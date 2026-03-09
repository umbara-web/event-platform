import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

export const validate = <T extends z.ZodType<any, any>>(schema: T) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    const result = await schema.safeParseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      file: req.file,
      files: req.files,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      next(
        ApiError.unprocessableEntity(MESSAGES.GENERAL.VALIDATION_ERROR, errors)
      );
      return;
    }

    req.body = result.data.body ?? req.body;
    req.query = result.data.query ?? req.query;
    req.params = result.data.params ?? req.params;

    next();
  };
};
