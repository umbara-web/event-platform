import Link from 'next/link';
import { Ticket } from 'lucide-react';
import { APP_NAME, ROUTES } from '@/src/lib/constants';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='bg-muted/50 flex min-h-screen flex-col items-center justify-center p-4'>
      <Link href={ROUTES.HOME} className='mb-8 flex items-center space-x-2'>
        <div className='bg-primary flex h-10 w-10 items-center justify-center rounded-lg'>
          <Ticket className='text-primary-foreground h-6 w-6' />
        </div>
        <span className='text-xl font-bold'>{APP_NAME}</span>
      </Link>
      {children}
    </div>
  );
}
