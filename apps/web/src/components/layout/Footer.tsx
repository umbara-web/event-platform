import Link from 'next/link';
import { Ticket, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { APP_NAME, ROUTES } from '@/src/lib/constants';

const footerLinks = {
  company: [
    { label: 'Tentang Kami', href: '/about' },
    { label: 'Karir', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Kontak', href: '/contact' },
  ],
  support: [
    { label: 'Bantuan', href: '/help' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Kebijakan Privasi', href: '/privacy' },
    { label: 'Syarat & Ketentuan', href: '/terms' },
  ],
  organizer: [
    { label: 'Buat Event', href: ROUTES.REGISTER },
    { label: 'Panduan Organizer', href: '/organizer-guide' },
    { label: 'Harga', href: '/pricing' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '<https://facebook.com>', label: 'Facebook' },
  { icon: Twitter, href: '<https://twitter.com>', label: 'Twitter' },
  { icon: Instagram, href: '<https://instagram.com>', label: 'Instagram' },
  { icon: Youtube, href: '<https://youtube.com>', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className='bg-muted/50 border-t'>
      <div className='container py-12'>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-5'>
          {/* Brand */}
          <div className='lg:col-span-2'>
            <Link href={ROUTES.HOME} className='flex items-center space-x-2'>
              <div className='bg-primary flex h-8 w-8 items-center justify-center rounded-lg'>
                <Ticket className='text-primary-foreground h-5 w-5' />
              </div>
              <span className='font-bold'>{APP_NAME}</span>
            </Link>
            <p className='text-muted-foreground mt-4 max-w-xs text-sm'>
              Platform manajemen acara terdepan di Indonesia. Temukan dan buat
              event dengan mudah.
            </p>
            <div className='mt-4 flex space-x-4'>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-muted-foreground hover:text-primary transition-colors'
                  aria-label={social.label}
                >
                  <social.icon className='h-5 w-5' />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className='mb-4 text-sm font-semibold'>Perusahaan</h3>
            <ul className='space-y-3'>
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-primary text-sm transition-colors'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className='mb-4 text-sm font-semibold'>Bantuan</h3>
            <ul className='space-y-3'>
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-primary text-sm transition-colors'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organizer Links */}
          <div>
            <h3 className='mb-4 text-sm font-semibold'>Untuk Penyelenggara</h3>
            <ul className='space-y-3'>
              {footerLinks.organizer.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-primary text-sm transition-colors'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className='mt-12 border-t pt-8'>
          <p className='text-muted-foreground text-center text-sm'>
            © {new Date().getFullYear()} {APP_NAME}. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
