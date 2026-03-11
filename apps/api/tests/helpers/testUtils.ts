/// <reference types="jest" />

import { User, Role } from '@prisma/client';

export function createMockUser(overrides: Partial<User> = {}) {
  return {
    id: 'user-123',
    email: 'test@test.com',
    password: 'hashed',
    firstName: 'Test',
    lastName: 'User',
    profileImage: null,
    role: Role.CUSTOMER,
    referralCode: 'REF123',
    referredById: null,
    isVerified: true,
    resetToken: null,
    resetTokenExp: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export const createMockOrganizer = (overrides = {}) => ({
  id: 'organizer-123',
  email: 'organizer@example.com',
  firstName: 'Test',
  lastName: 'Organizer',
  role: Role.ORGANIZER,
  profileImage: null,
  ...overrides,
});

export function createMockCategory() {
  return {
    id: 'category-123',
    name: 'Music',
    slug: 'music',

    description: 'Music events',
    imageUrl: null,

    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function createMockLocation() {
  return {
    id: 'location-123',
    name: 'Jakarta',
    slug: 'jakarta',

    province: 'DKI Jakarta',
    country: 'Indonesia',

    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export const createMockTicketTier = (eventId: string, overrides = {}) => ({
  id: 'tier-123',
  eventId,
  name: 'Regular',
  price: 100000,
  ticketType: 'PAID',
  description: null,
  maxPerUser: 5,
  quota: 100,
  soldCount: 0,
  salesStartDate: new Date(),
  salesEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockEvent = (organizerId: string, overrides = {}) => ({
  id: 'event-123',
  organizerId,
  name: 'Test Event',
  slug: 'test-event-xxxxxxxx',
  description: 'Test description',
  categoryId: 'category-123',
  locationId: 'location-123',
  venue: 'Test Venue',
  address: 'Test Address',
  startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  endDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
  status: 'PUBLISHED',
  imageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockTransaction = (userId: string, eventId: string, overrides = {}) => ({
  id: 'transaction-123',
  userId,
  eventId,
  totalAmount: 200000,
  finalAmount: 200000,
  status: 'PENDING',
  paymentMethod: null,
  paidAt: null,
  expiredAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export function createMockTransactionWithItems() {
  const transaction = createMockTransaction('user-123', 'event-123');

  const items = [
    {
      id: 'item-1',
      transactionId: transaction.id,
      ticketTierId: 'tier-123',
      quantity: 2,
      unitPrice: 100000,
      subtotal: 200000,
      createdAt: new Date(),
    },
  ];

  return {
    transaction,
    items,
  };
}
