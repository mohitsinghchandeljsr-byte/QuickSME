import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Phone, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Party } from "@shared/schema";

export default function Parties() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: parties, isLoading } = useQuery<Party[]>({
    queryKey: ["/api/parties"],
  });

  const filteredParties = parties?.filter(party =>
    party.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    party.gstin?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Parties</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage customers and vendors
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search parties..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-parties"
              />
            </div>
            <Button data-testid="button-add-party">
              <Plus className="w-4 h-4 mr-2" />
              Add Party
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading parties...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredParties?.map((party, idx) => (
              <Card
                key={party.id}
                className="p-6 hover-elevate active-elevate-2 cursor-pointer"
                onClick={() => console.log(`View party: ${party.name}`)}
                data-testid={`party-card-${idx}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-base font-semibold text-foreground">
                        {party.name}
                      </h3>
                      <Badge variant={party.type === "Customer" ? "default" : "secondary"}>
                        {party.type}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          GSTIN
                        </p>
                        <p className="text-sm font-mono text-foreground">{party.gstin || "N/A"}</p>
                      </div>
                      {party.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <p className="text-sm text-foreground">{party.phone}</p>
                        </div>
                      )}
                      {party.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <p className="text-sm text-foreground">{party.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Outstanding
                    </p>
                    <p
                      className={`text-xl font-mono font-bold ${
                        parseFloat(party.outstanding) >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {parseFloat(party.outstanding) >= 0 ? "+" : ""}₹{Math.abs(parseFloat(party.outstanding)).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
