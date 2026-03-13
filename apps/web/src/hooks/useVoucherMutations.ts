import { useMutation, useQueryClient } from '@tanstack/react-query';
import vouchersApi from '@/src/lib/api/vouchers';
import { QUERY_KEYS } from '@/src/lib/constants';
import { toast } from '@/src/components/ui/use-toast';

export function useVoucherMutations(eventId: string) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.EVENT_VOUCHERS, eventId],
    });

  const createVoucher = useMutation({
    mutationFn: vouchersApi.createVoucher,
    onSuccess: () => {
      toast({ title: 'Voucher berhasil dibuat' });
      invalidate();
    },
  });

  const deleteVoucher = useMutation({
    mutationFn: vouchersApi.deleteVoucher,
    onSuccess: () => {
      toast({ title: 'Voucher berhasil dihapus' });
      invalidate();
    },
  });

  return { createVoucher, deleteVoucher };
}
