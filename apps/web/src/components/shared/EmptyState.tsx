import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <div className='bg-muted rounded-full p-4'>
        <Icon className='text-muted-foreground h-8 w-8' />
      </div>
      <h3 className='mt-4 text-lg font-semibold'>{title}</h3>
      {description && (
        <p className='text-muted-foreground mt-2 max-w-sm text-sm'>
          {description}
        </p>
      )}
      {action && (
        <Button className='mt-4' onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
