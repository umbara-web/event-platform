import { CreditCard, Star, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { formatRelativeTime, formatRupiah } from '@/src/lib/utils';
import type { Activity } from '@/src/lib/api/dashboard';

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Clock className='h-5 w-5' />
          Aktivitas Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {activities.length === 0 ? (
            <p className='text-muted-foreground py-4 text-center'>
              Belum ada aktivitas
            </p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className='flex items-start gap-4'>
                <div
                  className={`rounded-full p-2 ${
                    activity.type === 'transaction'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {activity.type === 'transaction' ? (
                    <CreditCard className='h-4 w-4' />
                  ) : (
                    <Star className='h-4 w-4' />
                  )}
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='text-sm'>{activity.message}</p>
                  <div className='mt-1 flex items-center gap-2'>
                    {activity.amount && (
                      <span className='text-sm font-medium text-green-600'>
                        {formatRupiah(activity.amount)}
                      </span>
                    )}
                    {activity.rating && (
                      <span className='text-sm font-medium text-yellow-600'>
                        ⭐ {activity.rating}
                      </span>
                    )}
                    <span className='text-muted-foreground text-xs'>
                      {formatRelativeTime(activity.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentActivity;
