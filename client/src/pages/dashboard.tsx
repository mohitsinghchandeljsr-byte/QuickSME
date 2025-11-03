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
import { useQuery } from "@tanstack/react-query";
import type { Voucher, Party } from "@shared/schema";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: vouchers } = useQuery<Voucher[]>({
    queryKey: ["/api/vouchers"],
  });

  const { data: parties } = useQuery<Party[]>({
    queryKey: ["/api/parties"],
  });

  const voucherTypes = [
    {
      title: "Payment",
      description: "Record payments to suppliers and vendors",
      icon: ArrowDownLeft,
      count: vouchers?.filter(v => v.voucherType === "payment").length || 0,
    },
    {
      title: "Receipt",
      description: "Record receipts from customers",
      icon: ArrowUpRight,
      count: vouchers?.filter(v => v.voucherType === "receipt").length || 0,
    },
    {
      title: "Sales",
      description: "Create sales invoices with GST",
      icon: FileText,
      count: vouchers?.filter(v => v.voucherType === "sales").length || 0,
    },
    {
      title: "Purchase",
      description: "Record purchase bills from vendors",
      icon: FileText,
      count: vouchers?.filter(v => v.voucherType === "purchase").length || 0,
    },
    {
      title: "Journal",
      description: "Make adjustments and corrections",
      icon: FileText,
      count: vouchers?.filter(v => v.voucherType === "journal").length || 0,
    },
    {
      title: "Contra",
      description: "Transfer between bank and cash",
      icon: Repeat,
      count: vouchers?.filter(v => v.voucherType === "contra").length || 0,
    },
  ];

  const totalRevenue = vouchers?.filter(v => v.voucherType === "sales" || v.voucherType === "receipt")
    .reduce((sum, v) => sum + parseFloat(v.amount), 0) || 0;

  const totalExpenses = vouchers?.filter(v => v.voucherType === "payment" || v.voucherType === "purchase")
    .reduce((sum, v) => sum + parseFloat(v.amount), 0) || 0;

  const totalOutstanding = parties?.reduce((sum, p) => sum + parseFloat(p.outstanding), 0) || 0;

  const totalGST = vouchers?.reduce((sum, v) => {
    return sum + parseFloat(v.cgst || "0") + parseFloat(v.sgst || "0") + parseFloat(v.igst || "0");
  }, 0) || 0;

  const recentVouchers = vouchers?.slice(0, 4).map(v => {
    const party = parties?.find(p => p.id === v.partyId);
    return {
      date: v.date,
      party: party?.name || "N/A",
      amount: v.voucherType === "receipt" || v.voucherType === "sales" ? `+₹${parseFloat(v.amount).toLocaleString('en-IN')}` : `-₹${parseFloat(v.amount).toLocaleString('en-IN')}`,
      type: v.voucherType.charAt(0).toUpperCase() + v.voucherType.slice(1),
    };
  }) || [];

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
            <Button onClick={() => setLocation("/vouchers")} data-testid="button-new-voucher">
              <Plus className="w-4 h-4 mr-2" />
              New Voucher
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            label="Total Revenue"
            value={`₹${totalRevenue.toLocaleString('en-IN')}`}
            icon={TrendingUp}
          />
          <MetricCard
            label="Total Expenses"
            value={`₹${totalExpenses.toLocaleString('en-IN')}`}
            icon={TrendingDown}
          />
          <MetricCard
            label="Net Balance"
            value={`₹${(totalRevenue - totalExpenses).toLocaleString('en-IN')}`}
            icon={Wallet}
          />
          <MetricCard
            label="Outstanding"
            value={`₹${Math.abs(totalOutstanding).toLocaleString('en-IN')}`}
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
                onClick={() => setLocation("/vouchers")}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">
              Recent Transactions
            </h3>
            {recentVouchers.length > 0 ? (
              <div className="space-y-3">
                {recentVouchers.map((txn, idx) => (
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
            ) : (
              <p className="text-sm text-muted-foreground">No transactions yet</p>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">GST Summary</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Total GST
                  </p>
                  <p className="text-lg font-mono font-semibold text-foreground">
                    ₹{totalGST.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Vouchers
                  </p>
                  <p className="text-lg font-mono font-semibold text-foreground">
                    {vouchers?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    Parties
                  </p>
                  <p className="text-lg font-mono font-semibold text-foreground">
                    {parties?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
