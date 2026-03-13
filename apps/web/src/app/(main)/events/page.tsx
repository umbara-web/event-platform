'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { EventGrid } from '@/src/components/events/EventGrid';
import { EventSearch } from '@/src/components/events/EventSearch';
import { EventFilters } from '@/src/components/events/EventFilters';
import { Pagination } from '@/src/components/shared/Pagination';
import eventsApi, { EventFilters as IEventFilters } from '@/src/lib/api/events';
import { QUERY_KEYS, PAGINATION } from '@/src/lib/constants';

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse URL params
  const initialFilters = React.useMemo<IEventFilters>(() => {
    return {
      page: Number(searchParams.get('page')) || PAGINATION.DEFAULT_PAGE,
      limit: Number(searchParams.get('limit')) || PAGINATION.DEFAULT_LIMIT,
      search: searchParams.get('search') || '',
      categoryId: searchParams.get('categoryId') || undefined,
      locationId: searchParams.get('locationId') || undefined,
      sortBy: searchParams.get('sortBy') || 'startDate',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
      isFree: searchParams.get('isFree') === 'true' ? true : undefined,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<IEventFilters>(initialFilters);

  // Keep state in sync with URL if searchParams change externally (forward/back button)
  React.useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Update URL when filters change
  const updateUrl = useCallback(
    (newFilters: IEventFilters) => {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.set(key, String(value));
        }
      });
      const queryString = params.toString();
      const currentQuery = searchParams.toString();
      if (queryString !== currentQuery) {
        router.push(`/events?${queryString}`, { scroll: false });
      }
    },
    [router, searchParams]
  );

  // Fetch events
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.EVENTS, filters],
    queryFn: () => eventsApi.getEvents({ ...filters, status: 'PUBLISHED' }),
  });

  const events = data?.data || [];
  const pagination = data?.pagination;

  const handleFilterChange = useCallback(
    (newFilters: Partial<IEventFilters>) => {
      setFilters((prev) => {
        const updated = { ...prev, ...newFilters, page: 1 };
        // Shallow compare to avoid redundant updates
        if (JSON.stringify(updated) === JSON.stringify(prev)) return prev;
        updateUrl(updated);
        return updated;
      });
    },
    [updateUrl]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      handleFilterChange({ search });
    },
    [handleFilterChange]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters((prev) => {
        if (prev.page === page) return prev;
        const updated = { ...prev, page };
        updateUrl(updated);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return updated;
      });
    },
    [updateUrl]
  );

  const handleReset = useCallback(() => {
    const resetFilters: IEventFilters = {
      page: PAGINATION.DEFAULT_PAGE,
      limit: PAGINATION.DEFAULT_LIMIT,
      sortBy: 'startDate',
      sortOrder: 'asc',
    };
    setFilters(resetFilters);
    router.push('/events');
  }, [router]);

  return (
    <div className='container mx-auto py-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Jelajahi Event</h1>
        <p className='text-muted-foreground'>
          Temukan event menarik di sekitarmu
        </p>
      </div>

      {/* Search & Filters */}
      <div className='mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <EventSearch
          value={filters.search || ''}
          onChange={handleSearchChange}
        />
        <EventFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      </div>

      {/* Results */}
      <EventGrid
        events={events}
        isLoading={isLoading}
        emptyMessage={
          filters.search
            ? `Tidak ada event ditemukan untuk "${filters.search}"`
            : 'Tidak ada event yang tersedia'
        }
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className='mt-8'>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
