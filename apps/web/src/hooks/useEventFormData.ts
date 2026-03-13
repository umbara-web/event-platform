import { useQuery } from '@tanstack/react-query';
import eventsApi from '@/src/lib/api/events';
import { QUERY_KEYS } from '@/src/lib/constants';

export function useEventFormData() {
  const categoriesQuery = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => eventsApi.getCategories(),
  });

  const locationsQuery = useQuery({
    queryKey: [QUERY_KEYS.LOCATIONS],
    queryFn: () => eventsApi.getLocations(),
  });

  return {
    categories: categoriesQuery.data?.data || [],
    locations: locationsQuery.data?.data || [],
    isLoading: categoriesQuery.isLoading || locationsQuery.isLoading,
  };
}
