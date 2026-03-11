// src/services/review.service.ts

import { Prisma } from '@prisma/client';
import prisma from '../configs/database.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/index.js';
import {
  parsePaginationParams,
  toPrismaQuery,
  createPaginatedResult,
} from '../utils/pagination.js';
import type {
  CreateReviewInput,
  UpdateReviewInput,
  GetReviewsQuery,
} from '../validators/review.validator.js';
import type { PaginationParams } from '../types/index.js';

interface ReviewFilters {
  eventId?: string;
  organizerId?: string;
  rating?: number;
}

class ReviewService {
  /**
   * Create a review
   */
  async createReview(userId: string, data: CreateReviewInput) {
    const now = new Date();

    // Check if event exists and has ended
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
    });

    if (!event) {
      throw ApiError.notFound(MESSAGES.EVENT.NOT_FOUND);
    }

    if (event.endDate > now) {
      throw ApiError.badRequest(MESSAGES.REVIEW.NOT_ATTENDED);
    }

    // Check if user attended this event (has completed transaction)
    const attendance = await prisma.transaction.findFirst({
      where: {
        userId,
        eventId: data.eventId,
        status: 'COMPLETED',
      },
    });

    if (!attendance) {
      throw ApiError.badRequest(MESSAGES.REVIEW.NOT_ATTENDED);
    }

    // Check if user already reviewed
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId: data.eventId,
        },
      },
    });

    if (existingReview) {
      throw ApiError.conflict(MESSAGES.REVIEW.ALREADY_REVIEWED);
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId,
        eventId: data.eventId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return review;
  }

  /**
   * Update a review
   */
  async updateReview(
    reviewId: string,
    userId: string,
    data: UpdateReviewInput
  ) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw ApiError.notFound(MESSAGES.REVIEW.NOT_FOUND);
    }

    if (review.userId !== userId) {
      throw ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN);
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(data.rating !== undefined && { rating: data.rating }),
        ...(data.comment !== undefined && { comment: data.comment }),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });

    return updatedReview;
  }

  /**
   * Delete a review
   */
  async deleteReview(reviewId: string, userId: string): Promise<void> {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw ApiError.notFound(MESSAGES.REVIEW.NOT_FOUND);
    }

    if (review.userId !== userId) {
      throw ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN);
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });
  }

  /**
   * Get reviews with filters
   */
  async getReviews(filters: ReviewFilters, pagination: PaginationParams) {
    const paginationOptions = parsePaginationParams(pagination);
    const { skip, take, orderBy } = toPrismaQuery(paginationOptions);

    const where: Prisma.ReviewWhereInput = {
      ...(filters.eventId && { eventId: filters.eventId }),
      ...(filters.rating && { rating: filters.rating }),
      ...(filters.organizerId && {
        event: { organizerId: filters.organizerId },
      }),
    };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
          event: {
            select: {
              id: true,
              name: true,
              slug: true,
              imageUrl: true,
            },
          },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.review.count({ where }),
    ]);

    return createPaginatedResult(reviews, total, paginationOptions);
  }

  /**
   * Get event reviews
   */
  async getEventReviews(eventId: string, pagination: PaginationParams) {
    return this.getReviews({ eventId }, pagination);
  }

  /**
   * Get organizer reviews
   */
  async getOrganizerReviews(organizerId: string, pagination: PaginationParams) {
    return this.getReviews({ organizerId }, pagination);
  }

  /**
   * Get review statistics for an event
   */
  async getEventReviewStats(eventId: string) {
    const [aggregate, distribution] = await Promise.all([
      prisma.review.aggregate({
        where: { eventId },
        _avg: { rating: true },
        _count: { rating: true },
      }),
      prisma.review.groupBy({
        by: ['rating'],
        where: { eventId },
        _count: { rating: true },
      }),
    ]);

    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    distribution.forEach((d) => {
      ratingDistribution[d.rating as keyof typeof ratingDistribution] =
        d._count.rating;
    });

    return {
      averageRating: aggregate._avg.rating ?? 0,
      totalReviews: aggregate._count.rating,
      ratingDistribution,
    };
  }

  /**
   * Get organizer review statistics
   */
  async getOrganizerReviewStats(organizerId: string) {
    const [aggregate, distribution] = await Promise.all([
      prisma.review.aggregate({
        where: { event: { organizerId } },
        _avg: { rating: true },
        _count: { rating: true },
      }),
      prisma.review.groupBy({
        by: ['rating'],
        where: { event: { organizerId } },
        _count: { rating: true },
      }),
    ]);

    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    distribution.forEach((d) => {
      ratingDistribution[d.rating as keyof typeof ratingDistribution] =
        d._count.rating;
    });

    return {
      averageRating: aggregate._avg.rating ?? 0,
      totalReviews: aggregate._count.rating,
      ratingDistribution,
    };
  }
}

export const reviewService = new ReviewService();
export default reviewService;
