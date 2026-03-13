'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Calendar,
  CreditCard,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { StatsCard } from '@/src/components/dashboard/StatsCard';
import { RevenueChart } from '@/src/components/dashboard/RevenueChart';
import { RecentActivity } from '@/src/components/dashboard/RecentActivity';
import { PendingTransactions } from '@/src/components/dashboard/PendingTransactions';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';
import { Skeleton } from '@/src/components/ui/skeleton';
import dashboardApi from '@/src/lib/api/dashboard';
import { ROUTES, QUERY_KEYS } from '@/src/lib/constants';
import { formatRupiah } from '@/src/lib/utils';

export default function DashboardPage() {
  // Fetch summary
  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_SUMMARY],
    queryFn: () => dashboardApi.getSummary(),
  });

  // Fetch statistics (current year)
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: [
      QUERY_KEYS.DASHBOARD_STATISTICS,
      { year: new Date().getFullYear() },
    ],
    queryFn: () =>
      dashboardApi.getStatistics({ year: new Date().getFullYear() }),
  });

  // Fetch pending transactions
  const { data: pendingData } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_PENDING],
    queryFn: () => dashboardApi.getPendingTransactions(1, 5),
  });

  // Fetch recent activity
  const { data: activityData } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_ACTIVITY],
    queryFn: () => dashboardApi.getRecentActivity(10),
  });

  const summary = summaryData?.data;
  const statistics = statsData?.data;
  const pendingTransactions = pendingData?.data || [];
  const activities = activityData?.data || [];

  if (isSummaryLoading) {
    return (
      <div className='space-y-6'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-32' />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Selamat datang kembali! Berikut ringkasan aktivitas Anda.
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.DASHBOARD_EVENT_CREATE}>Buat Event Baru</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Pendapatan'
          value={formatRupiah(summary?.revenue || 0)}
          icon={DollarSign}
        />
        <StatsCard
          title='Total Event'
          value={summary?.events.total || 0}
          description={`${summary?.events.active || 0} aktif`}
          icon={Calendar}
        />
        <StatsCard
          title='Total Peserta'
          value={summary?.attendees || 0}
          icon={Users}
        />
        <StatsCard
          title='Rating Rata-rata'
          value={summary?.rating.average.toFixed(1) || '0.0'}
          description={`${summary?.rating.total || 0} ulasan`}
          icon={Star}
        />
      </div>

      {/* Charts & Activity */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Revenue Chart */}
        {statistics && (
          <RevenueChart data={statistics.data} groupBy={statistics.groupBy} />
        )}

        {/* Recent Activity */}
        <RecentActivity activities={activities} />
      </div>

      {/* Pending Transactions */}
      {pendingTransactions.length > 0 && (
        <div>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>
              Transaksi Menunggu Konfirmasi
            </h2>
            <Button variant='ghost' asChild>
              <Link href={ROUTES.DASHBOARD_TRANSACTIONS}>
                Lihat Semua
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
          <PendingTransactions transactions={pendingTransactions} />
        </div>
      )}
    </div>
  );
}
