'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Ticket,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';
import { useAuth } from '@/src/hooks/useAuth';
import { ROUTES, APP_NAME } from '@/src/lib/constants';

const sidebarLinks = [
  {
    title: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: 'Event Saya',
    href: ROUTES.DASHBOARD_EVENTS,
    icon: Calendar,
  },
  {
    title: 'Transaksi',
    href: ROUTES.DASHBOARD_TRANSACTIONS,
    icon: CreditCard,
  },
  {
    title: 'Statistik',
    href: ROUTES.DASHBOARD_STATISTICS,
    icon: BarChart3,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, isLogoutLoading } = useAuth();

  return (
    <aside className='bg-background fixed top-0 left-0 z-40 h-screen w-64 border-r'>
      <div className='flex h-full flex-col'>
        {/* Logo */}
        <div className='flex h-16 items-center border-b px-6'>
          <Link href={ROUTES.HOME} className='flex items-center space-x-2'>
            <div className='bg-primary flex h-8 w-8 items-center justify-center rounded-lg'>
              <Ticket className='text-primary-foreground h-5 w-5' />
            </div>
            <span className='font-bold'>{APP_NAME}</span>
          </Link>
        </div>

        {/* Create Event Button */}
        <div className='p-4'>
          <Button asChild className='w-full'>
            <Link href={ROUTES.DASHBOARD_EVENT_CREATE}>
              <Plus className='mr-2 h-4 w-4' />
              Buat Event
            </Link>
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className='flex-1 space-y-1 px-3'>
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== ROUTES.DASHBOARD &&
                pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <link.icon className='h-5 w-5' />
                {link.title}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className='border-t p-4'>
          <Button
            variant='ghost'
            className='text-muted-foreground hover:text-destructive w-full justify-start'
            onClick={logout}
            disabled={isLogoutLoading}
          >
            <LogOut className='mr-2 h-4 w-4' />
            Keluar
          </Button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
