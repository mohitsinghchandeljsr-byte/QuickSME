import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Voucher, Party } from "@shared/schema";

export default function GSTR1() {
  const { data: vouchers } = useQuery<Voucher[]>({
    queryKey: ["/api/vouchers"],
  });

  const { data: parties } = useQuery<Party[]>({
    queryKey: ["/api/parties"],
  });

  const salesVouchers = vouchers?.filter(v => v.voucherType === 'sales') || [];
  
  const totalCGST = salesVouchers.reduce((sum, v) => sum + parseFloat(v.cgst || "0"), 0);
  const totalSGST = salesVouchers.reduce((sum, v) => sum + parseFloat(v.sgst || "0"), 0);
  const totalIGST = salesVouchers.reduce((sum, v) => sum + parseFloat(v.igst || "0"), 0);
  
  const summary = {
    totalInvoices: salesVouchers.length,
    totalTaxableValue: salesVouchers.reduce((sum, v) => sum + parseFloat(v.amount), 0),
    totalCGST,
    totalSGST,
    totalIGST,
    totalGST: totalCGST + totalSGST + totalIGST,
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">GSTR-1</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Details of outward supplies of goods or services
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" data-testid="button-download-json">
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </Button>
            <Button data-testid="button-file-return">
              <Send className="w-4 h-4 mr-2" />
              File Return
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Total Invoices
            </p>
            <p className="text-3xl font-bold font-mono text-foreground">
              {summary.totalInvoices}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Taxable Value
            </p>
            <p className="text-2xl font-bold font-mono text-foreground">
              ₹{Math.round(summary.totalTaxableValue).toLocaleString('en-IN')}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Total GST
            </p>
            <p className="text-2xl font-bold font-mono text-foreground">
              ₹{Math.round(summary.totalGST).toLocaleString('en-IN')}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Status
            </p>
            <Badge variant="secondary" className="text-sm">Not Filed</Badge>
          </Card>
        </div>

        <Card className="mb-6">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">B2B Invoices</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Business to Business - Invoices with GSTIN
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Customer
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    GSTIN
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Taxable Value
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    CGST
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    SGST
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    IGST
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {salesVouchers.slice(0, 10).map((voucher, idx) => {
                  const party = parties?.find(p => p.id === voucher.partyId);
                  return (
                    <tr key={idx} className="hover-elevate" data-testid={`voucher-row-${idx}`}>
                      <td className="px-6 py-4 text-sm font-mono text-foreground">{voucher.date}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{party?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{party?.gstin || "N/A"}</td>
                      <td className="px-6 py-4 text-right text-sm font-mono font-semibold text-foreground">
                        ₹{parseFloat(voucher.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-mono text-foreground">
                        ₹{parseFloat(voucher.cgst || "0").toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-mono text-foreground">
                        ₹{parseFloat(voucher.sgst || "0").toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-mono text-foreground">
                        ₹{parseFloat(voucher.igst || "0").toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <h3 className="text-base font-semibold text-foreground mb-3">Filing Instructions</h3>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Review all outward supply details carefully</li>
            <li>Ensure GSTIN of all customers is correct</li>
            <li>Download the JSON file for offline verification</li>
            <li>Upload to GST portal before 11th of next month</li>
            <li>File the return after verifying all details</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
