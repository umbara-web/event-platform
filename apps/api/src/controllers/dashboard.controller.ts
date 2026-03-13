import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { MESSAGES } from '../constants/index';
import dashboardService from '../services/dashboard.service';

export const getSummary = asyncHandler(async (req: Request, res: Response) => {
  const summary = await dashboardService.getOrganizerSummary(req.user!.id);

  ApiResponse.success(res, 'Dashboard summary berhasil diambil', summary);
});

export const getStatistics = asyncHandler(async (req: Request, res: Response) => {
  const year = req.query.year ? parseInt(req.query.year as string) : undefined;
  const month = req.query.month ? parseInt(req.query.month as string) : undefined;

  const statistics = await dashboardService.getEventStatistics(req.user!.id, {
    year,
    month,
  });

  ApiResponse.success(res, 'Statistik berhasil diambil', statistics);
});

export const getEventParticipants = asyncHandler(async (req: Request, res: Response) => {
  if (!req.params.eventId) {
    throw ApiError.badRequest('Event ID is required');
  }

  const pagination = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
  };

  const result = await dashboardService.getEventParticipants(
    req.params.eventId as string,
    req.user!.id,
    pagination
  );

  if (!result) {
    throw ApiError.notFound(MESSAGES.EVENT.NOT_FOUND);
  }

  ApiResponse.paginated(res, 'Daftar peserta berhasil diambil', result.data, result.pagination);
});

export const getPendingTransactions = asyncHandler(async (req: Request, res: Response) => {
  const pagination = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
  };

  const result = await dashboardService.getPendingTransactions(req.user!.id, pagination);

  ApiResponse.paginated(res, 'Transaksi pending berhasil diambil', result.data, result.pagination);
});

export const getRecentActivity = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const activity = await dashboardService.getRecentActivity(req.user!.id, limit);

  ApiResponse.success(res, 'Aktivitas terbaru berhasil diambil', activity);
});

export default {
  getSummary,
  getStatistics,
  getEventParticipants,
  getPendingTransactions,
  getRecentActivity,
};
