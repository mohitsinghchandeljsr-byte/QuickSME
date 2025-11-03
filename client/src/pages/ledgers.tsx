import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Ledger } from "@shared/schema";

export default function Ledgers() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: ledgers, isLoading } = useQuery<Ledger[]>({
    queryKey: ["/api/ledgers"],
  });

  const filteredLedgers = ledgers?.filter(ledger =>
    ledger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ledger.group.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading ledgers...</p>
          </div>
        ) : (
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
                  {filteredLedgers?.map((ledger, idx) => (
                    <tr
                      key={ledger.id}
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
                          ₹{parseFloat(ledger.balance).toLocaleString('en-IN')}
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
        )}
      </div>
    </div>
  );
}
