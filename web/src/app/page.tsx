import EventCard from '@/src/components/EventCard';
import api from '@/src/lib/axios';

// Add revalidation if we expect frequent updates, or use dynamic rendering
export const revalidate = 60; // revalidate every 60 seconds

async function getEvents() {
  try {
    const res = await api.get('/events');
    return res.data?.data || [];
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return [];
  }
}

export default async function HomePage() {
  const events = await getEvents();

  return (
    <div className='flex min-h-screen flex-col'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-white pt-16 pb-24 lg:pt-24 lg:pb-32'>
        <div className='absolute inset-0 bg-indigo-50/50 mix-blend-multiply' />
        {/* Background gradient graphics */}
        <div className='absolute top-0 right-0 -mt-20 -mr-20 h-120 w-120 rounded-full bg-linear-to-br from-indigo-100 to-rose-50 opacity-50 blur-3xl'></div>
        <div className='absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-linear-to-tr from-cyan-100 to-emerald-50 opacity-50 blur-3xl'></div>

        <div className='relative container mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8'>
          <h1 className='text-4xl font-extrabold tracking-tight text-balance text-gray-900 sm:text-5xl lg:text-6xl'>
            Discover & Book{' '}
            <span className='bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
              Amazing Events platform
            </span>
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600'>
            From tech conferences to local meetups, find the best experiences
            waiting for you. Secure your spot in seconds.
          </p>
        </div>
      </section>

      {/* Events Listing */}
      <section className='flex-1 bg-gray-50 py-16'>
        <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-8 flex items-center justify-between'>
            <h2 className='text-2xl font-bold tracking-tight text-gray-900'>
              Upcoming Events
            </h2>
          </div>

          {events.length === 0 ? (
            <div className='rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm'>
              <svg
                className='mx-auto h-12 w-12 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                />
              </svg>
              <h3 className='mt-4 text-sm font-semibold text-gray-900'>
                No events found
              </h3>
              <p className='mt-2 text-sm text-gray-500'>
                Check back later for new and exciting events.
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8'>
              {events.map((event: any) => {
                // Find the cheapest ticket to display
                const freeTicket = event.tickets?.find(
                  (t: any) => t.price === 0
                );
                const cheapestPaid = event.tickets
                  ?.filter((t: any) => t.price > 0)
                  .sort((a: any, b: any) => a.price - b.price)[0];

                let displayPriceText;
                if (freeTicket) displayPriceText = 0;
                else if (cheapestPaid) displayPriceText = cheapestPaid.price;
                else displayPriceText = undefined;

                return (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    format={event.format}
                    locationOrLink={event.locationOrLink}
                    dateTime={event.dateTime}
                    organizerName={event.organizer?.name || 'Unknown Organizer'}
                    cheapestTicketPrice={displayPriceText}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
