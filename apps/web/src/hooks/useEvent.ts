import { useQuery } from '@tanstack/react-query';
import eventsApi from '@/src/lib/api/events';
import { QUERY_KEYS } from '@/src/lib/constants';

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.EVENT, eventId],
    queryFn: () => eventsApi.getEvent(eventId),
  });
}
