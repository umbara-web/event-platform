'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  DollarSign,
  Ticket,
  Users,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { RevenueChart } from '@/src/components/dashboard/RevenueChart';
import { StatsCard } from '@/src/components/dashboard/StatsCard';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';
import dashboardApi from '@/src/lib/api/dashboard';
import { QUERY_KEYS } from '@/src/lib/constants';
import { formatRupiah } from '@/src/lib/utils';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
const months = [
  { value: '1', label: 'Januari' },
  { value: '2', label: 'Februari' },
  { value: '3', label: 'Maret' },
  { value: '4', label: 'April' },
  { value: '5', label: 'Mei' },
  { value: '6', label: 'Juni' },
  { value: '7', label: 'Juli' },
  { value: '8', label: 'Agustus' },
  { value: '9', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

export default function StatisticsPage() {
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  // Fetch statistics
  const { data: statsData, isLoading } = useQuery({
    queryKey: [
      QUERY_KEYS.DASHBOARD_STATISTICS,
      {
        year: parseInt(selectedYear),
        month: selectedMonth ? parseInt(selectedMonth) : undefined,
      },
    ],
    queryFn: () =>
      dashboardApi.getStatistics({
        year: parseInt(selectedYear),
        month: selectedMonth ? parseInt(selectedMonth) : undefined,
      }),
  });

  // Fetch summary
  const { data: summaryData } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_SUMMARY],
    queryFn: () => dashboardApi.getSummary(),
  });

  const statistics = statsData?.data;
  const summary = summaryData?.data;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold'>Statistik</h1>
          <p className='text-muted-foreground'>
            Analisis performa event dan pendapatan Anda
          </p>
        </div>

        {/* Filters */}
        <div className='flex items-center gap-4'>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className='w-[120px]'>
              <SelectValue placeholder='Tahun' />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className='w-[150px]'>
              <SelectValue placeholder='Semua Bulan' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=''>Semua Bulan</SelectItem>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <StatsCard
            title='Total Pendapatan'
            value={formatRupiah(summary.revenue)}
            icon={DollarSign}
          />
          <StatsCard
            title='Total Event'
            value={summary.events.total}
            description={`${summary.events.active} aktif`}
            icon={Calendar}
          />
          <StatsCard
            title='Total Peserta'
            value={summary.attendees}
            icon={Users}
          />
          <StatsCard
            title='Total Transaksi'
            value={summary.transactions.completed}
            description={`${summary.transactions.pending} pending`}
            icon={Ticket}
          />
        </div>
      )}

      {/* Chart */}
      {isLoading ? (
        <Card>
          <CardContent className='flex items-center justify-center py-12'>
            <LoadingSpinner />
          </CardContent>
        </Card>
      ) : statistics ? (
        <>
          <RevenueChart data={statistics.data} groupBy={statistics.groupBy} />

          {/* Period Summary */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <TrendingUp className='h-5 w-5' />
                Ringkasan Periode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 md:grid-cols-3'>
                <div className='bg-muted rounded-lg p-4 text-center'>
                  <p className='text-muted-foreground text-sm'>
                    Total Pendapatan
                  </p>
                  <p className='text-primary text-2xl font-bold'>
                    {formatRupiah(statistics.totals.revenue)}
                  </p>
                </div>
                <div className='bg-muted rounded-lg p-4 text-center'>
                  <p className='text-muted-foreground text-sm'>Tiket Terjual</p>
                  <p className='text-2xl font-bold'>
                    {statistics.totals.tickets}
                  </p>
                </div>
                <div className='bg-muted rounded-lg p-4 text-center'>
                  <p className='text-muted-foreground text-sm'>
                    Total Transaksi
                  </p>
                  <p className='text-2xl font-bold'>
                    {statistics.totals.transactions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className='text-muted-foreground py-12 text-center'>
            Tidak ada data untuk periode ini
          </CardContent>
        </Card>
      )}
    </div>
  );
}
