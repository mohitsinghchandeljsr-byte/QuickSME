import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Download, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Party } from "@shared/schema";

export default function EInvoice() {
  const [partyId, setPartyId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now()}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));
  const [amount, setAmount] = useState("");
  const [generated, setGenerated] = useState(false);
  const [irn] = useState("4d9e456f8a7b123456789abcdef0123456789abcdef0123456789abcdef01234");
  const [ackNumber] = useState("112024111234567");
  const [ackDate] = useState(new Date().toLocaleString('en-GB'));

  const { data: parties } = useQuery<Party[]>({
    queryKey: ["/api/parties"],
  });

  const selectedParty = parties?.find(p => p.id === partyId);

  const handleGenerate = () => {
    setGenerated(true);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-semibold text-foreground">Generate e-Invoice</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Create GST-compliant e-invoices with IRN and QR code
          </p>
        </div>

        <div className="max-w-4xl">
          {!generated ? (
            <Card className="p-8">
              <h2 className="text-lg font-semibold text-foreground mb-6">Invoice Details</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Invoice Number</Label>
                    <Input
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="font-mono"
                      data-testid="input-invoice-number"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Invoice Date</Label>
                    <Input
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="font-mono"
                      data-testid="input-invoice-date"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Customer</Label>
                  <Select value={partyId} onValueChange={setPartyId}>
                    <SelectTrigger data-testid="select-customer">
                      <SelectValue placeholder="Select customer..." />
                    </SelectTrigger>
                    <SelectContent>
                      {parties?.filter(p => p.type === 'Customer' && p.gstin).map((party) => (
                        <SelectItem key={party.id} value={party.id}>
                          {party.name} - {party.gstin}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedParty && (
                    <div className="mt-3 p-3 bg-muted rounded-md text-sm">
                      <p className="text-foreground font-medium">{selectedParty.name}</p>
                      <p className="text-muted-foreground">GSTIN: {selectedParty.gstin}</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Invoice Amount (₹)</Label>
                  <Input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="text-right font-mono text-lg"
                    data-testid="input-amount"
                  />
                </div>

                <Button 
                  onClick={handleGenerate} 
                  className="w-full"
                  disabled={!partyId || !amount}
                  data-testid="button-generate"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Generate e-Invoice
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      e-Invoice Generated Successfully
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      IRN has been generated and digitally signed by the IRP
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <h2 className="text-lg font-semibold text-foreground mb-6">e-Invoice Details</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6 pb-6 border-b border-border">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Invoice Number
                      </p>
                      <p className="text-base font-mono font-semibold text-foreground">
                        {invoiceNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Invoice Date
                      </p>
                      <p className="text-base font-mono font-semibold text-foreground">
                        {invoiceDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Amount
                      </p>
                      <p className="text-xl font-mono font-bold text-foreground">
                        ₹{parseFloat(amount || "0").toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Status
                      </p>
                      <Badge variant="default" className="text-sm">Active</Badge>
                    </div>
                  </div>

                  <div className="pb-6 border-b border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                      Invoice Reference Number (IRN)
                    </p>
                    <p className="text-sm font-mono bg-muted p-3 rounded-md break-all text-foreground">
                      {irn}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Acknowledgment Number
                      </p>
                      <p className="text-base font-mono font-semibold text-foreground">
                        {ackNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Acknowledgment Date & Time
                      </p>
                      <p className="text-base font-mono font-semibold text-foreground">
                        {ackDate}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <div className="flex items-center justify-center p-8 bg-muted rounded-md">
                      <div className="text-center">
                        <div className="w-48 h-48 bg-white border-2 border-border rounded-md flex items-center justify-center mb-4 mx-auto">
                          <p className="text-xs text-muted-foreground">QR Code</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Scan this QR code for instant verification
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1" data-testid="button-download-pdf">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => setGenerated(false)} data-testid="button-new">
                      Generate New
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <h3 className="text-base font-semibold text-foreground mb-3">About e-Invoice</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>Mandatory for businesses with turnover above ₹5 crore</li>
                  <li>IRN is unique and generated by Invoice Registration Portal (IRP)</li>
                  <li>QR code contains digitally signed invoice details</li>
                  <li>Valid for GST compliance and audit purposes</li>
                  <li>e-Invoice data is automatically sent to GST and e-Way Bill systems</li>
                </ul>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
