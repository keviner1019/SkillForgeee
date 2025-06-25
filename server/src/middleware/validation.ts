import { Request, Response, NextFunction } from 'express';

const { body, validationResult } = require('express-validator');

// Validation error handler middleware
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map((error: any) => ({
                field: error.type === 'field' ? error.path : undefined,
                message: error.msg,
                value: error.type === 'field' ? error.value : undefined
            }))
        });
        return;
    }
    next();
};

// Register validation rules
export const validateRegister = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .trim(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

    body('confirmPassword')
        .custom((value: any, { req }: { req: any }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),

    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),

    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),

    handleValidationErrors
];

// Login validation rules
export const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .trim(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 1 })
        .withMessage('Password cannot be empty'),

    handleValidationErrors
];

// Password reset request validation
export const validatePasswordResetRequest = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .trim(),

    handleValidationErrors
];

// Password reset validation
export const validatePasswordReset = [
    body('token')
        .notEmpty()
        .withMessage('Reset token is required'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

    body('confirmPassword')
        .custom((value: any, { req }: { req: any }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),

    handleValidationErrors
];

// Change password validation (for authenticated users)
export const validateChangePassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),

    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

    body('confirmNewPassword')
        .custom((value: any, { req }: { req: any }) => {
            if (value !== req.body.newPassword) {
                throw new Error('New password confirmation does not match new password');
            }
            return true;
        }),

    handleValidationErrors
]; 