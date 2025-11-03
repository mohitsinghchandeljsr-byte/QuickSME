import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertStockItemSchema, type StockItem, type InsertStockItem } from "@shared/schema";
import { Plus, Package, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function StockManagement() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: stockItems, isLoading } = useQuery<StockItem[]>({
    queryKey: ["/api/stock"],
  });

  const form = useForm<InsertStockItem>({
    resolver: zodResolver(insertStockItemSchema.extend({
      reorderLevel: insertStockItemSchema.shape.reorderLevel.default("0"),
      hsnCode: insertStockItemSchema.shape.hsnCode.default(""),
      gstRate: insertStockItemSchema.shape.gstRate.default("18"),
    })),
    defaultValues: {
      name: "",
      code: "",
      category: "",
      unit: "Pcs",
      quantity: "0",
      purchasePrice: "0",
      salePrice: "0",
      reorderLevel: "0",
      hsnCode: "",
      gstRate: "18",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertStockItem) => apiRequest("/api/stock", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stock"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Stock Item Added",
        description: "New stock item created successfully",
      });
    },
  });

  const onSubmit = (data: InsertStockItem) => {
    createMutation.mutate(data);
  };

  const totalValue = stockItems?.reduce((sum, item) => {
    return sum + parseFloat(item.quantity) * parseFloat(item.purchasePrice);
  }, 0) || 0;

  const lowStockItems = stockItems?.filter(item => 
    parseFloat(item.quantity) <= parseFloat(item.reorderLevel || "0")
  ) || [];

  const totalItems = stockItems?.length || 0;
  const totalQuantity = stockItems?.reduce((sum, item) => sum + parseFloat(item.quantity), 0) || 0;

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Stock Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage inventory items, quantities, and pricing
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-stock">
                <Plus className="w-4 h-4 mr-2" />
                Add Stock Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Stock Item</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Code</FormLabel>
                          <FormControl>
                            <Input {...field} className="font-mono" data-testid="input-code" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-category" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Pcs, Kg, Liters" data-testid="input-unit" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opening Quantity</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="font-mono" data-testid="input-quantity" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="purchasePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Price</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="font-mono" data-testid="input-purchase-price" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="salePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sale Price</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="font-mono" data-testid="input-sale-price" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="reorderLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reorder Level</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="font-mono" data-testid="input-reorder-level" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hsnCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HSN Code</FormLabel>
                          <FormControl>
                            <Input {...field} className="font-mono" data-testid="input-hsn-code" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gstRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST Rate (%)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="font-mono" data-testid="input-gst-rate" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit">
                    {createMutation.isPending ? "Creating..." : "Create Stock Item"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Items
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{totalItems}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Quantity
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{totalQuantity.toFixed(0)}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-indigo-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Stock Value
              </p>
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">
              ₹{Math.round(totalValue).toLocaleString('en-IN')}
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Low Stock
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-red-600">{lowStockItems.length}</p>
          </Card>
        </div>

        <Card>
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Stock Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Code
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Item Name
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Category
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Quantity
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Purchase Price
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Sale Price
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Stock Value
                  </th>
                  <th className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stockItems?.map((item, idx) => {
                  const isLowStock = parseFloat(item.quantity) <= parseFloat(item.reorderLevel || "0");
                  const stockValue = parseFloat(item.quantity) * parseFloat(item.purchasePrice);
                  
                  return (
                    <tr key={idx} className="hover-elevate" data-testid={`stock-row-${idx}`}>
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{item.code}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{item.category}</td>
                      <td className="px-6 py-4 text-right text-sm font-mono font-semibold text-foreground">
                        {parseFloat(item.quantity).toFixed(0)} {item.unit}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-mono text-foreground">
                        ₹{parseFloat(item.purchasePrice).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-mono text-foreground">
                        ₹{parseFloat(item.salePrice).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-mono font-semibold text-foreground">
                        ₹{Math.round(stockValue).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={isLowStock ? "destructive" : "default"}>
                          {isLowStock ? "Low Stock" : "In Stock"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
