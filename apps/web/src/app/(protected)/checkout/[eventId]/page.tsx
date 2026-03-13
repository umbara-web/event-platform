'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Ticket } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { CheckoutSummary } from '@/src/components/transactions/CheckoutSummary';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';
import { toast } from '@/src/components/ui/use-toast';
import { useCartStore } from '@/src/stores/cartStore';
import eventsApi from '@/src/lib/api/events';
import transactionsApi from '@/src/lib/api/transactions';
import { ROUTES, QUERY_KEYS } from '@/src/lib/constants';
import { formatRupiah } from '@/src/lib/utils';

interface CheckoutPageProps {
  params: { eventId: string };
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const router = useRouter();
  const { event, items, clearCart } = useCartStore();

  // Fetch event if not in cart
  const { data: eventData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.EVENT, params.eventId],
    queryFn: () => eventsApi.getEvent(params.eventId),
    enabled: !event || event.id !== params.eventId,
  });

  const currentEvent = event || eventData?.data;

  // Redirect if no items in cart
  useEffect(() => {
    if (!isLoading && items.length === 0) {
      router.push(ROUTES.EVENTS);
    }
  }, [items, isLoading, router]);

  // Create transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: transactionsApi.createTransaction,
    onSuccess: (response) => {
      clearCart();
      toast({
        title: 'Transaksi berhasil dibuat',
        description: 'Silakan lakukan pembayaran',
      });
      router.push(ROUTES.TRANSACTION_DETAIL(response.data!.id));
    },
    onError: (error: any) => {
      toast({
        title: 'Gagal membuat transaksi',
        description: error.response?.data?.message || 'Terjadi kesalahan',
        variant: 'destructive',
      });
    },
  });

  const handleCheckout = (data: {
    voucherCode?: string;
    couponId?: string;
    usePoints: boolean;
    pointsToUse: number;
  }) => {
    if (!currentEvent) return;

    createTransactionMutation.mutate({
      eventId: currentEvent.id,
      items: items.map((item) => ({
        ticketTierId: item.ticketTier.id,
        quantity: item.quantity,
      })),
      voucherCode: data.voucherCode,
      couponId: data.couponId,
      usePoints: data.usePoints,
      pointsToUse: data.pointsToUse,
    });
  };

  if (isLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  if (!currentEvent || items.length === 0) {
    return null;
  }

  return (
    <div className='container py-8'>
      {/* Header */}
      <div className='mb-8'>
        <Button variant='ghost' className='mb-4' onClick={() => router.back()}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Kembali
        </Button>
        <h1 className='text-2xl font-bold'>Checkout</h1>
      </div>

      <div className='grid gap-8 lg:grid-cols-3'>
        {/* Event & Ticket Info */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle>Detail Event</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className='text-lg font-semibold'>{currentEvent.name}</h3>
              <p className='text-muted-foreground text-sm'>
                {currentEvent.venue}, {currentEvent.location.name}
              </p>
            </CardContent>
          </Card>

          {/* Selected Tickets */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Ticket className='h-5 w-5' />
                Tiket yang Dipilih
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {items.map((item) => (
                  <div
                    key={item.ticketTier.id}
                    className='flex items-center justify-between rounded-lg border p-4'
                  >
                    <div>
                      <p className='font-medium'>{item.ticketTier.name}</p>
                      <p className='text-muted-foreground text-sm'>
                        {item.quantity} tiket ×{' '}
                        {formatRupiah(item.ticketTier.price)}
                      </p>
                    </div>
                    <p className='font-semibold'>
                      {formatRupiah(item.ticketTier.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checkout Summary */}
        <div className='lg:col-span-1'>
          <div className='sticky top-20'>
            <CheckoutSummary
              eventId={currentEvent.id}
              items={items}
              onCheckout={handleCheckout}
              isLoading={createTransactionMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
