export interface CreateTransactionInput {
  eventId: string;
  items: TransactionItemInput[];
  voucherCode?: string;
  couponId?: string;
  usePoints?: boolean;
  pointsToUse?: number;
}

export interface TransactionItemInput {
  ticketTierId: string;
  quantity: number;
}

export interface TransactionFilters {
  status?: string;
  eventId?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ConfirmTransactionInput {
  transactionId: string;
  action: 'accept' | 'reject';
  rejectionReason?: string;
}
