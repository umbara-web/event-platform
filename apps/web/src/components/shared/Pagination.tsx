'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  limits?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  limits = [10, 20, 50],
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (showEllipsisStart) {
        pages.push('ellipsis');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (showEllipsisEnd) {
        pages.push('ellipsis');
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
      <div className='text-muted-foreground flex items-center gap-2 text-sm'>
        <span>
          Menampilkan {startItem}-{endItem} dari {totalItems} item
        </span>
        {onLimitChange && (
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => onLimitChange(Number(value))}
          >
            <SelectTrigger className='w-17.5'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {limits.map((limit) => (
                <SelectItem key={limit} value={String(limit)}>
                  {limit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className='flex items-center gap-1'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>

        {getPageNumbers().map((page, index) =>
          page === 'ellipsis' ? (
            <Button
              key={`ellipsis-${index}`}
              variant='ghost'
              size='icon'
              disabled
            >
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size='icon'
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant='outline'
          size='icon'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
