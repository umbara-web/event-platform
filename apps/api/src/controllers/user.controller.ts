import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/index.js';
import userService from '../services/user.service.js';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await userService.getProfile(req.user!.id);

  ApiResponse.success(res, MESSAGES.USER.PROFILE_FETCHED, profile);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await userService.updateProfile(req.user!.id, req.body);

  ApiResponse.success(res, MESSAGES.USER.PROFILE_UPDATED, profile);
});

export const uploadProfileImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest('File gambar wajib diunggah');
  }

  const profile = await userService.uploadProfileImage(req.user!.id, req.file);

  ApiResponse.success(res, MESSAGES.USER.PROFILE_UPDATED, profile);
});

export const getPointsBalance = asyncHandler(async (req: Request, res: Response) => {
  const points = await userService.getPointsBalance(req.user!.id);

  ApiResponse.success(res, MESSAGES.USER.POINTS_FETCHED, points);
});

export const getCoupons = asyncHandler(async (req: Request, res: Response) => {
  const includeUsed = req.query.includeUsed === 'true';
  const coupons = await userService.getUserCoupons(req.user!.id, includeUsed);

  ApiResponse.success(res, MESSAGES.USER.COUPONS_FETCHED, coupons);
});

export const getTransactionHistory = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await userService.getTransactionHistory(req.user!.id, page, limit);

  const paginationWithNav = {
    ...result.pagination,
    hasNextPage: result.pagination.currentPage < result.pagination.totalPages,
    hasPrevPage: result.pagination.currentPage > 1,
  };

  ApiResponse.paginated(
    res,
    MESSAGES.TRANSACTION.LIST_FETCHED,
    result.transactions,
    paginationWithNav
  );
});

export const getOrganizerProfile = asyncHandler(async (req: Request, res: Response) => {
  const organizerId = Array.isArray(req.params.organizerId)
    ? req.params.organizerId[0]
    : req.params.organizerId;

  if (!organizerId) {
    throw ApiError.badRequest('Organizer ID is required');
  }

  const profile = await userService.getOrganizerProfile(organizerId);

  ApiResponse.success(res, MESSAGES.USER.PROFILE_FETCHED, profile);
});

export default {
  getProfile,
  updateProfile,
  uploadProfileImage,
  getPointsBalance,
  getCoupons,
  getTransactionHistory,
  getOrganizerProfile,
};
