'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/src/components/layout/Navbar';
import { Footer } from '@/src/components/layout/Footer';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';
import { useAuthStore } from '@/src/stores/authStore';
import { ROUTES } from '@/src/lib/constants';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
