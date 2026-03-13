import { MetricCard } from '../metric-card';
import { TrendingUp } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <MetricCard
        label="Total Revenue"
        value="₹12,45,000"
        trend="+12.5% from last month"
        icon={TrendingUp}
        positive={true}
      />
    </div>
  );
}
