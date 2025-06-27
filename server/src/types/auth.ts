import { Request } from 'express';

// Authentication request body types
export interface RegisterRequestBody {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LoginRequestBody {
    email: string;
    password: string;
}

export interface PasswordResetRequestBody {
    email: string;
}

export interface PasswordResetBody {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface ChangePasswordBody {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

// User response type (without sensitive data)
export interface UserResponse {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

// Authentication response types
export interface AuthResponse {
    success: boolean;
    message: string;
    user?: UserResponse;
    token?: string;
}

export interface ValidationError {
    field?: string;
    message: string;
    value?: any;
}

export interface ValidationErrorResponse {
    success: false;
    message: string;
    errors: ValidationError[];
}

// Authenticated request type with user information
export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
    };
}