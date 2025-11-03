import { MetricCard } from "@/components/metric-card";
import { VoucherTypeCard } from "@/components/voucher-type-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  Repeat,
  Plus,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const voucherTypes = [
    {
      title: "Payment",
      description: "Record payments to suppliers and vendors",
      icon: ArrowDownLeft,
      count: 24,
    },
    {
      title: "Receipt",
      description: "Record receipts from customers",
      icon: ArrowUpRight,
      count: 18,
    },
    {
      title: "Sales",
      description: "Create sales invoices with GST",
      icon: FileText,
      count: 32,
    },
    {
      title: "Purchase",
      description: "Record purchase bills from vendors",
      icon: FileText,
      count: 28,
    },
    {
      title: "Journal",
      description: "Make adjustments and corrections",
      icon: FileText,
      count: 5,
    },
    {
      title: "Contra",
      description: "Transfer between bank and cash",
      icon: Repeat,
      count: 12,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Overview of your business finances
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Quick search (Ctrl+K)"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <Button data-testid="button-new-voucher">
              <Plus className="w-4 h-4 mr-2" />
              New Voucher
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            label="Total Revenue"
            value="₹12,45,000"
            trend="+12.5% from last month"
            icon={TrendingUp}
            positive={true}
          />
          <MetricCard
            label="Total Expenses"
            value="₹8,32,500"
            trend="+8.2% from last month"
            icon={TrendingDown}
            positive={false}
          />
          <MetricCard
            label="Cash Balance"
            value="₹4,12,500"
            icon={Wallet}
          />
          <MetricCard
            label="Outstanding"
            value="₹2,85,000"
            icon={Users}
          />
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {voucherTypes.map((type) => (
              <VoucherTypeCard
                key={type.title}
                {...type}
                onClick={() => console.log(`Create ${type.title} voucher`)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">
              Recent Transactions
            </h3>
            <div className="space-y-3">
              {[
                { date: "15-11-2024", party: "ABC Suppliers", amount: "-₹45,000", type: "Payment" },
                { date: "15-11-2024", party: "XYZ Customer", amount: "+₹65,000", type: "Receipt" },
                { date: "14-11-2024", party: "PQR Vendors", amount: "-₹28,500", type: "Payment" },
                { date: "14-11-2024", party: "LMN Client", amount: "+₹92,000", type: "Sales" },
              ].map((txn, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  data-testid={`transaction-${idx}`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{txn.party}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {txn.date} • {txn.type}
                    </p>
                  </div>
                  <p
                    className={`text-base font-mono font-semibold ${
                      txn.amount.startsWith("+") ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {txn.amount}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">GST Summary</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    CGST
                  </p>
                  <p className="text-lg font-mono font-semibold text-foreground">₹45,200</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    SGST
                  </p>
                  <p className="text-lg font-mono font-semibold text-foreground">₹45,200</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    IGST
                  </p>
                  <p className="text-lg font-mono font-semibold text-foreground">₹28,400</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Total GST (This Month)
                </p>
                <p className="text-2xl font-mono font-bold text-foreground">₹1,18,800</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
