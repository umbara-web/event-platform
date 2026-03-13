import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from '@/src/components/ui/use-toast';
import eventsApi from '@/src/lib/api/events';
import { ROUTES } from '@/src/lib/constants';
import type { EventFormData } from '@/src/schemas/event.schema';

interface UseCreateEventOptions {
  imageFile: File | null;
}

export function useCreateEvent({ imageFile }: UseCreateEventOptions) {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: EventFormData) => {
      const payload = transformFormData(data);
      return eventsApi.createEvent(payload, imageFile || undefined);
    },
    onSuccess: (response) => {
      showSuccessToast();
      router.push(ROUTES.DASHBOARD_EVENT_DETAIL(response.data!.id));
    },
    onError: (error: any) => {
      showErrorToast(error);
    },
  });
}

function transformFormData(data: EventFormData) {
  return {
    ...data,
    startDate: new Date(data.startDate).toISOString(),
    endDate: new Date(data.endDate).toISOString(),
    ticketTiers: data.ticketTiers.map(transformTicketTier),
  };
}

function transformTicketTier(tier: EventFormData['ticketTiers'][number]) {
  return {
    ...tier,
    ticketType: tier.price === 0 ? ('FREE' as const) : ('PAID' as const),
    salesStartDate: new Date(tier.salesStartDate).toISOString(),
    salesEndDate: new Date(tier.salesEndDate).toISOString(),
  };
}

function showSuccessToast() {
  toast({
    title: 'Event berhasil dibuat',
    description: 'Event Anda telah disimpan sebagai draft',
  });
}

function showErrorToast(error: any) {
  toast({
    title: 'Gagal membuat event',
    description: error.response?.data?.message || 'Terjadi kesalahan',
    variant: 'destructive',
  });
}
