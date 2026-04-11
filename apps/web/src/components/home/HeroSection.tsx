import React from 'react';
import { ImageSlider } from '../ui/image-slider';
import { HERO_IMAGES } from '@/src/constants/images';
// import { EventSearch } from '@/src/components/events/EventSearch';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { ArrowRight, Sparkles, Search, MapPin } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/src/lib/constants';

// Hero section component with image slider background
export const HeroSection: React.FC = () => {
  return (
    <section className='relative mt-16 flex min-h-[700px] items-center justify-center overflow-hidden px-4 text-center'>
      <div className='absolute inset-0 z-10 bg-black/40 bg-linear-to-t from-black/80 via-black/20 to-black/40' />
      <ImageSlider images={HERO_IMAGES} interval={5000} showIndicators />

      {/* <HeroOverlay /> */}
      <div className='z-20 container mx-auto'>
        <div className='mx-auto text-center'>
          <Badge className='mb-4' variant='info'>
            <Sparkles className='mr-1 h-3 w-3' />
            Platform Event #1 di Indonesia
          </Badge>
          <h1 className='text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl'>
            Temukan & Ikuti{' '}
            <span className='from-accent to-primary-light bg-linear-to-r bg-clip-text text-transparent'>
              Event Terbaik
            </span>{' '}
            di Sekitarmu
          </h1>
          <p className='text-muted-foreground mt-6 text-lg'>
            Jelajahi ribuan event menarik dari konser musik, workshop, seminar,
            hingga festival kuliner. Buat pengalaman tak terlupakan bersama
            kami.
          </p>
          <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button size='lg' variant='default' asChild>
              <Link href={ROUTES.EVENTS}>
                Jelajahi Event
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button size='lg' variant='outline' asChild>
              <Link href={ROUTES.LOGIN}>Pemesanan Tiket</Link>
            </Button>
          </div>

          {/* Integrated Search Bar */}
          <form
            action={ROUTES.EVENTS}
            method='GET'
            className='mx-auto mt-8 w-full max-w-4xl'
          >
            <div className='glass-effect flex flex-col gap-2 rounded-full border border-white/10 p-2 shadow-2xl md:flex-row'>
              <div className='flex flex-1 items-center gap-3 rounded-full bg-white/10 px-4 py-3 dark:bg-[#2f2249]/50'>
                <Search className='h-6 w-6 text-slate-400' />
                <input
                  name='search'
                  className='w-full border-none bg-transparent p-0 text-white outline-none placeholder:text-slate-400 focus:ring-0'
                  placeholder='Search events...'
                  type='text'
                />
              </div>
              <div className='flex flex-1 items-center gap-3 rounded-full bg-white/10 px-4 py-3 dark:bg-[#2f2249]/50'>
                <MapPin className='h-6 w-6 text-slate-400' />
                <input
                  name='locationText'
                  className='w-full border-none bg-transparent p-0 text-white outline-none placeholder:text-slate-400 focus:ring-0'
                  placeholder='Location...'
                  type='text'
                />
              </div>
              <Button
                size='lg'
                variant='default'
                asChild
                className='bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 rounded-full px-8 py-3 font-bold text-white transition-all'
              >
                <Search className='h-5 w-5' />
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>
      {/* <HeroContent /> */}
    </section>
  );
};

// Hero gradient overlay
// const HeroOverlay: React.FC = () => (
//   <div className='from-background-dark via-background-dark/70 to-background-dark/30 absolute inset-0 z-10 bg-linear-to-t' />
// );

// Hero content (title, description, search)
const HeroContent: React.FC = () => (
  <div className='relative z-20 flex max-w-3xl flex-col items-center gap-6'>
    <HeroTitle />
    <HeroDescription />
    {/* <SearchBar /> */}
  </div>
);

// Hero title
const HeroTitle: React.FC = () => (
  <h1 className='font-display text-4xl leading-[1.1] font-black tracking-tight text-white md:text-5xl lg:text-6xl'>
    Discover the Best Events <br className='hidden md:block' /> in{' '}
    <span className='from-accent to-primary-light bg-linear-to-r bg-clip-text text-transparent'>
      San Francisco
    </span>
  </h1>
);

// Hero description
const HeroDescription: React.FC = () => (
  <p className='max-w-xl text-lg font-light text-gray-200 md:text-xl'>
    Find concerts, workshops, sports, and more happening near you.
  </p>
);
