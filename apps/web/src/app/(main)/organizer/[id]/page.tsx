'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Star, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/tabs';
import { EventCard } from '@/src/components/events/EventCard';
import { ReviewCard } from '@/src/components/reviews/ReviewCard';
import { RatingStars } from '@/src/components/reviews/RatingStars';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';
import { EmptyState } from '@/src/components/shared/EmptyState';
import { Pagination } from '@/src/components/shared/Pagination';
import usersApi from '@/src/lib/api/users';
import reviewsApi from '@/src/lib/api/reviews';
import eventsApi from '@/src/lib/api/events';
import { ROUTES, QUERY_KEYS } from '@/src/lib/constants';
import { formatDate, getInitials } from '@/src/lib/utils';
import { useState } from 'react';

interface OrganizerPageProps {
  params: { id: string };
}

export default function OrganizerPage({ params }: OrganizerPageProps) {
  const router = useRouter();
  const [reviewPage, setReviewPage] = useState(1);

  // Fetch organizer profile
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE, params.id],
    queryFn: () => usersApi.getOrganizerProfile(params.id),
  });

  // Fetch organizer's published events
  const { data: eventsData, isLoading: isEventsLoading } = useQuery({
    queryKey: [QUERY_KEYS.EVENTS, { organizerId: params.id }],
    queryFn: () =>
      eventsApi.getEvents({
        status: 'PUBLISHED',
        limit: 12,
      }),
  });

  // Fetch organizer reviews
  const { data: reviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: [QUERY_KEYS.REVIEWS, 'organizer', params.id, reviewPage],
    queryFn: () =>
      reviewsApi.getOrganizerReviews(params.id, {
        page: reviewPage,
        limit: 10,
      }),
  });

  const profile = profileData?.data;
  const events = eventsData?.data || [];
  const reviews = reviewsData?.data || [];
  const reviewsPagination = reviewsData?.pagination;

  if (isProfileLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className='container py-16'>
        <EmptyState
          title='Penyelenggara tidak ditemukan'
          action={{
            label: 'Kembali',
            onClick: () => router.back(),
          }}
        />
      </div>
    );
  }

  return (
    <div className='container py-8'>
      {/* Back Button */}
      <Button variant='ghost' className='mb-6' onClick={() => router.back()}>
        <ArrowLeft className='mr-2 h-4 w-4' />
        Kembali
      </Button>

      {/* Profile Header */}
      <Card className='mb-8'>
        <CardContent className='flex flex-col items-center gap-6 p-8 md:flex-row md:items-start'>
          <Avatar className='h-24 w-24 md:h-32 md:w-32'>
            <AvatarImage src={profile.profileImage || ''} />
            <AvatarFallback className='text-2xl'>
              {getInitials(profile.firstName, profile.lastName)}
            </AvatarFallback>
          </Avatar>

          <div className='flex-1 text-center md:text-left'>
            <h1 className='text-2xl font-bold md:text-3xl'>
              {profile.firstName} {profile.lastName}
            </h1>
            <Badge className='mt-2' variant='secondary'>
              Penyelenggara Event
            </Badge>

            <div className='text-muted-foreground mt-4 flex flex-wrap items-center justify-center gap-4 md:justify-start'>
              <div className='flex items-center gap-1'>
                <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                <span className='text-foreground font-medium'>
                  {profile.averageRating.toFixed(1)}
                </span>
                <span>({profile.totalReviews} ulasan)</span>
              </div>
              <div className='flex items-center gap-1'>
                <Calendar className='h-5 w-5' />
                <span>{profile.organizedEvents?.length || 0} event</span>
              </div>
              <div className='flex items-center gap-1'>
                <Users className='h-5 w-5' />
                <span>Bergabung {formatDate(profile.createdAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs: Events & Reviews */}
      <Tabs defaultValue='events'>
        <TabsList className='w-full'>
          <TabsTrigger value='events' className='flex-1'>
            Event ({events.length})
          </TabsTrigger>
          <TabsTrigger value='reviews' className='flex-1'>
            Ulasan ({profile.totalReviews})
          </TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value='events' className='mt-6'>
          {isEventsLoading ? (
            <div className='flex justify-center py-12'>
              <LoadingSpinner />
            </div>
          ) : events.length > 0 ? (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title='Belum ada event'
              description='Penyelenggara ini belum memiliki event aktif'
            />
          )}
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value='reviews' className='mt-6'>
          {isReviewsLoading ? (
            <div className='flex justify-center py-12'>
              <LoadingSpinner />
            </div>
          ) : reviews.length > 0 ? (
            <>
              {/* Rating Summary */}
              <Card className='mb-6'>
                <CardContent className='flex items-center gap-6 p-6'>
                  <div className='text-center'>
                    <p className='text-4xl font-bold'>
                      {profile.averageRating.toFixed(1)}
                    </p>
                    <RatingStars rating={profile.averageRating} size='md' />
                    <p className='text-muted-foreground text-sm'>
                      {profile.totalReviews} ulasan
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews List */}
              <div className='space-y-4'>
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              {/* Pagination */}
              {reviewsPagination && reviewsPagination.totalPages > 1 && (
                <div className='mt-6'>
                  <Pagination
                    currentPage={reviewsPagination.currentPage}
                    totalPages={reviewsPagination.totalPages}
                    totalItems={reviewsPagination.totalItems}
                    itemsPerPage={reviewsPagination.itemsPerPage}
                    onPageChange={setReviewPage}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={Star}
              title='Belum ada ulasan'
              description='Penyelenggara ini belum memiliki ulasan'
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
