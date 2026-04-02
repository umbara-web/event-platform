import Link from 'next/link';
import { APP_NAME, ROUTES } from '@/src/lib/constants';
import Logo from '@/src/components/logo/Logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='bg-muted/50 flex min-h-screen flex-col items-center justify-center p-4'>
      <Link href={ROUTES.HOME} className='mb-8 flex items-center space-x-2'>
        <Logo />
      </Link>
      {children}
    </div>
  );
}
