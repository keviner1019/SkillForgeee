import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  console.error('Error:', err);

  // Prisma unique constraint error
  if (err.code === 'P2002') {
    const message = 'Duplicate field value entered';
    error = { name: 'ValidationError', message, statusCode: 400 } as CustomError;
  }

  // Prisma record not found error
  if (err.code === 'P2025') {
    const message = 'Resource not found';
    error = { name: 'NotFoundError', message, statusCode: 404 } as CustomError;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { name: 'UnauthorizedError', message, statusCode: 401 } as CustomError;
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { name: 'UnauthorizedError', message, statusCode: 401 } as CustomError;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}; 