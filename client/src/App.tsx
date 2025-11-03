import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Vouchers from "@/pages/vouchers";
import Reports from "@/pages/reports";
import Parties from "@/pages/parties";
import Ledgers from "@/pages/ledgers";

import RevenueForecaster from "@/pages/tools/revenue-forecaster";
import GSTCalculator from "@/pages/tools/gst-calculator";
import Cashflow from "@/pages/tools/cashflow";

import InvoiceTemplate from "@/pages/templates/invoice";
import QuotationGenerator from "@/pages/templates/quotation";
import AccountingTemplates from "@/pages/templates/accounting";

import GSTRegistration from "@/pages/gst/registration";
import FileGSTReturns from "@/pages/gst/returns";
import GSTR1 from "@/pages/gst/gstr1";
import GSTR2A from "@/pages/gst/gstr2a";
import GSTR2B from "@/pages/gst/gstr2b";
import GSTR3B from "@/pages/gst/gstr3b";
import EInvoice from "@/pages/gst/e-invoice";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/vouchers" component={Vouchers} />
      <Route path="/reports" component={Reports} />
      <Route path="/parties" component={Parties} />
      <Route path="/ledgers" component={Ledgers} />
      
      <Route path="/tools/revenue-forecaster" component={RevenueForecaster} />
      <Route path="/tools/gst-calculator" component={GSTCalculator} />
      <Route path="/tools/cashflow" component={Cashflow} />
      
      <Route path="/templates/invoice" component={InvoiceTemplate} />
      <Route path="/templates/quotation" component={QuotationGenerator} />
      <Route path="/templates/accounting" component={AccountingTemplates} />
      
      <Route path="/gst/registration" component={GSTRegistration} />
      <Route path="/gst/returns" component={FileGSTReturns} />
      <Route path="/gst/gstr1" component={GSTR1} />
      <Route path="/gst/gstr2a" component={GSTR2A} />
      <Route path="/gst/gstr2b" component={GSTR2B} />
      <Route path="/gst/gstr3b" component={GSTR3B} />
      <Route path="/gst/e-invoice" component={EInvoice} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "15rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Demo Company Ltd.</span>
                </div>
              </header>
              <main className="flex-1 overflow-hidden">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
