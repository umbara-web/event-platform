import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return new Date(date).toLocaleDateString('id-ID', options || defaultOptions);
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Baru saja';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
  return formatDate(date);
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    WAITING_PAYMENT: 'bg-yellow-100 text-yellow-800',
    WAITING_CONFIRMATION: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    EXPIRED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
    DRAFT: 'bg-gray-100 text-gray-800',
    PUBLISHED: 'bg-green-100 text-green-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusText(status: string): string {
  const statusTexts: Record<string, string> = {
    WAITING_PAYMENT: 'Menunggu Pembayaran',
    WAITING_CONFIRMATION: 'Menunggu Konfirmasi',
    COMPLETED: 'Selesai',
    REJECTED: 'Ditolak',
    EXPIRED: 'Kedaluwarsa',
    CANCELLED: 'Dibatalkan',
    DRAFT: 'Draft',
    PUBLISHED: 'Dipublikasikan',
  };
  return statusTexts[status] || status;
}

export function calculateDiscount(
  amount: number,
  discountType: 'PERCENTAGE' | 'FIXED',
  discountValue: number,
  maxDiscount?: number | null
): number {
  let discount: number;

  if (discountType === 'PERCENTAGE') {
    discount = Math.floor((amount * discountValue) / 100);
    if (maxDiscount && discount > maxDiscount) {
      discount = maxDiscount;
    }
  } else {
    discount = discountValue;
  }

  return Math.min(discount, amount);
}

export function isEventUpcoming(startDate: string | Date): boolean {
  return new Date(startDate) > new Date();
}

export function isEventOngoing(
  startDate: string | Date,
  endDate: string | Date
): boolean {
  const now = new Date();
  return new Date(startDate) <= now && new Date(endDate) >= now;
}

export function isEventPast(endDate: string | Date): boolean {
  return new Date(endDate) < new Date();
}
