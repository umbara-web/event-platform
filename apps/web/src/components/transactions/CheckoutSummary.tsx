'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Tag, Ticket, Wallet, Gift, Loader2, Check } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Checkbox } from '@/src/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Separator } from '@/src/components/ui/separator';
import { toast } from '@/src/components/ui/use-toast';
import { formatRupiah, calculateDiscount } from '@/src/lib/utils';
import { QUERY_KEYS } from '@/src/lib/constants';
import usersApi from '@/src/lib/api/users';
import vouchersApi from '@/src/lib/api/vouchers';
import type { TicketTier, UserCoupon } from '@/src/types';

interface CartItem {
  ticketTier: TicketTier;
  quantity: number;
}

interface CheckoutSummaryProps {
  eventId: string;
  items: CartItem[];
  onCheckout: (data: {
    voucherCode?: string;
    couponId?: string;
    usePoints: boolean;
    pointsToUse: number;
  }) => void;
  isLoading?: boolean;
}

export function CheckoutSummary({
  eventId,
  items,
  onCheckout,
  isLoading,
}: CheckoutSummaryProps) {
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [selectedCouponId, setSelectedCouponId] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);

  // Fetch user points
  const { data: pointsData } = useQuery({
    queryKey: [QUERY_KEYS.POINTS],
    queryFn: () => usersApi.getPointsBalance(),
  });

  // Fetch user coupons
  const { data: couponsData } = useQuery({
    queryKey: [QUERY_KEYS.COUPONS],
    queryFn: () => usersApi.getCoupons(),
  });

  const availablePoints = pointsData?.data?.totalBalance || 0;
  const coupons = couponsData?.data || [];

  // Validate voucher mutation
  const validateVoucherMutation = useMutation({
    mutationFn: (code: string) =>
      vouchersApi.validateVoucher({
        code,
        eventId,
        totalAmount: subtotal,
      }),
    onSuccess: (response) => {
      setAppliedVoucher({
        code: voucherCode,
        discount: response.data!.discountAmount,
      });
      toast({
        title: 'Voucher diterapkan',
        description: `Diskon ${formatRupiah(response.data!.discountAmount)}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Voucher tidak valid',
        description:
          error.response?.data?.message || 'Voucher tidak dapat digunakan',
        variant: 'destructive',
      });
    },
  });

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.ticketTier.price * item.quantity,
    0
  );

  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) return;
    validateVoucherMutation.mutate(voucherCode.trim().toUpperCase());
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
  };

  const handleCouponChange = (couponId: string) => {
    setSelectedCouponId(couponId);
    if (couponId) {
      const coupon = coupons.find((c) => c.id === couponId);
      if (coupon) {
        const discount = calculateDiscount(
          subtotal - (appliedVoucher?.discount || 0),
          coupon.discountType,
          coupon.discountValue,
          coupon.maxDiscount
        );
        setCouponDiscount(discount);
      }
    } else {
      setCouponDiscount(0);
    }
  };

  const handleUsePointsChange = (checked: boolean) => {
    setUsePoints(checked);
    if (checked) {
      const maxPoints = Math.min(
        availablePoints,
        subtotal - (appliedVoucher?.discount || 0) - couponDiscount
      );
      setPointsToUse(maxPoints);
    } else {
      setPointsToUse(0);
    }
  };

  const totalDiscount =
    (appliedVoucher?.discount || 0) + couponDiscount + pointsToUse;
  const finalAmount = Math.max(0, subtotal - totalDiscount);

  const handleCheckout = () => {
    onCheckout({
      voucherCode: appliedVoucher?.code,
      couponId: selectedCouponId || undefined,
      usePoints,
      pointsToUse,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Ticket className='h-5 w-5' />
          Ringkasan Pesanan
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Items */}
        <div className='space-y-2'>
          {items.map((item) => (
            <div
              key={item.ticketTier.id}
              className='flex justify-between text-sm'
            >
              <span>
                {item.ticketTier.name} x {item.quantity}
              </span>
              <span>{formatRupiah(item.ticketTier.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Subtotal */}
        <div className='flex justify-between font-medium'>
          <span>Subtotal</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>

        <Separator />

        {/* Voucher */}
        <div className='space-y-2'>
          <Label className='flex items-center gap-2'>
            <Tag className='h-4 w-4' />
            Voucher Event
          </Label>
          {appliedVoucher ? (
            <div className='flex items-center justify-between rounded-lg bg-green-50 p-3'>
              <div className='flex items-center gap-2 text-green-700'>
                <Check className='h-4 w-4' />
                <span className='font-medium'>{appliedVoucher.code}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='font-medium text-green-700'>
                  -{formatRupiah(appliedVoucher.discount)}
                </span>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleRemoveVoucher}
                  className='h-auto p-1 text-red-600 hover:text-red-700'
                >
                  Hapus
                </Button>
              </div>
            </div>
          ) : (
            <div className='flex gap-2'>
              <Input
                placeholder='Masukkan kode voucher'
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              />
              <Button
                variant='outline'
                onClick={handleApplyVoucher}
                disabled={!voucherCode || validateVoucherMutation.isPending}
              >
                {validateVoucherMutation.isPending ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  'Terapkan'
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Coupon */}
        {coupons.length > 0 && (
          <div className='space-y-2'>
            <Label className='flex items-center gap-2'>
              <Gift className='h-4 w-4' />
              Kupon Anda
            </Label>
            <Select value={selectedCouponId} onValueChange={handleCouponChange}>
              <SelectTrigger>
                <SelectValue placeholder='Pilih kupon' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=''>Tidak menggunakan kupon</SelectItem>
                {coupons.map((coupon) => (
                  <SelectItem key={coupon.id} value={coupon.id}>
                    {coupon.code} -{' '}
                    {coupon.discountType === 'PERCENTAGE'
                      ? `${coupon.discountValue}%`
                      : formatRupiah(coupon.discountValue)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {couponDiscount > 0 && (
              <p className='text-sm text-green-600'>
                Diskon kupon: -{formatRupiah(couponDiscount)}
              </p>
            )}
          </div>
        )}

        {/* Points */}
        {availablePoints > 0 && (
          <div className='space-y-2'>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='usePoints'
                checked={usePoints}
                onCheckedChange={handleUsePointsChange}
              />
              <Label htmlFor='usePoints' className='flex items-center gap-2'>
                <Wallet className='h-4 w-4' />
                Gunakan poin ({formatRupiah(availablePoints)} tersedia)
              </Label>
            </div>
            {usePoints && (
              <p className='text-sm text-green-600'>
                Poin digunakan: -{formatRupiah(pointsToUse)}
              </p>
            )}
          </div>
        )}

        <Separator />

        {/* Discount Summary */}
        {totalDiscount > 0 && (
          <div className='flex justify-between text-sm text-green-600'>
            <span>Total Diskon</span>
            <span>-{formatRupiah(totalDiscount)}</span>
          </div>
        )}

        {/* Final Amount */}
        <div className='flex justify-between text-lg font-bold'>
          <span>Total Pembayaran</span>
          <span className='text-primary'>{formatRupiah(finalAmount)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className='w-full'
          size='lg'
          onClick={handleCheckout}
          disabled={isLoading || items.length === 0}
        >
          {isLoading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Memproses...
            </>
          ) : finalAmount === 0 ? (
            'Konfirmasi Pesanan'
          ) : (
            `Bayar ${formatRupiah(finalAmount)}`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CheckoutSummary;
