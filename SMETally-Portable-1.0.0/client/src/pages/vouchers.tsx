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
import { Calendar, Save, X } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Party, Ledger, InsertVoucher } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Vouchers() {
  const [voucherType, setVoucherType] = useState("payment");
  const [date, setDate] = useState(new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));
  const [partyId, setPartyId] = useState("");
  const [ledgerId, setLedgerId] = useState("");
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [cgst, setCgst] = useState("");
  const [sgst, setSgst] = useState("");
  const [igst, setIgst] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: parties } = useQuery<Party[]>({
    queryKey: ["/api/parties"],
  });

  const { data: ledgers } = useQuery<Ledger[]>({
    queryKey: ["/api/ledgers"],
  });

  const createVoucherMutation = useMutation({
    mutationFn: async (voucher: InsertVoucher) => {
      return apiRequest("POST", "/api/vouchers", voucher);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vouchers"] });
      toast({
        title: "Success",
        description: "Voucher saved successfully",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save voucher",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setAmount("");
    setNarration("");
    setPartyId("");
    setLedgerId("");
    setCgst("");
    setSgst("");
    setIgst("");
  };

  const handleSave = () => {
    if (!amount) {
      toast({
        title: "Validation Error",
        description: "Please enter an amount",
        variant: "destructive",
      });
      return;
    }

    const voucherData: InsertVoucher = {
      voucherType,
      date,
      partyId: partyId || null,
      ledgerId: ledgerId || null,
      amount,
      narration: narration || null,
      cgst: cgst || "0",
      sgst: sgst || "0",
      igst: igst || "0",
    };

    createVoucherMutation.mutate(voucherData);
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
            <Button 
              variant="outline" 
              onClick={() => setLocation("/")} 
              data-testid="button-cancel"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={createVoucherMutation.isPending}
              data-testid="button-save"
            >
              <Save className="w-4 h-4 mr-2" />
              {createVoucherMutation.isPending ? "Saving..." : "Save (Ctrl+S)"}
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
                <Select value={partyId} onValueChange={setPartyId}>
                  <SelectTrigger id="party" data-testid="select-party">
                    <SelectValue placeholder="Select party..." />
                  </SelectTrigger>
                  <SelectContent>
                    {parties?.map((party) => (
                      <SelectItem key={party.id} value={party.id}>
                        {party.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="ledger" className="text-sm font-medium mb-1 block">
                  Ledger Account
                </Label>
                <Select value={ledgerId} onValueChange={setLedgerId}>
                  <SelectTrigger id="ledger" data-testid="select-ledger">
                    <SelectValue placeholder="Select ledger..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ledgers?.map((ledger) => (
                      <SelectItem key={ledger.id} value={ledger.id}>
                        {ledger.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              {(voucherType === "sales" || voucherType === "purchase") && (
                <div className="border-t border-border pt-6 space-y-4">
                  <h3 className="text-base font-semibold text-foreground">GST Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-1 block">CGST (9%)</Label>
                      <Input
                        type="text"
                        placeholder="0.00"
                        value={cgst}
                        onChange={(e) => setCgst(e.target.value)}
                        className="text-right font-mono"
                        data-testid="input-cgst"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1 block">SGST (9%)</Label>
                      <Input
                        type="text"
                        placeholder="0.00"
                        value={sgst}
                        onChange={(e) => setSgst(e.target.value)}
                        className="text-right font-mono"
                        data-testid="input-sgst"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1 block">IGST (18%)</Label>
                      <Input
                        type="text"
                        placeholder="0.00"
                        value={igst}
                        onChange={(e) => setIgst(e.target.value)}
                        className="text-right font-mono"
                        data-testid="input-igst"
                      />
                    </div>
                  </div>
                </div>
              )}
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
