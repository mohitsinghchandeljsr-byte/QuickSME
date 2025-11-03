import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Phone, Mail } from "lucide-react";

export default function Parties() {
  const [searchQuery, setSearchQuery] = useState("");

  const parties = [
    {
      name: "ABC Suppliers",
      type: "Vendor",
      gstin: "24AABCU9603R1ZM",
      phone: "+91 98765 43210",
      email: "contact@abcsuppliers.com",
      outstanding: "-₹45,000",
    },
    {
      name: "XYZ Customer",
      type: "Customer",
      gstin: "27AAPFU0939F1ZV",
      phone: "+91 98765 43211",
      email: "billing@xyzcustomer.com",
      outstanding: "+₹65,000",
    },
    {
      name: "PQR Vendors",
      type: "Vendor",
      gstin: "29AABCT1332L1ZG",
      phone: "+91 98765 43212",
      email: "sales@pqrvendors.com",
      outstanding: "-₹28,500",
    },
    {
      name: "LMN Client",
      type: "Customer",
      gstin: "07AACCI3788N1Z1",
      phone: "+91 98765 43213",
      email: "accounts@lmnclient.com",
      outstanding: "+₹92,000",
    },
  ];

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

        <div className="grid grid-cols-1 gap-4">
          {parties.map((party, idx) => (
            <Card
              key={idx}
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
                      <p className="text-sm font-mono text-foreground">{party.gstin}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <p className="text-sm text-foreground">{party.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      <p className="text-sm text-foreground">{party.email}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Outstanding
                  </p>
                  <p
                    className={`text-xl font-mono font-bold ${
                      party.outstanding.startsWith("+") ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {party.outstanding}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
