import { ComponentPropsWithRef } from 'react';
import { cn } from '@/src/lib/utils';

interface MarqueeProps extends ComponentPropsWithRef<'div'> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
}

export const Marquee: React.FC<MarqueeProps> = ({
  className,
  reverse = false,
  pauseOnHover = true,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) => {
  return (
    <div
      className={cn(
        'group flex overflow-hidden p-2',
        { 'hover-pause': pauseOnHover },
        className
      )}
      style={
        {
          gap: 'var(--gap)',
          '--gap': '3rem',
          '--duration': '40s',
        } as React.CSSProperties
      }
      {...props}
    >
      {Array(repeat)
        .fill(null)
        .map((_, i) => (
          <div
            key={i}
            className={cn('flex shrink-0 justify-around', {
              'animate-marquee-scrolling flex-row': !vertical,
              'animate-marquee-scrolling-vertical flex-col': vertical,
              'direction-reverse': reverse,
            })}
            style={{
              gap: 'var(--gap)',
            }}
          >
            {children}
          </div>
        ))}
    </div>
  );
};
