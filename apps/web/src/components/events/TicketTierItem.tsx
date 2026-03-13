'use client';

import { UseFormRegister } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import type { EventFormData } from '@/src/schemas/event.schema';

interface TicketTierItemProps {
  index: number;
  register: UseFormRegister<EventFormData>;
  onRemove: () => void;
  canRemove: boolean;
}

export function TicketTierItem({
  index,
  register,
  onRemove,
  canRemove,
}: TicketTierItemProps) {
  return (
    <div className='rounded-lg border p-4'>
      <TicketHeader index={index} onRemove={onRemove} canRemove={canRemove} />
      <TicketFields index={index} register={register} />
      <TicketDescription index={index} register={register} />
    </div>
  );
}

function TicketHeader({
  index,
  onRemove,
  canRemove,
}: {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className='mb-4 flex items-center justify-between'>
      <h4 className='font-medium'>Tiket #{index + 1}</h4>
      {canRemove && (
        <Button type='button' variant='ghost' size='icon' onClick={onRemove}>
          <Trash2 className='text-destructive h-4 w-4' />
        </Button>
      )}
    </div>
  );
}

function TicketFields({
  index,
  register,
}: {
  index: number;
  register: UseFormRegister<EventFormData>;
}) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      <div className='space-y-2'>
        <Label>Nama Tiket</Label>
        <Input
          placeholder='Contoh: Regular, VIP'
          {...register(`ticketTiers.${index}.name`)}
        />
      </div>

      <div className='space-y-2'>
        <Label>Harga (Rp)</Label>
        <Input
          type='number'
          min={0}
          placeholder='0 untuk gratis'
          {...register(`ticketTiers.${index}.price`, { valueAsNumber: true })}
        />
      </div>

      <div className='space-y-2'>
        <Label>Kuota</Label>
        <Input
          type='number'
          min={1}
          {...register(`ticketTiers.${index}.quota`, { valueAsNumber: true })}
        />
      </div>

      <div className='space-y-2'>
        <Label>Maks per User</Label>
        <Input
          type='number'
          min={1}
          max={10}
          {...register(`ticketTiers.${index}.maxPerUser`, {
            valueAsNumber: true,
          })}
        />
      </div>

      <div className='space-y-2'>
        <Label>Mulai Penjualan</Label>
        <Input
          type='datetime-local'
          {...register(`ticketTiers.${index}.salesStartDate`)}
        />
      </div>

      <div className='space-y-2'>
        <Label>Akhir Penjualan</Label>
        <Input
          type='datetime-local'
          {...register(`ticketTiers.${index}.salesEndDate`)}
        />
      </div>
    </div>
  );
}

function TicketDescription({
  index,
  register,
}: {
  index: number;
  register: UseFormRegister<EventFormData>;
}) {
  return (
    <div className='mt-4 space-y-2'>
      <Label>Deskripsi (Opsional)</Label>
      <Textarea
        placeholder='Deskripsi tiket'
        rows={2}
        {...register(`ticketTiers.${index}.description`)}
      />
    </div>
  );
}
