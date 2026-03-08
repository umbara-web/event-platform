'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError('Telah terjadi kesalahan sistem');
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-[calc(100vh-(--spacing(16))-(--spacing(32)))] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100'>
        <div>
          <h2 className='mt-2 text-center text-3xl font-bold tracking-tight text-gray-900'>
            Welcome back
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Don't have an account?{' '}
            <Link
              href='/register'
              className='font-medium text-indigo-600 transition-colors hover:text-indigo-500'
            >
              Sign up today
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

          <div className='space-y-4 rounded-md shadow-sm'>
            <div>
              <label htmlFor='email-address' className='sr-only'>
                Email address
              </label>
              <div className='relative'>
                <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                  <Mail className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='email-address'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  className='relative block w-full rounded-lg border-0 bg-white py-2.5 pl-10 text-gray-900 ring-1 ring-gray-300 transition-all ring-inset placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6'
                  placeholder='Email address'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
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
                  autoComplete='current-password'
                  required
                  className='relative block w-full rounded-lg border-0 bg-white py-2.5 pl-10 text-gray-900 ring-1 ring-gray-300 transition-all ring-inset placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6'
                  placeholder='Password'
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember-me'
                name='remember-me'
                type='checkbox'
                className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
              />
              <label
                htmlFor='remember-me'
                className='ml-2 block text-sm text-gray-900'
              >
                Remember me
              </label>
            </div>

            <div className='text-sm'>
              <a
                href='#'
                className='font-medium text-indigo-600 hover:text-indigo-500'
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-70'
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
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
