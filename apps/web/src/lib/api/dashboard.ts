import apiClient from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  DashboardSummary,
  Statistics,
  Transaction,
} from '@/src/types';

export interface StatisticsFilters {
  year?: number;
  month?: number;
}

export interface Participant {
  userId: string;
  name: string;
  email: string;
  profileImage: string | null;
  invoiceNumber: string;
  tickets: Array<{
    tierName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  totalTickets: number;
  totalPaid: number;
  purchasedAt: string;
}

export interface Activity {
  type: 'transaction' | 'review';
  id: string;
  message: string;
  amount?: number;
  status?: string;
  rating?: number;
  createdAt: string;
}

export const dashboardApi = {
  getSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
    const response = await apiClient.get('/dashboard/summary');
    return response.data;
  },

  getStatistics: async (
    filters?: StatisticsFilters
  ): Promise<ApiResponse<Statistics>> => {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.year) params.append('year', String(filters.year));
      if (filters.month) params.append('month', String(filters.month));
    }

    const response = await apiClient.get(
      `/dashboard/statistics?${params.toString()}`
    );
    return response.data;
  },

  getPendingTransactions: async (
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<Transaction>> => {
    const params = new URLSearchParams();
    if (page) params.append('page', String(page));
    if (limit) params.append('limit', String(limit));

    const response = await apiClient.get(
      `/dashboard/pending-transactions?${params.toString()}`
    );
    return response.data;
  },

  getEventParticipants: async (
    eventId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<Participant>> => {
    const params = new URLSearchParams();
    if (page) params.append('page', String(page));
    if (limit) params.append('limit', String(limit));

    const response = await apiClient.get(
      `/dashboard/events/${eventId}/participants?${params.toString()}`
    );
    return response.data;
  },

  getRecentActivity: async (
    limit?: number
  ): Promise<ApiResponse<Activity[]>> => {
    const response = await apiClient.get('/dashboard/recent-activity', {
      params: { limit },
    });
    return response.data;
  },
};

export default dashboardApi;
