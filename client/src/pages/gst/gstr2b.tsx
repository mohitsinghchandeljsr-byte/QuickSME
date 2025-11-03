import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Voucher } from "@shared/schema";

export default function GSTR2BReconciliation() {
  const { data: vouchers } = useQuery<Voucher[]>({
    queryKey: ["/api/vouchers"],
  });

  const purchaseVouchers = vouchers?.filter(v => v.voucherType === 'purchase') || [];
  
  const totalITC = purchaseVouchers.reduce((sum, v) => {
    return sum + parseFloat(v.cgst || "0") + parseFloat(v.sgst || "0") + parseFloat(v.igst || "0");
  }, 0);

  const itcBreakdown = {
    inputs: totalITC * 0.6,
    inputServices: totalITC * 0.25,
    capitalGoods: totalITC * 0.15,
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">GSTR-2B Reconciliation</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Auto-generated ITC statement for input tax credit
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" data-testid="button-refresh">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button data-testid="button-download">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">ITC Available (All)</h2>
            <Badge variant="default" className="text-lg px-4 py-2">
              ₹{Math.round(totalITC).toLocaleString('en-IN')}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground mb-2">Inputs</p>
              <p className="text-2xl font-bold font-mono text-foreground">
                ₹{Math.round(itcBreakdown.inputs).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground mb-2">Input Services</p>
              <p className="text-2xl font-bold font-mono text-foreground">
                ₹{Math.round(itcBreakdown.inputServices).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground mb-2">Capital Goods</p>
              <p className="text-2xl font-bold font-mono text-foreground">
                ₹{Math.round(itcBreakdown.capitalGoods).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">ITC by Tax Head</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">CGST</span>
                <span className="text-base font-mono font-semibold text-foreground">
                  ₹{Math.round(totalITC / 3).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">SGST</span>
                <span className="text-base font-mono font-semibold text-foreground">
                  ₹{Math.round(totalITC / 3).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">IGST</span>
                <span className="text-base font-mono font-semibold text-foreground">
                  ₹{Math.round(totalITC / 3).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-border">
                <span className="text-sm font-semibold text-foreground">Total ITC</span>
                <span className="text-lg font-mono font-bold text-foreground">
                  ₹{Math.round(totalITC).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">ITC Ineligible</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Rule 38 - Blocked Credit</span>
                <span className="text-base font-mono font-semibold text-foreground">₹0</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Rule 42 - Reversal</span>
                <span className="text-base font-mono font-semibold text-foreground">₹0</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Rule 43 - Common Credit</span>
                <span className="text-base font-mono font-semibold text-foreground">₹0</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-border">
                <span className="text-sm font-semibold text-foreground">Total Ineligible</span>
                <span className="text-lg font-mono font-bold text-foreground">₹0</span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <h3 className="text-base font-semibold text-foreground mb-3">About GSTR-2B</h3>
          <p className="text-sm text-muted-foreground mb-3">
            GSTR-2B is an auto-drafted ITC statement generated for every registered taxpayer. 
            It contains details of inward supplies and is available on the 14th of every month.
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li>Generated automatically based on GSTR-1 filed by suppliers</li>
            <li>Static document - does not change after generation</li>
            <li>Use this for claiming ITC in GSTR-3B</li>
            <li>Compare with GSTR-2A for comprehensive reconciliation</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
