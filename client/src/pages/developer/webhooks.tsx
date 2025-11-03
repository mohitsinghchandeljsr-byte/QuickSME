import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Webhook, Plus, Trash2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Webhooks() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const events = [
    { id: "voucher.created", label: "Voucher Created", description: "When a new voucher is created" },
    { id: "voucher.updated", label: "Voucher Updated", description: "When a voucher is modified" },
    { id: "voucher.deleted", label: "Voucher Deleted", description: "When a voucher is deleted" },
    { id: "party.created", label: "Party Created", description: "When a new party is added" },
    { id: "party.updated", label: "Party Updated", description: "When party details are changed" },
    { id: "stock.low", label: "Stock Low", description: "When stock falls below reorder level" },
    { id: "stock.updated", label: "Stock Updated", description: "When stock quantity changes" },
  ];

  const [webhooks] = useState([
    {
      id: "1",
      url: "https://api.example.com/webhook",
      events: ["voucher.created", "voucher.updated"],
      status: "active",
      lastDelivery: "2024-11-03T10:30:00Z",
      successRate: 98.5,
    },
    {
      id: "2",
      url: "https://hooks.slack.com/services/...",
      events: ["stock.low"],
      status: "active",
      lastDelivery: "2024-11-02T15:45:00Z",
      successRate: 100,
    },
  ]);

  const handleCreateWebhook = () => {
    toast({
      title: "Webhook Created",
      description: `Webhook configured for ${selectedEvents.length} events`,
    });
    setIsDialogOpen(false);
    setWebhookUrl("");
    setSelectedEvents([]);
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Webhook className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Webhooks</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Receive real-time notifications when events occur in your account
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-webhook">
                <Plus className="w-4 h-4 mr-2" />
                Create Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Webhook</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Webhook URL</label>
                  <Input
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-domain.com/webhook"
                    data-testid="input-webhook-url"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The URL where webhook payloads will be delivered
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-3 block">Select Events</label>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {events.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-3 border border-border rounded-md">
                        <Checkbox
                          checked={selectedEvents.includes(event.id)}
                          onCheckedChange={() => toggleEvent(event.id)}
                          data-testid={`checkbox-${event.id}`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{event.label}</p>
                          <p className="text-xs text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button 
                  onClick={handleCreateWebhook} 
                  className="w-full"
                  disabled={!webhookUrl || selectedEvents.length === 0}
                  data-testid="button-submit"
                >
                  Create Webhook
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-6 p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <h3 className="text-base font-semibold text-foreground mb-2">How Webhooks Work</h3>
          <p className="text-sm text-muted-foreground">
            When an event occurs, we'll send an HTTP POST request to your configured URL with the event data. 
            Your endpoint should respond with a 2xx status code to acknowledge receipt.
          </p>
        </Card>

        <div className="space-y-4">
          {webhooks.map((webhook, idx) => (
            <Card key={webhook.id} className="p-6" data-testid={`webhook-card-${idx}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-sm font-mono text-foreground">{webhook.url}</code>
                    <Badge variant={webhook.status === "active" ? "default" : "secondary"}>
                      {webhook.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="secondary" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last delivery: {new Date(webhook.lastDelivery).toLocaleString('en-GB')}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  data-testid={`button-delete-${idx}`}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                  <p className="text-sm font-semibold text-foreground">{webhook.successRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Events</p>
                  <p className="text-sm font-semibold text-foreground">{webhook.events.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="text-sm font-semibold text-green-600">Operational</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Webhook Delivery Logs</h3>
          <div className="space-y-3">
            {[
              { event: "voucher.created", status: "success", time: "2024-11-03T10:30:00Z" },
              { event: "stock.low", status: "success", time: "2024-11-03T09:15:00Z" },
              { event: "voucher.updated", status: "failed", time: "2024-11-03T08:45:00Z" },
            ].map((log, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-md">
                <div className="flex items-center gap-3">
                  {log.status === "success" ? (
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  )}
                  <code className="text-sm font-mono text-foreground">{log.event}</code>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(log.time).toLocaleString('en-GB')}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
