'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Download, Search } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { Pagination } from '@/src/components/shared/Pagination';
import { LoadingSpinner } from '@/src/components/shared/LoadingSpinner';
import { EmptyState } from '@/src/components/shared/EmptyState';
import dashboardApi from '@/src/lib/api/dashboard';
import eventsApi from '@/src/lib/api/events';
import { QUERY_KEYS, PAGINATION } from '@/src/lib/constants';
import { formatRupiah, formatDateTime, getInitials } from '@/src/lib/utils';

interface ParticipantsPageProps {
  params: { id: string };
}

export default function ParticipantsPage({ params }: ParticipantsPageProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch event details
  const { data: eventData } = useQuery({
    queryKey: [QUERY_KEYS.EVENT, params.id],
    queryFn: () => eventsApi.getEvent(params.id),
  });

  // Fetch participants
  const { data: participantsData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.EVENT_PARTICIPANTS, params.id, page],
    queryFn: () =>
      dashboardApi.getEventParticipants(
        params.id,
        page,
        PAGINATION.DEFAULT_LIMIT
      ),
  });

  const event = eventData?.data;
  const participants = participantsData?.data || [];
  const pagination = participantsData?.pagination;

  // Filter participants by search term
  const filteredParticipants = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    // Create CSV content
    const headers = [
      'Nama',
      'Email',
      'Invoice',
      'Tiket',
      'Jumlah',
      'Total',
      'Tanggal',
    ];
    const rows = participants.map((p) => [
      p.name,
      p.email,
      p.invoiceNumber,
      p.tickets.map((t) => t.tierName).join(', '),
      p.totalTickets,
      p.totalPaid,
      new Date(p.purchasedAt).toLocaleDateString('id-ID'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `participants-${event?.slug || params.id}.csv`;
    link.click();
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <Button variant='ghost' className='mb-4' onClick={() => router.back()}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Kembali
        </Button>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold'>Daftar Peserta</h1>
            {event && <p className='text-muted-foreground'>{event.name}</p>}
          </div>
          <div className='flex items-center gap-4'>
            <div className='relative'>
              <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                placeholder='Cari peserta...'
                className='w-[250px] pl-10'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant='outline' onClick={handleExportCSV}>
              <Download className='mr-2 h-4 w-4' />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardContent className='flex items-center gap-4 p-4'>
            <div className='bg-primary/10 rounded-full p-3'>
              <Users className='text-primary h-6 w-6' />
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>Total Peserta</p>
              <p className='text-2xl font-bold'>
                {pagination?.totalItems || participants.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Peserta Terdaftar</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex justify-center py-12'>
              <LoadingSpinner />
            </div>
          ) : filteredParticipants.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Peserta</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Tiket</TableHead>
                    <TableHead className='text-right'>Total</TableHead>
                    <TableHead>Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParticipants.map((participant) => (
                    <TableRow key={participant.invoiceNumber}>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-8 w-8'>
                            <AvatarImage src={participant.profileImage || ''} />
                            <AvatarFallback className='text-xs'>
                              {participant.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className='font-medium'>{participant.name}</p>
                            <p className='text-muted-foreground text-sm'>
                              {participant.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className='text-sm'>
                          {participant.invoiceNumber}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className='space-y-1'>
                          {participant.tickets.map((ticket, idx) => (
                            <div key={idx} className='text-sm'>
                              {ticket.tierName} × {ticket.quantity}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className='text-right font-medium'>
                        {formatRupiah(participant.totalPaid)}
                      </TableCell>
                      <TableCell className='text-muted-foreground'>
                        {formatDateTime(participant.purchasedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pagination && pagination.totalPages > 1 && (
                <div className='mt-4'>
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    itemsPerPage={pagination.itemsPerPage}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={Users}
              title='Belum ada peserta'
              description='Event ini belum memiliki peserta terdaftar'
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
