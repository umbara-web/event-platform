import apiClient from './client';
import type { ApiResponse, LoginResponse, User } from '@/src/types';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ORGANIZER';
  referralCode?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const authApi = {
  register: async (data: RegisterData): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  logout: async (refreshToken: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post('/auth/logout', { refreshToken });
    return response.data;
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<
    ApiResponse<{ tokens: { accessToken: string; refreshToken: string } }>
  > => {
    const response = await apiClient.post('/auth/refresh-token', {
      refreshToken,
    });
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (
    data: ResetPasswordData
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  changePassword: async (
    data: ChangePasswordData
  ): Promise<ApiResponse<void>> => {
    const response = await apiClient.post('/auth/change-password', data);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

export default authApi;
