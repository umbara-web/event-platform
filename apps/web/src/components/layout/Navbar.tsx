'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  User,
  LogOut,
  Ticket,
  LayoutDashboard,
  ChevronDown,
  Settings,
  Wallet,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { useAuth } from '@/src/hooks/useAuth';
import { ROUTES, APP_NAME } from '@/src/lib/constants';
import { getInitials } from '@/src/lib/utils';
import { cn } from '@/src/lib/utils';

const navLinks = [
  { href: ROUTES.HOME, label: 'Beranda' },
  { href: ROUTES.EVENTS, label: 'Jelajahi Event' },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isLogoutLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur'>
      <nav className='container flex h-16 items-center justify-between'>
        {/* Logo */}
        <Link href={ROUTES.HOME} className='flex items-center space-x-2'>
          <div className='bg-primary flex h-8 w-8 items-center justify-center rounded-lg'>
            <Ticket className='text-primary-foreground h-5 w-5' />
          </div>
          <span className='hidden font-bold sm:inline-block'>{APP_NAME}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden items-center space-x-6 md:flex'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'hover:text-primary text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className='flex items-center space-x-4'>
          {/* Search Button */}
          <Button
            variant='ghost'
            size='icon'
            asChild
            className='hidden md:flex'
          >
            <Link href={ROUTES.EVENTS}>
              <Search className='h-5 w-5' />
            </Link>
          </Button>

          {isAuthenticated && user ? (
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
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm leading-none font-medium'>
                      {user.firstName} {user.lastName}
                    </p>
                    <p className='text-muted-foreground text-xs leading-none'>
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {user.role === 'ORGANIZER' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.DASHBOARD}>
                        <LayoutDashboard className='mr-2 h-4 w-4' />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuItem asChild>
                  <Link href={ROUTES.PROFILE}>
                    <User className='mr-2 h-4 w-4' />
                    Profil
                  </Link>
                </DropdownMenuItem>

                {user.role === 'CUSTOMER' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.MY_TICKETS}>
                        <Ticket className='mr-2 h-4 w-4' />
                        Tiket Saya
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={ROUTES.TRANSACTIONS}>
                        <Wallet className='mr-2 h-4 w-4' />
                        Transaksi
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  disabled={isLogoutLoading}
                  className='text-destructive focus:text-destructive'
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className='hidden items-center space-x-2 md:flex'>
              <Button variant='ghost' asChild>
                <Link href={ROUTES.LOGIN}>Masuk</Link>
              </Button>
              <Button asChild>
                <Link href={ROUTES.REGISTER}>Daftar</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className='h-5 w-5' />
            ) : (
              <Menu className='h-5 w-5' />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='border-t md:hidden'>
          <div className='container space-y-4 py-4'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={cn(
                  'hover:text-primary block py-2 text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}

            {!isAuthenticated && (
              <div className='flex flex-col space-y-2 pt-4'>
                <Button variant='outline' asChild>
                  <Link href={ROUTES.LOGIN} onClick={closeMobileMenu}>
                    Masuk
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={ROUTES.REGISTER} onClick={closeMobileMenu}>
                    Daftar
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
