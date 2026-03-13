'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';
import { toast } from '@/src/components/ui/use-toast';
import { formatRupiah, formatDateTime } from '@/src/lib/utils';
import { ROUTES, QUERY_KEYS, IMAGE_PLACEHOLDER } from '@/src/lib/constants';
import transactionsApi from '@/src/lib/api/transactions';
import type { Transaction } from '@/src/types';

interface PendingTransactionsProps {
  transactions: Transaction[];
}

export function PendingTransactions({
  transactions,
}: PendingTransactionsProps) {
  const queryClient = useQueryClient();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showProofDialog, setShowProofDialog] = useState(false);

  const confirmMutation = useMutation({
    mutationFn: ({
      id,
      action,
      reason,
    }: {
      id: string;
      action: 'accept' | 'reject';
      reason?: string;
    }) =>
      transactionsApi.confirmTransaction(id, {
        action,
        rejectionReason: reason,
      }),
    onSuccess: (_, variables) => {
      toast({
        title:
          variables.action === 'accept'
            ? 'Transaksi diterima'
            : 'Transaksi ditolak',
        description:
          variables.action === 'accept'
            ? 'Peserta akan menerima notifikasi email'
            : 'Peserta akan menerima notifikasi email dengan alasan penolakan',
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD_PENDING],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.DASHBOARD_SUMMARY],
      });
      setShowRejectDialog(false);
      setSelectedTransaction(null);
      setRejectionReason('');
    },
    onError: (error: any) => {
      toast({
        title: 'Gagal',
        description: error.response?.data?.message || 'Terjadi kesalahan',
        variant: 'destructive',
      });
    },
  });

  const handleAccept = (transaction: Transaction) => {
    confirmMutation.mutate({ id: transaction.id, action: 'accept' });
  };

  const handleReject = () => {
    if (!selectedTransaction || !rejectionReason.trim()) return;
    confirmMutation.mutate({
      id: selectedTransaction.id,
      action: 'reject',
      reason: rejectionReason,
    });
  };

  const openRejectDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowRejectDialog(true);
  };

  const openProofDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowProofDialog(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Transaksi Menunggu Konfirmasi</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className='text-muted-foreground py-8 text-center'>
              Tidak ada transaksi yang perlu dikonfirmasi
            </p>
          ) : (
            <div className='space-y-4'>
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className='flex items-center justify-between rounded-lg border p-4'
                >
                  <div className='min-w-0 flex-1'>
                    <p className='truncate font-medium'>
                      {transaction.event.name}
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {transaction.user?.firstName} {transaction.user?.lastName}
                    </p>
                    <p className='text-primary text-sm font-medium'>
                      {formatRupiah(transaction.finalAmount)}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      {formatDateTime(transaction.createdAt)}
                    </p>
                  </div>
                  <div className='ml-4 flex items-center gap-2'>
                    {transaction.paymentProof && (
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => openProofDialog(transaction)}
                      >
                        <Eye className='h-4 w-4' />
                      </Button>
                    )}
                    <Button
                      variant='outline'
                      size='icon'
                      className='text-green-600 hover:bg-green-50 hover:text-green-700'
                      onClick={() => handleAccept(transaction)}
                      disabled={confirmMutation.isPending}
                    >
                      {confirmMutation.isPending ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <Check className='h-4 w-4' />
                      )}
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      className='text-red-600 hover:bg-red-50 hover:text-red-700'
                      onClick={() => openRejectDialog(transaction)}
                      disabled={confirmMutation.isPending}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Transaksi</DialogTitle>
            <DialogDescription>
              Berikan alasan penolakan yang jelas. Alasan ini akan dikirim ke
              peserta via email.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='reason'>Alasan Penolakan</Label>
              <Textarea
                id='reason'
                placeholder='Contoh: Bukti pembayaran tidak valid, nominal tidak sesuai, dll.'
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowRejectDialog(false)}
            >
              Batal
            </Button>
            <Button
              variant='destructive'
              onClick={handleReject}
              disabled={!rejectionReason.trim() || confirmMutation.isPending}
            >
              {confirmMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Memproses...
                </>
              ) : (
                'Tolak Transaksi'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Proof Dialog */}
      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Bukti Pembayaran</DialogTitle>
          </DialogHeader>
          <div className='relative aspect-video'>
            {selectedTransaction?.paymentProof && (
              <Image
                src={selectedTransaction.paymentProof}
                alt='Bukti pembayaran'
                fill
                className='rounded-lg object-contain'
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PendingTransactions;
