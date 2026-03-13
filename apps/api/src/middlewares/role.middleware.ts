import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { MESSAGES } from '../constants/index';

/**
 * Role-based access control middleware
 * Restricts access to specific roles
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(ApiError.unauthorized(MESSAGES.AUTH.UNAUTHORIZED));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN));
      return;
    }

    next();
  };
};

// Check if user is customer
export const isCustomer = authorize(Role.CUSTOMER);

// Check if user is organizer
export const isOrganizer = authorize(Role.ORGANIZER);

// Check if user is customer or organizer
export const isAuthenticated = authorize(Role.CUSTOMER, Role.ORGANIZER);

export default {
  authorize,
  isCustomer,
  isOrganizer,
  isAuthenticated,
};
