import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { MESSAGES } from '../constants/index';
import voucherService from '../services/voucher.service';

export const createVoucher = asyncHandler(async (req: Request, res: Response) => {
  const voucher = await voucherService.createVoucher(req.user!.id, req.body);

  ApiResponse.created(res, MESSAGES.VOUCHER.CREATED, voucher);
});

export const updateVoucher = asyncHandler(async (req: Request, res: Response) => {
  const voucherId = req.params.id as string;
  if (!voucherId) {
    throw ApiError.badRequest('Voucher ID is required');
  }

  const voucher = await voucherService.updateVoucher(voucherId, req.user!.id, req.body);

  ApiResponse.success(res, MESSAGES.VOUCHER.UPDATED, voucher);
});

export const deleteVoucher = asyncHandler(async (req: Request, res: Response) => {
  const voucherId = req.params.id as string;
  if (!voucherId) {
    throw ApiError.badRequest('Voucher ID is required');
  }

  await voucherService.deleteVoucher(voucherId, req.user!.id);

  ApiResponse.success(res, MESSAGES.VOUCHER.DELETED);
});

export const validateVoucher = asyncHandler(async (req: Request, res: Response) => {
  const { code, eventId, totalAmount } = req.body;
  const result = await voucherService.validateVoucher(code, eventId, totalAmount);

  if (!result.isValid) {
    ApiResponse.error(res, result.message || MESSAGES.VOUCHER.INVALID, 400);
    return;
  }

  ApiResponse.success(res, 'Voucher valid', {
    discountAmount: result.discountAmount,
  });
});

export const getEventVouchers = asyncHandler(async (req: Request, res: Response) => {
  const eventId = req.params.eventId as string;
  if (!eventId) {
    throw ApiError.badRequest('Event ID is required');
  }

  const vouchers = await voucherService.getEventVouchers(eventId, req.user!.id);

  ApiResponse.success(res, MESSAGES.VOUCHER.FETCHED, vouchers);
});

export default {
  createVoucher,
  updateVoucher,
  deleteVoucher,
  validateVoucher,
  getEventVouchers,
};
