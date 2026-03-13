'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Textarea } from '@/src/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { toast } from '@/src/components/ui/use-toast';
import reviewsApi from '@/src/lib/api/reviews';
import { QUERY_KEYS } from '@/src/lib/constants';
import { cn } from '@/src/lib/utils';

interface ReviewFormProps {
  eventId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ eventId, onSuccess }: ReviewFormProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const createReviewMutation = useMutation({
    mutationFn: () =>
      reviewsApi.createReview({
        eventId,
        rating,
        comment: comment.trim() || undefined,
      }),
    onSuccess: () => {
      toast({
        title: 'Review berhasil dikirim',
        description: 'Terima kasih atas feedback Anda!',
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REVIEWS, eventId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REVIEW_STATS, eventId],
      });
      setRating(0);
      setComment('');
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Gagal mengirim review',
        description: error.response?.data?.message || 'Terjadi kesalahan',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: 'Rating diperlukan',
        description: 'Silakan berikan rating untuk event ini',
        variant: 'destructive',
      });
      return;
    }
    createReviewMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tulis Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Rating Stars */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Rating</label>
            <div className='flex gap-1'>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type='button'
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className='transition-transform hover:scale-110'
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors',
                      (hoverRating || rating) >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-muted text-muted'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Komentar (Opsional)</label>
            <Textarea
              placeholder='Bagikan pengalaman Anda mengikuti event ini...'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <Button
            type='submit'
            disabled={rating === 0 || createReviewMutation.isPending}
          >
            {createReviewMutation.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Kirim Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ReviewForm;
