import type { ElementType } from 'react';
import { Ticket, type LucideIcon } from 'lucide-react';
import { APP_NAME } from '@/src/lib/constants';
import Image from 'next/image';
import ColourfulText from '@/src/components/ui/colourful-text';

type LogoProps = {
  text?: string;
  Icon?: LucideIcon;
  className?: string;
  heading?: ElementType;
};

export default function Logo({
  className = '',
  heading: Heading = 'h2',
}: LogoProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Image src='/images/logo.png' alt='Logo' width={35} height={35} className='w-auto h-auto' />

      <Heading className='text-primary text-xl font-bold tracking-tight dark:text-white'>
        <ColourfulText text={APP_NAME} />
      </Heading>
    </div>
  );
}
