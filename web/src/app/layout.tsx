import clsx from 'clsx';
import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

import AuthSessionProvider from '@/src/providers/authSessionProvider';
import AuthWatcher from '@/src/components/authWatcher';
import AppLayout from '@/src/components/AppLayout';

export const metadata: Metadata = {
  title: 'TicketFest - Find & Manage Events',
  description: 'The easiest way to organize and attend events',
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={clsx(poppins.variable, 'antialiased')}>
        <AuthSessionProvider>
          <AuthWatcher />
          <AppLayout>{children}</AppLayout>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
