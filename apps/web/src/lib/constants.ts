export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || 'Event Management Platform';
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || '<http://localhost:8000/api/v1>';

export const ROUTES = {
  HOME: '/',
  EVENTS: '/events',
  EVENT_DETAIL: (slug: string) => `/events/${slug}`,
  ORGANIZER: (id: string) => `/organizer/${id}`,
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  MY_TICKETS: '/my-tickets',
  TRANSACTIONS: '/transactions',
  TRANSACTION_DETAIL: (id: string) => `/transactions/${id}`,
  CHECKOUT: (eventId: string) => `/checkout/${eventId}`,
  DASHBOARD: '/dashboard',
  DASHBOARD_EVENTS: '/dashboard/events',
  DASHBOARD_EVENT_CREATE: '/dashboard/events/create',
  DASHBOARD_EVENT_DETAIL: (id: string) => `/dashboard/events/${id}`,
  DASHBOARD_EVENT_EDIT: (id: string) => `/dashboard/events/${id}/edit`,
  DASHBOARD_EVENT_VOUCHERS: (id: string) => `/dashboard/events/${id}/vouchers`,
  DASHBOARD_EVENT_PARTICIPANTS: (id: string) =>
    `/dashboard/events/${id}/participants`,
  DASHBOARD_TRANSACTIONS: '/dashboard/transactions',
  DASHBOARD_TRANSACTION_DETAIL: (id: string) => `/dashboard/transactions/${id}`,
  DASHBOARD_STATISTICS: '/dashboard/statistics',
} as const;

export const QUERY_KEYS = {
  USER: 'user',
  PROFILE: 'profile',
  POINTS: 'points',
  COUPONS: 'coupons',
  EVENTS: 'events',
  EVENT: 'event',
  UPCOMING_EVENTS: 'upcoming-events',
  CATEGORIES: 'categories',
  LOCATIONS: 'locations',
  TRANSACTIONS: 'transactions',
  TRANSACTION: 'transaction',
  MY_TRANSACTIONS: 'my-transactions',
  REVIEWS: 'reviews',
  REVIEW_STATS: 'review-stats',
  ORGANIZER_EVENTS: 'organizer-events',
  DASHBOARD_SUMMARY: 'dashboard-summary',
  DASHBOARD_STATISTICS: 'dashboard-statistics',
  DASHBOARD_PENDING: 'dashboard-pending',
  DASHBOARD_ACTIVITY: 'dashboard-activity',
  EVENT_PARTICIPANTS: 'event-participants',
  EVENT_VOUCHERS: 'event-vouchers',
  EVENT_TRANSACTIONS: 'event-transactions',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  LIMITS: [12, 24, 48],
} as const;

export const TRANSACTION_STATUS_STEPS = [
  { status: 'WAITING_PAYMENT', label: 'Menunggu Pembayaran' },
  { status: 'WAITING_CONFIRMATION', label: 'Menunggu Konfirmasi' },
  { status: 'COMPLETED', label: 'Selesai' },
] as const;

export const IMAGE_PLACEHOLDER = '/images/placeholder-event.jpg';
export const AVATAR_PLACEHOLDER = '/images/avatar-placeholder.png';
