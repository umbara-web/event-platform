/// <reference types="jest" />

import { prismaMock } from '../prismaMock';
import { reviewService } from '../../src/services/review.service';
import { ApiError } from '../../src/utils/ApiError';
import { createMockEvent, createMockUser } from '../helpers/testUtils';

describe('ReviewService', () => {
  describe('createReview', () => {
    const userId = 'user-123';
    const reviewData = {
      eventId: 'event-123',
      rating: 5,
      comment: 'Great event!',
    };

    it('should create review for completed event', async () => {
      const pastEvent = createMockEvent('organizer-123', {
        endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      });

      prismaMock.event.findUnique.mockResolvedValue(pastEvent as any);
      prismaMock.transaction.findFirst.mockResolvedValue({
        id: 'transaction-123',
        status: 'COMPLETED',
      } as any);
      prismaMock.review.findUnique.mockResolvedValue(null);
      prismaMock.review.create.mockResolvedValue({
        id: 'review-123',
        userId,
        eventId: reviewData.eventId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: createMockUser(),
        event: pastEvent,
      } as any);

      const result = await reviewService.createReview(userId, reviewData);

      expect(result).toBeDefined();
      expect(result.rating).toBe(5);
    });

    it('should throw error if event has not ended', async () => {
      const futureEvent = createMockEvent('organizer-123', {
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      prismaMock.event.findUnique.mockResolvedValue(futureEvent as any);

      await expect(reviewService.createReview(userId, reviewData)).rejects.toThrow(ApiError);
    });

    it('should throw error if user did not attend event', async () => {
      const pastEvent = createMockEvent('organizer-123', {
        endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      });

      prismaMock.event.findUnique.mockResolvedValue(pastEvent as any);
      prismaMock.transaction.findFirst.mockResolvedValue(null);

      await expect(reviewService.createReview(userId, reviewData)).rejects.toThrow(ApiError);
    });

    it('should throw error if user already reviewed', async () => {
      const pastEvent = createMockEvent('organizer-123', {
        endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      });

      prismaMock.event.findUnique.mockResolvedValue(pastEvent as any);
      prismaMock.transaction.findFirst.mockResolvedValue({
        id: 'transaction-123',
        status: 'COMPLETED',
      } as any);
      prismaMock.review.findUnique.mockResolvedValue({
        id: 'existing-review',
      } as any);

      await expect(reviewService.createReview(userId, reviewData)).rejects.toThrow(ApiError);
    });
  });

  describe('getEventReviewStats', () => {
    it('should return review statistics', async () => {
      prismaMock.review.aggregate.mockResolvedValue({
        _avg: { rating: 4.5 },
        _count: { rating: 10 },
        _max: {},
        _min: {},
        _sum: {},
      });
      prismaMock.review.groupBy.mockResolvedValue([
        { rating: 5, _count: { rating: 6 } },
        { rating: 4, _count: { rating: 3 } },
        { rating: 3, _count: { rating: 1 } },
      ] as any);

      const result = await reviewService.getEventReviewStats('event-123');

      expect(result.averageRating).toBe(4.5);
      expect(result.totalReviews).toBe(10);
      expect(result.ratingDistribution[5]).toBe(6);
    });
  });
});
