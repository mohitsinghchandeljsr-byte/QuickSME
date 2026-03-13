import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle2, AlertCircle, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BankReconciliation() {
  const { toast } = useToast();

  const handleUploadStatement = () => {
    toast({
      title: "Upload Bank Statement",
      description: "Feature will be available soon",
    });
  };

  const transactions = [
    {
      id: "1",
      date: "05/11/2024",
      description: "Payment to Vendor A",
      withdrawal: "50000",
      deposit: "",
      ledgerAmount: "50000",
      status: "matched",
    },
    {
      id: "2",
      date: "04/11/2024",
      description: "Receipt from Customer B",
      withdrawal: "",
      deposit: "95000",
      ledgerAmount: "95000",
      status: "matched",
    },
    {
      id: "3",
      date: "03/11/2024",
      description: "Bank Charges",
      withdrawal: "500",
      deposit: "",
      ledgerAmount: "",
      status: "unmatched",
    },
  ];

  const summary = {
    bankBalance: 245500,
    ledgerBalance: 246000,
    difference: -500,
    matchedTransactions: 2,
    unmatchedTransactions: 1,
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Bank Reconciliation</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Match bank statements with ledger entries
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Bank Balance
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">
              ₹{summary.bankBalance.toLocaleString('en-IN')}
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Ledger Balance
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">
              ₹{summary.ledgerBalance.toLocaleString('en-IN')}
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Difference
              </p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">
              ₹{Math.abs(summary.difference).toLocaleString('en-IN')}
            </p>
          </Card>
        </div>

        <Card className="mb-6">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Transactions</h2>
              <Button onClick={handleUploadStatement} data-testid="button-upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload Statement
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Description
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Withdrawal
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Deposit
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Ledger Amount
                  </th>
                  <th className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((txn, idx) => (
                  <tr key={txn.id} className="hover-elevate" data-testid={`transaction-row-${idx}`}>
                    <td className="px-6 py-4 text-sm font-mono text-foreground">{txn.date}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{txn.description}</td>
                    <td className="px-6 py-4 text-right text-sm font-mono text-foreground">
                      {txn.withdrawal ? `₹${parseInt(txn.withdrawal).toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-mono text-foreground">
                      {txn.deposit ? `₹${parseInt(txn.deposit).toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-mono text-foreground">
                      {txn.ledgerAmount ? `₹${parseInt(txn.ledgerAmount).toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={txn.status === 'matched' ? 'default' : 'destructive'}>
                        {txn.status === 'matched' ? (
                          <><CheckCircle2 className="w-3 h-3 mr-1" /> Matched</>
                        ) : (
                          <><AlertCircle className="w-3 h-3 mr-1" /> Unmatched</>
                        )}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <h3 className="text-base font-semibold text-foreground mb-3">Reconciliation Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Matched Transactions:</span>
              <span className="ml-2 font-semibold text-foreground">{summary.matchedTransactions}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Unmatched Transactions:</span>
              <span className="ml-2 font-semibold text-foreground">{summary.unmatchedTransactions}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
