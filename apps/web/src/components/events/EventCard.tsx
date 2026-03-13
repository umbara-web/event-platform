import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Star, Users } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { ROUTES, IMAGE_PLACEHOLDER } from '@/src/lib/constants';
import { formatDate, formatRupiah, isEventPast } from '@/src/lib/utils';
import type { Event } from '@/src/types';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const isPast = isEventPast(event.endDate);
  const lowestPrice = event.lowestPrice ?? event.ticketTiers?.[0]?.price ?? 0;
  const isFree = lowestPrice === 0;

  return (
    <Link href={ROUTES.EVENT_DETAIL(event.slug)}>
      <Card className='group h-full overflow-hidden transition-all hover:shadow-lg'>
        {/* Image */}
        <div className='relative aspect-video overflow-hidden'>
          <Image
            src={event.imageUrl || IMAGE_PLACEHOLDER}
            alt={event.name}
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
          {isPast && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/60'>
              <Badge variant='secondary' className='text-lg'>
                Event Selesai
              </Badge>
            </div>
          )}
          {!isPast && (
            <Badge
              className='absolute top-3 left-3'
              variant={isFree ? 'success' : 'default'}
            >
              {isFree ? 'GRATIS' : formatRupiah(lowestPrice)}
            </Badge>
          )}
        </div>

        <CardContent className='p-4'>
          {/* Category */}
          <Badge variant='outline' className='mb-2'>
            {event.category.name}
          </Badge>

          {/* Title */}
          <h3 className='group-hover:text-primary mb-2 line-clamp-2 font-semibold'>
            {event.name}
          </h3>

          {/* Date & Location */}
          <div className='text-muted-foreground space-y-1 text-sm'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4' />
              <span>{formatDate(event.startDate)}</span>
            </div>
            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4' />
              <span className='line-clamp-1'>{event.location.name}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className='border-t px-4 py-3'>
          <div className='flex w-full items-center justify-between text-sm'>
            {/* Rating */}
            {event.averageRating !== undefined && event.averageRating > 0 ? (
              <div className='flex items-center gap-1'>
                <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                <span className='font-medium'>
                  {event.averageRating.toFixed(1)}
                </span>
                <span className='text-muted-foreground'>
                  ({event.totalReviews || event._count?.reviews || 0})
                </span>
              </div>
            ) : (
              <span className='text-muted-foreground'>Belum ada review</span>
            )}

            {/* Organizer */}
            <span className='text-muted-foreground'>
              by {event.organizer.firstName}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default EventCard;
