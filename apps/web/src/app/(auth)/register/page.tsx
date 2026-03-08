'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  User,
  Phone,
  Briefcase,
  UserCircle,
  AlertCircle,
} from 'lucide-react';
import api from '@/src/lib/axios';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'ATTENDEE',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/register', formData);
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Registrasi gagal'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-[calc(100vh-(--spacing(16))-(--spacing(32)))] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100'>
        <div>
          <h2 className='mt-2 text-center text-3xl font-bold tracking-tight text-gray-900'>
            Join TicketFest
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='font-medium text-indigo-600 transition-colors hover:text-indigo-500'
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {error && (
            <div className='rounded-md border border-red-200 bg-red-50 p-4'>
              <div className='flex'>
                <div className='shrink-0'>
                  <AlertCircle
                    className='h-5 w-5 text-red-500'
                    aria-hidden='true'
                  />
                </div>
                <div className='ml-3'>
                  <h3 className='text-sm font-medium text-red-800'>{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className='space-y-4'>
            <div>
              <label
                htmlFor='name'
                className='mb-1 block text-sm leading-6 font-medium text-gray-900'
              >
                Full Name
              </label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <User className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='name'
                  name='name'
                  type='text'
                  required
                  className='relative block w-full rounded-lg border-0 bg-white py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-gray-300 transition-all ring-inset placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6'
                  placeholder='John Doe'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-2 sm:col-span-1'>
                <label
                  htmlFor='email'
                  className='mb-1 block text-sm leading-6 font-medium text-gray-900'
                >
                  Email
                </label>
                <div className='relative'>
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                    <Mail className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    className='relative block w-full rounded-lg border-0 bg-white py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-gray-300 transition-all ring-inset placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6'
                    placeholder='user@ex.com'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className='col-span-2 sm:col-span-1'>
                <label
                  htmlFor='phone'
                  className='mb-1 block text-sm leading-6 font-medium text-gray-900'
                >
                  Phone Number
                </label>
                <div className='relative'>
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                    <Phone className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    id='phone'
                    name='phone'
                    type='tel'
                    required
                    className='relative block w-full rounded-lg border-0 bg-white py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-gray-300 transition-all ring-inset placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6'
                    placeholder='08123456789'
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor='password'
                className='mb-1 block text-sm leading-6 font-medium text-gray-900'
              >
                Password
              </label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <Lock className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='new-password'
                  required
                  className='relative block w-full rounded-lg border-0 bg-white py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-gray-300 transition-all ring-inset placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6'
                  placeholder='••••••••'
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <label className='mb-3 block text-sm leading-6 font-medium text-gray-900'>
              I want to use TicketFest as:
            </label>
            <div className='grid grid-cols-2 gap-4'>
              <button
                type='button'
                onClick={() => setFormData({ ...formData, role: 'ATTENDEE' })}
                className={`relative flex cursor-pointer rounded-xl border p-4 transition-all focus:outline-none ${
                  formData.role === 'ATTENDEE'
                    ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                    : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50'
                }`}
              >
                <div className='flex w-full flex-col items-center gap-2 text-center'>
                  <div
                    className={`rounded-full p-2 ${formData.role === 'ATTENDEE' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}
                  >
                    <UserCircle className='h-6 w-6' />
                  </div>
                  <div>
                    <span
                      className={`block text-sm font-bold ${formData.role === 'ATTENDEE' ? 'text-indigo-900' : 'text-gray-900'}`}
                    >
                      Attendee
                    </span>
                    <span
                      className={`mt-1 block text-xs ${formData.role === 'ATTENDEE' ? 'text-indigo-700' : 'text-gray-500'}`}
                    >
                      Buy tickets & attend events
                    </span>
                  </div>
                </div>
              </button>

              <button
                type='button'
                onClick={() => setFormData({ ...formData, role: 'ORGANIZER' })}
                className={`relative flex cursor-pointer rounded-xl border p-4 transition-all focus:outline-none ${
                  formData.role === 'ORGANIZER'
                    ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                    : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50'
                }`}
              >
                <div className='flex w-full flex-col items-center gap-2 text-center'>
                  <div
                    className={`rounded-full p-2 ${formData.role === 'ORGANIZER' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}
                  >
                    <Briefcase className='h-6 w-6' />
                  </div>
                  <div>
                    <span
                      className={`block text-sm font-bold ${formData.role === 'ORGANIZER' ? 'text-indigo-900' : 'text-gray-900'}`}
                    >
                      Organizer
                    </span>
                    <span
                      className={`mt-1 block text-xs ${formData.role === 'ORGANIZER' ? 'text-indigo-700' : 'text-gray-500'}`}
                    >
                      Create & manage events
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className='pt-2'>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-500 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-70'
            >
              {isLoading ? (
                <>
                  <svg
                    className='mr-3 -ml-1 h-5 w-5 animate-spin text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
