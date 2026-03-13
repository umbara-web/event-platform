'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface CreateEventHeaderProps {
  onBack: () => void;
}

export function CreateEventHeader({ onBack }: CreateEventHeaderProps) {
  return (
    <div>
      <Button variant='ghost' className='mb-4' onClick={onBack}>
        <ArrowLeft className='mr-2 h-4 w-4' />
        Kembali
      </Button>
      <h1 className='text-2xl font-bold'>Buat Event Baru</h1>
      <p className='text-muted-foreground'>
        Isi informasi event Anda dengan lengkap
      </p>
    </div>
  );
}
