export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  role: 'CUSTOMER' | 'ORGANIZER';
  referralCode: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  province: string | null;
  country: string;
}

export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  description: string | null;
  price: number;
  ticketType: 'FREE' | 'PAID';
  quota: number;
  soldCount: number;
  availableSeats?: number;
  maxPerUser: number;
  salesStartDate: string;
  salesEndDate: string;
}

export interface Event {
  id: string;
  organizerId: string;
  name: string;
  slug: string;
  description: string;
  venue: string;
  address: string;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  category: Category;
  location: Location;
  organizer: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
  };
  ticketTiers: TicketTier[];
  averageRating?: number;
  totalReviews?: number;
  lowestPrice?: number;
  _count?: {
    reviews: number;
    transactions: number;
  };
}

export interface Voucher {
  id: string;
  eventId: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase: number;
  maxDiscount: number | null;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface UserCoupon {
  id: string;
  couponId: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase: number;
  maxDiscount: number | null;
  isUsed: boolean;
  expiresAt: string;
}

export interface Point {
  id: string;
  amount: number;
  expiresAt: string;
  source: string;
  createdAt: string;
}

export interface PointsBalance {
  totalBalance: number;
  points: Point[];
}

export interface TransactionItem {
  id: string;
  ticketTierId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  ticketTier: {
    name: string;
    price: number;
  };
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  userId: string;
  eventId: string;
  status: TransactionStatus;
  totalAmount: number;
  discountAmount: number;
  pointsUsed: number;
  finalAmount: number;
  paymentProof: string | null;
  paymentDeadline: string | null;
  confirmDeadline: string | null;
  paidAt: string | null;
  confirmedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  cancelledAt: string | null;
  expiredAt: string | null;
  createdAt: string;
  event: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    startDate: string;
    venue: string;
  };
  items: TransactionItem[];
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export type TransactionStatus =
  | 'WAITING_PAYMENT'
  | 'WAITING_CONFIRMATION'
  | 'COMPLETED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface Review {
  id: string;
  userId: string;
  eventId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
  };
  event?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface DashboardSummary {
  events: {
    total: number;
    active: number;
    completed: number;
  };
  transactions: {
    total: number;
    completed: number;
    pending: number;
  };
  revenue: number;
  attendees: number;
  rating: {
    average: number;
    total: number;
  };
}

export interface Statistics {
  groupBy: 'day' | 'month' | 'year';
  startDate: string;
  endDate: string;
  data: Array<{
    period: string;
    revenue: number;
    tickets: number;
    transactions: number;
  }>;
  totals: {
    revenue: number;
    tickets: number;
    transactions: number;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}
