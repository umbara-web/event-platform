import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { MESSAGES } from '../constants/index';
import transactionService from '../services/transaction/index';
import type { TransactionFilters } from '../types/transaction.types';

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionService.createTransaction(req.user!.id, req.body);

  ApiResponse.created(res, MESSAGES.TRANSACTION.CREATED, transaction);
});

export const uploadPaymentProof = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest('Bukti pembayaran wajib diunggah');
  }

  const transactionId = req.params.id as string;
  if (!transactionId) {
    throw ApiError.badRequest('Transaction ID is required');
  }

  const transaction = await transactionService.uploadPaymentProof(
    transactionId,
    req.user!.id,
    req.file
  );

  ApiResponse.success(res, MESSAGES.TRANSACTION.PAYMENT_UPLOADED, transaction);
});

export const confirmTransaction = asyncHandler(async (req: Request, res: Response) => {
  const transactionId = req.params.id as string;
  if (!transactionId) {
    throw ApiError.badRequest('Transaction ID is required');
  }

  const transaction = await transactionService.confirmTransaction(
    transactionId,
    req.user!.id,
    req.body
  );

  const message =
    req.body.action === 'accept' ? MESSAGES.TRANSACTION.CONFIRMED : MESSAGES.TRANSACTION.REJECTED;

  ApiResponse.success(res, message, transaction);
});

export const cancelTransaction = asyncHandler(async (req: Request, res: Response) => {
  const transactionId = req.params.id as string;
  if (!transactionId) {
    throw ApiError.badRequest('Transaction ID is required');
  }

  const transaction = await transactionService.cancelTransaction(transactionId, req.user!.id);

  ApiResponse.success(res, MESSAGES.TRANSACTION.CANCELLED, transaction);
});

export const getTransaction = asyncHandler(async (req: Request, res: Response) => {
  const transactionId = req.params.id as string;
  if (!transactionId) {
    throw ApiError.badRequest('Transaction ID is required');
  }

  const isOrganizer = req.user!.role === 'ORGANIZER';
  const transaction = await transactionService.getTransaction(
    transactionId,
    req.user!.id,
    isOrganizer
  );

  ApiResponse.success(res, MESSAGES.TRANSACTION.FETCHED, transaction);
});

export const getMyTransactions = asyncHandler(async (req: Request, res: Response) => {
  const filters: TransactionFilters = {
    userId: req.user!.id,
    status: req.query.status as string,
    eventId: req.query.eventId as string,
  };

  const pagination = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  const result = await transactionService.getTransactions(filters, pagination);

  ApiResponse.paginated(res, MESSAGES.TRANSACTION.LIST_FETCHED, result.data, result.pagination);
});

export const getEventTransactions = asyncHandler(async (req: Request, res: Response) => {
  const filters: TransactionFilters = {
    eventId: req.params.eventId as string,
    status: req.query.status as string,
  };

  const pagination = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  const result = await transactionService.getTransactions(filters, pagination);

  ApiResponse.paginated(res, MESSAGES.TRANSACTION.LIST_FETCHED, result.data, result.pagination);
});

export default {
  createTransaction,
  uploadPaymentProof,
  confirmTransaction,
  cancelTransaction,
  getTransaction,
  getMyTransactions,
  getEventTransactions,
};
