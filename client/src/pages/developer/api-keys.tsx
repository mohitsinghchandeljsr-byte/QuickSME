import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Key, Plus, Copy, Trash2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function APIKeys() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [newKeyName, setNewKeyName] = useState("");

  const [apiKeys] = useState([
    {
      id: "1",
      name: "Production API",
      key: "sk_live_AbCdEf123456789XyZ",
      created: "2024-11-01",
      lastUsed: "2024-11-03",
      requests: 15234,
    },
    {
      id: "2",
      name: "Development",
      key: "sk_test_123456789AbCdEfXyZ",
      created: "2024-10-15",
      lastUsed: "2024-11-02",
      requests: 8421,
    },
  ]);

  const handleGenerateKey = () => {
    toast({
      title: "API Key Generated",
      description: `New key "${newKeyName}" created successfully`,
    });
    setIsDialogOpen(false);
    setNewKeyName("");
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied to clipboard",
      description: "API key copied successfully",
    });
  };

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + "..." + key.substring(key.length - 4);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Key className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl font-semibold text-foreground">API Keys</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage API keys for programmatic access to your account
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-generate-key">
                <Plus className="w-4 h-4 mr-2" />
                Generate New Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate API Key</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Key Name</label>
                  <Input
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production API, Mobile App"
                    data-testid="input-key-name"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose a descriptive name to identify this key
                  </p>
                </div>
                <Button onClick={handleGenerateKey} className="w-full" data-testid="button-create-key">
                  Create API Key
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 p-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <h3 className="text-base font-semibold text-foreground mb-2">Security Warning</h3>
          <p className="text-sm text-muted-foreground">
            API keys have full access to your account. Keep them secure and never share them publicly. If a key is compromised, revoke it immediately.
          </p>
        </Card>

        <div className="space-y-4">
          {apiKeys.map((apiKey, idx) => (
            <Card key={apiKey.id} className="p-6" data-testid={`api-key-card-${idx}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{apiKey.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created {apiKey.created} • Last used {apiKey.lastUsed}
                  </p>
                </div>
                <Badge variant={apiKey.key.startsWith("sk_live") ? "default" : "secondary"}>
                  {apiKey.key.startsWith("sk_live") ? "Production" : "Test"}
                </Badge>
              </div>

              <div className="bg-muted p-4 rounded-md mb-4 flex items-center gap-2">
                <code className="text-sm font-mono text-foreground flex-1">
                  {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => toggleKeyVisibility(apiKey.id)}
                  data-testid={`button-toggle-${idx}`}
                >
                  {showKeys[apiKey.id] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => copyKey(apiKey.key)}
                  data-testid={`button-copy-${idx}`}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{apiKey.requests.toLocaleString()}</span> requests
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  data-testid={`button-revoke-${idx}`}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Revoke
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">API Usage Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">Total Requests</p>
              <p className="text-2xl font-bold font-mono text-foreground">23,655</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">This Month</p>
              <p className="text-2xl font-bold font-mono text-foreground">8,234</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">Rate Limit</p>
              <p className="text-2xl font-bold font-mono text-foreground">1,000/hr</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
