import apiClient from './client';
import type { ApiResponse, PaginatedResponse, Transaction } from '@/src/types';

export interface CreateTransactionData {
  eventId: string;
  items: Array<{
    ticketTierId: string;
    quantity: number;
  }>;
  voucherCode?: string;
  couponId?: string;
  usePoints?: boolean;
  pointsToUse?: number;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  status?: string;
  eventId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ConfirmTransactionData {
  action: 'accept' | 'reject';
  rejectionReason?: string;
}

export const transactionsApi = {
  createTransaction: async (
    data: CreateTransactionData
  ): Promise<ApiResponse<Transaction>> => {
    const response = await apiClient.post('/transactions', data);
    return response.data;
  },

  getMyTransactions: async (
    filters?: TransactionFilters
  ): Promise<PaginatedResponse<Transaction>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get(
      `/transactions/my?${params.toString()}`
    );
    return response.data;
  },

  getTransaction: async (id: string): Promise<ApiResponse<Transaction>> => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  },

  uploadPaymentProof: async (
    id: string,
    file: File
  ): Promise<ApiResponse<Transaction>> => {
    const formData = new FormData();
    formData.append('paymentProof', file);

    const response = await apiClient.post(
      `/transactions/${id}/payment-proof`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  cancelTransaction: async (id: string): Promise<ApiResponse<Transaction>> => {
    const response = await apiClient.post(`/transactions/${id}/cancel`);
    return response.data;
  },

  // Organizer endpoints
  getEventTransactions: async (
    eventId: string,
    filters?: TransactionFilters
  ): Promise<PaginatedResponse<Transaction>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get(
      `/transactions/event/${eventId}?${params.toString()}`
    );
    return response.data;
  },

  confirmTransaction: async (
    id: string,
    data: ConfirmTransactionData
  ): Promise<ApiResponse<Transaction>> => {
    const response = await apiClient.post(`/transactions/${id}/confirm`, data);
    return response.data;
  },
};

export default transactionsApi;
