import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Calendar, Save, X, Plus } from "lucide-react";

export default function Vouchers() {
  const [voucherType, setVoucherType] = useState("payment");
  const [date, setDate] = useState("15-11-2024");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");

  const handleSave = () => {
    console.log("Saving voucher:", { voucherType, date, amount, narration });
    setAmount("");
    setNarration("");
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Voucher Entry</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Press F2 for quick entry • Ctrl+S to save
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => console.log("Cancel")} data-testid="button-cancel">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} data-testid="button-save">
              <Save className="w-4 h-4 mr-2" />
              Save (Ctrl+S)
            </Button>
          </div>
        </div>

        <div className="max-w-4xl">
          <Card className="p-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="voucher-type" className="text-sm font-medium mb-1 block">
                    Voucher Type
                  </Label>
                  <Select value={voucherType} onValueChange={setVoucherType}>
                    <SelectTrigger id="voucher-type" data-testid="select-voucher-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="receipt">Receipt</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="journal">Journal</SelectItem>
                      <SelectItem value="contra">Contra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date" className="text-sm font-medium mb-1 block">
                    Date
                  </Label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="text"
                      placeholder="DD-MM-YYYY"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="font-mono"
                      data-testid="input-date"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="party" className="text-sm font-medium mb-1 block">
                  Party Name
                </Label>
                <Input
                  id="party"
                  type="text"
                  placeholder="Start typing to search or create new..."
                  data-testid="input-party"
                />
              </div>

              <div>
                <Label htmlFor="ledger" className="text-sm font-medium mb-1 block">
                  Ledger Account
                </Label>
                <Input
                  id="ledger"
                  type="text"
                  placeholder="Select ledger account..."
                  data-testid="input-ledger"
                />
              </div>

              <div>
                <Label htmlFor="amount" className="text-sm font-medium mb-1 block">
                  Amount (₹)
                </Label>
                <Input
                  id="amount"
                  type="text"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-right font-mono text-lg"
                  data-testid="input-amount"
                />
              </div>

              <div>
                <Label htmlFor="narration" className="text-sm font-medium mb-1 block">
                  Narration
                </Label>
                <Input
                  id="narration"
                  type="text"
                  placeholder="Brief description of the transaction..."
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  data-testid="input-narration"
                />
              </div>

              {voucherType === "sales" || voucherType === "purchase" ? (
                <div className="border-t border-border pt-6 space-y-4">
                  <h3 className="text-base font-semibold text-foreground">GST Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-1 block">CGST (9%)</Label>
                      <Input
                        type="text"
                        placeholder="0.00"
                        className="text-right font-mono"
                        data-testid="input-cgst"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1 block">SGST (9%)</Label>
                      <Input
                        type="text"
                        placeholder="0.00"
                        className="text-right font-mono"
                        data-testid="input-sgst"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1 block">IGST (18%)</Label>
                      <Input
                        type="text"
                        placeholder="0.00"
                        className="text-right font-mono"
                        data-testid="input-igst"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </Card>

          <div className="mt-6 p-4 bg-muted rounded-md">
            <h4 className="text-sm font-medium text-foreground mb-2">Keyboard Shortcuts</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Save voucher:</span>
                <kbd className="font-mono bg-background px-2 py-1 rounded">Ctrl+S</kbd>
              </div>
              <div className="flex justify-between">
                <span>Cancel:</span>
                <kbd className="font-mono bg-background px-2 py-1 rounded">Esc</kbd>
              </div>
              <div className="flex justify-between">
                <span>Quick voucher:</span>
                <kbd className="font-mono bg-background px-2 py-1 rounded">F2</kbd>
              </div>
              <div className="flex justify-between">
                <span>Next field:</span>
                <kbd className="font-mono bg-background px-2 py-1 rounded">Tab</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
