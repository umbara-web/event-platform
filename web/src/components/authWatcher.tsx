'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthWatcher() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Just a simple watcher, no strict redirection here since individual pages handle it.
    // However, if we're on login/register and already authenticated, redirect to home.
    if (status === 'authenticated') {
      if (pathname === '/login' || pathname === '/register') {
        router.push('/');
      }
    }
  }, [status, pathname, router]);

  return null;
}
