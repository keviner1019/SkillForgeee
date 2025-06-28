import { Request, Response, NextFunction } from "express";

const { body, validationResult } = require("express-validator");

// Validation error handler middleware
export const handleValidationErrors = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array().map((error: any) => ({
                field: error.type === "field" ? error.path : undefined,
                message: error.msg,
                value: error.type === "field" ? error.value : undefined,
            })),
        });
        return;
    }
    next();
};

// Register validation rules
export const validateRegister = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail()
        .trim(),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),

    body("confirmPassword").custom((value: any, { req }: { req: any }) => {
        if (value !== req.body.password) {
            throw new Error("Password confirmation does not match password");
        }
        return true;
    }),

    body("firstName")
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("First name must be between 2 and 50 characters")
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage(
            "First name can only contain letters, spaces, hyphens, and apostrophes"
        ),

    body("lastName")
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Last name must be between 2 and 50 characters")
        .matches(/^[a-zA-Z\s'-]+$/)
        .withMessage(
            "Last name can only contain letters, spaces, hyphens, and apostrophes"
        ),

    handleValidationErrors,
];

// Login validation rules
export const validateLogin = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail()
        .trim(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 1 })
        .withMessage("Password cannot be empty"),

    handleValidationErrors,
];

// Password reset request validation
export const validatePasswordResetRequest = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail()
        .trim(),

    handleValidationErrors,
];

// Password reset validation
export const validatePasswordReset = [
    body("token").notEmpty().withMessage("Reset token is required"),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),

    body("confirmPassword").custom((value: any, { req }: { req: any }) => {
        if (value !== req.body.password) {
            throw new Error("Password confirmation does not match password");
        }
        return true;
    }),

    handleValidationErrors,
];

// Change password validation (for authenticated users)
export const validateChangePassword = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),

    body("newPassword")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage(
            "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),

    body("confirmNewPassword").custom((value: any, { req }: { req: any }) => {
        if (value !== req.body.newPassword) {
            throw new Error("New password confirmation does not match new password");
        }
        return true;
    }),

    handleValidationErrors,
];

// Learning Path validation rules
export const validateCreateLearningPath = [
    body("title")
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Title must be between 3 and 100 characters")
        .matches(/^[a-zA-Z0-9\s\-_.,!?]+$/)
        .withMessage(
            "Title can only contain letters, numbers, spaces, and basic punctuation"
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

    body("price")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Price must be a non-negative integer")
        .toInt(),

    body("isPublic")
        .optional()
        .isBoolean()
        .withMessage("isPublic must be a boolean value")
        .toBoolean(),

    handleValidationErrors,
];

export const validateUpdateLearningPath = [
    body("title")
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Title must be between 3 and 100 characters")
        .matches(/^[a-zA-Z0-9\s\-_.,!?]+$/)
        .withMessage(
            "Title can only contain letters, numbers, spaces, and basic punctuation"
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

    body("price")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Price must be a non-negative integer")
        .toInt(),

    body("isPublic")
        .optional()
        .isBoolean()
        .withMessage("isPublic must be a boolean value")
        .toBoolean(),

    handleValidationErrors,
];

export const validatePathId = [
    body("id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Learning path ID must be a positive integer")
        .toInt(),

    handleValidationErrors,
];

export const validateCreateNode = [
    body("title")
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Title must be between 3 and 50 characters")
        .matches(/^[a-zA-Z0-9\s\-_.,!?]+$/)
        .withMessage(
            "Title can only contain letters, numbers, spaces, and basic punctuation"
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

    handleValidationErrors,
];

export const validateUpdateNode = [
    body("title")
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Title must be between 3 and 50 characters")
        .matches(/^[a-zA-Z0-9\s\-_.,!?]+$/)
        .withMessage(
            "Title can only contain letters, numbers, spaces, and basic punctuation"
        ),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),

    body("status")
        .optional()
        .isIn(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"])
        .withMessage("Status must be either NOT_STARTED, IN_PROGRESS, or COMPLETED"),

    body("notificationDate")
        .optional()
        .isISO8601()
        .withMessage("Date must be a valid ISO 8601 date (e.g., YYYY-MM-DD)")
        .toDate(),

    body("color")
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage("Color should not be empty if provided"),

    body("positionX")
        .optional()
        .isNumeric()
        .withMessage("Position X must be a number")
        .toFloat(),

    body("positionY")
        .optional()
        .isNumeric()
        .withMessage("Position Y must be a number")
        .toFloat(),

    body("parentNodeId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Parent node ID must be a positive integer")
        .toInt(),

    handleValidationErrors,
];
