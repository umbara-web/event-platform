'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEvent } from '@/src/hooks/useEvent';
import { useVouchers } from '@/src/hooks/useVouchers';
import { useVoucherMutations } from '@/src/hooks/useVoucherMutations';
import { VoucherList } from '@/src/components/voucher/VoucherList';

interface Props {
  params: { id: string };
}

export default function VouchersPage({ params }: Props) {
  const router = useRouter();
  const { data: event } = useEvent(params.id);
  const { data: vouchers } = useVouchers(params.id);
  const { deleteVoucher } = useVoucherMutations(params.id);

  const handleDelete = (id: string) => deleteVoucher.mutate(id);

  return (
    <div className='space-y-6'>
      <header>
        <Button variant='ghost' onClick={() => router.back()}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Kembali
        </Button>

        <h1 className='text-2xl font-bold'>Kelola Voucher</h1>
        <p className='text-muted-foreground'>{event?.data?.name}</p>
      </header>

      <VoucherList vouchers={vouchers?.data || []} onDelete={handleDelete} />
    </div>
  );
}
