import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { MulterError } from 'multer';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';
import config from '../configs/index.js';

// Convert various errors to ApiError
const convertToApiError = (error: unknown): ApiError => {
  // Already an ApiError
  if (error instanceof ApiError) {
    return error;
  }

  // Zod validation error
  if (error instanceof ZodError) {
    const errors = error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return ApiError.unprocessableEntity(
      MESSAGES.GENERAL.VALIDATION_ERROR,
      errors
    );
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': {
        // Unique constraint violation
        const field = (error.meta?.target as string[])?.join(', ') || 'field';
        return ApiError.conflict(`${field} sudah digunakan`);
      }
      case 'P2003':
        // Foreign key constraint violation
        return ApiError.badRequest('Referensi data tidak valid');
      case 'P2025':
        // Record not found
        return ApiError.notFound(MESSAGES.GENERAL.NOT_FOUND);
      default:
        return ApiError.internal(MESSAGES.GENERAL.INTERNAL_ERROR);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return ApiError.badRequest('Data tidak valid');
  }

  // Multer errors
  if (error instanceof MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return ApiError.badRequest('Ukuran file terlalu besar');
      case 'LIMIT_FILE_COUNT':
        return ApiError.badRequest('Terlalu banyak file');
      case 'LIMIT_UNEXPECTED_FILE':
        return ApiError.badRequest('Field file tidak diharapkan');
      default:
        return ApiError.badRequest(`Upload error: ${error.message}`);
    }
  }

  // JWT errors
  if (error instanceof Error) {
    if (error.name === 'JsonWebTokenError') {
      return ApiError.unauthorized(MESSAGES.AUTH.INVALID_TOKEN);
    }
    if (error.name === 'TokenExpiredError') {
      return ApiError.unauthorized(MESSAGES.AUTH.INVALID_TOKEN);
    }
  }

  // Default to internal server error
  return ApiError.internal(MESSAGES.GENERAL.INTERNAL_ERROR);
};

// Error handling middleware
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const apiError = convertToApiError(err);

  // Log error in development
  if (config.isDevelopment) {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      ...(apiError.errors && { errors: apiError.errors }),
    });
  }

  // Send error response
  res.status(apiError.statusCode).json({
    success: false,
    message: apiError.message,
    ...(apiError.errors && { errors: apiError.errors }),
    ...(config.isDevelopment && { stack: err.stack }),
  });
};

// 404 Not Found handler
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.path} tidak ditemukan`,
  });
};

export default {
  errorHandler,
  notFoundHandler,
};
