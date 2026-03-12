import apiClient from './client';
import type { ApiResponse, Voucher } from '@/src/types';

export interface CreateVoucherData {
  eventId: string;
  code?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
}

export interface UpdateVoucherData {
  discountType?: 'PERCENTAGE' | 'FIXED';
  discountValue?: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface ValidateVoucherData {
  code: string;
  eventId: string;
  totalAmount: number;
}

export interface ValidateVoucherResponse {
  discountAmount: number;
}

export const vouchersApi = {
  createVoucher: async (
    data: CreateVoucherData
  ): Promise<ApiResponse<Voucher>> => {
    const response = await apiClient.post('/vouchers', data);
    return response.data;
  },

  updateVoucher: async (
    id: string,
    data: UpdateVoucherData
  ): Promise<ApiResponse<Voucher>> => {
    const response = await apiClient.patch(`/vouchers/${id}`, data);
    return response.data;
  },

  deleteVoucher: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/vouchers/${id}`);
    return response.data;
  },

  getEventVouchers: async (
    eventId: string
  ): Promise<ApiResponse<Voucher[]>> => {
    const response = await apiClient.get(`/vouchers/event/${eventId}`);
    return response.data;
  },

  validateVoucher: async (
    data: ValidateVoucherData
  ): Promise<ApiResponse<ValidateVoucherResponse>> => {
    const response = await apiClient.post('/vouchers/validate', data);
    return response.data;
  },
};

export default vouchersApi;
