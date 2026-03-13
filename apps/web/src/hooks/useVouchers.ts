import { useQuery } from '@tanstack/react-query';
import vouchersApi from '@/src/lib/api/vouchers';
import { QUERY_KEYS } from '@/src/lib/constants';

export function useVouchers(eventId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.EVENT_VOUCHERS, eventId],
    queryFn: () => vouchersApi.getEventVouchers(eventId),
  });
}
