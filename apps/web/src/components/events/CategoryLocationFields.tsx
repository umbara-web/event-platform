'use client';

import { UseFormSetValue, FieldErrors } from 'react-hook-form';
import { Label } from '@/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import type { EventFormData } from '@/src/schemas/event.schema';

interface SelectOption {
  id: string;
  name: string;
}

interface CategoryLocationFieldsProps {
  setValue: UseFormSetValue<EventFormData>;
  categories: SelectOption[];
  locations: SelectOption[];
  errors: FieldErrors<EventFormData>;
}

export function CategoryLocationFields({
  setValue,
  categories,
  locations,
  errors,
}: CategoryLocationFieldsProps) {
  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      <SelectField
        label='Kategori'
        placeholder='Pilih kategori'
        options={categories}
        onValueChange={(value) => setValue('categoryId', value)}
        error={errors.categoryId?.message}
      />
      <SelectField
        label='Kota'
        placeholder='Pilih kota'
        options={locations}
        onValueChange={(value) => setValue('locationId', value)}
        error={errors.locationId?.message}
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  placeholder: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  error?: string;
}

function SelectField({
  label,
  placeholder,
  options,
  onValueChange,
  error,
}: SelectFieldProps) {
  return (
    <div className='space-y-2'>
      <Label>{label}</Label>
      <Select onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className='text-destructive text-sm'>{error}</p>}
    </div>
  );
}
