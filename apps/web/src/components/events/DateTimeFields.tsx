'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import type { EventFormData } from '@/src/schemas/event.schema';

interface DateTimeFieldsProps {
  register: UseFormRegister<EventFormData>;
  errors: FieldErrors<EventFormData>;
}

export function DateTimeFields({ register, errors }: DateTimeFieldsProps) {
  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      <DateTimeInput
        id='startDate'
        label='Tanggal & Waktu Mulai'
        register={register}
        error={errors.startDate?.message}
      />
      <DateTimeInput
        id='endDate'
        label='Tanggal & Waktu Berakhir'
        register={register}
        error={errors.endDate?.message}
      />
    </div>
  );
}

interface DateTimeInputProps {
  id: 'startDate' | 'endDate';
  label: string;
  register: UseFormRegister<EventFormData>;
  error?: string;
}

function DateTimeInput({ id, label, register, error }: DateTimeInputProps) {
  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type='datetime-local' {...register(id)} />
      {error && <p className='text-destructive text-sm'>{error}</p>}
    </div>
  );
}
