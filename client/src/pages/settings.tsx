import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Save } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState(localStorage.getItem("companyName") || "Demo Company Ltd.");
  const [gstin, setGstin] = useState(localStorage.getItem("companyGstin") || "27AABCU9603R1ZM");
  const [pan, setPan] = useState(localStorage.getItem("companyPan") || "AABCU9603R");
  const [address, setAddress] = useState(localStorage.getItem("companyAddress") || "123 Business Park, Mumbai, Maharashtra 400001");
  const [email, setEmail] = useState(localStorage.getItem("companyEmail") || "info@democompany.com");
  const [phone, setPhone] = useState(localStorage.getItem("companyPhone") || "+91 98765 43210");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("companyName", companyName);
    localStorage.setItem("companyGstin", gstin);
    localStorage.setItem("companyPan", pan);
    localStorage.setItem("companyAddress", address);
    localStorage.setItem("companyEmail", email);
    localStorage.setItem("companyPhone", phone);

    toast({
      title: "Settings Saved",
      description: "Company details updated successfully",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Company Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your company details and preferences
            </p>
          </div>
        </div>

        <div className="max-w-3xl">
          <form onSubmit={handleSave} className="space-y-8">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Company Information</h2>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="companyName" className="text-sm font-medium mb-2 block">
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    data-testid="input-company-name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="gstin" className="text-sm font-medium mb-2 block">
                      GSTIN
                    </Label>
                    <Input
                      id="gstin"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className="font-mono"
                      data-testid="input-gstin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pan" className="text-sm font-medium mb-2 block">
                      PAN
                    </Label>
                    <Input
                      id="pan"
                      value={pan}
                      onChange={(e) => setPan(e.target.value)}
                      className="font-mono"
                      data-testid="input-pan"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm font-medium mb-2 block">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    data-testid="input-address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      data-testid="input-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      data-testid="input-phone"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="submit" data-testid="button-save">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
