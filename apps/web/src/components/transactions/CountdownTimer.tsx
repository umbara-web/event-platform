'use client';

import { Clock } from 'lucide-react';
import { useCountdown } from '@/src/hooks/useCountdown';
import { cn } from '@/src/lib/utils';

interface CountdownTimerProps {
  targetDate: string | Date | null;
  label?: string;
  onExpire?: () => void;
  variant?: 'default' | 'danger';
}

export function CountdownTimer({
  targetDate,
  label = 'Sisa waktu pembayaran',
  onExpire,
  variant = 'default',
}: CountdownTimerProps) {
  const countdown = useCountdown(targetDate);

  if (countdown.isExpired) {
    return (
      <div className='bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg p-4'>
        <Clock className='h-5 w-5' />
        <span className='font-medium'>Waktu habis</span>
      </div>
    );
  }

  const isUrgent = countdown.hours === 0 && countdown.minutes < 30;

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-lg p-4',
        isUrgent || variant === 'danger'
          ? 'bg-destructive/10 text-destructive'
          : 'bg-yellow-50 text-yellow-700'
      )}
    >
      <Clock className='h-5 w-5' />
      <div>
        <p className='text-sm'>{label}</p>
        <p className='text-2xl font-bold tabular-nums'>{countdown.formatted}</p>
      </div>
    </div>
  );
}

export default CountdownTimer;
