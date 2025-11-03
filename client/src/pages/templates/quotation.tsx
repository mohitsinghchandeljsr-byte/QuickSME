import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Plus, Trash2, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Party } from "@shared/schema";

interface QuotationItem {
  description: string;
  quantity: string;
  rate: string;
  amount: number;
}

export default function QuotationGenerator() {
  const [quotationNumber, setQuotationNumber] = useState(`QT-${Date.now()}`);
  const [quotationDate, setQuotationDate] = useState(new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));
  const [validUntil, setValidUntil] = useState("");
  const [partyId, setPartyId] = useState("");
  const [items, setItems] = useState<QuotationItem[]>([
    { description: "", quantity: "1", rate: "0", amount: 0 }
  ]);
  const [terms, setTerms] = useState("Valid for 30 days from the date of quotation.\nPayment terms: 50% advance, 50% on delivery.");

  const { data: parties } = useQuery<Party[]>({
    queryKey: ["/api/parties"],
  });

  const selectedParty = parties?.find(p => p.id === partyId);

  const addItem = () => {
    setItems([...items, { description: "", quantity: "1", rate: "0", amount: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof QuotationItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate') {
      const qty = parseFloat(newItems[index].quantity) || 0;
      const rate = parseFloat(newItems[index].rate) || 0;
      newItems[index].amount = qty * rate;
    }
    
    setItems(newItems);
  };

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Quotation Generator</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create and send professional quotations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" data-testid="button-send">
              <Send className="w-4 h-4 mr-2" />
              Send via Email
            </Button>
            <Button data-testid="button-download">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="max-w-5xl">
          <Card className="p-8">
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <Label className="text-sm font-medium mb-2 block">Quotation Number</Label>
                <Input
                  value={quotationNumber}
                  onChange={(e) => setQuotationNumber(e.target.value)}
                  className="font-mono"
                  data-testid="input-quotation-number"
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Quotation Date</Label>
                <Input
                  value={quotationDate}
                  onChange={(e) => setQuotationDate(e.target.value)}
                  className="font-mono"
                  data-testid="input-quotation-date"
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Valid Until</Label>
                <Input
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  placeholder="DD-MM-YYYY"
                  className="font-mono"
                  data-testid="input-valid-until"
                />
              </div>
            </div>

            <div className="mb-8">
              <Label className="text-sm font-medium mb-2 block">Quote For</Label>
              <Select value={partyId} onValueChange={setPartyId}>
                <SelectTrigger data-testid="select-party">
                  <SelectValue placeholder="Select customer..." />
                </SelectTrigger>
                <SelectContent>
                  {parties?.filter(p => p.type === 'Customer').map((party) => (
                    <SelectItem key={party.id} value={party.id}>
                      {party.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedParty && (
                <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                  <p className="text-foreground font-medium">{selectedParty.name}</p>
                  {selectedParty.email && <p className="text-muted-foreground">{selectedParty.email}</p>}
                  {selectedParty.phone && <p className="text-muted-foreground">{selectedParty.phone}</p>}
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">Items</Label>
                <Button onClick={addItem} size="sm" data-testid="button-add-item">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
              
              <div className="border border-border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left text-xs font-medium uppercase text-muted-foreground px-4 py-3">Description</th>
                      <th className="text-right text-xs font-medium uppercase text-muted-foreground px-4 py-3 w-24">Qty</th>
                      <th className="text-right text-xs font-medium uppercase text-muted-foreground px-4 py-3 w-32">Rate</th>
                      <th className="text-right text-xs font-medium uppercase text-muted-foreground px-4 py-3 w-32">Amount</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            placeholder="Item description..."
                            data-testid={`input-item-description-${index}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="text"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                            className="text-right font-mono"
                            data-testid={`input-item-quantity-${index}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="text"
                            value={item.rate}
                            onChange={(e) => updateItem(index, 'rate', e.target.value)}
                            className="text-right font-mono"
                            data-testid={`input-item-rate-${index}`}
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">
                          ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeItem(index)}
                            disabled={items.length === 1}
                            data-testid={`button-remove-item-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end mb-6">
              <div className="w-80">
                <div className="pt-3 border-t-2 border-border flex justify-between items-center">
                  <span className="text-base font-semibold text-foreground">Total Quoted Amount:</span>
                  <span className="text-2xl font-mono font-bold text-foreground">
                    ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-right">GST extra as applicable</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Terms & Conditions</Label>
              <Textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                rows={4}
                data-testid="textarea-terms"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
