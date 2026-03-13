'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Ticket, CalendarDays, MapPin, ExternalLink } from 'lucide-react';
import api from '@/src/lib/axios';

export default function MyTicketsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchMyRegistrations();
    }
  }, [status]);

  const fetchMyRegistrations = async () => {
    try {
      const res = await api.get('/registrations/me', {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      setRegistrations(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch registrations', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className='flex justify-center py-20'>
        <div className='h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  return (
    <div className='flex-1 bg-gray-50 py-10'>
      <div className='container mx-auto max-w-4xl px-4'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>My Tickets</h1>
          <p className='mt-1 text-gray-600'>
            All events you have registered for.
          </p>
        </div>

        {registrations.length === 0 ? (
          <div className='rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-sm'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50'>
              <Ticket className='h-8 w-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-medium text-gray-900'>
              No tickets yet
            </h3>
            <p className='mt-1 mb-6 text-sm text-gray-500'>
              You haven't registered for any events. Explore events to get
              started!
            </p>
            <Link
              href='/'
              className='inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500'
            >
              Explore Events{' '}
              <span className='ml-1' aria-hidden='true'>
                &rarr;
              </span>
            </Link>
          </div>
        ) : (
          <div className='space-y-4'>
            {registrations.map((reg, idx) => {
              const dateObj = reg.event ? new Date(reg.event.dateTime) : null;
              return (
                <div
                  key={reg.id || idx}
                  className='group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md hover:ring-1 hover:ring-indigo-100'
                >
                  <div className='flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex-1 space-y-2'>
                      <div className='flex items-center gap-2'>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                            reg.status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                              : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                          }`}
                        >
                          {reg.status}
                        </span>
                        {reg.event && (
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                              reg.event.format === 'ONLINE'
                                ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20'
                                : 'bg-gray-50 text-gray-700 ring-gray-600/20'
                            }`}
                          >
                            {reg.event.format}
                          </span>
                        )}
                      </div>

                      <h3 className='text-lg font-bold text-gray-900'>
                        {reg.event?.title || 'Unknown Event'}
                      </h3>

                      {dateObj && (
                        <div className='flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500'>
                          <span className='inline-flex items-center gap-1'>
                            <CalendarDays className='h-4 w-4' />
                            {dateObj.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}{' '}
                            at{' '}
                            {dateObj.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className='inline-flex items-center gap-1'>
                            <MapPin className='h-4 w-4' />
                            {reg.event.locationOrLink}
                          </span>
                        </div>
                      )}

                      {reg.ticket && (
                        <p className='text-sm text-gray-500'>
                          <span className='font-medium text-gray-700'>
                            Ticket:
                          </span>{' '}
                          {reg.ticket.name} —{' '}
                          {reg.ticket.price === 0
                            ? 'Free'
                            : new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                maximumFractionDigits: 0,
                              }).format(reg.ticket.price)}
                        </p>
                      )}
                    </div>

                    {reg.event && (
                      <div className='shrink-0'>
                        <Link
                          href={`/events/${reg.event.id}`}
                          className='inline-flex items-center rounded-lg bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100'
                        >
                          View Event{' '}
                          <ExternalLink className='ml-1.5 h-3.5 w-3.5' />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
