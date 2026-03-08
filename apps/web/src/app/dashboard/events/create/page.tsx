'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import api from '@/src/lib/axios';

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    format: 'OFFLINE',
    locationOrLink: '',
    dateTime: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Convert datetime-local value (e.g. "2026-03-07T04:00") to full ISO-8601 string
      const payload = {
        ...formData,
        dateTime: new Date(formData.dateTime).toISOString(),
      };

      const res = await api.post('/events', payload, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      const newEventId = res.data.data.id;
      // Redirect to the newly created event's manage page to add tickets
      router.push(`/dashboard/events/${newEventId}?created=true`);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to create event'
      );
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className='flex justify-center p-20'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  return (
    <div className='flex-1 bg-gray-50 py-10'>
      <div className='container mx-auto max-w-3xl px-4'>
        <Link
          href='/dashboard'
          className='mb-6 inline-flex items-center text-sm font-medium text-gray-500 transition-colors hover:text-indigo-600'
        >
          <ArrowLeft className='mr-1 h-4 w-4' /> Back to Dashboard
        </Link>

        <div className='overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm'>
          <div className='border-b border-gray-100 bg-white p-8'>
            <h1 className='text-2xl font-bold text-gray-900'>
              Create New Event
            </h1>
            <p className='mt-1 text-sm text-gray-500'>
              Fill in the details below to open a new event.
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6 p-8'>
            {error && (
              <div className='rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700'>
                {error}
              </div>
            )}

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Event Title
              </label>
              <input
                type='text'
                required
                placeholder='e.g. Next.js Developer Conference 2026'
                className='w-full rounded-lg border-gray-300 px-3 py-2.5 text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600'
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                Description
              </label>
              <textarea
                required
                rows={4}
                placeholder='Tell attendees what this event is about...'
                className='w-full resize-none rounded-lg border-gray-300 px-3 py-2.5 text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              ></textarea>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Event Format
                </label>
                <select
                  className='w-full rounded-lg border-gray-300 bg-white px-3 py-2.5 text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600'
                  value={formData.format}
                  onChange={(e) =>
                    setFormData({ ...formData, format: e.target.value })
                  }
                >
                  <option value='OFFLINE'>Offline (In-Person)</option>
                  <option value='ONLINE'>Online (Virtual)</option>
                </select>
              </div>

              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Date and Time
                </label>
                <input
                  type='datetime-local'
                  required
                  className='w-full rounded-lg border-gray-300 px-3 py-2.5 text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600'
                  value={formData.dateTime}
                  onChange={(e) =>
                    setFormData({ ...formData, dateTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>
                {formData.format === 'ONLINE'
                  ? 'Meeting Link'
                  : 'Venue Location'}
              </label>
              <input
                type='text'
                required
                placeholder={
                  formData.format === 'ONLINE'
                    ? 'e.g. https://zoom.us/j/123456'
                    : 'e.g. Jakarta Convention Center'
                }
                className='w-full rounded-lg border-gray-300 px-3 py-2.5 text-gray-900 ring-1 ring-gray-300 ring-inset focus:ring-2 focus:ring-indigo-600'
                value={formData.locationOrLink}
                onChange={(e) =>
                  setFormData({ ...formData, locationOrLink: e.target.value })
                }
              />
            </div>

            <div className='flex justify-end gap-3 border-t border-gray-100 pt-4'>
              <Link
                href='/dashboard'
                className='rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100'
              >
                Cancel
              </Link>
              <button
                type='submit'
                disabled={isSubmitting}
                className='inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50'
              >
                {isSubmitting ? (
                  'Creating...'
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' /> Publish Event
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
