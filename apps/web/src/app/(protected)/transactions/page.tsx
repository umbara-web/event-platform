'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ChevronRight, Ticket } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { TransactionStatus } from '@/src/components/transactions/TransactionStatus';
import { Pagination } from '@/src/components/shared/Pagination';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';
import { EmptyState } from '@/src/components/shared/EmptyState';
import transactionsApi from '@/src/lib/api/transactions';
import {
  ROUTES,
  QUERY_KEYS,
  IMAGE_PLACEHOLDER,
  PAGINATION,
} from '@/src/lib/constants';
import { formatRupiah, formatDate } from '@/src/lib/utils';
import type { TransactionStatus as TStatus } from '@/src/types';

const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'WAITING_PAYMENT', label: 'Menunggu Pembayaran' },
  { value: 'WAITING_CONFIRMATION', label: 'Menunggu Konfirmasi' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: 'REJECTED', label: 'Ditolak' },
  { value: 'EXPIRED', label: 'Kedaluwarsa' },
  { value: 'CANCELLED', label: 'Dibatalkan' },
];

export default function TransactionsPage() {
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.MY_TRANSACTIONS, { status, page }],
    queryFn: () =>
      transactionsApi.getMyTransactions({
        status: status || undefined,
        page,
        limit: PAGINATION.DEFAULT_LIMIT,
      }),
  });

  const transactions = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className='container py-8'>
      <div className='mb-8 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold'>Riwayat Transaksi</h1>
          <p className='text-muted-foreground'>Lihat semua transaksi Anda</p>
        </div>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className='w-50'>
            <SelectValue placeholder='Filter status' />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <LoadingSpinner size='lg' />
        </div>
      ) : transactions.length > 0 ? (
        <>
          <div className='space-y-4'>
            {transactions.map((transaction) => (
              <Link
                key={transaction.id}
                href={ROUTES.TRANSACTION_DETAIL(transaction.id)}
              >
                <Card className='transition-all hover:shadow-md'>
                  <CardContent className='flex items-center gap-4 p-4'>
                    {/* Event Image */}
                    <div className='relative hidden h-20 w-28 overflow-hidden rounded-lg sm:block'>
                      <Image
                        src={transaction.event.imageUrl || IMAGE_PLACEHOLDER}
                        alt={transaction.event.name}
                        fill
                        className='object-cover'
                      />
                    </div>

                    {/* Info */}
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-start justify-between gap-2'>
                        <div className='min-w-0'>
                          <p className='truncate font-semibold'>
                            {transaction.event.name}
                          </p>
                          <p className='text-muted-foreground text-sm'>
                            {transaction.invoiceNumber}
                          </p>
                        </div>
                        <TransactionStatus status={transaction.status} />
                      </div>

                      <div className='text-muted-foreground mt-2 flex flex-wrap items-center gap-4 text-sm'>
                        <div className='flex items-center gap-1'>
                          <Calendar className='h-4 w-4' />
                          <span>{formatDate(transaction.createdAt)}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Ticket className='h-4 w-4' />
                          <span>
                            {transaction.items.reduce(
                              (sum, item) => sum + item.quantity,
                              0
                            )}{' '}
                            tiket
                          </span>
                        </div>
                        <span className='text-primary font-semibold'>
                          {formatRupiah(transaction.finalAmount)}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className='text-muted-foreground h-5 w-5' />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className='mt-8'>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={Ticket}
          title='Belum ada transaksi'
          description='Mulai jelajahi event dan beli tiket pertamamu'
          action={{
            label: 'Jelajahi Event',
            onClick: () => (window.location.href = ROUTES.EVENTS),
          }}
        />
      )}
    </div>
  );
}
