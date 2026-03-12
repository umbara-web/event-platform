import apiClient from './client';
import type { ApiResponse, User, PointsBalance, UserCoupon } from '@/src/types';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
}

export interface OrganizerProfile {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  createdAt: string;
  organizedEvents: Array<{
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    startDate: string;
  }>;
  averageRating: number;
  totalReviews: number;
}

export const usersApi = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  updateProfile: async (
    data: UpdateProfileData
  ): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch('/users/profile', data);
    return response.data;
  },

  uploadProfileImage: async (file: File): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/users/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getPointsBalance: async (): Promise<ApiResponse<PointsBalance>> => {
    const response = await apiClient.get('/users/points');
    return response.data;
  },

  getCoupons: async (
    includeUsed?: boolean
  ): Promise<ApiResponse<UserCoupon[]>> => {
    const response = await apiClient.get('/users/coupons', {
      params: { includeUsed },
    });
    return response.data;
  },

  getOrganizerProfile: async (
    id: string
  ): Promise<ApiResponse<OrganizerProfile>> => {
    const response = await apiClient.get(`/users/organizers/${id}`);
    return response.data;
  },
};

export default usersApi;
