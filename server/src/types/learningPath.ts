import { Request } from 'express';

// Base learning path interfaces
export interface LearningPathBase {
    title: string;
    description?: string;
    price: number;
    isPublic: boolean;
}

export interface LearningPath extends LearningPathBase {
    id: number;
    ownerId: number;
    createdAt: Date;
    updatedAt: Date;
}

// Request interfaces for different operations
export interface CreateLearningPathRequest extends Request {
    body: LearningPathBase;
    user?: {
        id: number;
        email: string;
    };
}

export interface UpdateLearningPathRequest extends Request {
    body: Partial<LearningPathBase>;
    params: {
        id: string;
    };
    user?: {
        id: number;
        email: string;
    };
}

export interface GetLearningPathRequest extends Request {
    params: {
        id: string;
    };
    user?: {
        id: number;
        email: string;
    };
}

export interface DeleteLearningPathRequest extends Request {
    params: {
        id: string;
    };
    user?: {
        id: number;
        email: string;
    };
}

// Response interfaces
export interface LearningPathResponse {
    success: boolean;
    message: string;
    data?: LearningPath | LearningPath[];
    error?: string;
    code?: string;
    timestamp?: string;
}

// Note: Validation is handled by middleware/validation.ts using express-validator
// Types here focus on data structure definitions only

// Error types specific to learning paths
export interface LearningPathError extends Error {
    code?: string;
    statusCode?: number;
    field?: string;
}

export class LearningPathNotFoundError extends Error {
    statusCode = 404;
    code = 'LEARNING_PATH_NOT_FOUND';

    constructor(message = 'Learning path not found') {
        super(message);
        this.name = 'LearningPathNotFoundError';
    }
}

export class LearningPathUnauthorizedError extends Error {
    statusCode = 403;
    code = 'LEARNING_PATH_UNAUTHORIZED';

    constructor(message = 'You do not have permission to access this learning path') {
        super(message);
        this.name = 'LearningPathUnauthorizedError';
    }
}

// Note: Validation errors are handled by express-validator in middleware
// Custom error classes below are for business logic errors, not validation 