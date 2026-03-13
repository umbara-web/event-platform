import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Percent, Tag, Trash2 } from 'lucide-react';
import { formatRupiah, formatDate } from '@/src/lib/utils';

interface Props {
  voucher: any;
  onDelete: (id: string) => void;
}

export function VoucherCard({ voucher, onDelete }: Props) {
  const isExpired = new Date(voucher.endDate) < new Date();
  const isActive = voucher.isActive && !isExpired;

  return (
    <Card className={!isActive ? 'opacity-60' : ''}>
      <CardHeader className='flex justify-between'>
        <code className='font-bold'>{voucher.code}</code>
        <Badge>{isExpired ? 'Expired' : 'Aktif'}</Badge>
      </CardHeader>

      <CardContent className='space-y-3'>
        {renderDiscount(voucher)}

        <div className='text-muted-foreground text-sm'>
          <p>Min. pembelian: {formatRupiah(voucher.minPurchase)}</p>
          <p>
            {formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}
          </p>
        </div>

        <Button
          variant='destructive'
          size='sm'
          onClick={() => onDelete(voucher.id)}
          disabled={voucher.usedCount > 0}
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Hapus
        </Button>
      </CardContent>
    </Card>
  );
}

function renderDiscount(voucher: any) {
  if (voucher.discountType === 'PERCENTAGE') {
    return (
      <div className='flex items-center gap-2 text-lg font-semibold'>
        <Percent className='h-5 w-5' />
        {voucher.discountValue}% OFF
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2 text-lg font-semibold'>
      <Tag className='h-5 w-5' />
      {formatRupiah(voucher.discountValue)} OFF
    </div>
  );
}
