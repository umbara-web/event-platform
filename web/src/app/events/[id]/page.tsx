import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, MapPin, User, Tag, ShieldCheck } from 'lucide-react';
import api from '@/src/lib/axios';

async function getEventDetails(id: string) {
  try {
    const res = await api.get(`/events/${id}`);
    return res.data?.data;
  } catch (error) {
    return null;
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventDetails(id);

  if (!event) {
    notFound();
  }

  const dateObj = new Date(event.dateTime);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className='bg-gray-50 pb-20'>
      {/* Event Header Banner */}
      <div className='relative h-64 w-full overflow-hidden bg-linear-to-r from-indigo-900 to-purple-900 md:h-80'>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className='absolute inset-0 bg-linear-to-t from-gray-900/80 to-transparent'></div>
        <div className='absolute bottom-0 left-0 container mx-auto w-full p-6 md:p-10'>
          <div className='mb-3 flex items-center gap-3'>
            <span className='inline-flex items-center rounded-md bg-indigo-400/20 px-2 py-1 text-xs font-medium text-indigo-200 ring-1 ring-indigo-400/30 ring-inset'>
              {event.format === 'ONLINE' ? 'Virtual Event' : 'In-Person Event'}
            </span>
          </div>
          <h1 className='mb-2 text-3xl font-bold text-white md:text-5xl'>
            {event.title}
          </h1>
          <p className='flex items-center gap-2 text-indigo-200'>
            <User className='h-4 w-4' /> Organized by {event.organizer?.name}
          </p>
        </div>
      </div>

      <div className='container mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='space-y-8 lg:col-span-2'>
            <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8'>
              <h2 className='mb-4 text-xl font-bold text-gray-900'>
                About This Event
              </h2>
              <div className='prose max-w-none whitespace-pre-line text-gray-600'>
                {event.description}
              </div>
            </div>

            <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8'>
              <h2 className='mb-6 text-xl font-bold text-gray-900'>
                Location & Time
              </h2>

              <div className='flex flex-col gap-6 md:flex-row'>
                <div className='flex items-start gap-4'>
                  <div className='rounded-xl bg-indigo-50 p-3 text-indigo-600'>
                    <CalendarDays className='h-6 w-6' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      Date and Time
                    </h3>
                    <p className='mt-1 text-sm text-gray-600'>
                      {formattedDate}
                    </p>
                    <p className='text-sm text-gray-600'>{formattedTime}</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='rounded-xl bg-indigo-50 p-3 text-indigo-600'>
                    <MapPin className='h-6 w-6' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>Location</h3>
                    <p className='mt-1 text-sm text-gray-600'>
                      {event.format === 'ONLINE'
                        ? 'Online Link Provided Upon Registration'
                        : event.locationOrLink}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Tickets */}
          <div className='lg:col-span-1'>
            <div className='sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
              <h2 className='mb-6 flex items-center gap-2 text-xl font-bold text-gray-900'>
                <Tag className='h-5 w-5 text-indigo-500' />
                Available Tickets
              </h2>

              {!event.tickets || event.tickets.length === 0 ? (
                <div className='rounded-xl bg-gray-50 py-6 text-center'>
                  <p className='text-sm text-gray-500'>
                    Tickets are not available yet.
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {event.tickets.map((ticket: any) => (
                    <div
                      key={ticket.id}
                      className='rounded-xl border border-gray-200 p-4 transition-colors hover:border-indigo-300'
                    >
                      <div className='mb-2 flex items-start justify-between'>
                        <h3 className='font-semibold text-gray-900'>
                          {ticket.name}
                        </h3>
                        <span className='font-bold text-indigo-600'>
                          {ticket.price === 0
                            ? 'Free'
                            : new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                maximumFractionDigits: 0,
                              }).format(ticket.price)}
                        </span>
                      </div>
                      <p className='mb-4 inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-500'>
                        Capacity: {ticket.capacity} spots
                      </p>

                      <Link
                        href={`/events/${event.id}/checkout?ticketId=${ticket.id}`}
                        className='block w-full rounded-lg bg-indigo-600 px-3 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500'
                      >
                        Get Ticket
                      </Link>
                    </div>
                  ))}

                  <div className='mt-2 flex items-start gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500'>
                    <ShieldCheck className='h-4 w-4 shrink-0 text-emerald-500' />
                    <span>
                      Secure checkout powered by TicketFest guarantee. Your
                      informations are protected.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
