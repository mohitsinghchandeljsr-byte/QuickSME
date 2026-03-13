import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Key, Plus, Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ApiKey } from "@shared/schema";

type ApiKeyWithFullKey = ApiKey & { fullKey?: string };

export default function APIKeys() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [keyPrefix, setKeyPrefix] = useState("sk_live");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  const { data: apiKeys = [], isLoading } = useQuery<ApiKeyWithFullKey[]>({
    queryKey: ["/api/api-keys"],
  });

  const createKeyMutation = useMutation({
    mutationFn: async (data: { name: string; keyPrefix: string }) => {
      return apiRequest<ApiKeyWithFullKey>("POST", "/api/api-keys", data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/api-keys"] });
      setNewlyCreatedKey(data.fullKey || null);
      toast({
        title: "API Key Generated",
        description: `New key "${newKeyName}" created successfully. Make sure to copy it now!`,
      });
      setNewKeyName("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate API key",
        variant: "destructive",
      });
    },
  });

  const revokeKeyMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/api-keys/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/api-keys"] });
      toast({
        title: "API Key Revoked",
        description: "The API key has been revoked successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive",
      });
    },
  });

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key",
        variant: "destructive",
      });
      return;
    }
    createKeyMutation.mutate({ name: newKeyName, keyPrefix });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied to clipboard",
      description: "API key copied successfully",
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewlyCreatedKey(null);
    setNewKeyName("");
    setKeyPrefix("sk_live");
  };

  const maskKey = (prefix: string, lastFour: string) => {
    return `${prefix}_${"*".repeat(20)}${lastFour}`;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString('en-GB');
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center gap-2">
          <Key className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading API keys...</p>
        </div>
      </div>
    );
  }

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
            <DialogContent onPointerDownOutside={(e) => newlyCreatedKey && e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>{newlyCreatedKey ? "API Key Created" : "Generate API Key"}</DialogTitle>
                <DialogDescription>
                  {newlyCreatedKey
                    ? "Copy your API key now. You won't be able to see it again!"
                    : "Create a new API key for programmatic access"}
                </DialogDescription>
              </DialogHeader>
              {newlyCreatedKey ? (
                <div className="space-y-4">
                  <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 rounded-md">
                    <p className="text-sm font-semibold text-foreground mb-2">⚠️ Important</p>
                    <p className="text-sm text-muted-foreground">
                      Make sure to copy your API key now. You won't be able to see it again!
                    </p>
                  </div>
                  <div className="bg-muted p-4 rounded-md flex items-center gap-2">
                    <code className="text-sm font-mono text-foreground flex-1 break-all">{newlyCreatedKey}</code>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 flex-shrink-0"
                      onClick={() => copyKey(newlyCreatedKey)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button onClick={handleCloseDialog} className="w-full">
                    Done
                  </Button>
                </div>
              ) : (
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
                  <div>
                    <label className="text-sm font-medium">Key Type</label>
                    <Select value={keyPrefix} onValueChange={setKeyPrefix}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sk_live">Production (sk_live)</SelectItem>
                        <SelectItem value="sk_test">Test (sk_test)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use test keys for development
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerateKey}
                    className="w-full"
                    data-testid="button-create-key"
                    disabled={createKeyMutation.isPending}
                  >
                    {createKeyMutation.isPending ? "Creating..." : "Create API Key"}
                  </Button>
                </div>
              )}
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
          {apiKeys.length === 0 ? (
            <Card className="p-8 text-center">
              <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No API Keys Yet</h3>
              <p className="text-sm text-muted-foreground">
                Generate your first API key to start building integrations
              </p>
            </Card>
          ) : (
            apiKeys.map((apiKey, idx) => (
              <Card key={apiKey.id} className="p-6" data-testid={`api-key-card-${idx}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{apiKey.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {formatDate(apiKey.createdAt)} • Last used {formatDate(apiKey.lastUsedAt)}
                    </p>
                  </div>
                  <Badge variant={apiKey.keyPrefix === "sk_live" ? "default" : "secondary"}>
                    {apiKey.keyPrefix === "sk_live" ? "Production" : "Test"}
                  </Badge>
                </div>

                <div className="bg-muted p-4 rounded-md mb-4 flex items-center gap-2">
                  <code className="text-sm font-mono text-foreground flex-1">
                    {maskKey(apiKey.keyPrefix, apiKey.lastFour)}
                  </code>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{apiKey.requestCount.toLocaleString()}</span> requests
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    data-testid={`button-revoke-${idx}`}
                    onClick={() => revokeKeyMutation.mutate(apiKey.id)}
                    disabled={revokeKeyMutation.isPending}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Revoke
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {apiKeys.length > 0 && (
          <Card className="mt-6 p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">API Usage Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Total Requests</p>
                <p className="text-2xl font-bold font-mono text-foreground">
                  {apiKeys.reduce((sum, key) => sum + key.requestCount, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Active Keys</p>
                <p className="text-2xl font-bold font-mono text-foreground">{apiKeys.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Rate Limit</p>
                <p className="text-2xl font-bold font-mono text-foreground">1,000/hr</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
