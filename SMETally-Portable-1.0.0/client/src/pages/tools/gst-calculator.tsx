import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, RefreshCcw } from "lucide-react";

export default function GSTCalculator() {
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState("18");
  const [stateType, setStateType] = useState("intra");

  const baseAmount = parseFloat(amount) || 0;
  const rate = parseFloat(gstRate) || 0;

  const cgst = stateType === "intra" ? (baseAmount * rate) / 200 : 0;
  const sgst = stateType === "intra" ? (baseAmount * rate) / 200 : 0;
  const igst = stateType === "inter" ? (baseAmount * rate) / 100 : 0;
  const totalGST = cgst + sgst + igst;
  const totalAmount = baseAmount + totalGST;

  const handleReset = () => {
    setAmount("");
    setGstRate("18");
    setStateType("intra");
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">GST Calculator</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Calculate GST on your transactions instantly
          </p>
        </div>

        <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Input Details
            </h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
                  Base Amount (₹)
                </Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-right font-mono text-lg"
                  data-testid="input-base-amount"
                />
              </div>

              <div>
                <Label htmlFor="gst-rate" className="text-sm font-medium mb-2 block">
                  GST Rate
                </Label>
                <Select value={gstRate} onValueChange={setGstRate}>
                  <SelectTrigger id="gst-rate" data-testid="select-gst-rate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0% - Exempt</SelectItem>
                    <SelectItem value="5">5% - Essential Goods</SelectItem>
                    <SelectItem value="12">12% - Standard Goods</SelectItem>
                    <SelectItem value="18">18% - Most Goods & Services</SelectItem>
                    <SelectItem value="28">28% - Luxury Items</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="state-type" className="text-sm font-medium mb-2 block">
                  Transaction Type
                </Label>
                <Select value={stateType} onValueChange={setStateType}>
                  <SelectTrigger id="state-type" data-testid="select-state-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intra">Intra-State (CGST + SGST)</SelectItem>
                    <SelectItem value="inter">Inter-State (IGST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleReset} 
                variant="outline" 
                className="w-full"
                data-testid="button-reset"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Calculation Results</h2>
            
            <div className="space-y-4">
              <div className="pb-4 border-b border-border">
                <p className="text-sm text-muted-foreground mb-1">Base Amount</p>
                <p className="text-2xl font-mono font-bold text-foreground">
                  ₹{baseAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {stateType === "intra" ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">CGST ({rate / 2}%)</span>
                    <span className="text-lg font-mono font-semibold text-foreground">
                      ₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">SGST ({rate / 2}%)</span>
                    <span className="text-lg font-mono font-semibold text-foreground">
                      ₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">IGST ({rate}%)</span>
                  <span className="text-lg font-mono font-semibold text-foreground">
                    ₹{igst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">Total GST</p>
                <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
                  ₹{totalGST.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="pt-4 border-t-2 border-border">
                <p className="text-sm text-muted-foreground mb-1">Grand Total (Inc. GST)</p>
                <p className="text-3xl font-mono font-bold text-foreground">
                  ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mt-6 p-6 max-w-4xl">
          <h3 className="text-base font-semibold text-foreground mb-4">GST Rate Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-foreground mb-2">0% - Exempted Items</p>
              <p className="text-muted-foreground">Fresh fruits, vegetables, milk, etc.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">5% - Essential Goods</p>
              <p className="text-muted-foreground">Sugar, tea, coffee, medicines, etc.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">12% - Standard Goods</p>
              <p className="text-muted-foreground">Computers, processed food, etc.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">18% - Most Items</p>
              <p className="text-muted-foreground">Most goods and services</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-2">28% - Luxury Items</p>
              <p className="text-muted-foreground">Cars, cigarettes, aerated drinks, etc.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
