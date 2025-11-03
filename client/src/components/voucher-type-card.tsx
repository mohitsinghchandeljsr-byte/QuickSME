import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface VoucherTypeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  count?: number;
  onClick?: () => void;
}

export function VoucherTypeCard({ title, description, icon: Icon, count, onClick }: VoucherTypeCardProps) {
  return (
    <Card
      className="p-6 hover-elevate active-elevate-2 cursor-pointer"
      onClick={onClick}
      data-testid={`voucher-type-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          {count !== undefined && (
            <p className="text-xs text-muted-foreground mt-2 font-mono">
              {count} entries this month
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
