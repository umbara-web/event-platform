import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { MESSAGES } from '../constants/index.js';
import reviewService from '../services/review.service.js';
import { ApiError } from '@/utils/index.js';

export const createReview = asyncHandler(
  async (req: Request, res: Response) => {
    const review = await reviewService.createReview(req.user!.id, req.body);

    ApiResponse.created(res, MESSAGES.REVIEW.CREATED, review);
  }
);

export const updateReview = asyncHandler(
  async (req: Request, res: Response) => {
    const reviewId = req.params.id;
    if (!reviewId) {
      throw ApiError.badRequest('Review ID is required');
    }

    const review = await reviewService.updateReview(
      reviewId,
      req.user!.id,
      req.body
    );

    ApiResponse.success(res, MESSAGES.REVIEW.UPDATED, review);
  }
);

export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    const reviewId = req.params.id;
    if (!reviewId) {
      throw ApiError.badRequest('Review ID is required');
    }

    await reviewService.deleteReview(reviewId, req.user!.id);

    ApiResponse.success(res, MESSAGES.REVIEW.DELETED);
  }
);

export const getEventReviews = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.params.eventId) {
      throw ApiError.badRequest('Event ID is required');
    }

    const pagination = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await reviewService.getEventReviews(
      req.params.eventId,
      pagination
    );

    ApiResponse.paginated(
      res,
      MESSAGES.REVIEW.FETCHED,
      result.data,
      result.pagination
    );
  }
);

export const getOrganizerReviews = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.params.organizerId) {
      throw ApiError.badRequest('Organizer ID is required');
    }

    const pagination = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };

    const result = await reviewService.getOrganizerReviews(
      req.params.organizerId,
      pagination
    );

    ApiResponse.paginated(
      res,
      MESSAGES.REVIEW.FETCHED,
      result.data,
      result.pagination
    );
  }
);

export const getEventReviewStats = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.params.eventId) {
      throw ApiError.badRequest('Event ID is required');
    }

    const stats = await reviewService.getEventReviewStats(req.params.eventId);

    ApiResponse.success(res, 'Statistik review berhasil diambil', stats);
  }
);

export default {
  createReview,
  updateReview,
  deleteReview,
  getEventReviews,
  getOrganizerReviews,
  getEventReviewStats,
};
