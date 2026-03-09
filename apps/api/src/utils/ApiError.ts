import { HTTP_STATUS, HttpStatusCode } from '../constants/index.js';

export class ApiError extends Error {
  public statusCode: HttpStatusCode;
  public isOperational: boolean;
  public errors?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isOperational = true,
    errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    // Maintains proper stack trace for where the error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  // Static factory methods for common errors
  static badRequest(
    message: string,
    errors?: Array<{ field: string; message: string }>
  ): ApiError {
    return new ApiError(message, HTTP_STATUS.BAD_REQUEST, true, errors);
  }

  static unauthorized(message: string): ApiError {
    return new ApiError(message, HTTP_STATUS.UNAUTHORIZED);
  }

  static forbidden(message: string): ApiError {
    return new ApiError(message, HTTP_STATUS.FORBIDDEN);
  }

  static notFound(message: string): ApiError {
    return new ApiError(message, HTTP_STATUS.NOT_FOUND);
  }

  static conflict(message: string): ApiError {
    return new ApiError(message, HTTP_STATUS.CONFLICT);
  }

  static unprocessableEntity(
    message: string,
    errors?: Array<{ field: string; message: string }>
  ): ApiError {
    return new ApiError(
      message,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      true,
      errors
    );
  }

  static tooManyRequests(message: string): ApiError {
    return new ApiError(message, HTTP_STATUS.TOO_MANY_REQUESTS);
  }

  static internal(message: string): ApiError {
    return new ApiError(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

export default ApiError;
