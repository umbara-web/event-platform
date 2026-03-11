import { Prisma, TransactionStatus } from '@prisma/client';
import prisma from '../../configs/database.js';
import { ApiError } from '../../utils/ApiError.js';
import { MESSAGES } from '../../constants/index.js';
import {
  parsePaginationParams,
  toPrismaQuery,
  createPaginatedResult,
} from '../../utils/pagination.js';
import {
  transactionDetailInclude,
  transactionListInclude,
} from './transaction.types.js';
import type { TransactionFilters } from '../../types/transaction.types.js';
import type { PaginationParams } from '../../types/index.js';

export async function getTransaction(
  transactionId: string,
  userId: string,
  isOrganizer: boolean = false
) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: transactionDetailInclude,
  });

  if (!transaction) {
    throw ApiError.notFound(MESSAGES.TRANSACTION.NOT_FOUND);
  }

  validateTransactionAccess(transaction, userId, isOrganizer);

  return transaction;
}

function validateTransactionAccess(
  transaction: { userId: string; event: { organizerId: string } },
  userId: string,
  isOrganizer: boolean
): void {
  if (isOrganizer) {
    if (transaction.event.organizerId !== userId) {
      throw ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN);
    }
  } else {
    if (transaction.userId !== userId) {
      throw ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN);
    }
  }
}

export async function getTransactions(
  filters: TransactionFilters,
  pagination: PaginationParams
) {
  const paginationOptions = parsePaginationParams(pagination);
  const { skip, take, orderBy } = toPrismaQuery(paginationOptions);
  const where = buildTransactionFilters(filters);

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: transactionListInclude,
      orderBy,
      skip,
      take,
    }),
    prisma.transaction.count({ where }),
  ]);

  return createPaginatedResult(transactions, total, paginationOptions);
}

function buildTransactionFilters(
  filters: TransactionFilters
): Prisma.TransactionWhereInput {
  return {
    ...(filters.status && { status: filters.status as TransactionStatus }),
    ...(filters.eventId && { eventId: filters.eventId }),
    ...(filters.userId && { userId: filters.userId }),
    ...(filters.startDate && { createdAt: { gte: filters.startDate } }),
    ...(filters.endDate && { createdAt: { lte: filters.endDate } }),
  };
}
