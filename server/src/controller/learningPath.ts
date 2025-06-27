import { PrismaClient } from '@prisma/client';
import { Response, NextFunction } from 'express';
import {
    CreateLearningPathRequest,
    UpdateLearningPathRequest,
    GetLearningPathRequest,
    DeleteLearningPathRequest,
    LearningPathResponse
} from '../types/learningPath';
import { AuthenticatedRequest } from '../types/auth';

const prisma = new PrismaClient();

// Get all learning paths for a user
export const getAllPath = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Get user ID from authenticated middleware
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }

        const learningPaths = await prisma.learningPath.findMany({
            where: { ownerId: userId },
            include: {
                nodes: true,
                collaborators: true,
                _count: {
                    select: {
                        nodes: true,
                        collaborators: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            message: 'Learning paths retrieved successfully',
            data: learningPaths
        });
    } catch (error) {
        next(error); // Pass to centralized error handler
    }
};

// Create a new learning path
export const createNewPath = async (req: CreateLearningPathRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { title, description, price = 0, isPublic = false } = req.body;
        const userId = (req as any).user?.id; // From auth middleware

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }

        if (!title || title.trim().length === 0) {
            res.status(400).json({
                success: false,
                message: "Title is required and cannot be empty"
            });
            return;
        }

        const learningPath = await prisma.learningPath.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                price: Math.max(0, price), // Ensure non-negative price
                isPublic,
                ownerId: userId
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });

        res.status(201).json({
            success: true,
            message: 'Learning path created successfully',
            data: learningPath
        });
    } catch (error) {
        next(error); // Pass to centralized error handler
    }
};

// Update a learning path
export const updatePath = async (req: UpdateLearningPathRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const pathIdParam = req.params.id;
        if (!pathIdParam) {
            res.status(400).json({
                success: false,
                message: "Learning path ID is required"
            });
            return;
        }

        const pathId = parseInt(pathIdParam);
        const userId = (req as any).user?.id;
        const { title, description, price, isPublic } = req.body;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }

        if (isNaN(pathId)) {
            res.status(400).json({
                success: false,
                message: "Invalid learning path ID"
            });
            return;
        }

        // Check if the learning path exists and user owns it
        const existingPath = await prisma.learningPath.findFirst({
            where: {
                id: pathId,
                ownerId: userId
            }
        });

        if (!existingPath) {
            res.status(404).json({
                success: false,
                message: "Learning path not found or you don't have permission to update it"
            });
            return;
        }

        // Prepare update data
        const updateData: any = {};
        if (title !== undefined) updateData.title = title.trim();
        if (description !== undefined) updateData.description = description?.trim() || null;
        if (price !== undefined) updateData.price = Math.max(0, price);
        if (isPublic !== undefined) updateData.isPublic = isPublic;

        const updatedPath = await prisma.learningPath.update({
            where: { id: pathId },
            data: updateData,
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        nodes: true,
                        collaborators: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Learning path updated successfully',
            data: updatedPath
        });
    } catch (error) {
        next(error); // Pass to centralized error handler
    }
};

// Delete a learning path
export const deletePath = async (req: DeleteLearningPathRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const pathIdParam = req.params.id;
        if (!pathIdParam) {
            res.status(400).json({
                success: false,
                message: "Learning path ID is required"
            });
            return;
        }

        const pathId = parseInt(pathIdParam);
        const userId = (req as any).user?.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }

        if (isNaN(pathId)) {
            res.status(400).json({
                success: false,
                message: "Invalid learning path ID"
            });
            return;
        }

        // Check if the learning path exists and user owns it
        const existingPath = await prisma.learningPath.findFirst({
            where: {
                id: pathId,
                ownerId: userId
            }
        });

        if (!existingPath) {
            res.status(404).json({
                success: false,
                message: "Learning path not found or you don't have permission to delete it"
            });
            return;
        }

        await prisma.learningPath.delete({
            where: { id: pathId }
        });

        res.status(200).json({
            success: true,
            message: 'Learning path deleted successfully'
        });
    } catch (error) {
        next(error); // Pass to centralized error handler
    }
};

// Get a specific learning path
export const getPathById = async (req: GetLearningPathRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const pathIdParam = req.params.id;
        if (!pathIdParam) {
            res.status(400).json({
                success: false,
                message: "Learning path ID is required"
            });
            return;
        }

        const pathId = parseInt(pathIdParam);
        const userId = (req as any).user?.id;

        if (isNaN(pathId)) {
            res.status(400).json({
                success: false,
                message: "Invalid learning path ID"
            });
            return;
        }

        const learningPath = await prisma.learningPath.findFirst({
            where: {
                id: pathId,
                OR: [
                    { ownerId: userId }, // User owns the path
                    { isPublic: true }, // Path is public
                    {
                        collaborators: {
                            some: { userId: userId }
                        }
                    } // User is a collaborator
                ]
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                nodes: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
                collaborators: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        nodes: true,
                        collaborators: true,
                        purchasedBy: true
                    }
                }
            }
        });

        if (!learningPath) {
            res.status(404).json({
                success: false,
                message: "Learning path not found or you don't have access to it"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Learning path retrieved successfully',
            data: learningPath
        });
    } catch (error) {
        next(error); // Pass to centralized error handler
    }
};