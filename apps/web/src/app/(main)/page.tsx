'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  Star,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { EventCard } from '@/src/components/events/EventCard';
import { Skeleton } from '@/src/components/ui/skeleton';
import eventsApi from '@/src/lib/api/events';
import { ROUTES, QUERY_KEYS } from '@/src/lib/constants';
import { formatRupiah } from '@/src/lib/utils';

export default function HomePage() {
  // Fetch upcoming events
  const { data: eventsData, isLoading: isEventsLoading } = useQuery({
    queryKey: [QUERY_KEYS.UPCOMING_EVENTS],
    queryFn: () => eventsApi.getUpcomingEvents(8),
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => eventsApi.getCategories(),
  });

  const events = eventsData?.data || [];
  const categories = categoriesData?.data || [];

  return (
    <div>
      {/* Hero Section */}
      <section className='from-primary/10 via-background to-secondary/10 relative overflow-hidden bg-linear-to-br py-20 lg:py-32'>
        <div className='container mx-auto'>
          <div className='mx-auto text-center'>
            <Badge className='mb-4' variant='secondary'>
              <Sparkles className='mr-1 h-3 w-3' />
              Platform Event #1 di Indonesia
            </Badge>
            <h1 className='text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl'>
              Temukan & Ikuti{' '}
              <span className='text-primary'>Event Terbaik</span> di Sekitarmu
            </h1>
            <p className='text-muted-foreground mt-6 text-lg'>
              Jelajahi ribuan event menarik dari konser musik, workshop,
              seminar, hingga festival kuliner. Buat pengalaman tak terlupakan
              bersama kami.
            </p>
            <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <Button size='lg' asChild>
                <Link href={ROUTES.EVENTS}>
                  Jelajahi Event
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <Link href={ROUTES.REGISTER}>Buat Event</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className='bg-primary/20 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl' />
        <div className='bg-secondary/20 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl' />
      </section>

      {/* Stats Section */}
      <section className='bg-muted/50 border-y py-12'>
        <div className='container mx-auto'>
          <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
            {[
              { label: 'Event Aktif', value: '1,000+' },
              { label: 'Penyelenggara', value: '500+' },
              { label: 'Peserta', value: '100,000+' },
              { label: 'Kota', value: '50+' },
            ].map((stat) => (
              <div key={stat.label} className='text-center'>
                <p className='text-primary text-3xl font-bold'>{stat.value}</p>
                <p className='text-muted-foreground'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className='py-16'>
        <div className='container mx-auto'>
          <div className='mb-8 flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold'>Jelajahi Kategori</h2>
              <p className='text-muted-foreground'>
                Temukan event sesuai minatmu
              </p>
            </div>
          </div>
          <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`${ROUTES.EVENTS}?categoryId=${category.id}`}
              >
                <Card className='group cursor-pointer transition-all hover:shadow-md'>
                  <CardContent className='flex items-center gap-4 p-4'>
                    <div className='bg-primary/10 group-hover:bg-primary/20 rounded-full p-3 transition-colors'>
                      <Calendar className='text-primary h-6 w-6' />
                    </div>
                    <div>
                      <h3 className='group-hover:text-primary font-semibold'>
                        {category.name}
                      </h3>
                      <p className='text-muted-foreground text-sm'>
                        {category.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className='bg-muted/30 py-16'>
        <div className='container mx-auto'>
          <div className='mb-8 flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold'>Event Mendatang</h2>
              <p className='text-muted-foreground'>
                Jangan lewatkan event-event seru ini
              </p>
            </div>
            <Button variant='outline' asChild>
              <Link href={ROUTES.EVENTS}>
                Lihat Semua
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>

          {isEventsLoading ? (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='space-y-3'>
                  <Skeleton className='aspect-video w-full' />
                  <Skeleton className='h-6 w-3/4' />
                  <Skeleton className='h-4 w-1/2' />
                </div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className='py-12 text-center'>
              <p className='text-muted-foreground'>Belum ada event mendatang</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16'>
        <div className='container mx-auto'>
          <div className='from-primary to-primary/80 text-primary-foreground rounded-2xl bg-linear-to-r p-8 text-center lg:p-12'>
            <h2 className='text-2xl font-bold lg:text-3xl'>
              Punya Event yang Ingin Dipromosikan?
            </h2>
            <p className='text-primary-foreground/80 mx-auto mt-4 max-w-2xl'>
              Bergabunglah dengan ribuan penyelenggara event di platform kami.
              Kelola tiket, promosi, dan peserta dengan mudah.
            </p>
            <Button size='lg' variant='secondary' className='mt-6' asChild>
              <Link href={ROUTES.REGISTER}>
                Daftar sebagai Penyelenggara
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
