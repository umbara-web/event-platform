'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  Calendar,
  CreditCard,
  BarChart3,
  Plus,
  LogOut,
  Ticket,
  Bell,
  Search,
} from 'lucide-react';
import { cn, getInitials } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { Input } from '@/src/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/src/components/ui/sheet';
import { useAuth } from '@/src/hooks/useAuth';
import { ROUTES, APP_NAME } from '@/src/lib/constants';

const sidebarLinks = [
  { title: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { title: 'Event Saya', href: ROUTES.DASHBOARD_EVENTS, icon: Calendar },
  { title: 'Transaksi', href: ROUTES.DASHBOARD_TRANSACTIONS, icon: CreditCard },
  { title: 'Statistik', href: ROUTES.DASHBOARD_STATISTICS, icon: BarChart3 },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout, isLogoutLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <>
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
          <Link
            href={ROUTES.DASHBOARD_EVENT_CREATE}
            onClick={() => setIsSidebarOpen(false)}
          >
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
            (link.href !== ROUTES.DASHBOARD && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsSidebarOpen(false)}
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
    </>
  );

  return (
    <div className='bg-muted/30 min-h-screen'>
      {/* Desktop Sidebar */}
      <aside className='bg-background fixed top-0 left-0 z-40 hidden h-screen w-64 border-r lg:block'>
        <div className='flex h-full flex-col'>
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side='left' className='w-64 p-0'>
          <div className='flex h-full flex-col'>
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className='lg:pl-64'>
        {/* Header */}
        <header className='bg-background sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 lg:px-6'>
          {/* Mobile Menu Button */}
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden'
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className='h-5 w-5' />
          </Button>

          {/* Search */}
          <div className='hidden flex-1 md:block'>
            <div className='relative max-w-md'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input placeholder='Cari event...' className='pl-10' />
            </div>
          </div>

          <div className='flex flex-1 items-center justify-end gap-4'>
            {/* Notifications */}
            <Button variant='ghost' size='icon' className='relative'>
              <Bell className='h-5 w-5' />
              <span className='bg-destructive absolute top-1 right-1 h-2 w-2 rounded-full' />
            </Button>

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-10 w-10 rounded-full'
                  >
                    <Avatar className='h-10 w-10'>
                      <AvatarImage
                        src={user.profileImage || ''}
                        alt={user.firstName}
                      />
                      <AvatarFallback>
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56' align='end'>
                  <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-medium'>
                        {user.firstName} {user.lastName}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.PROFILE}>Profil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.HOME}>Lihat Website</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className='text-destructive focus:text-destructive'
                  >
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className='p-4 lg:p-6'>{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
