import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  icon: LucideIcon;
  positive?: boolean;
}

export function MetricCard({ label, value, trend, icon: Icon, positive }: MetricCardProps) {
  return (
    <Card className="p-6" data-testid={`metric-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-2">
            {label}
          </p>
          <p className="text-3xl font-bold font-mono text-foreground">
            {value}
          </p>
          {trend && (
            <p className={`text-sm mt-2 ${positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </Card>
  );
}
