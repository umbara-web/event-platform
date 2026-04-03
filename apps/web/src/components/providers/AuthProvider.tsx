'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/src/stores/authStore';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, isLoading: storeLoading } = useAuthStore();
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // If user logged in through social login but hasn't completed their profile
    const isNewUser = (session as any)?.isNewUser;
    if (status === 'authenticated' && isNewUser && pathname !== '/complete-profile') {
      router.push('/complete-profile');
    }
  }, [session, status, pathname, router]);

  // Show nothing while loading auth state
  // You could show a loading spinner here instead
  if (storeLoading || status === 'loading') {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthProvider;
