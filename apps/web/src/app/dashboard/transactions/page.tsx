'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ChevronRight, CreditCard, Eye } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { TransactionStatus } from '@/src/components/transactions/TransactionStatus';
import { PendingTransactions } from '@/src/components/dashboard/PendingTransactions';
import { Pagination } from '@/src/components/shared/Pagination';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';
import { EmptyState } from '@/src/components/shared/EmptyState';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/tabs';
import dashboardApi from '@/src/lib/api/dashboard';
import eventsApi from '@/src/lib/api/events';
import transactionsApi from '@/src/lib/api/transactions';
import {
  ROUTES,
  QUERY_KEYS,
  IMAGE_PLACEHOLDER,
  PAGINATION,
} from '@/src/lib/constants';
import { formatRupiah, formatDate, formatDateTime } from '@/src/lib/utils';

export default function DashboardTransactionsPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [page, setPage] = useState(1);

  // Fetch organizer events for filter
  const { data: eventsData } = useQuery({
    queryKey: [QUERY_KEYS.ORGANIZER_EVENTS],
    queryFn: () => eventsApi.getMyEvents({ limit: 100 }),
  });

  // Fetch pending transactions
  const { data: pendingData, isLoading: isPendingLoading } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_PENDING, page],
    queryFn: () =>
      dashboardApi.getPendingTransactions(page, PAGINATION.DEFAULT_LIMIT),
    enabled: activeTab === 'pending',
  });

  // Fetch all transactions for selected event
  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery(
    {
      queryKey: [QUERY_KEYS.EVENT_TRANSACTIONS, selectedEventId, page],
      queryFn: () =>
        transactionsApi.getEventTransactions(selectedEventId, {
          page,
          limit: PAGINATION.DEFAULT_LIMIT,
        }),
      enabled: activeTab === 'all' && !!selectedEventId,
    }
  );

  const events = eventsData?.data || [];
  const pendingTransactions = pendingData?.data || [];
  const pendingPagination = pendingData?.pagination;
  const allTransactions = transactionsData?.data || [];
  const allPagination = transactionsData?.pagination;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold'>Transaksi</h1>
        <p className='text-muted-foreground'>
          Kelola dan konfirmasi transaksi dari event Anda
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value='pending'>
            Menunggu Konfirmasi
            {pendingTransactions.length > 0 && (
              <span className='bg-destructive text-destructive-foreground ml-2 rounded-full px-2 py-0.5 text-xs'>
                {pendingData?.pagination?.totalItems ||
                  pendingTransactions.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value='all'>Semua Transaksi</TabsTrigger>
        </TabsList>

        {/* Pending Tab */}
        <TabsContent value='pending' className='mt-6'>
          {isPendingLoading ? (
            <div className='flex justify-center py-12'>
              <LoadingSpinner />
            </div>
          ) : pendingTransactions.length > 0 ? (
            <>
              <PendingTransactions transactions={pendingTransactions} />
              {pendingPagination && pendingPagination.totalPages > 1 && (
                <div className='mt-6'>
                  <Pagination
                    currentPage={pendingPagination.currentPage}
                    totalPages={pendingPagination.totalPages}
                    totalItems={pendingPagination.totalItems}
                    itemsPerPage={pendingPagination.itemsPerPage}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={CreditCard}
              title='Tidak ada transaksi pending'
              description='Semua transaksi sudah dikonfirmasi'
            />
          )}
        </TabsContent>

        {/* All Transactions Tab */}
        <TabsContent value='all' className='mt-6 space-y-4'>
          {/* Event Filter */}
          <div className='flex items-center gap-4'>
            <Select
              value={selectedEventId}
              onValueChange={(v) => {
                setSelectedEventId(v);
                setPage(1);
              }}
            >
              <SelectTrigger className='w-[300px]'>
                <SelectValue placeholder='Pilih event' />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!selectedEventId ? (
            <EmptyState
              icon={Calendar}
              title='Pilih event'
              description='Pilih event untuk melihat daftar transaksi'
            />
          ) : isTransactionsLoading ? (
            <div className='flex justify-center py-12'>
              <LoadingSpinner />
            </div>
          ) : allTransactions.length > 0 ? (
            <>
              <div className='space-y-4'>
                {allTransactions.map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className='flex items-center justify-between p-4'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2'>
                          <p className='font-medium'>
                            {transaction.invoiceNumber}
                          </p>
                          <TransactionStatus status={transaction.status} />
                        </div>
                        <p className='text-muted-foreground text-sm'>
                          {transaction.user?.firstName}{' '}
                          {transaction.user?.lastName} •{' '}
                          {transaction.user?.email}
                        </p>
                        <div className='mt-1 flex items-center gap-4 text-sm'>
                          <span className='text-primary font-medium'>
                            {formatRupiah(transaction.finalAmount)}
                          </span>
                          <span className='text-muted-foreground'>
                            {formatDateTime(transaction.createdAt)}
                          </span>
                        </div>
                      </div>
                      <Button variant='ghost' size='icon' asChild>
                        <Link
                          href={ROUTES.DASHBOARD_TRANSACTION_DETAIL(
                            transaction.id
                          )}
                        >
                          <Eye className='h-4 w-4' />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {allPagination && allPagination.totalPages > 1 && (
                <Pagination
                  currentPage={allPagination.currentPage}
                  totalPages={allPagination.totalPages}
                  totalItems={allPagination.totalItems}
                  itemsPerPage={allPagination.itemsPerPage}
                  onPageChange={setPage}
                />
              )}
            </>
          ) : (
            <EmptyState
              icon={CreditCard}
              title='Belum ada transaksi'
              description='Event ini belum memiliki transaksi'
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
