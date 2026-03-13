'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Ticket,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Separator } from '@/src/components/ui/separator';
import { TransactionStatus } from '@/src/components/transactions/TransactionStatus';
import { CountdownTimer } from '@/src/components/transactions/CountdownTimer';
import { PaymentProofUpload } from '@/src/components/transactions/PaymentProofUpload';
import { ConfirmDialog } from '@/src/components/shared/ConfirmDialog';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';
import { EmptyState } from '@/src/components/shared/EmptyState';
import { toast } from '@/src/components/ui/use-toast';
import transactionsApi from '@/src/lib/api/transactions';
import { ROUTES, QUERY_KEYS, IMAGE_PLACEHOLDER } from '@/src/lib/constants';
import {
  formatRupiah,
  formatDateTime,
  formatDate,
  getStatusText,
} from '@/src/lib/utils';
import { useState } from 'react';

interface TransactionDetailPageProps {
  params: { id: string };
}

export default function TransactionDetailPage({
  params,
}: TransactionDetailPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Fetch transaction
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION, params.id],
    queryFn: () => transactionsApi.getTransaction(params.id),
    refetchInterval: (data) => {
      // Auto refresh for pending transactions
      const status = data?.state?.data?.data?.status;
      return status === 'WAITING_PAYMENT' || status === 'WAITING_CONFIRMATION'
        ? 30000
        : false;
    },
  });

  // Upload payment proof mutation
  const uploadMutation = useMutation({
    mutationFn: (file: File) =>
      transactionsApi.uploadPaymentProof(params.id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRANSACTION, params.id],
      });
      toast({
        title: 'Bukti pembayaran berhasil diupload',
        description: 'Menunggu konfirmasi dari penyelenggara',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Gagal mengupload',
        description: error.response?.data?.message || 'Terjadi kesalahan',
        variant: 'destructive',
      });
    },
  });

  // Cancel transaction mutation
  const cancelMutation = useMutation({
    mutationFn: () => transactionsApi.cancelTransaction(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRANSACTION, params.id],
      });
      setShowCancelDialog(false);
      toast({
        title: 'Transaksi dibatalkan',
        description: 'Poin dan kupon yang digunakan telah dikembalikan',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Gagal membatalkan',
        description: error.response?.data?.message || 'Terjadi kesalahan',
        variant: 'destructive',
      });
    },
  });

  const transaction = data?.data;

  if (isLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className='container py-16'>
        <EmptyState
          title='Transaksi tidak ditemukan'
          action={{
            label: 'Kembali',
            onClick: () => router.push(ROUTES.TRANSACTIONS),
          }}
        />
      </div>
    );
  }

  const canCancel =
    transaction.status === 'WAITING_PAYMENT' ||
    transaction.status === 'WAITING_CONFIRMATION';
  const canUploadProof = transaction.status === 'WAITING_PAYMENT';
  const isCompleted = transaction.status === 'COMPLETED';

  return (
    <div className='container py-8'>
      {/* Header */}
      <div className='mb-8'>
        <Button variant='ghost' className='mb-4' onClick={() => router.back()}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Kembali
        </Button>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold'>{transaction.invoiceNumber}</h1>
            <p className='text-muted-foreground'>
              Dibuat pada {formatDateTime(transaction.createdAt)}
            </p>
          </div>
          <TransactionStatus status={transaction.status} />
        </div>
      </div>

      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Main Content */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Status Info */}
          {transaction.status === 'WAITING_PAYMENT' &&
            transaction.paymentDeadline && (
              <CountdownTimer
                targetDate={transaction.paymentDeadline}
                label='Batas waktu pembayaran'
              />
            )}

          {transaction.status === 'WAITING_CONFIRMATION' && (
            <Card className='border-blue-200 bg-blue-50'>
              <CardContent className='flex items-center gap-4 p-4'>
                <Clock className='h-6 w-6 text-blue-600' />
                <div>
                  <p className='font-medium text-blue-800'>
                    Menunggu konfirmasi penyelenggara
                  </p>
                  <p className='text-sm text-blue-600'>
                    Pembayaran Anda sedang diverifikasi
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {transaction.status === 'COMPLETED' && (
            <Card className='border-green-200 bg-green-50'>
              <CardContent className='flex items-center gap-4 p-4'>
                <CheckCircle className='h-6 w-6 text-green-600' />
                <div>
                  <p className='font-medium text-green-800'>
                    Transaksi selesai
                  </p>
                  <p className='text-sm text-green-600'>
                    Tiket Anda sudah aktif dan siap digunakan
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {transaction.status === 'REJECTED' && (
            <Card className='border-red-200 bg-red-50'>
              <CardContent className='p-4'>
                <div className='flex items-center gap-4'>
                  <XCircle className='h-6 w-6 text-red-600' />
                  <div>
                    <p className='font-medium text-red-800'>
                      Transaksi ditolak
                    </p>
                    {transaction.rejectionReason && (
                      <p className='text-sm text-red-600'>
                        Alasan: {transaction.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle>Detail Event</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={ROUTES.EVENT_DETAIL(transaction.event.slug)}
                className='flex gap-4'
              >
                <div className='relative h-24 w-32 overflow-hidden rounded-lg'>
                  <Image
                    src={transaction.event.imageUrl || IMAGE_PLACEHOLDER}
                    alt={transaction.event.name}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='flex-1'>
                  <h3 className='hover:text-primary font-semibold'>
                    {transaction.event.name}
                  </h3>
                  <div className='text-muted-foreground mt-2 space-y-1 text-sm'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4' />
                      <span>{formatDate(transaction.event.startDate)}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <MapPin className='h-4 w-4' />
                      <span>{transaction.event.venue}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Tickets */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Ticket className='h-5 w-5' />
                Detail Tiket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {transaction.items.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between rounded-lg border p-4'
                  >
                    <div>
                      <p className='font-medium'>{item.ticketTier.name}</p>
                      <p className='text-muted-foreground text-sm'>
                        {item.quantity} tiket × {formatRupiah(item.unitPrice)}
                      </p>
                    </div>
                    <p className='font-semibold'>
                      {formatRupiah(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Proof Upload */}
          {canUploadProof && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Bukti Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentProofUpload
                  onUpload={(file) => uploadMutation.mutate(file)}
                  isLoading={uploadMutation.isPending}
                  currentImage={transaction.paymentProof}
                />
              </CardContent>
            </Card>
          )}

          {/* Payment Proof Display */}
          {transaction.paymentProof && !canUploadProof && (
            <Card>
              <CardHeader>
                <CardTitle>Bukti Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='relative aspect-video overflow-hidden rounded-lg'>
                  <Image
                    src={transaction.paymentProof}
                    alt='Bukti pembayaran'
                    fill
                    className='object-contain'
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Payment Summary */}
        <div className='lg:col-span-1'>
          <div className='sticky top-20'>
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Subtotal</span>
                    <span>{formatRupiah(transaction.totalAmount)}</span>
                  </div>
                  {transaction.discountAmount > 0 && (
                    <div className='flex justify-between text-sm text-green-600'>
                      <span>Diskon</span>
                      <span>-{formatRupiah(transaction.discountAmount)}</span>
                    </div>
                  )}
                  {transaction.pointsUsed > 0 && (
                    <div className='flex justify-between text-sm text-green-600'>
                      <span>Poin digunakan</span>
                      <span>-{formatRupiah(transaction.pointsUsed)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className='flex justify-between text-lg font-bold'>
                  <span>Total</span>
                  <span className='text-primary'>
                    {formatRupiah(transaction.finalAmount)}
                  </span>
                </div>

                {canCancel && (
                  <>
                    <Separator />
                    <Button
                      variant='destructive'
                      className='w-full'
                      onClick={() => setShowCancelDialog(true)}
                    >
                      Batalkan Transaksi
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title='Batalkan Transaksi?'
        description='Transaksi yang dibatalkan tidak dapat dikembalikan. Poin dan kupon yang digunakan akan dikembalikan ke akun Anda.'
        confirmText='Ya, Batalkan'
        variant='destructive'
        isLoading={cancelMutation.isPending}
        onConfirm={() => cancelMutation.mutate()}
      />
    </div>
  );
}
