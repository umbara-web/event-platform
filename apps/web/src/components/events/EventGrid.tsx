import { EventCard } from './EventCard';
import { Skeleton } from '@/src/components/ui/skeleton';
import { EmptyState } from '@/src/components/shared/EmptyState';
import type { Event } from '@/src/types';

interface EventGridProps {
  events: Event[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function EventGrid({
  events,
  isLoading,
  emptyMessage = 'Tidak ada event ditemukan',
}: EventGridProps) {
  if (isLoading) {
    return (
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

function EventCardSkeleton() {
  return (
    <div className='bg-card overflow-hidden rounded-lg border'>
      <Skeleton className='aspect-video w-full' />
      <div className='space-y-3 p-4'>
        <Skeleton className='h-5 w-20' />
        <Skeleton className='h-6 w-full' />
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-4 w-24' />
      </div>
      <div className='border-t px-4 py-3'>
        <Skeleton className='h-4 w-full' />
      </div>
    </div>
  );
}

export default EventGrid;
