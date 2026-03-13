'use client';

import { Star } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className='flex items-center gap-0.5'>
      {Array.from({ length: maxRating }).map((_, index) => {
        const isFilled = index < rating;
        const isHalf = index === Math.floor(rating) && rating % 1 !== 0;

        return (
          <button
            key={index}
            type='button'
            onClick={() => handleClick(index)}
            disabled={!interactive}
            className={cn(
              'transition-colors',
              interactive && 'cursor-pointer hover:scale-110'
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-muted text-muted'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export default RatingStars;
