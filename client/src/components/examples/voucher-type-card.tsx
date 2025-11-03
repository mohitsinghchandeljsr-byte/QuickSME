import { VoucherTypeCard } from '../voucher-type-card';
import { ArrowDownLeft } from 'lucide-react';

export default function VoucherTypeCardExample() {
  return (
    <div className="p-4 max-w-md">
      <VoucherTypeCard
        title="Payment"
        description="Record payments to suppliers and vendors"
        icon={ArrowDownLeft}
        count={24}
        onClick={() => console.log('Payment voucher clicked')}
      />
    </div>
  );
}
