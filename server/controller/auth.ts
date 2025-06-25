import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const SALT_ROUND = 10;

const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUND);
};

const generateAccessToken = (userData: {
    id: number;
    username: string;
}): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign(
        { id: userData.id, username: userData.username },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
};

const generateRefreshToken = (userData: {
    id: number;
    username: string;
}): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign(
        { id: userData.id, username: userData.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(400).json({
                message: "Username, email, and password are required",
            });
            return;
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        const refreshToken = generateRefreshToken(user);
        const accessToken = generateAccessToken(user);

        res.cookie("refreshToken", refreshToken, {
            sameSite: "strict",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            message: "User registered successfully",
            accessToken: accessToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error: any) {
        console.error("Registration error:", error);
        if (error.code === "P2002") {
            res.status(400).json({
                message: "User with this email or username already exists",
            });
            return;
        }
        res.status(500).json({
            message: "Internal server error during registration",
        });
    }
};

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                message: "Email and password are required",
            });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            res.status(401).json({
                message: "Invalid email or password.",
            });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({
                message: "Invalid email or password.",
            });
            return;
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
            sameSite: "strict",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",
            accessToken: accessToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Internal server error during login",
        });
    }
};

const logout = (req: Request, res: Response): void => {
    res.clearCookie("refreshToken", { path: "/" });
    res.status(200).json({
        message: "Logged out successfully",
    });
};

export { register, login, logout };
