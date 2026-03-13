'use client';

import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import type { EventFormData } from '@/src/schemas/event.schema';
import { CategoryLocationFields } from './CategoryLocationFields';
import { VenueAddressFields } from './VenueAddressFields';
import { DateTimeFields } from './DateTimeFields';

interface Category {
  id: string;
  name: string;
}

interface Location {
  id: string;
  name: string;
}

interface EventBasicInfoFieldsProps {
  register: UseFormRegister<EventFormData>;
  errors: FieldErrors<EventFormData>;
  setValue: UseFormSetValue<EventFormData>;
  categories: Category[];
  locations: Location[];
}

export function EventBasicInfoFields({
  register,
  errors,
  setValue,
  categories,
  locations,
}: EventBasicInfoFieldsProps) {
  return (
    <>
      <NameField register={register} error={errors.name?.message} />
      <DescriptionField
        register={register}
        error={errors.description?.message}
      />
      <CategoryLocationFields
        setValue={setValue}
        categories={categories}
        locations={locations}
        errors={errors}
      />
      <VenueAddressFields register={register} errors={errors} />
      <DateTimeFields register={register} errors={errors} />
    </>
  );
}

function NameField({
  register,
  error,
}: {
  register: UseFormRegister<EventFormData>;
  error?: string;
}) {
  return (
    <div className='space-y-2'>
      <Label htmlFor='name'>Nama Event</Label>
      <Input
        id='name'
        placeholder='Masukkan nama event'
        {...register('name')}
      />
      {error && <p className='text-destructive text-sm'>{error}</p>}
    </div>
  );
}

function DescriptionField({
  register,
  error,
}: {
  register: UseFormRegister<EventFormData>;
  error?: string;
}) {
  return (
    <div className='space-y-2'>
      <Label htmlFor='description'>Deskripsi</Label>
      <Textarea
        id='description'
        placeholder='Jelaskan tentang event Anda'
        rows={5}
        {...register('description')}
      />
      {error && <p className='text-destructive text-sm'>{error}</p>}
    </div>
  );
}
