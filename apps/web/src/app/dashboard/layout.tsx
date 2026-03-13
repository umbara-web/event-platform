'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/src/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';
import { useAuthStore } from '@/src/stores/authStore';
import { ROUTES } from '@/src/lib/constants';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
      } else if (user?.role !== 'ORGANIZER') {
        router.push(ROUTES.HOME);
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ORGANIZER') {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
