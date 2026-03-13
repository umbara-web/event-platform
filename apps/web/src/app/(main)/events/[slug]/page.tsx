'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Star,
  Share2,
  Heart,
  ArrowLeft,
  Ticket,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { Separator } from '@/src/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/components/ui/tabs';
import { TicketSelector } from '@/src/components/events/TicketSelector';
import { ReviewCard } from '@/src/components/reviews/ReviewCard';
import { RatingStars } from '@/src/components/reviews/RatingStars';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';
import { EmptyState } from '@/src/components/shared/EmptyState';
import { toast } from '@/src/components/ui/use-toast';
import { useAuth } from '@/src/hooks/useAuth';
import { useCartStore } from '@/src/stores/cartStore';
import eventsApi from '@/src/lib/api/events';
import reviewsApi from '@/src/lib/api/reviews';
import { ROUTES, QUERY_KEYS, IMAGE_PLACEHOLDER } from '@/src/lib/constants';
import {
  formatDate,
  formatTime,
  formatRupiah,
  getInitials,
  isEventPast,
  isEventUpcoming,
} from '@/src/lib/utils';

interface EventDetailPageProps {
  params: { slug: string };
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { setEvent, addItem, items, clearCart } = useCartStore();
  const [selectedTickets, setSelectedTickets] = useState<
    Record<string, number>
  >({});

  // Fetch event
  const { data: eventData, isLoading: isEventLoading } = useQuery({
    queryKey: [QUERY_KEYS.EVENT, params.slug],
    queryFn: () => eventsApi.getEvent(params.slug),
  });

  // Fetch reviews
  const { data: reviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: [QUERY_KEYS.REVIEWS, eventData?.data?.id],
    queryFn: () =>
      reviewsApi.getEventReviews(eventData!.data!.id, { limit: 5 }),
    enabled: !!eventData?.data?.id,
  });

  // Fetch review stats
  const { data: statsData } = useQuery({
    queryKey: [QUERY_KEYS.REVIEW_STATS, eventData?.data?.id],
    queryFn: () => reviewsApi.getEventReviewStats(eventData!.data!.id),
    enabled: !!eventData?.data?.id,
  });

  const event = eventData?.data;
  const reviews = reviewsData?.data || [];
  const stats = statsData?.data;

  if (isEventLoading) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center'>
        <LoadingSpinner size='lg' text='Memuat event...' />
      </div>
    );
  }

  if (!event) {
    return (
      <div className='container py-16'>
        <EmptyState
          title='Event tidak ditemukan'
          description='Event yang Anda cari tidak ada atau sudah dihapus'
          action={{
            label: 'Kembali ke Daftar Event',
            onClick: () => router.push(ROUTES.EVENTS),
          }}
        />
      </div>
    );
  }

  const isPast = isEventPast(event.endDate);
  const isUpcoming = isEventUpcoming(event.startDate);
  const totalSelectedTickets = Object.values(selectedTickets).reduce(
    (sum, qty) => sum + qty,
    0
  );

  const handleQuantityChange = (ticketTierId: string, quantity: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketTierId]: quantity,
    }));
  };

  const handleBuyTickets = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login diperlukan',
        description: 'Silakan login terlebih dahulu untuk membeli tiket',
      });
      router.push(
        `${ROUTES.LOGIN}?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    if (user?.role === 'ORGANIZER') {
      toast({
        title: 'Tidak dapat membeli tiket',
        description: 'Akun penyelenggara tidak dapat membeli tiket',
        variant: 'destructive',
      });
      return;
    }

    if (totalSelectedTickets === 0) {
      toast({
        title: 'Pilih tiket',
        description: 'Silakan pilih minimal 1 tiket untuk melanjutkan',
        variant: 'destructive',
      });
      return;
    }

    // Clear cart and add new items
    clearCart();
    setEvent(event);

    Object.entries(selectedTickets).forEach(([ticketTierId, quantity]) => {
      if (quantity > 0) {
        const tier = event.ticketTiers.find((t) => t.id === ticketTierId);
        if (tier) {
          addItem(tier, quantity);
        }
      }
    });

    router.push(ROUTES.CHECKOUT(event.id));
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event.name,
        text: event.description.slice(0, 100) + '...',
        url: window.location.href,
      });
    } catch {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link disalin',
        description: 'Link event berhasil disalin ke clipboard',
      });
    }
  };

  const lowestPrice = event.ticketTiers.reduce(
    (min, tier) => (tier.price < min ? tier.price : min),
    event.ticketTiers[0]?.price || 0
  );

  return (
    <div className='bg-muted/30 min-h-screen'>
      {/* Hero Image */}
      <div className='relative h-75 w-full lg:h-100'>
        <Image
          src={event.imageUrl || IMAGE_PLACEHOLDER}
          alt={event.name}
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent' />

        {/* Back Button */}
        <Button
          variant='ghost'
          size='icon'
          className='absolute top-4 left-4 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
          onClick={() => router.back()}
        >
          <ArrowLeft className='h-5 w-5' />
        </Button>

        {/* Share Button */}
        <Button
          variant='ghost'
          size='icon'
          className='absolute top-4 right-4 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
          onClick={handleShare}
        >
          <Share2 className='h-5 w-5' />
        </Button>

        {/* Event Status Badge */}
        {isPast && (
          <Badge
            variant='secondary'
            className='absolute bottom-4 left-4 text-lg'
          >
            Event Selesai
          </Badge>
        )}
      </div>

      <div className='container py-8'>
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-6 lg:col-span-2'>
            {/* Event Info */}
            <Card>
              <CardContent className='p-6'>
                <Badge className='mb-4'>{event.category.name}</Badge>
                <h1 className='text-2xl font-bold lg:text-3xl'>{event.name}</h1>

                <div className='text-muted-foreground mt-4 flex flex-wrap items-center gap-4'>
                  {/* Rating */}
                  {stats && stats.totalReviews > 0 && (
                    <div className='flex items-center gap-1'>
                      <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                      <span className='text-foreground font-medium'>
                        {stats.averageRating.toFixed(1)}
                      </span>
                      <span>({stats.totalReviews} ulasan)</span>
                    </div>
                  )}
                  {/* Attendees */}
                  <div className='flex items-center gap-1'>
                    <Users className='h-5 w-5' />
                    <span>{event.totalAttendees || 0} peserta</span>
                  </div>
                </div>

                <Separator className='my-6' />

                {/* Date & Time */}
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='flex items-start gap-3'>
                    <div className='bg-primary/10 rounded-lg p-2'>
                      <Calendar className='text-primary h-5 w-5' />
                    </div>
                    <div>
                      <p className='font-medium'>Tanggal</p>
                      <p className='text-muted-foreground text-sm'>
                        {formatDate(event.startDate)}
                        {event.startDate !== event.endDate &&
                          ` - ${formatDate(event.endDate)}`}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <div className='bg-primary/10 rounded-lg p-2'>
                      <Clock className='text-primary h-5 w-5' />
                    </div>
                    <div>
                      <p className='font-medium'>Waktu</p>
                      <p className='text-muted-foreground text-sm'>
                        {formatTime(event.startDate)} -{' '}
                        {formatTime(event.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3 sm:col-span-2'>
                    <div className='bg-primary/10 rounded-lg p-2'>
                      <MapPin className='text-primary h-5 w-5' />
                    </div>
                    <div>
                      <p className='font-medium'>{event.venue}</p>
                      <p className='text-muted-foreground text-sm'>
                        {event.address}
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        {event.location.name}, {event.location.province}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs: Description & Reviews */}
            <Tabs defaultValue='description'>
              <TabsList className='w-full'>
                <TabsTrigger value='description' className='flex-1'>
                  Deskripsi
                </TabsTrigger>
                <TabsTrigger value='reviews' className='flex-1'>
                  Ulasan ({stats?.totalReviews || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value='description' className='mt-4'>
                <Card>
                  <CardContent className='prose max-w-none p-6'>
                    <div className='whitespace-pre-wrap'>
                      {event.description}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='reviews' className='mt-4 space-y-4'>
                {/* Rating Summary */}
                {stats && stats.totalReviews > 0 && (
                  <Card>
                    <CardContent className='p-6'>
                      <div className='flex items-center gap-6'>
                        <div className='text-center'>
                          <p className='text-4xl font-bold'>
                            {stats.averageRating.toFixed(1)}
                          </p>
                          <RatingStars rating={stats.averageRating} size='md' />
                          <p className='text-muted-foreground text-sm'>
                            {stats.totalReviews} ulasan
                          </p>
                        </div>
                        <div className='flex-1 space-y-1'>
                          {[5, 4, 3, 2, 1].map((rating) => {
                            const count =
                              stats.ratingDistribution[
                                rating as keyof typeof stats.ratingDistribution
                              ];
                            const percentage =
                              stats.totalReviews > 0
                                ? (count / stats.totalReviews) * 100
                                : 0;
                            return (
                              <div
                                key={rating}
                                className='flex items-center gap-2'
                              >
                                <span className='w-3 text-sm'>{rating}</span>
                                <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                                <div className='bg-muted h-2 flex-1 rounded-full'>
                                  <div
                                    className='h-full rounded-full bg-yellow-400'
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className='text-muted-foreground w-8 text-right text-sm'>
                                  {count}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Reviews List */}
                {isReviewsLoading ? (
                  <LoadingSpinner />
                ) : reviews.length > 0 ? (
                  <div className='space-y-4'>
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className='text-muted-foreground p-6 text-center'>
                      Belum ada ulasan untuk event ini
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Penyelenggara</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={ROUTES.ORGANIZER(event.organizer.id)}
                  className='hover:bg-muted flex items-center gap-4 rounded-lg p-2 transition-colors'
                >
                  <Avatar className='h-12 w-12'>
                    <AvatarImage src={event.organizer.profileImage || ''} />
                    <AvatarFallback>
                      {getInitials(
                        event.organizer.firstName,
                        event.organizer.lastName
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-semibold'>
                      {event.organizer.firstName} {event.organizer.lastName}
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      Lihat profil penyelenggara
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Ticket Selection */}
          <div className='lg:col-span-1'>
            <div className='sticky top-20'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Ticket className='h-5 w-5' />
                    Pilih Tiket
                  </CardTitle>
                  {!isPast && (
                    <p className='text-muted-foreground text-sm'>
                      Mulai dari{' '}
                      <span className='text-primary font-semibold'>
                        {lowestPrice === 0
                          ? 'Gratis'
                          : formatRupiah(lowestPrice)}
                      </span>
                    </p>
                  )}
                </CardHeader>
                <CardContent className='space-y-4'>
                  {isPast ? (
                    <div className='bg-muted text-muted-foreground rounded-lg p-4 text-center'>
                      Event ini sudah berakhir
                    </div>
                  ) : (
                    <>
                      <TicketSelector
                        ticketTiers={event.ticketTiers}
                        selectedTickets={selectedTickets}
                        onQuantityChange={handleQuantityChange}
                      />

                      {totalSelectedTickets > 0 && (
                        <div className='bg-muted rounded-lg p-4'>
                          <div className='flex justify-between text-sm'>
                            <span>Total ({totalSelectedTickets} tiket)</span>
                            <span className='font-semibold'>
                              {formatRupiah(
                                Object.entries(selectedTickets).reduce(
                                  (sum, [tierId, qty]) => {
                                    const tier = event.ticketTiers.find(
                                      (t) => t.id === tierId
                                    );
                                    return sum + (tier?.price || 0) * qty;
                                  },
                                  0
                                )
                              )}
                            </span>
                          </div>
                        </div>
                      )}

                      <Button
                        className='w-full'
                        size='lg'
                        onClick={handleBuyTickets}
                        disabled={totalSelectedTickets === 0}
                      >
                        {totalSelectedTickets === 0
                          ? 'Pilih Tiket'
                          : `Beli ${totalSelectedTickets} Tiket`}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
