import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Package, Clock, CheckCircle2 } from "lucide-react";

export default function PurchaseOrders() {
  const orders = [
    {
      id: "1",
      poNumber: "PO-2024-001",
      vendor: "ABC Suppliers Pvt Ltd",
      date: "01/11/2024",
      amount: "125000",
      status: "approved",
      items: 5,
    },
    {
      id: "2",
      poNumber: "PO-2024-002",
      vendor: "XYZ Trading Co",
      date: "03/11/2024",
      amount: "87500",
      status: "pending",
      items: 3,
    },
    {
      id: "3",
      poNumber: "PO-2024-003",
      vendor: "Modern Electronics",
      date: "05/11/2024",
      amount: "245000",
      status: "received",
      items: 8,
    },
  ];

  const summary = {
    totalOrders: 3,
    pendingOrders: 1,
    totalValue: 457500,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "default";
      case "pending": return "secondary";
      case "received": return "default";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle2 className="w-3 h-3 mr-1" />;
      case "pending": return <Clock className="w-3 h-3 mr-1" />;
      case "received": return <Package className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Purchase Orders</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track orders placed with suppliers
              </p>
            </div>
          </div>
          <Button data-testid="button-add-po">
            <Plus className="w-4 h-4 mr-2" />
            New Purchase Order
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Orders
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{summary.totalOrders}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Pending Orders
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{summary.pendingOrders}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-green-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Value
              </p>
            </div>
            <p className="text-xl font-bold font-mono text-foreground">
              ₹{summary.totalValue.toLocaleString('en-IN')}
            </p>
          </Card>
        </div>

        <Card>
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">All Purchase Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    PO Number
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Vendor
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Date
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Items
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
                {orders.map((order, idx) => (
                  <tr key={order.id} className="hover-elevate" data-testid={`po-row-${idx}`}>
                    <td className="px-6 py-4 text-sm font-mono font-medium text-foreground">
                      {order.poNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{order.vendor}</td>
                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{order.date}</td>
                    <td className="px-6 py-4 text-right text-sm font-mono text-foreground">{order.items}</td>
                    <td className="px-6 py-4 text-right text-sm font-mono text-foreground">
                      ₹{parseInt(order.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
