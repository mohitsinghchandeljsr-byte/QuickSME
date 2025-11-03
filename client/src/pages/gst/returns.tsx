import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, AlertCircle } from "lucide-react";
import { Link } from "wouter";

interface Return {
  name: string;
  description: string;
  dueDate: string;
  status: "filed" | "pending" | "overdue";
  url: string;
}

const returns: Return[] = [
  {
    name: "GSTR-1",
    description: "Details of outward supplies of taxable goods and/or services",
    dueDate: "11th of next month",
    status: "pending",
    url: "/gst/gstr1",
  },
  {
    name: "GSTR-2A",
    description: "Auto-populated purchase details (Read-only)",
    dueDate: "Continuous",
    status: "filed",
    url: "/gst/gstr2a",
  },
  {
    name: "GSTR-2B",
    description: "Auto-generated ITC statement",
    dueDate: "14th of next month",
    status: "filed",
    url: "/gst/gstr2b",
  },
  {
    name: "GSTR-3B",
    description: "Summary return with tax payment",
    dueDate: "20th of next month",
    status: "overdue",
    url: "/gst/gstr3b",
  },
  {
    name: "GSTR-9",
    description: "Annual return",
    dueDate: "31st December (Annual)",
    status: "pending",
    url: "#",
  },
];

export default function FileGSTReturns() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">File GST Returns</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and file your GST returns on time
          </p>
        </div>

        <Card className="p-6 mb-8 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1">Important Reminder</h3>
              <p className="text-sm text-muted-foreground">
                GSTR-3B for current month is overdue. Late filing may attract penalties and interest.
                Please file immediately to avoid complications.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 mb-8">
          {returns.map((returnItem, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{returnItem.name}</h3>
                      <p className="text-sm text-muted-foreground">{returnItem.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Due: {returnItem.dueDate}</span>
                    </div>
                    <Badge
                      variant={
                        returnItem.status === "filed"
                          ? "default"
                          : returnItem.status === "overdue"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {returnItem.status === "filed" ? "Filed" : returnItem.status === "overdue" ? "Overdue" : "Pending"}
                    </Badge>
                  </div>
                </div>

                {returnItem.url !== "#" && (
                  <Button asChild data-testid={`button-view-${returnItem.name.toLowerCase()}`}>
                    <Link href={returnItem.url}>
                      View Details
                    </Link>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Filing Calendar</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 pb-2 border-b border-border">
              <div className="text-xs font-medium uppercase text-muted-foreground">Return</div>
              <div className="text-xs font-medium uppercase text-muted-foreground">Frequency</div>
              <div className="text-xs font-medium uppercase text-muted-foreground">Due Date</div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-foreground">GSTR-1</div>
              <div className="text-muted-foreground">Monthly</div>
              <div className="text-muted-foreground">11th of next month</div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-foreground">GSTR-3B</div>
              <div className="text-muted-foreground">Monthly</div>
              <div className="text-muted-foreground">20th of next month</div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-foreground">GSTR-9</div>
              <div className="text-muted-foreground">Annually</div>
              <div className="text-muted-foreground">31st December</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
