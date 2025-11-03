import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Zap } from "lucide-react";
import { useLocation } from "wouter";

interface Template {
  name: string;
  description: string;
  voucherType: string;
  category: string;
}

const templates: Template[] = [
  {
    name: "Salary Payment",
    description: "Record monthly salary payments to employees",
    voucherType: "payment",
    category: "Payroll",
  },
  {
    name: "Rent Payment",
    description: "Monthly rent payment voucher",
    voucherType: "payment",
    category: "Expenses",
  },
  {
    name: "Electricity Bill",
    description: "Utility bill payment template",
    voucherType: "payment",
    category: "Expenses",
  },
  {
    name: "Customer Receipt",
    description: "Receive payment from customers",
    voucherType: "receipt",
    category: "Income",
  },
  {
    name: "Sales Invoice",
    description: "Generate sales invoice with GST",
    voucherType: "sales",
    category: "Income",
  },
  {
    name: "Purchase Bill",
    description: "Record supplier purchase bills",
    voucherType: "purchase",
    category: "Expenses",
  },
  {
    name: "Bank to Cash Transfer",
    description: "Withdraw cash from bank account",
    voucherType: "contra",
    category: "Banking",
  },
  {
    name: "Cash to Bank Deposit",
    description: "Deposit cash into bank account",
    voucherType: "contra",
    category: "Banking",
  },
  {
    name: "Depreciation Entry",
    description: "Monthly depreciation journal entry",
    voucherType: "journal",
    category: "Adjustments",
  },
  {
    name: "Bad Debt Write-off",
    description: "Write off uncollectible receivables",
    voucherType: "journal",
    category: "Adjustments",
  },
];

export default function AccountingTemplates() {
  const [, setLocation] = useLocation();

  const handleUseTemplate = (template: Template) => {
    setLocation('/vouchers');
  };

  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Accounting Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quick-start templates for common accounting transactions
          </p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates
                .filter(t => t.category === category)
                .map((template, idx) => (
                  <Card
                    key={idx}
                    className="p-6 hover-elevate active-elevate-2 cursor-pointer"
                    onClick={() => handleUseTemplate(template)}
                    data-testid={`template-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-foreground mb-1">
                          {template.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {template.voucherType}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {template.description}
                    </p>
                    <Button size="sm" className="w-full" data-testid={`button-use-template-${idx}`}>
                      <Zap className="w-3 h-3 mr-2" />
                      Use Template
                    </Button>
                  </Card>
                ))}
            </div>
          </div>
        ))}

        <Card className="p-6 bg-muted">
          <div className="flex items-start gap-4">
            <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Speed up your workflow
              </h3>
              <p className="text-sm text-muted-foreground">
                Templates pre-fill common fields and apply default settings, saving you time on repetitive entries.
                Click any template to start creating a voucher with pre-configured settings.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
