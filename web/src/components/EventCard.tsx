import Link from 'next/link';
import { CalendarDays, MapPin } from 'lucide-react';

interface EventProps {
  id: string;
  title: string;
  format: string;
  locationOrLink: string;
  dateTime: string;
  organizerName: string;
  cheapestTicketPrice?: number;
}

export default function EventCard({
  id,
  title,
  format,
  locationOrLink,
  dateTime,
  organizerName,
  cheapestTicketPrice,
}: EventProps) {
  const dateObj = new Date(dateTime);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate random gradient based on id length to make it look dynamic
  const gradients = [
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-purple-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-orange-400 to-pink-500',
  ];
  const bgGradient = gradients[id.charCodeAt(0) % gradients.length];

  return (
    <div className='group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:shadow-xl hover:ring-indigo-600/20'>
      {/* Thumbnail */}
      <div
        className={`h-48 w-full bg-linear-to-br ${bgGradient} relative overflow-hidden`}
      >
        <div className='absolute inset-0 bg-black/10 mix-blend-overlay'></div>
        {/* Placeholder Pattern to make it look less empty */}
        <div
          className='absolute inset-0 opacity-20'
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        ></div>

        <div className='absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm backdrop-blur-sm'>
          {format === 'ONLINE' ? '🎥 Online Event' : '🏢 Offline Event'}
        </div>
      </div>

      <div className='flex flex-1 flex-col justify-between p-5'>
        <div>
          <h3 className='line-clamp-2 text-lg font-bold text-gray-900 uppercase'>
            <Link href={`/events/${id}`}>
              <span className='absolute inset-0' />
              {title}
            </Link>
          </h3>
          <p className='mt-1 text-sm font-medium text-gray-500'>
            by <span className='text-gray-900'>{organizerName}</span>
          </p>

          <div className='mt-4 space-y-2'>
            <div className='flex items-center text-sm text-gray-600'>
              <CalendarDays className='mr-2 h-4 w-4 shrink-0 text-indigo-500' />
              <time dateTime={dateTime}>
                {formattedDate} • {formattedTime}
              </time>
            </div>
            <div className='flex items-start text-sm text-gray-600'>
              <MapPin className='mt-0.5 mr-2 h-4 w-4 shrink-0 text-indigo-500' />
              <span className='line-clamp-1'>{locationOrLink}</span>
            </div>
          </div>
        </div>

        <div className='mt-6 flex items-center justify-between border-t border-gray-100 pt-4'>
          <div className='flex flex-col'>
            <span className='text-xs font-medium text-gray-500'>
              Tickets from
            </span>
            <span className='text-lg font-bold text-gray-900'>
              {cheapestTicketPrice === 0
                ? 'Free'
                : cheapestTicketPrice !== undefined
                  ? new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      maximumFractionDigits: 0,
                    }).format(cheapestTicketPrice)
                  : 'TBA'}
            </span>
          </div>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
              className='h-5 w-5'
            >
              <path
                fillRule='evenodd'
                d='M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
