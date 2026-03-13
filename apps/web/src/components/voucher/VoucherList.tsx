import { VoucherCard } from './VoucherCard';

interface Props {
  vouchers: any[];
  onDelete: (id: string) => void;
}

export function VoucherList({ vouchers, onDelete }: Props) {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {vouchers.map((voucher) => (
        <VoucherCard key={voucher.id} voucher={voucher} onDelete={onDelete} />
      ))}
    </div>
  );
}
