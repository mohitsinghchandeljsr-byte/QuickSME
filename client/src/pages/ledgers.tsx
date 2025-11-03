import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";

export default function Ledgers() {
  const [searchQuery, setSearchQuery] = useState("");

  const ledgers = [
    { name: "Cash in Hand", group: "Cash-in-Hand", balance: "₹1,25,000", type: "Dr" },
    { name: "HDFC Bank", group: "Bank Accounts", balance: "₹2,87,500", type: "Dr" },
    { name: "Sales Revenue", group: "Sales Accounts", balance: "₹12,45,000", type: "Cr" },
    { name: "Purchase Account", group: "Purchase Accounts", balance: "₹8,32,500", type: "Dr" },
    { name: "Electricity Expense", group: "Indirect Expenses", balance: "₹15,200", type: "Dr" },
    { name: "Rent Expense", group: "Indirect Expenses", balance: "₹45,000", type: "Dr" },
    { name: "GST Input", group: "Duties & Taxes", balance: "₹62,400", type: "Dr" },
    { name: "GST Output", group: "Duties & Taxes", balance: "₹1,18,800", type: "Cr" },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Ledgers</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Chart of accounts and balances
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search ledgers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-ledgers"
              />
            </div>
            <Button data-testid="button-add-ledger">
              <Plus className="w-4 h-4 mr-2" />
              Add Ledger
            </Button>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Ledger Name
                  </th>
                  <th className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Group
                  </th>
                  <th className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Balance
                  </th>
                  <th className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground px-6 py-3">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ledgers.map((ledger, idx) => (
                  <tr
                    key={idx}
                    className="hover-elevate cursor-pointer"
                    onClick={() => console.log(`View ledger: ${ledger.name}`)}
                    data-testid={`ledger-row-${idx}`}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">{ledger.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">{ledger.group}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-base font-mono font-semibold text-foreground">
                        {ledger.balance}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={ledger.type === "Dr" ? "secondary" : "default"}>
                        {ledger.type}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
