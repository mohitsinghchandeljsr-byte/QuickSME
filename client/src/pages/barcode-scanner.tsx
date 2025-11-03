import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { StockItem } from "@shared/schema";
import { Scan, Package, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BarcodeScanner() {
  const { toast } = useToast();
  const [scannedCode, setScannedCode] = useState("");
  const [scanBuffer, setScanBuffer] = useState("");
  const [lastScanTime, setLastScanTime] = useState(0);
  const [scannedItems, setScannedItems] = useState<Array<{ item: StockItem; quantity: number; timestamp: string }>>([]);
  const [isListening, setIsListening] = useState(true);

  const { data: stockItems } = useQuery<StockItem[]>({
    queryKey: ["/api/stock"],
  });

  useEffect(() => {
    if (!isListening) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const currentTime = new Date().getTime();
      
      if (currentTime - lastScanTime > 100) {
        setScanBuffer("");
      }
      
      setLastScanTime(currentTime);

      if (e.key === "Enter") {
        if (scanBuffer.length > 0) {
          processBarcode(scanBuffer);
          setScanBuffer("");
        }
      } else if (e.key.length === 1) {
        setScanBuffer(prev => prev + e.key);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [scanBuffer, lastScanTime, isListening]);

  const processBarcode = (barcode: string) => {
    setScannedCode(barcode);
    
    const item = stockItems?.find(
      s => s.code === barcode || 
           s.hsnCode === barcode || 
           s.name.toLowerCase().includes(barcode.toLowerCase())
    );

    if (item) {
      const existingItem = scannedItems.find(si => si.item.id === item.id);
      
      if (existingItem) {
        setScannedItems(prev => 
          prev.map(si => 
            si.item.id === item.id 
              ? { ...si, quantity: si.quantity + 1 }
              : si
          )
        );
      } else {
        setScannedItems(prev => [...prev, {
          item,
          quantity: 1,
          timestamp: new Date().toLocaleString('en-GB')
        }]);
      }

      toast({
        title: "Item Scanned",
        description: `${item.name} - Qty: ${existingItem ? existingItem.quantity + 1 : 1}`,
      });
    } else {
      toast({
        title: "Item Not Found",
        description: `No stock item matches barcode: ${barcode}`,
        variant: "destructive",
      });
    }
  };

  const handleManualScan = () => {
    if (scannedCode.trim()) {
      processBarcode(scannedCode.trim());
    }
  };

  const clearScannedItems = () => {
    setScannedItems([]);
    toast({
      title: "Cleared",
      description: "All scanned items have been cleared",
    });
  };

  const totalItems = scannedItems.reduce((sum, si) => sum + si.quantity, 0);
  const totalValue = scannedItems.reduce((sum, si) => 
    sum + (si.quantity * parseFloat(si.item.salePrice)), 0
  );
  const uniqueItems = scannedItems.length;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <Scan className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Barcode Scanner</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Scan items using laser scanner or enter barcodes manually
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Scan className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Scanner Status
              </p>
            </div>
            <Badge variant={isListening ? "default" : "secondary"} className="text-sm">
              {isListening ? "Active" : "Paused"}
            </Badge>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-green-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Items Scanned
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{totalItems}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Unique Items
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">{uniqueItems}</p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Value
              </p>
            </div>
            <p className="text-xl font-bold font-mono text-foreground">
              ₹{Math.round(totalValue).toLocaleString('en-IN')}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Manual Entry</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter barcode or item code..."
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualScan()}
                  className="font-mono"
                  data-testid="input-barcode"
                />
                <Button onClick={handleManualScan} data-testid="button-scan">
                  <Scan className="w-4 h-4 mr-2" />
                  Scan
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={isListening ? "destructive" : "default"}
                  onClick={() => setIsListening(!isListening)}
                  className="flex-1"
                  data-testid="button-toggle-scanner"
                >
                  {isListening ? "Pause Scanner" : "Resume Scanner"}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearScannedItems}
                  disabled={scannedItems.length === 0}
                  className="flex-1"
                  data-testid="button-clear"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <h3 className="text-base font-semibold text-foreground mb-3">Scanner Instructions</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                <span>Connect your USB barcode scanner to your computer</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                <span>Scanner will automatically detect and process barcodes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                <span>Matches Item Code, HSN Code, or Item Name</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                <span>Use manual entry if scanner is unavailable</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
                <span>Pause scanner when typing in other fields</span>
              </li>
            </ul>
          </Card>
        </div>

        <Card>
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Scanned Items</h2>
          </div>
          <div className="overflow-x-auto">
            {scannedItems.length === 0 ? (
              <div className="p-12 text-center">
                <Scan className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No items scanned yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Use your laser scanner or enter barcodes manually
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                      Code
                    </th>
                    <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                      Item Name
                    </th>
                    <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                      Quantity
                    </th>
                    <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                      Unit Price
                    </th>
                    <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                      Total Value
                    </th>
                    <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                      Scanned At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {scannedItems.map((scannedItem, idx) => (
                    <tr key={idx} className="hover-elevate" data-testid={`scanned-row-${idx}`}>
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                        {scannedItem.item.code}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {scannedItem.item.name}
                      </td>
                      <td className="px-6 py-4 text-right text-lg font-bold font-mono text-foreground">
                        {scannedItem.quantity}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-mono text-foreground">
                        ₹{parseFloat(scannedItem.item.salePrice).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-mono font-semibold text-foreground">
                        ₹{(scannedItem.quantity * parseFloat(scannedItem.item.salePrice)).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                        {scannedItem.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
