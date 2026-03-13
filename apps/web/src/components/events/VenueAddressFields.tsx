'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import type { EventFormData } from '@/src/schemas/event.schema';

interface VenueAddressFieldsProps {
  register: UseFormRegister<EventFormData>;
  errors: FieldErrors<EventFormData>;
}

export function VenueAddressFields({
  register,
  errors,
}: VenueAddressFieldsProps) {
  return (
    <>
      <div className='space-y-2'>
        <Label htmlFor='venue'>Nama Venue</Label>
        <Input
          id='venue'
          placeholder='Contoh: Gelora Bung Karno'
          {...register('venue')}
        />
        {errors.venue && (
          <p className='text-destructive text-sm'>{errors.venue.message}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='address'>Alamat Lengkap</Label>
        <Textarea
          id='address'
          placeholder='Masukkan alamat lengkap venue'
          rows={2}
          {...register('address')}
        />
        {errors.address && (
          <p className='text-destructive text-sm'>{errors.address.message}</p>
        )}
      </div>
    </>
  );
}
