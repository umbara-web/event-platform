'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface FormActionsProps {
  isPending: boolean;
  onCancel: () => void;
}

export function FormActions({ isPending, onCancel }: FormActionsProps) {
  return (
    <div className='flex justify-end gap-4'>
      <Button type='button' variant='outline' onClick={onCancel}>
        Batal
      </Button>
      <Button type='submit' disabled={isPending}>
        {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        Simpan Event
      </Button>
    </div>
  );
}
