import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Blocks, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import { SiNotion, SiTrello, SiEvernote, SiGithub } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

export default function Integrations() {
  const { toast } = useToast();

  const handleConnect = (name: string) => {
    toast({
      title: "Integration",
      description: `Opening ${name} connection dialog...`,
    });
  };

  const integrations = [
    {
      name: "GitHub",
      icon: SiGithub,
      description: "Backup accounting data and sync with repositories",
      status: "connected",
      category: "Version Control",
    },
    {
      name: "Notion",
      icon: SiNotion,
      description: "Sync notes and documents with Notion workspace",
      status: "available",
      category: "Productivity",
    },
    {
      name: "Trello",
      icon: SiTrello,
      description: "Create cards from vouchers and track financial tasks",
      status: "available",
      category: "Project Management",
    },
    {
      name: "Evernote",
      icon: SiEvernote,
      description: "Export notes and receipts to Evernote notebooks",
      status: "available",
      category: "Note Taking",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <Blocks className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Integrations</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Connect SME Accounts with your favorite tools
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {integrations.map((integration, idx) => {
            const Icon = integration.icon;
            return (
              <Card key={integration.name} className="p-6 hover-elevate" data-testid={`integration-card-${idx}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{integration.name}</h3>
                      <p className="text-xs text-muted-foreground">{integration.category}</p>
                    </div>
                  </div>
                  {integration.status === "connected" ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Available</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                {integration.status === "connected" ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" data-testid={`button-configure-${idx}`}>
                      Configure
                    </Button>
                    <Button size="sm" variant="outline" data-testid={`button-disconnect-${idx}`}>
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleConnect(integration.name)}
                    data-testid={`button-connect-${idx}`}
                  >
                    Connect {integration.name}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Integration Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <SiNotion className="w-4 h-4" />
                Notion
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Sync accounting notes to Notion databases</li>
                <li>Create invoices from Notion templates</li>
                <li>Track financial tasks in Notion boards</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <SiTrello className="w-4 h-4" />
                Trello
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Convert vouchers into Trello cards</li>
                <li>Track payment due dates on boards</li>
                <li>Manage vendor relationships</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <SiEvernote className="w-4 h-4" />
                Evernote
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Export receipts and invoices</li>
                <li>Archive financial documents</li>
                <li>Sync accounting reminders</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <SiGithub className="w-4 h-4" />
                GitHub
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Version control for accounting data</li>
                <li>Automated backups to repositories</li>
                <li>Collaborate on financial reports</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">Need a Custom Integration?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use our Developer API to build custom integrations with any tool. Visit the Developer Portal to get started with API keys and webhooks.
              </p>
              <Button size="sm" variant="outline" asChild>
                <a href="/developer/api-docs">
                  View API Documentation
                  <ExternalLink className="w-3 h-3 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
