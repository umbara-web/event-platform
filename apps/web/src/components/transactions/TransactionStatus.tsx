import { Badge } from '@/src/components/ui/badge';
import { getStatusColor, getStatusText } from '@/src/lib/utils';
import type { TransactionStatus as TStatus } from '@/src/types';

interface TransactionStatusProps {
  status: TStatus;
}

export function TransactionStatus({ status }: TransactionStatusProps) {
  return (
    <Badge className={getStatusColor(status)}>{getStatusText(status)}</Badge>
  );
}

export default TransactionStatus;
