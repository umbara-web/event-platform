'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  MoreVertical,
  Eye,
  Edit,
  Trash,
  Ticket,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Pagination } from '@/src/components/shared/Pagination';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';
import { EmptyState } from '@/src/components/shared/EmptyState';
import eventsApi from '@/src/lib/api/events';
import {
  ROUTES,
  QUERY_KEYS,
  IMAGE_PLACEHOLDER,
  PAGINATION,
} from '@/src/lib/constants';
import {
  formatDate,
  formatRupiah,
  getStatusColor,
  getStatusText,
} from '@/src/lib/utils';

export default function DashboardEventsPage() {
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ORGANIZER_EVENTS, { status, page }],
    queryFn: () =>
      eventsApi.getMyEvents({
        status: status || undefined,
        page,
        limit: PAGINATION.DEFAULT_LIMIT,
      }),
  });

  const events = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold'>Event Saya</h1>
          <p className='text-muted-foreground'>
            Kelola semua event yang Anda buat
          </p>
        </div>
        <div className='flex items-center gap-4'>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className='w-37.5'>
              <SelectValue placeholder='Semua Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=''>Semua Status</SelectItem>
              <SelectItem value='DRAFT'>Draft</SelectItem>
              <SelectItem value='PUBLISHED'>Published</SelectItem>
              <SelectItem value='COMPLETED'>Completed</SelectItem>
              <SelectItem value='CANCELLED'>Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href={ROUTES.DASHBOARD_EVENT_CREATE}>
              <Plus className='mr-2 h-4 w-4' />
              Buat Event
            </Link>
          </Button>
        </div>
      </div>

      {/* Events List */}
      {isLoading ? (
        <div className='flex justify-center py-12'>
          <LoadingSpinner size='lg' />
        </div>
      ) : events.length > 0 ? (
        <>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {events.map((event) => (
              <Card key={event.id} className='overflow-hidden'>
                {/* Image */}
                <div className='relative aspect-video'>
                  <Image
                    src={event.imageUrl || IMAGE_PLACEHOLDER}
                    alt={event.name}
                    fill
                    className='object-cover'
                  />
                  <Badge
                    className={`absolute top-2 right-2 ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {getStatusText(event.status)}
                  </Badge>
                </div>

                <CardContent className='p-4'>
                  <h3 className='line-clamp-1 font-semibold'>{event.name}</h3>

                  <div className='text-muted-foreground mt-2 space-y-1 text-sm'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4' />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <MapPin className='h-4 w-4' />
                      <span className='line-clamp-1'>
                        {event.location.name}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Users className='h-4 w-4' />
                      <span>{event._count?.transactions || 0} transaksi</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='mt-4 flex items-center justify-between'>
                    <div className='flex gap-2'>
                      <Button variant='outline' size='sm' asChild>
                        <Link href={ROUTES.DASHBOARD_EVENT_DETAIL(event.id)}>
                          <Eye className='mr-1 h-4 w-4' />
                          Detail
                        </Link>
                      </Button>
                      <Button variant='outline' size='sm' asChild>
                        <Link href={ROUTES.DASHBOARD_EVENT_EDIT(event.id)}>
                          <Edit className='mr-1 h-4 w-4' />
                          Edit
                        </Link>
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem asChild>
                          <Link
                            href={ROUTES.DASHBOARD_EVENT_VOUCHERS(event.id)}
                          >
                            <Ticket className='mr-2 h-4 w-4' />
                            Kelola Voucher
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={ROUTES.DASHBOARD_EVENT_PARTICIPANTS(event.id)}
                          >
                            <Users className='mr-2 h-4 w-4' />
                            Daftar Peserta
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='text-destructive'>
                          <Trash className='mr-2 h-4 w-4' />
                          Hapus Event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <EmptyState
          icon={Calendar}
          title='Belum ada event'
          description='Buat event pertama Anda dan mulai promosikan'
          action={{
            label: 'Buat Event',
            onClick: () =>
              (window.location.href = ROUTES.DASHBOARD_EVENT_CREATE),
          }}
        />
      )}
    </div>
  );
}
