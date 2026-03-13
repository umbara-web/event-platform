import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { cn } from '@/src/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={className}>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-muted-foreground text-sm font-medium'>{title}</p>
            <div className='flex items-baseline gap-2'>
              <p className='text-2xl font-bold'>{value}</p>
              {trend && (
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {trend.isPositive ? '+' : '-'}
                  {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {description && (
              <p className='text-muted-foreground text-xs'>{description}</p>
            )}
          </div>
          <div className='bg-primary/10 rounded-full p-3'>
            <Icon className='text-primary h-6 w-6' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StatsCard;
