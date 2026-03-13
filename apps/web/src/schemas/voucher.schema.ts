import { z } from 'zod';

export const voucherSchema = z.object({
  code: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.coerce.number().min(1, 'Nilai diskon minimal 1'),
  minPurchase: z.coerce.number().min(0).default(0),
  maxDiscount: z.coerce.number().optional(),
  usageLimit: z.coerce.number().min(1, 'Batas penggunaan minimal 1'),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, 'Tanggal berakhir wajib diisi'),
});

export type VoucherFormData = z.infer<typeof voucherSchema>;
