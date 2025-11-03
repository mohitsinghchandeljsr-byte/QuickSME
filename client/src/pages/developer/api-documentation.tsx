import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function APIDocs() {
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(label);
    toast({
      title: "Copied to clipboard",
      description: `${label} copied successfully`,
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = [
    {
      method: "GET",
      path: "/api/vouchers",
      description: "List all vouchers",
      response: `[
  {
    "id": "uuid",
    "voucherNumber": "VCH-001",
    "type": "payment",
    "date": "2024-11-03",
    "partyId": "uuid",
    "amount": "50000",
    "narration": "Payment for supplies"
  }
]`,
    },
    {
      method: "POST",
      path: "/api/vouchers",
      description: "Create a new voucher",
      request: `{
  "type": "payment",
  "date": "2024-11-03",
  "partyId": "uuid",
  "amount": "50000",
  "narration": "Payment description"
}`,
      response: `{
  "id": "uuid",
  "voucherNumber": "VCH-002",
  "type": "payment",
  "date": "2024-11-03",
  "amount": "50000"
}`,
    },
    {
      method: "GET",
      path: "/api/parties",
      description: "List all parties (customers/vendors)",
      response: `[
  {
    "id": "uuid",
    "name": "ABC Suppliers",
    "type": "vendor",
    "gstin": "29ABCDE1234F1Z5",
    "contactPerson": "John Doe",
    "email": "john@abc.com"
  }
]`,
    },
    {
      method: "GET",
      path: "/api/ledgers",
      description: "List all ledgers",
      response: `[
  {
    "id": "uuid",
    "name": "Cash",
    "type": "Dr",
    "balance": "500000"
  }
]`,
    },
    {
      method: "GET",
      path: "/api/stock",
      description: "List all stock items",
      response: `[
  {
    "id": "uuid",
    "name": "Product A",
    "quantity": 100,
    "unit": "pcs",
    "price": "500",
    "hsnCode": "1234",
    "reorderLevel": 20
  }
]`,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <Code className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">API Documentation</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Build apps and integrations on top of SME Accounts
            </p>
          </div>
        </div>

        <Tabs defaultValue="rest" className="mb-8">
          <TabsList>
            <TabsTrigger value="rest">REST API</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
          </TabsList>

          <TabsContent value="rest" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Getting Started</h2>
              <p className="text-sm text-muted-foreground mb-4">
                All API requests must include your API key in the Authorization header:
              </p>
              <div className="bg-muted p-4 rounded-md relative">
                <code className="text-sm font-mono text-foreground">
                  Authorization: Bearer YOUR_API_KEY
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => copyCode("Authorization: Bearer YOUR_API_KEY", "Header")}
                >
                  {copiedCode === "Header" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Base URL</h2>
              <div className="bg-muted p-4 rounded-md">
                <code className="text-sm font-mono text-foreground">
                  https://your-domain.replit.app
                </code>
              </div>
            </Card>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Endpoints</h2>
              {endpoints.map((endpoint, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant={endpoint.method === "GET" ? "default" : "secondary"}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{endpoint.description}</p>
                  
                  {endpoint.request && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-foreground uppercase">Request Body</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyCode(endpoint.request!, "Request")}
                        >
                          {copiedCode === "Request" ? (
                            <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3 mr-1" />
                          )}
                          Copy
                        </Button>
                      </div>
                      <div className="bg-muted p-4 rounded-md overflow-x-auto">
                        <pre className="text-xs font-mono text-foreground">{endpoint.request}</pre>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-foreground uppercase">Response</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyCode(endpoint.response, `Response ${idx}`)}
                      >
                        {copiedCode === `Response ${idx}` ? (
                          <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 mr-1" />
                        )}
                        Copy
                      </Button>
                    </div>
                    <div className="bg-muted p-4 rounded-md overflow-x-auto">
                      <pre className="text-xs font-mono text-foreground">{endpoint.response}</pre>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <h3 className="text-base font-semibold text-foreground mb-2">Rate Limits</h3>
              <p className="text-sm text-muted-foreground">
                API requests are limited to 1000 requests per hour per API key. Rate limit headers are included in all responses.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Webhook Events</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Subscribe to events in your account to receive real-time notifications.
              </p>
              <div className="space-y-4">
                {["voucher.created", "voucher.updated", "party.created", "stock.low"].map((event) => (
                  <div key={event} className="flex items-center justify-between p-4 border border-border rounded-md">
                    <code className="text-sm font-mono text-foreground">{event}</code>
                    <Badge>Available</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Webhook Payload Example</h2>
              <div className="bg-muted p-4 rounded-md overflow-x-auto">
                <pre className="text-xs font-mono text-foreground">{`{
  "event": "voucher.created",
  "timestamp": "2024-11-03T10:30:00Z",
  "data": {
    "id": "uuid",
    "voucherNumber": "VCH-001",
    "type": "payment",
    "amount": "50000"
  }
}`}</pre>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="auth" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">API Key Authentication</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Generate API keys from the Developer Portal to authenticate your requests.
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-foreground uppercase mb-2">Step 1: Generate API Key</p>
                  <p className="text-sm text-muted-foreground">
                    Navigate to Developer Portal → API Keys and click "Generate New Key"
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground uppercase mb-2">Step 2: Include in Requests</p>
                  <div className="bg-muted p-4 rounded-md">
                    <code className="text-sm font-mono text-foreground">
                      curl -H "Authorization: Bearer sk_live_..." https://your-domain.replit.app/api/vouchers
                    </code>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground uppercase mb-2">Step 3: Secure Your Keys</p>
                  <p className="text-sm text-muted-foreground">
                    Never commit API keys to version control. Use environment variables in production.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <h3 className="text-base font-semibold text-foreground mb-2">Security Best Practices</h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Rotate API keys regularly</li>
                <li>Use different keys for development and production</li>
                <li>Revoke unused or compromised keys immediately</li>
                <li>Monitor API usage for suspicious activity</li>
              </ul>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
