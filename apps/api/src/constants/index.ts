export * from './httpStatus.js';
export * from './messages.js';

// Transaction status constants
export const TRANSACTION_STATUS = {
  WAITING_PAYMENT: 'WAITING_PAYMENT',
  WAITING_CONFIRMATION: 'WAITING_CONFIRMATION',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
} as const;

// Role constants
export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  ORGANIZER: 'ORGANIZER',
} as const;

// Event status constants
export const EVENT_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// File upload limits
export const UPLOAD = {
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ] as string[],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;
