import { Response } from 'express';
import { HTTP_STATUS, HttpStatusCode } from '../constants/index';

export interface ApiResponseOptions<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
  meta?: Record<string, unknown>;
}

export class ApiResponse {
  // Send success response
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: HttpStatusCode = HTTP_STATUS.OK,
    meta?: Record<string, unknown>
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(meta && { meta }),
    });
  }

  // Send created response
  static created<T>(res: Response, message: string, data?: T): Response {
    return this.success(res, message, data, HTTP_STATUS.CREATED);
  }

  // Send no content response
  static noContent(res: Response): Response {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  // Send error response
  static error(
    res: Response,
    message: string,
    statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errors?: Array<{ field: string; message: string }>
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors }),
    });
  }

  // Send paginated response
  static paginated<T>(
    res: Response,
    message: string,
    data: T[],
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    }
  ): Response {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message,
      data,
      pagination,
    });
  }
}

export default ApiResponse;
