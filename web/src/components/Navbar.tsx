'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  CalendarDays,
  LogOut,
  Ticket,
  PlusCircle,
  LayoutDashboard,
} from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  return (
    <nav className='sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center'>
            <Link href='/' className='flex items-center gap-2'>
              <div className='rounded-lg bg-indigo-600 p-2'>
                <CalendarDays className='h-6 w-6 text-white' />
              </div>
              <span className='text-xl font-bold tracking-tight text-gray-900'>
                TicketFest
              </span>
            </Link>
          </div>

          <div className='flex items-center gap-4'>
            {!session ? (
              <>
                <Link
                  href='/login'
                  className='text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600'
                >
                  Log In
                </Link>
                <Link
                  href='/register'
                  className='rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className='flex items-center gap-6'>
                {userRole === 'ORGANIZER' && (
                  <>
                    <Link
                      href='/dashboard'
                      className='flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600'
                    >
                      <LayoutDashboard className='h-4 w-4' />
                      Dashboard
                    </Link>
                    <Link
                      href='/dashboard/events/create'
                      className='flex items-center gap-1.5 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100'
                    >
                      <PlusCircle className='h-4 w-4' />
                      Create Event
                    </Link>
                  </>
                )}

                {userRole === 'ATTENDEE' && (
                  <Link
                    href='/my-tickets'
                    className='flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600'
                  >
                    <Ticket className='h-4 w-4' />
                    My Tickets
                  </Link>
                )}

                <div className='h-6 w-px bg-gray-300'></div>

                <div className='flex items-center gap-3'>
                  <div className='flex flex-col items-end'>
                    <span className='text-sm leading-tight font-medium text-gray-900'>
                      {session.user?.name}
                    </span>
                    <span className='text-xs font-medium text-gray-500 capitalize'>
                      {userRole?.toLowerCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className='rounded-full p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600'
                    title='Log out'
                  >
                    <LogOut className='h-5 w-5' />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
