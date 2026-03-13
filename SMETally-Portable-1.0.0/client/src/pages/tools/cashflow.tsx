import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { Voucher } from "@shared/schema";
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function CashflowGenerator() {
  const { data: vouchers } = useQuery<Voucher[]>({
    queryKey: ["/api/vouchers"],
  });

  const monthlyData = vouchers?.reduce((acc, v) => {
    const date = new Date(v.date.split('-').reverse().join('-'));
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, inflows: 0, outflows: 0, net: 0 };
    }
    
    if (v.voucherType === 'sales' || v.voucherType === 'receipt') {
      acc[monthKey].inflows += parseFloat(v.amount);
    } else if (v.voucherType === 'payment' || v.voucherType === 'purchase') {
      acc[monthKey].outflows += parseFloat(v.amount);
    }
    
    acc[monthKey].net = acc[monthKey].inflows - acc[monthKey].outflows;
    
    return acc;
  }, {} as Record<string, { month: string; inflows: number; outflows: number; net: number }>);

  const chartData = Object.values(monthlyData || {}).map(data => ({
    month: data.month,
    Inflows: Math.round(data.inflows),
    Outflows: Math.round(data.outflows),
    Net: Math.round(data.net),
  }));

  const totalInflows = chartData.reduce((sum, d) => sum + d.Inflows, 0);
  const totalOutflows = chartData.reduce((sum, d) => sum + d.Outflows, 0);
  const netCashflow = totalInflows - totalOutflows;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Cashflow Generator</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track cash movements and forecast liquidity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-md">
                <ArrowUpCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Inflows</h3>
            </div>
            <p className="text-2xl font-bold font-mono text-green-600">
              ₹{totalInflows.toLocaleString('en-IN')}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-md">
                <ArrowDownCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Outflows</h3>
            </div>
            <p className="text-2xl font-bold font-mono text-red-600">
              ₹{totalOutflows.toLocaleString('en-IN')}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
                <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Net Cashflow</h3>
            </div>
            <p className={`text-2xl font-bold font-mono ${netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netCashflow >= 0 ? '+' : ''}₹{netCashflow.toLocaleString('en-IN')}
            </p>
          </Card>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Monthly Cashflow</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Inflows" fill="#10b981" />
              <Bar dataKey="Outflows" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Net Cashflow by Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Net" fill="#3b82f6">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.Net >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
