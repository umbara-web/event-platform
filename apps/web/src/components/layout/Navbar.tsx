'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/src/components/logo/Logo';
import { usePathname, useRouter } from 'next/navigation';
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
  Moon,
  Sun,
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
  const router = useRouter();
  const { user, isAuthenticated, logout, isLogoutLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className='fixed top-0 z-50 w-full'>
      <div
        className={cn(
          'container mx-auto px-2 transition-all duration-300 md:px-4 lg:px-6',
          isScrolled &&
            'bg-background/10 mt-4 max-w-7xl rounded-2xl shadow-xl shadow-zinc-300/20 backdrop-blur-sm lg:rounded-full'
        )}
      >
        <nav className='container mx-auto flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link href={ROUTES.HOME} className='flex items-center space-x-2'>
            <Logo />
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
          <div className='flex items-center space-x-4 dark:text-white'>
            {/* Search Button */}
            <Link href={ROUTES.EVENTS} className='hidden md:flex'>
              <Button variant='ghost' size='icon'>
                <Search className='h-5 w-5' />
              </Button>
            </Link>

            {/* Dark/Light Mode Toggle - selalu tampil */}
            <Button
              variant='ghost'
              size='icon'
              onClick={toggleTheme}
              aria-label={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
              }
              className='hidden md:flex'
            >
              {isDark ? (
                <Sun className='h-5 w-5 transition-transform duration-300' />
              ) : (
                <Moon className='h-5 w-5 transition-transform duration-300' />
              )}
            </Button>

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='hover:bg-accent relative flex h-10 w-10 items-center justify-center rounded-full'>
                    <Avatar className='h-10 w-10'>
                      <AvatarImage
                        src={user.profileImage || ''}
                        alt={user.firstName}
                      />
                      <AvatarFallback>
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
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
                      <DropdownMenuItem
                        onClick={() => router.push(ROUTES.DASHBOARD)}
                      >
                        <LayoutDashboard className='mr-2 h-4 w-4' />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  <DropdownMenuItem onClick={() => router.push(ROUTES.PROFILE)}>
                    <User className='mr-2 h-4 w-4' />
                    Profil
                  </DropdownMenuItem>

                  {user.role === 'CUSTOMER' && (
                    <>
                      <DropdownMenuItem
                        onClick={() => router.push(ROUTES.MY_TICKETS)}
                      >
                        <Ticket className='mr-2 h-4 w-4' />
                        Tiket Saya
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push(ROUTES.TRANSACTIONS)}
                      >
                        <Wallet className='mr-2 h-4 w-4' />
                        Transaksi
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
                {/* Border Pemisah */}
                <div className='h-6 w-px bg-gray-300' />
                <Link href={ROUTES.LOGIN}>
                  <Button variant='ghost'>Masuk</Button>
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <Button>Daftar</Button>
                </Link>
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

              {/* Dark/Light Toggle - Mobile */}
              <div className='flex items-center justify-between border-t pt-4'>
                <span className='text-muted-foreground text-sm'>
                  {isDark ? 'Mode Gelap' : 'Mode Terang'}
                </span>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={toggleTheme}
                  aria-label={
                    isDark ? 'Switch to light mode' : 'Switch to dark mode'
                  }
                >
                  {isDark ? (
                    <Sun className='h-5 w-5' />
                  ) : (
                    <Moon className='h-5 w-5' />
                  )}
                </Button>
              </div>

              {!isAuthenticated && (
                <div className='flex flex-col space-y-2 pt-2'>
                  <Link href={ROUTES.LOGIN} onClick={closeMobileMenu}>
                    <Button variant='outline' className='w-full'>
                      Masuk
                    </Button>
                  </Link>
                  <Link href={ROUTES.REGISTER} onClick={closeMobileMenu}>
                    <Button className='w-full'>Daftar</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
