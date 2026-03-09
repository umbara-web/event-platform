import { v4 as uuidv4 } from 'uuid';

/**
 * Generate unique invoice number
 * Format: INV-YYYYMMDD-XXXXXX
 */
export const generateInvoiceNumber = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const uniqueId = uuidv4().slice(0, 6).toUpperCase();
  return `INV-${dateStr}-${uniqueId}`;
};

// Generate slug from text
export const generateSlug = (text: string): string => {
  const baseSlug = text
    .toLowerCase()
    .trim()
    .replace(/[^\\w\\s-]/g, '')
    .replace(/[\\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const uniqueId = uuidv4().slice(0, 8);
  return `${baseSlug}-${uniqueId}`;
};

// Format currency to Rupiah
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Calculate discount amount
export const calculateDiscount = (
  originalAmount: number,
  discountType: 'PERCENTAGE' | 'FIXED',
  discountValue: number,
  maxDiscount?: number | null
): number => {
  let discount: number;

  if (discountType === 'PERCENTAGE') {
    discount = Math.floor((originalAmount * discountValue) / 100);
    if (maxDiscount && discount > maxDiscount) {
      discount = maxDiscount;
    }
  } else {
    discount = discountValue;
  }

  // Discount cannot exceed original amount
  return Math.min(discount, originalAmount);
};

// Add hours to date
export const addHours = (date: Date, hours: number): Date => {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
};

// Add days to date
export const addDays = (date: Date, days: number): Date => {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};

// Add months to date
export const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

// Check if date is in the past
export const isPast = (date: Date): boolean => {
  return date < new Date();
};

// Check if date is in the future
export const isFuture = (date: Date): boolean => {
  return date > new Date();
};

// Generate coupon code
export const generateCouponCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'DISC-';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Generate voucher code
export const generateVoucherCode = (eventName: string): string => {
  const prefix = eventName
    .substring(0, 4)
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
  const uniqueId = uuidv4().slice(0, 6).toUpperCase();
  return `${prefix}-${uniqueId}`;
};

export default {
  generateInvoiceNumber,
  generateSlug,
  formatRupiah,
  calculateDiscount,
  addHours,
  addDays,
  addMonths,
  isPast,
  isFuture,
  generateCouponCode,
  generateVoucherCode,
};
