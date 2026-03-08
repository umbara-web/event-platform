'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ChevronLeft, Ticket, CheckCircle2 } from 'lucide-react';
import api from '@/src/lib/axios';

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('ticketId');
  const { data: session, status } = useSession();

  const [event, setEvent] = useState<any>(null);
  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    attendeeName: '',
    attendeeEmail: '',
    attendeePhone: '',
  });

  useEffect(() => {
    // Pre-fill form if user is logged in
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        attendeeName: session.user.name || '',
        attendeeEmail: session.user.email || '',
      }));
    }
  }, [session]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!ticketId) {
        setError('No ticket selected.');
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get(`/events/${id}`);
        const eventData = res.data.data;
        setEvent(eventData);

        const selectedTicket = eventData.tickets?.find(
          (t: any) => t.id === ticketId
        );
        if (selectedTicket) {
          setTicket(selectedTicket);
        } else {
          setError('Ticket type not found.');
        }
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, ticketId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'authenticated') {
      router.push(
        `/login?callbackUrl=/events/${id}/checkout?ticketId=${ticketId}`
      );
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await api.post(
        `/events/${id}/register`,
        {
          ticketId,
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      setIsSuccess(true);
      // Wait a bit before redirecting
      setTimeout(() => {
        router.push('/my-tickets');
      }, 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Registration failed'
      );
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center py-20'>
        <div className='h-10 w-10 animate-spin rounded-full border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className='mx-auto max-w-xl px-4 py-20 text-center'>
        <div className='flex flex-col items-center rounded-3xl border border-gray-100 bg-white p-10 shadow-xl'>
          <div className='mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-500'>
            <CheckCircle2 className='h-10 w-10' />
          </div>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>
            Registration Complete!
          </h1>
          <p className='mb-8 max-w-sm text-gray-600'>
            You successfully registered for{' '}
            <span className='font-semibold text-gray-900'>{event?.title}</span>.
            Your ticket detail has been saved.
          </p>
          <div className='flex gap-4'>
            <Link
              href='/my-tickets'
              className='rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500'
            >
              View My Tickets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-[calc(100vh-140px)] bg-gray-50 py-12'>
      <div className='container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        <Link
          href={`/events/${id}`}
          className='mb-8 inline-flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600'
        >
          <ChevronLeft className='mr-1 h-4 w-4' /> Back to Event
        </Link>

        {error ? (
          <div className='rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm'>
            <p className='mb-4 font-medium text-red-600'>{error}</p>
            <Link href='/' className='text-indigo-600 hover:underline'>
              Return Home
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <div className='space-y-6 md:col-span-2'>
              <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8'>
                <h1 className='mb-6 border-b border-gray-100 pb-4 text-2xl font-bold text-gray-900'>
                  Checkout
                </h1>

                {status !== 'authenticated' && (
                  <div className='mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800'>
                    You must be logged in to buy a ticket.
                    <Link
                      href={`/login?callbackUrl=/events/${id}/checkout?ticketId=${ticketId}`}
                      className='ml-1 font-bold underline'
                    >
                      Log in now
                    </Link>
                  </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div>
                    <h3 className='mb-4 text-lg font-medium text-gray-900'>
                      Attendee Information
                    </h3>
                    <div className='grid grid-cols-1 gap-4'>
                      <div>
                        <label className='mb-1 block text-sm font-medium text-gray-700'>
                          Full Name
                        </label>
                        <input
                          type='text'
                          required
                          className='w-full rounded-lg border-gray-300 px-3 py-2.5 text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600'
                          value={formData.attendeeName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              attendeeName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        <div>
                          <label className='mb-1 block text-sm font-medium text-gray-700'>
                            Email
                          </label>
                          <input
                            type='email'
                            required
                            className='w-full rounded-lg border-gray-300 px-3 py-2.5 text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600'
                            value={formData.attendeeEmail}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                attendeeEmail: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className='mb-1 block text-sm font-medium text-gray-700'>
                            Phone Number
                          </label>
                          <input
                            type='tel'
                            required
                            className='w-full rounded-lg border-gray-300 px-3 py-2.5 text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600'
                            value={formData.attendeePhone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                attendeePhone: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-end border-t border-gray-100 pt-4'>
                    <button
                      type='submit'
                      disabled={isSubmitting || status !== 'authenticated'}
                      className='rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      {isSubmitting ? 'Processing...' : 'Complete Registration'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className='md:col-span-1'>
              <div className='sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
                <h3 className='mb-4 text-lg font-bold text-gray-900'>
                  Order Summary
                </h3>

                <div className='space-y-4'>
                  <div>
                    <p className='text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      Event
                    </p>
                    <p className='mt-1 text-sm font-bold text-gray-900'>
                      {event?.title}
                    </p>
                  </div>

                  <div className='border-b border-gray-100 pb-4'>
                    <p className='flex items-center gap-1 text-xs font-medium tracking-wider text-gray-500 uppercase'>
                      <Ticket className='h-3 w-3' /> Ticket Type
                    </p>
                    <div className='mt-1 flex items-center justify-between'>
                      <p className='text-sm font-bold text-gray-900'>
                        {ticket?.name}
                      </p>
                      <p className='text-sm text-gray-600'>x1</p>
                    </div>
                  </div>

                  <div className='flex items-center justify-between pt-2'>
                    <p className='font-bold text-gray-900'>Total</p>
                    <p className='text-xl font-bold text-indigo-600'>
                      {ticket?.price === 0
                        ? 'Free'
                        : new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            maximumFractionDigits: 0,
                          }).format(ticket?.price || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
