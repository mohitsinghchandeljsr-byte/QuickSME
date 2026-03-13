import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { Voucher } from "@shared/schema";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function RevenueForecaster() {
  const { data: vouchers } = useQuery<Voucher[]>({
    queryKey: ["/api/vouchers"],
  });

  const monthlyData = vouchers?.reduce((acc, v) => {
    const date = new Date(v.date.split('-').reverse().join('-'));
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, revenue: 0, expenses: 0, net: 0 };
    }
    
    if (v.voucherType === 'sales' || v.voucherType === 'receipt') {
      acc[monthKey].revenue += parseFloat(v.amount);
    } else if (v.voucherType === 'payment' || v.voucherType === 'purchase') {
      acc[monthKey].expenses += parseFloat(v.amount);
    }
    
    acc[monthKey].net = acc[monthKey].revenue - acc[monthKey].expenses;
    
    return acc;
  }, {} as Record<string, { month: string; revenue: number; expenses: number; net: number }>);

  const chartData = Object.values(monthlyData || {}).map(data => ({
    month: data.month,
    Revenue: Math.round(data.revenue),
    Expenses: Math.round(data.expenses),
    Net: Math.round(data.net),
  }));

  const totalRevenue = chartData.reduce((sum, d) => sum + d.Revenue, 0);
  const totalExpenses = chartData.reduce((sum, d) => sum + d.Expenses, 0);
  const avgMonthlyRevenue = totalRevenue / (chartData.length || 1);
  const growthRate = chartData.length >= 2 && chartData[0].Revenue > 0
    ? ((chartData[chartData.length - 1].Revenue - chartData[0].Revenue) / chartData[0].Revenue) * 100 
    : 0;

  const forecastedRevenue = avgMonthlyRevenue * (1 + growthRate / 100);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Revenue Forecaster</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze historical trends and forecast future revenue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Avg Monthly Revenue</h3>
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">
              ₹{Math.round(avgMonthlyRevenue).toLocaleString('en-IN')}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-md">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Growth Rate</h3>
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">
              {growthRate.toFixed(1)}%
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-md">
                <TrendingDown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Forecasted Next Month</h3>
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">
              ₹{Math.round(forecastedRevenue).toLocaleString('en-IN')}
            </p>
          </Card>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Revenue & Expenses Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="Net" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Monthly Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Revenue" fill="#3b82f6" />
              <Bar dataKey="Expenses" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
