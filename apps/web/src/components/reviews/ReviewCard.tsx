import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { Card, CardContent } from '@/src/components/ui/card';
import { RatingStars } from './RatingStars';
import { formatRelativeTime, getInitials } from '@/src/lib/utils';
import type { Review } from '@/src/types';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardContent className='p-4'>
        <div className='flex items-start gap-4'>
          <Avatar>
            <AvatarImage src={review.user.profileImage || ''} />
            <AvatarFallback>
              {getInitials(review.user.firstName, review.user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1'>
            <div className='flex items-center justify-between'>
              <h4 className='font-semibold'>
                {review.user.firstName} {review.user.lastName}
              </h4>
              <span className='text-muted-foreground text-sm'>
                {formatRelativeTime(review.createdAt)}
              </span>
            </div>
            <RatingStars rating={review.rating} size='sm' />
            {review.comment && (
              <p className='text-muted-foreground mt-2 text-sm'>
                {review.comment}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ReviewCard;
