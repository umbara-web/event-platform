import { Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  size = 'md',
  className,
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Loader2 className={cn('text-primary animate-spin', sizeClasses[size])} />
      {text && <p className='text-muted-foreground mt-2 text-sm'>{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
