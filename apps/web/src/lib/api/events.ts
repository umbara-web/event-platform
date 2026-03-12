import apiClient from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  Event,
  Category,
  Location,
  Voucher,
  ReviewStats,
} from '@/src/types';

export interface EventFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  locationId?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  isFree?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateEventData {
  name: string;
  description: string;
  categoryId: string;
  locationId: string;
  venue: string;
  address: string;
  startDate: string;
  endDate: string;
  ticketTiers: Array<{
    name: string;
    description?: string;
    price: number;
    ticketType: 'FREE' | 'PAID';
    quota: number;
    maxPerUser?: number;
    salesStartDate: string;
    salesEndDate: string;
  }>;
}

export interface UpdateEventData {
  name?: string;
  description?: string;
  categoryId?: string;
  locationId?: string;
  venue?: string;
  address?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const eventsApi = {
  getEvents: async (
    filters?: EventFilters
  ): Promise<PaginatedResponse<Event>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get(`/events?${params.toString()}`);
    return response.data;
  },

  getUpcomingEvents: async (limit?: number): Promise<ApiResponse<Event[]>> => {
    const response = await apiClient.get('/events/upcoming', {
      params: { limit },
    });
    return response.data;
  },

  getEvent: async (idOrSlug: string): Promise<ApiResponse<Event>> => {
    const response = await apiClient.get(`/events/${idOrSlug}`);
    return response.data;
  },

  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response = await apiClient.get('/events/categories');
    return response.data;
  },

  getLocations: async (): Promise<ApiResponse<Location[]>> => {
    const response = await apiClient.get('/events/locations');
    return response.data;
  },

  // Organizer endpoints
  getMyEvents: async (
    filters?: EventFilters
  ): Promise<PaginatedResponse<Event>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get(
      `/events/my/events?${params.toString()}`
    );
    return response.data;
  },

  createEvent: async (
    data: CreateEventData,
    image?: File
  ): Promise<ApiResponse<Event>> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('categoryId', data.categoryId);
    formData.append('locationId', data.locationId);
    formData.append('venue', data.venue);
    formData.append('address', data.address);
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);
    formData.append('ticketTiers', JSON.stringify(data.ticketTiers));

    if (image) {
      formData.append('image', image);
    }

    const response = await apiClient.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateEvent: async (
    id: string,
    data: UpdateEventData,
    image?: File
  ): Promise<ApiResponse<Event>> => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    if (image) {
      formData.append('image', image);
    }

    const response = await apiClient.patch(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteEvent: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  },

  publishEvent: async (id: string): Promise<ApiResponse<Event>> => {
    const response = await apiClient.post(`/events/${id}/publish`);
    return response.data;
  },
};

export default eventsApi;
