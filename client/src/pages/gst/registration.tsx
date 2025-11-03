import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, FileText, Building2, User, CreditCard } from "lucide-react";

interface Step {
  title: string;
  description: string;
  status: "completed" | "current" | "pending";
}

const steps: Step[] = [
  {
    title: "Determine Eligibility",
    description: "Check if your business requires GST registration based on turnover threshold",
    status: "completed",
  },
  {
    title: "Gather Documents",
    description: "Collect PAN, Aadhaar, business proof, bank account details, and photographs",
    status: "current",
  },
  {
    title: "Fill Application",
    description: "Complete GST REG-01 form on the GST portal with accurate business details",
    status: "pending",
  },
  {
    title: "Submit & Verify",
    description: "Submit application and verify through OTP sent to mobile and email",
    status: "pending",
  },
  {
    title: "Receive GSTIN",
    description: "Get your 15-digit GSTIN within 3-7 working days after approval",
    status: "pending",
  },
];

const documents = [
  {
    category: "Identity Proof",
    icon: User,
    items: ["PAN Card", "Aadhaar Card", "Passport size photograph"],
  },
  {
    category: "Business Proof",
    icon: Building2,
    items: ["Incorporation Certificate", "Partnership Deed", "Proprietorship Declaration", "Electricity Bill"],
  },
  {
    category: "Bank Details",
    icon: CreditCard,
    items: ["Cancelled Cheque", "Bank Statement", "Bank Account Number and IFSC"],
  },
  {
    category: "Address Proof",
    icon: FileText,
    items: ["Rent Agreement", "Ownership Document", "NOC from Owner"],
  },
];

export default function GSTRegistration() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">GST Registration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete guide to register your business for GST
          </p>
        </div>

        <Card className="p-6 mb-8 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <h3 className="text-base font-semibold text-foreground mb-2">Registration Threshold</h3>
          <p className="text-sm text-muted-foreground mb-3">
            GST registration is mandatory if your annual turnover exceeds:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-background rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Normal Category States</p>
              <p className="text-lg font-bold font-mono text-foreground">₹40 Lakhs</p>
            </div>
            <div className="p-3 bg-background rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Special Category States (NE)</p>
              <p className="text-lg font-bold font-mono text-foreground">₹20 Lakhs</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">Registration Process</h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  {step.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  ) : step.status === "current" ? (
                    <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-400 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white" />
                    </div>
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 pb-6 border-b border-border last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-foreground">
                      Step {index + 1}: {step.title}
                    </h3>
                    {step.status === "current" && (
                      <Badge variant="default">In Progress</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Required Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc, index) => (
              <div key={index} className="p-4 bg-muted rounded-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-background rounded-md">
                    <doc.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{doc.category}</h3>
                </div>
                <ul className="space-y-2">
                  {doc.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
