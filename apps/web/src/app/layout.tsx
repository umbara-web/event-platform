import clsx from 'clsx';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

import { QueryProvider } from '@/src/components/providers/QueryProvider';
import { AuthProvider } from '@/src/components/providers/AuthProvider';
import { Toaster } from '@/src/components/ui/toaster';
import { APP_NAME } from '@/src/lib/constants';

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: 'Platform manajemen acara terdepan di Indonesia',
};

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={clsx(inter.variable, 'antialiased')}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
