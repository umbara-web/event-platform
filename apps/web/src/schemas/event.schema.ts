import { z } from 'zod';

export const ticketTierSchema = z.object({
  name: z.string().min(1, 'Nama tiket wajib diisi'),
  description: z.string().optional(),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  quota: z.number().min(1, 'Kuota minimal 1'),
  maxPerUser: z.number().min(1).max(10),
  salesStartDate: z.string().min(1, 'Tanggal mulai penjualan wajib diisi'),
  salesEndDate: z.string().min(1, 'Tanggal akhir penjualan wajib diisi'),
});

export const eventSchema = z.object({
  name: z.string().min(3, 'Nama event minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  categoryId: z.string().min(1, 'Pilih kategori'),
  locationId: z.string().min(1, 'Pilih lokasi'),
  venue: z.string().min(3, 'Nama venue minimal 3 karakter'),
  address: z.string().min(10, 'Alamat minimal 10 karakter'),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, 'Tanggal berakhir wajib diisi'),
  ticketTiers: z.array(ticketTierSchema).min(1, 'Minimal 1 jenis tiket'),
});

// Infer types dari schema
export type EventFormData = z.infer<typeof eventSchema>;
export type TicketTierData = z.infer<typeof ticketTierSchema>;

// Default values dengan tipe yang explicit
export const DEFAULT_TICKET_TIER: TicketTierData = {
  name: 'Regular',
  description: '',
  price: 0,
  quota: 100,
  maxPerUser: 5,
  salesStartDate: '',
  salesEndDate: '',
};

export const DEFAULT_FORM_VALUES: EventFormData = {
  name: '',
  description: '',
  categoryId: '',
  locationId: '',
  venue: '',
  address: '',
  startDate: '',
  endDate: '',
  ticketTiers: [DEFAULT_TICKET_TIER],
};
