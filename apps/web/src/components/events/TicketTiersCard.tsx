'use client';

import { useFieldArray } from 'react-hook-form';
import type { Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { TicketTierItem } from './TicketTierItem';
import { DEFAULT_TICKET_TIER } from '@/src/schemas/event.schema';
import type { EventFormData } from '@/src/schemas/event.schema';

interface TicketTiersCardProps {
  control: Control<EventFormData>;
  register: UseFormRegister<EventFormData>;
  errors: FieldErrors<EventFormData>;
}

export function TicketTiersCard({
  control,
  register,
  errors,
}: TicketTiersCardProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ticketTiers',
  });

  const handleAddTicket = () => {
    append({ ...DEFAULT_TICKET_TIER, name: '' });
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Jenis Tiket</CardTitle>
        <AddTicketButton onClick={handleAddTicket} />
      </CardHeader>
      <CardContent className='space-y-4'>
        <TicketList fields={fields} register={register} onRemove={remove} />
        <ErrorMessage error={errors.ticketTiers?.message} />
      </CardContent>
    </Card>
  );
}

function AddTicketButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type='button' variant='outline' size='sm' onClick={onClick}>
      <Plus className='mr-2 h-4 w-4' />
      Tambah Tiket
    </Button>
  );
}

interface TicketListProps {
  fields: { id: string }[];
  register: UseFormRegister<EventFormData>;
  onRemove: (index: number) => void;
}

function TicketList({ fields, register, onRemove }: TicketListProps) {
  return (
    <>
      {fields.map((field, index) => (
        <TicketTierItem
          key={field.id}
          index={index}
          register={register}
          onRemove={() => onRemove(index)}
          canRemove={fields.length > 1}
        />
      ))}
    </>
  );
}

function ErrorMessage({ error }: { error?: string }) {
  if (!error) return null;
  return <p className='text-destructive text-sm'>{error}</p>;
}
