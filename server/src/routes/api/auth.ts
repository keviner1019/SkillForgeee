import { Router, Request, Response } from "express";

import { handleValidationErrors } from "../../middleware/validation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { register, login, logout } from "../../controller/auth";
import { authenticateToken } from "../../middleware/auth";

// FIX: Define proper interface for decoded token
interface DecodedToken extends JwtPayload {
  id: number;
  username: string;
}

const router = Router();

router.post("/register", handleValidationErrors, register);

router.post("/login", login);

// FIX: Updated refresh token endpoint with proper types and return statements
router.post("/refreshToken", async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    res.status(401).json({
      message: "Refresh token not provided",
    });
    return; // FIX: Add return statement
  }
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET!
    ) as DecodedToken; // FIX: Use proper type

    const newAccessToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );
    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(401).json({
      message: "Invalid refresh token",
    });
  }
});

router.post("/logout", logout);

// FIX: Use proper typing for authenticated request
router.get("/me", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; // Note: This could be improved with proper typing
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email, // Note: email not available in JWT, would need database lookup
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get user profile",
    });
  }
});

export default router;
