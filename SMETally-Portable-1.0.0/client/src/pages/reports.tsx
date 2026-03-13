import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Printer, FileSpreadsheet } from "lucide-react";

export default function Reports() {
  const [reportType, setReportType] = useState("balance-sheet");
  const [period, setPeriod] = useState("current-month");

  const balanceSheetData = [
    { category: "Assets", items: [
      { name: "Cash in Hand", amount: "1,25,000" },
      { name: "Bank Accounts", amount: "2,87,500" },
      { name: "Accounts Receivable", amount: "2,85,000" },
      { name: "Inventory", amount: "5,45,000" },
    ]},
    { category: "Liabilities", items: [
      { name: "Accounts Payable", amount: "1,92,000" },
      { name: "GST Payable", amount: "1,18,800" },
      { name: "Bank Loan", amount: "3,50,000" },
    ]},
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Financial statements and analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" data-testid="button-export-excel">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" data-testid="button-print">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button data-testid="button-download-pdf">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 max-w-xs">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger data-testid="select-report-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balance-sheet">Balance Sheet</SelectItem>
                <SelectItem value="profit-loss">Profit & Loss</SelectItem>
                <SelectItem value="trial-balance">Trial Balance</SelectItem>
                <SelectItem value="day-book">Day Book</SelectItem>
                <SelectItem value="outstanding">Outstanding Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 max-w-xs">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger data-testid="select-period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-month">Current Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="current-quarter">Current Quarter</SelectItem>
                <SelectItem value="current-year">Current Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="p-8">
          <div className="mb-6 text-center border-b border-border pb-6">
            <h2 className="text-xl font-semibold text-foreground">Demo Company Ltd.</h2>
            <h3 className="text-lg font-medium text-foreground mt-2">Balance Sheet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              As on 15th November 2024
            </p>
          </div>

          <div className="space-y-8">
            {balanceSheetData.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-base font-semibold text-foreground mb-4 border-b border-border pb-2">
                  {section.category}
                </h4>
                <div className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex justify-between items-center py-2 pl-4"
                      data-testid={`report-item-${itemIdx}`}
                    >
                      <span className="text-sm text-foreground">{item.name}</span>
                      <span className="text-base font-mono font-semibold text-foreground">
                        ₹{item.amount}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-3 border-t border-border mt-2">
                    <span className="text-sm font-semibold text-foreground">
                      Total {section.category}
                    </span>
                    <span className="text-lg font-mono font-bold text-foreground">
                      ₹{section.items.reduce((sum, item) => {
                        const val = parseFloat(item.amount.replace(/,/g, ''));
                        return sum + val;
                      }, 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <div className="border-t-2 border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-foreground">Net Position</span>
                <span className="text-xl font-mono font-bold text-foreground">
                  ₹4,82,700
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
