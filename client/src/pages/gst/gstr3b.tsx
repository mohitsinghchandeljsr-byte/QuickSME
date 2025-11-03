import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Voucher } from "@shared/schema";
import { useState } from "react";

export default function GSTR3B() {
  const [month, setMonth] = useState("November 2024");

  const { data: vouchers } = useQuery<Voucher[]>({
    queryKey: ["/api/vouchers"],
  });

  const salesVouchers = vouchers?.filter(v => v.voucherType === 'sales') || [];
  const purchaseVouchers = vouchers?.filter(v => v.voucherType === 'purchase') || [];

  const outwardSupplies = {
    taxableValue: salesVouchers.reduce((sum, v) => sum + parseFloat(v.amount), 0),
    cgst: salesVouchers.reduce((sum, v) => sum + parseFloat(v.cgst || "0"), 0),
    sgst: salesVouchers.reduce((sum, v) => sum + parseFloat(v.sgst || "0"), 0),
    igst: salesVouchers.reduce((sum, v) => sum + parseFloat(v.igst || "0"), 0),
  };

  const itcAvailable = {
    cgst: purchaseVouchers.reduce((sum, v) => sum + parseFloat(v.cgst || "0"), 0),
    sgst: purchaseVouchers.reduce((sum, v) => sum + parseFloat(v.sgst || "0"), 0),
    igst: purchaseVouchers.reduce((sum, v) => sum + parseFloat(v.igst || "0"), 0),
  };

  const taxPayable = {
    cgst: outwardSupplies.cgst - itcAvailable.cgst,
    sgst: outwardSupplies.sgst - itcAvailable.sgst,
    igst: outwardSupplies.igst - itcAvailable.igst,
  };

  const totalPayable = taxPayable.cgst + taxPayable.sgst + taxPayable.igst;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">GSTR-3B</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monthly summary return and tax payment
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" data-testid="button-download-json">
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </Button>
            <Button data-testid="button-file-return">
              <Send className="w-4 h-4 mr-2" />
              File & Pay
            </Button>
          </div>
        </div>

        <Card className="p-6 mb-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">Return Period</Label>
              <Input
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                data-testid="input-period"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Status</Label>
              <Badge variant="destructive" className="text-sm px-4 py-2">Not Filed - Overdue</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">3.1 Outward Supplies</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-4 py-3">
                    Nature of Supplies
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-4 py-3">
                    Taxable Value
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-4 py-3">
                    CGST
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-4 py-3">
                    SGST
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-4 py-3">
                    IGST
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 text-sm text-foreground">Taxable Outward Supplies</td>
                  <td className="px-4 py-3 text-right text-sm font-mono font-semibold text-foreground">
                    ₹{Math.round(outwardSupplies.taxableValue).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-mono text-foreground">
                    ₹{Math.round(outwardSupplies.cgst).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-mono text-foreground">
                    ₹{Math.round(outwardSupplies.sgst).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-mono text-foreground">
                    ₹{Math.round(outwardSupplies.igst).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">4. Eligible ITC</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-4 py-3">
                    Details
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-4 py-3">
                    CGST
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-4 py-3">
                    SGST
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-4 py-3">
                    IGST
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 text-sm text-foreground">ITC Available (Inputs & Input Services)</td>
                  <td className="px-4 py-3 text-right text-sm font-mono font-semibold text-green-600">
                    ₹{Math.round(itcAvailable.cgst).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-mono font-semibold text-green-600">
                    ₹{Math.round(itcAvailable.sgst).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-mono font-semibold text-green-600">
                    ₹{Math.round(itcAvailable.igst).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">6. Tax Payable</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-sm text-muted-foreground">CGST Payable</span>
              <span className="text-xl font-mono font-bold text-foreground">
                ₹{Math.round(Math.max(0, taxPayable.cgst)).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-sm text-muted-foreground">SGST Payable</span>
              <span className="text-xl font-mono font-bold text-foreground">
                ₹{Math.round(Math.max(0, taxPayable.sgst)).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-sm text-muted-foreground">IGST Payable</span>
              <span className="text-xl font-mono font-bold text-foreground">
                ₹{Math.round(Math.max(0, taxPayable.igst)).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t-2 border-border">
              <span className="text-base font-semibold text-foreground">Total Tax Payable</span>
              <span className="text-3xl font-mono font-bold text-red-600">
                ₹{Math.round(Math.max(0, totalPayable)).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <h3 className="text-base font-semibold text-foreground mb-3">Important Notes</h3>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>File GSTR-3B by 20th of next month to avoid late fees</li>
            <li>Late fee: ₹50/day (CGST) + ₹50/day (SGST) = ₹100/day total</li>
            <li>Ensure payment is made before filing the return</li>
            <li>Interest at 18% per annum on delayed tax payment</li>
            <li>Verify details from GSTR-1, GSTR-2A, and GSTR-2B before filing</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
