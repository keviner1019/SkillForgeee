import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

interface DecodedToken extends JwtPayload {
    id: number;
    username: string;
}

interface AuthenticatedRequest extends Request {
    user?: DecodedToken;
}

export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({
            message: "Access token required",
        });
        return;
    }

    if (!process.env.JWT_SECRET) {
        res.status(500).json({
            message: "Server configuration error",
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({
            message: "Invalid or expired token",
        });
        return;
    }
};
