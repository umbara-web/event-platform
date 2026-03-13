import { PAGINATION } from '../constants/index';
import { PaginationParams, PaginatedResult } from '../types/index';

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PrismaQueryOptions {
  skip: number;
  take: number;
  orderBy: Record<string, 'asc' | 'desc'>;
}

// Parse and validate pagination parameters from request query
export const parsePaginationParams = (
  params: PaginationParams
): PaginationOptions => {
  const page = Math.max(1, Number(params.page) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, Number(params.limit) || PAGINATION.DEFAULT_LIMIT)
  );
  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';

  return { page, limit, sortBy, sortOrder };
};

// Convert pagination options to Prisma query options
export const toPrismaQuery = (
  options: PaginationOptions
): PrismaQueryOptions => {
  return {
    skip: (options.page - 1) * options.limit,
    take: options.limit,
    orderBy: { [options.sortBy]: options.sortOrder },
  };
};

// Create paginated result object
export const createPaginatedResult = <T>(
  data: T[],
  totalItems: number,
  options: PaginationOptions
): PaginatedResult<T> => {
  const totalPages = Math.ceil(totalItems / options.limit);

  return {
    data,
    pagination: {
      currentPage: options.page,
      totalPages,
      totalItems,
      itemsPerPage: options.limit,
      hasNextPage: options.page < totalPages,
      hasPrevPage: options.page > 1,
    },
  };
};

export default {
  parsePaginationParams,
  toPrismaQuery,
  createPaginatedResult,
};
