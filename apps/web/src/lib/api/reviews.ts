// src/lib/api/reviews.ts

import apiClient from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  Review,
  ReviewStats,
} from '@/src/types';

export interface CreateReviewData {
  eventId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
  rating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const reviewsApi = {
  createReview: async (
    data: CreateReviewData
  ): Promise<ApiResponse<Review>> => {
    const response = await apiClient.post('/reviews', data);
    return response.data;
  },

  updateReview: async (
    id: string,
    data: UpdateReviewData
  ): Promise<ApiResponse<Review>> => {
    const response = await apiClient.patch(`/reviews/${id}`, data);
    return response.data;
  },

  deleteReview: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  },

  getEventReviews: async (
    eventId: string,
    filters?: ReviewFilters
  ): Promise<PaginatedResponse<Review>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get(
      `/reviews/event/${eventId}?${params.toString()}`
    );
    return response.data;
  },

  getEventReviewStats: async (
    eventId: string
  ): Promise<ApiResponse<ReviewStats>> => {
    const response = await apiClient.get(`/reviews/event/${eventId}/stats`);
    return response.data;
  },

  getOrganizerReviews: async (
    organizerId: string,
    filters?: ReviewFilters
  ): Promise<PaginatedResponse<Review>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get(
      `/reviews/organizer/${organizerId}?${params.toString()}`
    );
    return response.data;
  },
};

export default reviewsApi;
