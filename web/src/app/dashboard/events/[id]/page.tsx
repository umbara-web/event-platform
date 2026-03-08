'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  ArrowLeft,
  Ticket,
  Plus,
  Tag,
  MapPin,
  CalendarDays,
  BarChart,
} from 'lucide-react';
import api from '@/src/lib/axios';

export default function OrganizerEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();

  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ticket Form State
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketError, setTicketError] = useState('');
  const [ticketData, setTicketData] = useState({
    name: '',
    price: '', // Use string for input, parse to number on submit
    capacity: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated' || session?.user?.role !== 'ORGANIZER') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchEventData();
    }
  }, [status, session]);

  const fetchEventData = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data.data);
    } catch (err) {
      console.error('Failed to fetch event', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTicketError('');

    try {
      await api.post(
        `/events/${id}/tickets`,
        {
          name: ticketData.name,
          price: Number(ticketData.price),
          capacity: Number(ticketData.capacity),
        },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      // Refresh event data to show new ticket
      await fetchEventData();

      // Reset form
      setShowTicketForm(false);
      setTicketData({ name: '', price: '', capacity: '' });
    } catch (err: any) {
      setTicketError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to create ticket'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className='flex justify-center p-20'>
        <div className='h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className='p-20 text-center'>
        <h2 className='text-2xl font-bold text-gray-900'>Event Not Found</h2>
        <Link
          href='/dashboard'
          className='mt-4 inline-block text-indigo-600 hover:underline'
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const dateObj = new Date(event.dateTime);

  return (
    <div className='flex-1 bg-gray-50 py-10'>
      <div className='container mx-auto max-w-5xl px-4'>
        <div className='mb-6 flex items-center justify-between'>
          <Link
            href='/dashboard'
            className='inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-indigo-600'
          >
            <ArrowLeft className='mr-1 h-4 w-4' /> Back to Events
          </Link>
          <div className='flex gap-3'>
            <Link
              href={`/events/${event.id}`}
              target='_blank'
              className='inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-300 transition-all ring-inset hover:bg-gray-50'
            >
              View Public Page
            </Link>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main Details */}
          <div className='space-y-6 lg:col-span-2'>
            <div className='rounded-3xl border border-gray-100 bg-white p-8 shadow-sm'>
              <div className='mb-4 flex items-center gap-2'>
                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                    event.format === 'ONLINE'
                      ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20'
                      : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                  }`}
                >
                  {event.format}
                </span>
                <span className='text-sm text-gray-500'>
                  Created {new Date(event.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className='mb-6 text-3xl font-bold text-gray-900'>
                {event.title}
              </h1>

              <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='flex items-start gap-3'>
                  <div className='rounded-lg bg-indigo-50 p-2 text-indigo-600'>
                    <CalendarDays className='h-5 w-5' />
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-gray-900'>
                      Date & Time
                    </p>
                    <p className='text-sm text-gray-600'>
                      {dateObj.toLocaleDateString()} at{' '}
                      {dateObj.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <div className='rounded-lg bg-indigo-50 p-2 text-indigo-600'>
                    <MapPin className='h-5 w-5' />
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-gray-900'>
                      Location
                    </p>
                    <p className='line-clamp-2 text-sm break-all text-gray-600'>
                      {event.locationOrLink}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='mb-3 border-b border-gray-100 pb-2 text-lg font-bold text-gray-900'>
                  Description
                </h3>
                <p className='text-sm leading-relaxed whitespace-pre-line text-gray-600'>
                  {event.description}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className='grid grid-cols-2 gap-6'>
              <div className='flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-6 text-center shadow-sm'>
                <div className='mb-3 rounded-full bg-amber-50 p-3 text-amber-600'>
                  <Ticket className='h-6 w-6' />
                </div>
                <p className='text-2xl font-bold text-gray-900'>
                  {event.tickets?.length || 0}
                </p>
                <p className='text-sm font-medium tracking-wide text-gray-500 uppercase'>
                  Ticket Tiers
                </p>
              </div>
              <div className='flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-6 text-center opacity-70 shadow-sm'>
                <div className='mb-3 rounded-full bg-emerald-50 p-3 text-emerald-600'>
                  <BarChart className='h-6 w-6' />
                </div>
                <p className='text-2xl font-bold text-gray-900'>0</p>
                <p className='text-sm font-medium tracking-wide text-gray-500 uppercase'>
                  Total Sales
                </p>
                <p className='mt-1 text-xs text-gray-400'>
                  (Under Construction)
                </p>
              </div>
            </div>
          </div>

          {/* Tickets Management Sidebar */}
          <div className='lg:col-span-1'>
            <div className='sticky top-24 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm'>
              <div className='flex items-center justify-between border-b border-gray-100 bg-gray-50/50 p-6'>
                <h2 className='flex items-center gap-2 text-lg font-bold text-gray-900'>
                  <Tag className='h-5 w-5 text-indigo-600' /> Tickets
                </h2>
                {!showTicketForm && (
                  <button
                    onClick={() => setShowTicketForm(true)}
                    className='rounded-lg bg-indigo-100 p-1.5 text-indigo-700 transition-colors hover:bg-indigo-200'
                    title='Add Ticket'
                  >
                    <Plus className='h-4 w-4' />
                  </button>
                )}
              </div>

              {showTicketForm ? (
                <div className='border-b border-indigo-100 bg-indigo-50/30 p-6'>
                  <h3 className='mb-4 text-sm font-semibold text-indigo-900'>
                    Create New Ticket
                  </h3>

                  {ticketError && (
                    <div className='mb-4 rounded border border-red-100 bg-red-50 p-2 text-xs text-red-600'>
                      {ticketError}
                    </div>
                  )}

                  <form onSubmit={handleCreateTicket} className='space-y-4'>
                    <div>
                      <label className='mb-1 block text-xs font-medium text-gray-700'>
                        Ticket Name
                      </label>
                      <input
                        type='text'
                        required
                        placeholder='e.g. Early Bird'
                        className='w-full rounded-md border-0 px-3 py-1.5 text-sm text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600'
                        value={ticketData.name}
                        onChange={(e) =>
                          setTicketData({ ...ticketData, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className='mb-1 block text-xs font-medium text-gray-700'>
                        Price (IDR) - 0 for Free
                      </label>
                      <input
                        type='number'
                        min='0'
                        required
                        className='w-full rounded-md border-0 px-3 py-1.5 text-sm text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600'
                        value={ticketData.price}
                        onChange={(e) =>
                          setTicketData({
                            ...ticketData,
                            price: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className='mb-1 block text-xs font-medium text-gray-700'>
                        Capacity (Spots)
                      </label>
                      <input
                        type='number'
                        min='1'
                        required
                        className='w-full rounded-md border-0 px-3 py-1.5 text-sm text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600'
                        value={ticketData.capacity}
                        onChange={(e) =>
                          setTicketData({
                            ...ticketData,
                            capacity: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className='flex gap-2 pt-2'>
                      <button
                        type='button'
                        onClick={() => setShowTicketForm(false)}
                        className='flex-1 rounded-md bg-white px-2 py-1.5 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50'
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        disabled={isSubmitting}
                        className='flex-1 rounded-md bg-indigo-600 px-2 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50'
                      >
                        {isSubmitting ? 'Saving...' : 'Save Ticket'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              <div className='p-6'>
                {!event.tickets || event.tickets.length === 0 ? (
                  <div className='py-8 text-center'>
                    <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100'>
                      <Ticket className='h-6 w-6 text-gray-400' />
                    </div>
                    <p className='text-sm font-medium text-gray-900'>
                      No tickets yet
                    </p>
                    <p className='mt-1 text-xs text-gray-500'>
                      Create a ticket tier to allow attendees to register.
                    </p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {event.tickets.map((ticket: any) => (
                      <div
                        key={ticket.id}
                        className='relative rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-indigo-300'
                      >
                        <div className='mb-1 flex items-start justify-between'>
                          <h4 className='text-sm font-bold text-gray-900'>
                            {ticket.name}
                          </h4>
                          <span className='text-sm font-bold text-indigo-600'>
                            {ticket.price === 0
                              ? 'Free'
                              : new Intl.NumberFormat('id-ID', {
                                  style: 'currency',
                                  currency: 'IDR',
                                  maximumFractionDigits: 0,
                                }).format(ticket.price)}
                          </span>
                        </div>
                        <div className='mt-3 flex items-center justify-between text-xs text-gray-500'>
                          <span className='rounded-md bg-gray-100 px-2 py-1'>
                            Cap: {ticket.capacity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
