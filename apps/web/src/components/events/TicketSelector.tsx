'use client';

import { useState } from 'react';
import { Minus, Plus, Ticket } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { formatRupiah, formatDate } from '@/src/lib/utils';
import type { TicketTier } from '@/src/types';

interface TicketSelectorProps {
  ticketTiers: TicketTier[];
  selectedTickets: Record<string, number>;
  onQuantityChange: (ticketTierId: string, quantity: number) => void;
  disabled?: boolean;
}

export function TicketSelector({
  ticketTiers,
  selectedTickets,
  onQuantityChange,
  disabled,
}: TicketSelectorProps) {
  const handleIncrement = (tier: TicketTier) => {
    const current = selectedTickets[tier.id] || 0;
    const availableSeats = tier.availableSeats ?? tier.quota - tier.soldCount;
    const max = Math.min(tier.maxPerUser, availableSeats);

    if (current < max) {
      onQuantityChange(tier.id, current + 1);
    }
  };

  const handleDecrement = (tier: TicketTier) => {
    const current = selectedTickets[tier.id] || 0;
    if (current > 0) {
      onQuantityChange(tier.id, current - 1);
    }
  };

  const now = new Date();

  return (
    <div className='space-y-4'>
      {ticketTiers.map((tier) => {
        const quantity = selectedTickets[tier.id] || 0;
        const availableSeats =
          tier.availableSeats ?? tier.quota - tier.soldCount;
        const isSoldOut = availableSeats <= 0;
        const isSalesStarted = new Date(tier.salesStartDate) <= now;
        const isSalesEnded = new Date(tier.salesEndDate) < now;
        const isAvailable = isSalesStarted && !isSalesEnded && !isSoldOut;

        return (
          <Card key={tier.id} className={!isAvailable ? 'opacity-60' : ''}>
            <CardContent className='flex items-center justify-between p-4'>
              <div className='flex-1'>
                <div className='flex items-center gap-2'>
                  <Ticket className='text-primary h-5 w-5' />
                  <h4 className='font-semibold'>{tier.name}</h4>
                  {tier.ticketType === 'FREE' && (
                    <Badge variant='success'>GRATIS</Badge>
                  )}
                </div>
                {tier.description && (
                  <p className='text-muted-foreground mt-1 text-sm'>
                    {tier.description}
                  </p>
                )}
                <div className='mt-2 flex flex-wrap items-center gap-2 text-sm'>
                  <span className='text-primary font-semibold'>
                    {tier.price === 0 ? 'Gratis' : formatRupiah(tier.price)}
                  </span>
                  <span className='text-muted-foreground'>•</span>
                  {isSoldOut ? (
                    <Badge variant='destructive'>Habis</Badge>
                  ) : (
                    <span className='text-muted-foreground'>
                      {availableSeats} tersisa
                    </span>
                  )}
                  {!isSalesStarted && (
                    <Badge variant='secondary'>
                      Mulai {formatDate(tier.salesStartDate)}
                    </Badge>
                  )}
                  {isSalesEnded && (
                    <Badge variant='secondary'>Penjualan berakhir</Badge>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() => handleDecrement(tier)}
                  disabled={disabled || !isAvailable || quantity === 0}
                >
                  <Minus className='h-4 w-4' />
                </Button>
                <span className='w-8 text-center font-semibold'>
                  {quantity}
                </span>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() => handleIncrement(tier)}
                  disabled={
                    disabled ||
                    !isAvailable ||
                    quantity >= Math.min(tier.maxPerUser, availableSeats)
                  }
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default TicketSelector;
