'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/src/stores/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show nothing while loading auth state
  // You could show a loading spinner here instead
  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthProvider;
