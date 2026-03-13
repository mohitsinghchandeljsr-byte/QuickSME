import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Plus, TrendingUp, Calendar } from "lucide-react";

export default function Expenses() {
  const expenses = [
    {
      id: "1",
      date: "05/11/2024",
      category: "Office Supplies",
      description: "Printer cartridges and paper",
      amount: "4500",
      status: "paid",
    },
    {
      id: "2",
      date: "04/11/2024",
      category: "Utilities",
      description: "Electricity bill - November",
      amount: "12000",
      status: "paid",
    },
    {
      id: "3",
      date: "03/11/2024",
      category: "Travel",
      description: "Client meeting - Delhi",
      amount: "8500",
      status: "pending",
    },
    {
      id: "4",
      date: "02/11/2024",
      category: "Marketing",
      description: "Google Ads campaign",
      amount: "15000",
      status: "paid",
    },
  ];

  const summary = {
    totalExpenses: 40000,
    thisMonth: 40000,
    pendingExpenses: 8500,
  };

  const categoryBreakdown = [
    { category: "Utilities", amount: 12000 },
    { category: "Marketing", amount: 15000 },
    { category: "Travel", amount: 8500 },
    { category: "Office Supplies", amount: 4500 },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Expense Management</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track and manage business expenses
              </p>
            </div>
          </div>
          <Button data-testid="button-add-expense">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Expenses
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">
              ₹{summary.totalExpenses.toLocaleString('en-IN')}
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                This Month
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">
              ₹{summary.thisMonth.toLocaleString('en-IN')}
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Pending
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">
              ₹{summary.pendingExpenses.toLocaleString('en-IN')}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Recent Expenses</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                        Date
                      </th>
                      <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                        Category
                      </th>
                      <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                        Description
                      </th>
                      <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                        Amount
                      </th>
                      <th className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {expenses.map((expense, idx) => (
                      <tr key={expense.id} className="hover-elevate" data-testid={`expense-row-${idx}`}>
                        <td className="px-6 py-4 text-sm font-mono text-foreground">{expense.date}</td>
                        <td className="px-6 py-4 text-sm font-medium text-foreground">{expense.category}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{expense.description}</td>
                        <td className="px-6 py-4 text-right text-sm font-mono text-foreground">
                          ₹{parseInt(expense.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={expense.status === 'paid' ? 'default' : 'secondary'}>
                            {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Category Breakdown</h3>
            <div className="space-y-4">
              {categoryBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.category}</span>
                    <span className="font-mono font-semibold text-foreground">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${(item.amount / summary.totalExpenses) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
