'use client';

import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Label } from '@/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/src/components/ui/sheet';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Badge } from '@/src/components/ui/badge';
import eventsApi from '@/src/lib/api/events';
import { QUERY_KEYS } from '@/src/lib/constants';
import type { Category, Location } from '@/src/types';

interface EventFiltersProps {
  filters: {
    categoryId?: string;
    locationId?: string;
    isFree?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

export function EventFilters({
  filters,
  onFilterChange,
  onReset,
}: EventFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => eventsApi.getCategories(),
  });

  // Fetch locations
  const { data: locationsData } = useQuery({
    queryKey: [QUERY_KEYS.LOCATIONS],
    queryFn: () => eventsApi.getLocations(),
  });

  const categories = categoriesData?.data || [];
  const locations = locationsData?.data || [];

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const emptyFilters = {
      categoryId: undefined,
      locationId: undefined,
      isFree: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    };
    setLocalFilters(emptyFilters);
    onReset();
    setIsOpen(false);
  };

  const activeFilterCount = React.useMemo(() => {
    return Object.values(filters).filter((v) => v !== undefined && v !== '')
      .length;
  }, [filters]);

  const getCategoryName = useCallback(
    (id?: string) => categories.find((c) => c.id === id)?.name,
    [categories]
  );
  const getLocationName = useCallback(
    (id?: string) => locations.find((l) => l.id === id)?.name,
    [locations]
  );

  return (
    <div className='flex flex-wrap items-center gap-2'>
      {/* Desktop Filters */}
      <div className='hidden items-center gap-2 md:flex'>
        <Select
          value={filters.categoryId || '__all__'}
          onValueChange={(value) => {
            const nextFilters = { ...filters, categoryId: value === '__all__' ? undefined : value };
            onFilterChange(nextFilters);
          }}
        >
          <SelectTrigger className='w-37.5'>
            <SelectValue placeholder='Kategori' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='__all__'>Semua Kategori</SelectItem>
            {categories.map((category, idx) => (
              <SelectItem key={category.id || `category-${idx}`} value={category.id || `category-${idx}`}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.locationId || '__all__'}
          onValueChange={(value) => {
            const nextFilters = { ...filters, locationId: value === '__all__' ? undefined : value };
            onFilterChange(nextFilters);
          }}
        >
          <SelectTrigger className='w-37.5'>
            <SelectValue placeholder='Lokasi' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='__all__'>Semua Lokasi</SelectItem>
            {locations.map((location, idx) => (
              <SelectItem key={location.id || `location-${idx}`} value={location.id || `location-${idx}`}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy ? `${filters.sortBy}-${filters.sortOrder || 'asc'}` : 'startDate-asc'}
          onValueChange={(value) => {
            const [sortBy, sortOrder] = value.split('-');
            const nextFilters = { ...filters, sortBy, sortOrder: sortOrder as 'asc' | 'desc' };
            onFilterChange(nextFilters);
          }}
        >
          <SelectTrigger className='w-45'>
            <SelectValue placeholder='Urutkan' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='startDate-asc'>Tanggal Terdekat</SelectItem>
            <SelectItem value='startDate-desc'>Tanggal Terjauh</SelectItem>
            <SelectItem value='createdAt-desc'>Terbaru</SelectItem>
            <SelectItem value='name-asc'>Nama A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Filter Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant='outline' className='md:hidden h-9 px-3'>
            <SlidersHorizontal className='mr-2 h-4 w-4' />
            Filter
            {activeFilterCount > 0 && (
              <Badge className='ml-2 px-1 py-0 min-w-5 h-5 justify-center' variant='secondary'>
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side='bottom' className='h-[80vh]'>
          <SheetHeader>
            <SheetTitle>Filter Event</SheetTitle>
          </SheetHeader>
          <div className='mt-6 space-y-6'>
            {/* Category */}
            <div className='space-y-2'>
              <Label>Kategori</Label>
              <Select
                value={localFilters.categoryId || '__all__'}
                onValueChange={(value) => {
                  const nextFilters = {
                    ...localFilters,
                    categoryId: value === '__all__' ? undefined : value,
                  };
                  setLocalFilters(nextFilters);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Pilih kategori' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='__all__'>Semua Kategori</SelectItem>
                  {categories.map((category, idx) => (
                    <SelectItem key={category.id || `category-${idx}`} value={category.id || `category-${idx}`}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className='space-y-2'>
              <Label>Lokasi</Label>
              <Select
                value={localFilters.locationId || '__all__'}
                onValueChange={(value) => {
                  const nextFilters = {
                    ...localFilters,
                    locationId: value === '__all__' ? undefined : value,
                  };
                  setLocalFilters(nextFilters);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Pilih lokasi' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='__all__'>Semua Lokasi</SelectItem>
                  {locations.map((location, idx) => (
                    <SelectItem key={location.id || `location-${idx}`} value={location.id || `location-${idx}`}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Free Events */}
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='isFree'
                checked={localFilters.isFree || false}
                onCheckedChange={(checked) => {
                  const nextFilters = {
                    ...localFilters,
                    isFree: checked ? true : undefined,
                  };
                  setLocalFilters(nextFilters);
                }}
              />
              <Label htmlFor='isFree'>Hanya event gratis</Label>
            </div>

            {/* Sort */}
            <div className='space-y-2'>
              <Label>Urutkan</Label>
              <Select
                value={localFilters.sortBy ? `${localFilters.sortBy}-${localFilters.sortOrder || 'asc'}` : 'startDate-asc'}
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-');
                  const nextFilters = {
                    ...localFilters,
                    sortBy,
                    sortOrder: sortOrder as 'asc' | 'desc',
                  };
                  setLocalFilters(nextFilters);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Pilih urutan' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='startDate-asc'>
                    Tanggal Terdekat
                  </SelectItem>
                  <SelectItem value='startDate-desc'>
                    Tanggal Terjauh
                  </SelectItem>
                  <SelectItem value='createdAt-desc'>Terbaru</SelectItem>
                  <SelectItem value='name-asc'>Nama A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className='mt-6 flex gap-2'>
            <Button variant='outline' onClick={handleReset} className='flex-1'>
              Reset
            </Button>
            <Button onClick={handleApply} className='flex-1'>
              Terapkan
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className='flex flex-wrap items-center gap-2'>
          {filters.categoryId && (
            <Badge variant='secondary' className='gap-1'>
              {getCategoryName(filters.categoryId)}
              <button
                onClick={() =>
                  onFilterChange({ ...filters, categoryId: undefined })
                }
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}
          {filters.locationId && (
            <Badge variant='secondary' className='gap-1'>
              {getLocationName(filters.locationId)}
              <button
                onClick={() =>
                  onFilterChange({ ...filters, locationId: undefined })
                }
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}
          {filters.isFree && (
            <Badge variant='secondary' className='gap-1'>
              Gratis
              <button
                onClick={() =>
                  onFilterChange({ ...filters, isFree: undefined })
                }
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}
          <Button variant='ghost' size='sm' onClick={onReset}>
            Reset semua
          </Button>
        </div>
      )}
    </div>
  );
}

export default EventFilters;
