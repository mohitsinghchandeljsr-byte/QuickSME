import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandPalette } from "@/components/command-palette";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Vouchers from "@/pages/vouchers";
import StockManagement from "@/pages/stock";
import Reports from "@/pages/reports";
import Parties from "@/pages/parties";
import Ledgers from "@/pages/ledgers";
import Login from "@/pages/login";
import Settings from "@/pages/settings";
import UserManagement from "@/pages/user-management";
import AuditLog from "@/pages/audit-log";

import RevenueForecaster from "@/pages/tools/revenue-forecaster";
import GSTCalculator from "@/pages/tools/gst-calculator";
import Cashflow from "@/pages/tools/cashflow";
import BarcodeScanner from "@/pages/barcode-scanner";
import BackupRestore from "@/pages/backup-restore";
import Notes from "@/pages/notes";
import PurchaseOrders from "@/pages/purchase-orders";
import Expenses from "@/pages/expenses";
import BankReconciliation from "@/pages/bank-reconciliation";
import GitHubIntegration from "@/pages/github-integration";
import Integrations from "@/pages/integrations";
import APIDocs from "@/pages/developer/api-documentation";
import APIKeys from "@/pages/developer/api-keys";
import Webhooks from "@/pages/developer/webhooks";

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
import { useEffect } from "react";

function Router() {
  const [location, setLocation] = useLocation();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    if (!isAuthenticated && location !== "/login") {
      setLocation("/login");
    }
  }, [isAuthenticated, location, setLocation]);

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route component={Login} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Dashboard} />
      <Route path="/vouchers" component={Vouchers} />
      <Route path="/stock" component={StockManagement} />
      <Route path="/reports" component={Reports} />
      <Route path="/parties" component={Parties} />
      <Route path="/ledgers" component={Ledgers} />
      <Route path="/users" component={UserManagement} />
      <Route path="/audit" component={AuditLog} />
      <Route path="/settings" component={Settings} />
      
      <Route path="/tools/revenue-forecaster" component={RevenueForecaster} />
      <Route path="/tools/gst-calculator" component={GSTCalculator} />
      <Route path="/tools/cashflow" component={Cashflow} />
      <Route path="/purchase-orders" component={PurchaseOrders} />
      <Route path="/expenses" component={Expenses} />
      <Route path="/bank-reconciliation" component={BankReconciliation} />
      <Route path="/notes" component={Notes} />
      <Route path="/github" component={GitHubIntegration} />
      <Route path="/integrations" component={Integrations} />
      <Route path="/developer/api-docs" component={APIDocs} />
      <Route path="/developer/api-keys" component={APIKeys} />
      <Route path="/developer/webhooks" component={Webhooks} />
      <Route path="/barcode-scanner" component={BarcodeScanner} />
      <Route path="/backup-restore" component={BackupRestore} />
      
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

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <CommandPalette />
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
                <div className="flex items-center gap-4">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <button
                    onClick={() => {
                      const event = new KeyboardEvent('keydown', {
                        key: 'k',
                        metaKey: true,
                        ctrlKey: true,
                      });
                      document.dispatchEvent(event);
                    }}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted hover-elevate rounded-md text-xs text-muted-foreground"
                    data-testid="button-command-palette"
                  >
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
                      ⌘K
                    </kbd>
                    <span>Quick navigation</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{localStorage.getItem("companyName") || "Demo Company Ltd."}</span>
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
