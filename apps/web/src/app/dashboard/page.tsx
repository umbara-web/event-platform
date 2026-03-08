'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle, CalendarDays, ExternalLink, Activity } from 'lucide-react';
import api from '@/src/lib/axios';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role === 'ATTENDEE') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchMyEvents();
    }
  }, [status, session]);

  const fetchMyEvents = async () => {
    try {
      const res = await api.get('/events');
      // In a real app backend should filter by organizerId,
      // but for MVP we filter on client if backend returns all
      const allEvents = res.data.data;
      const myEvents = allEvents.filter(
        (e: any) => e.organizerId === (session?.user as any)?.id
      );
      setEvents(myEvents);
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className='flex justify-center p-20'>
        <div className='h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  return (
    <div className='flex-1 bg-gray-50 py-10'>
      <div className='container mx-auto max-w-7xl px-4'>
        <div className='mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Organizer Dashboard
            </h1>
            <p className='mt-1 text-gray-600'>
              Manage your events, tickets, and attendees.
            </p>
          </div>
          <Link
            href='/dashboard/events/create'
            className='inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500'
          >
            <PlusCircle className='mr-2 h-5 w-5' />
            Create New Event
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className='mb-10 grid grid-cols-1 gap-6 md:grid-cols-3'>
          <div className='flex items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
            <div className='mr-4 rounded-xl bg-indigo-50 p-4 text-indigo-600'>
              <CalendarDays className='h-8 w-8' />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>Total Events</p>
              <h3 className='text-3xl font-bold text-gray-900'>
                {events.length}
              </h3>
            </div>
          </div>
          <div className='flex items-center rounded-2xl border border-gray-100 bg-white p-6 opacity-70 shadow-sm'>
            <div className='mr-4 rounded-xl bg-emerald-50 p-4 text-emerald-600'>
              <Activity className='h-8 w-8' />
            </div>
            <div>
              <p className='text-sm font-medium text-gray-500'>
                Total Attendees
              </p>
              <h3 className='text-xl font-bold text-gray-900'>Coming Soon</h3>
            </div>
          </div>
        </div>

        <div className='overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm'>
          <div className='flex items-center justify-between border-b border-gray-100 px-6 py-5'>
            <h2 className='text-lg font-bold text-gray-900'>My Events</h2>
          </div>

          {events.length === 0 ? (
            <div className='p-12 text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50'>
                <CalendarDays className='h-8 w-8 text-gray-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-900'>
                No events found
              </h3>
              <p className='mt-1 mb-6 text-sm text-gray-500'>
                You haven't created any events yet. Get started by creating your
                first event.
              </p>
              <Link
                href='/dashboard/events/create'
                className='inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500'
              >
                Create Event{' '}
                <span aria-hidden='true' className='ml-1'>
                  &rarr;
                </span>
              </Link>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm text-gray-500'>
                <thead className='bg-gray-50 text-xs text-gray-700 uppercase'>
                  <tr>
                    <th className='px-6 py-4 font-semibold'>Event Name</th>
                    <th className='px-6 py-4 font-semibold'>Date & Time</th>
                    <th className='px-6 py-4 font-semibold'>Format</th>
                    <th className='px-6 py-4 text-right font-semibold'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {events.map((event: any) => (
                    <tr
                      key={event.id}
                      className='transition-colors hover:bg-gray-50/50'
                    >
                      <td className='max-w-xs truncate px-6 py-4 font-medium text-gray-900'>
                        {event.title}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {new Date(event.dateTime).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            event.format === 'ONLINE'
                              ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20'
                              : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          }`}
                        >
                          {event.format}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        <Link
                          href={`/dashboard/events/${event.id}`}
                          className='inline-flex items-center font-medium text-indigo-600 hover:text-indigo-900'
                        >
                          Manage <ExternalLink className='ml-1 h-3 w-3' />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
