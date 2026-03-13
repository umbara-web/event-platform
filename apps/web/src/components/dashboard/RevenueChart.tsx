'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { formatRupiah } from '@/src/lib/utils';
import type { Statistics } from '@/src/types';

interface RevenueChartProps {
  data: Statistics['data'];
  groupBy: Statistics['groupBy'];
}

export function RevenueChart({ data, groupBy }: RevenueChartProps) {
  const formatXAxis = (value: string) => {
    if (groupBy === 'month') {
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agu',
        'Sep',
        'Okt',
        'Nov',
        'Des',
      ];
      return months[parseInt(value) - 1] || value;
    }
    return value;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-background rounded-lg border p-3 shadow-lg'>
          <p className='font-medium'>
            {groupBy === 'month' ? formatXAxis(label) : `${label}`}
          </p>
          <p className='text-primary text-sm'>
            Pendapatan: {formatRupiah(payload[0].value)}
          </p>
          <p className='text-muted-foreground text-sm'>
            {payload[0].payload.tickets} tiket terjual
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Pendapatan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='h-75'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={data}>
              <defs>
                <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='hsl(var(--primary))'
                    stopOpacity={0.3}
                  />
                  <stop
                    offset='95%'
                    stopColor='hsl(var(--primary))'
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
              <XAxis
                dataKey='period'
                tickFormatter={formatXAxis}
                className='text-xs'
              />
              <YAxis
                tickFormatter={(value) =>
                  value >= 1000000
                    ? `${(value / 1000000).toFixed(0)}jt`
                    : value >= 1000
                      ? `${(value / 1000).toFixed(0)}rb`
                      : value
                }
                className='text-xs'
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type='monotone'
                dataKey='revenue'
                stroke='hsl(var(--primary))'
                fillOpacity={1}
                fill='url(#colorRevenue)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default RevenueChart;
