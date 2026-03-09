import { EventStatus, TicketType, DiscountType } from '@prisma/client';

export interface CreateEventInput {
  name: string;
  description: string;
  categoryId: string;
  locationId: string;
  venue: string;
  address: string;
  startDate: Date;
  endDate: Date;
  ticketTiers: CreateTicketTierInput[];
}

export interface CreateTicketTierInput {
  name: string;
  description?: string;
  price: number;
  ticketType: TicketType;
  quota: number;
  maxPerUser?: number;
  salesStartDate: Date;
  salesEndDate: Date;
}

export interface UpdateEventInput {
  name?: string;
  description?: string;
  categoryId?: string;
  locationId?: string;
  venue?: string;
  address?: string;
  startDate?: Date;
  endDate?: Date;
  status?: EventStatus;
}

export interface EventFilters {
  categoryId?: string;
  locationId?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  minPrice?: number;
  maxPrice?: number;
  status?: EventStatus;
  organizerId?: string;
  isFree?: boolean;
}

export interface CreateVoucherInput {
  eventId: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit: number;
  startDate: Date;
  endDate: Date;
}
