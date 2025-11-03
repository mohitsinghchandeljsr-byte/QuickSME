import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Home,
  FileText,
  BarChart3,
  Users,
  Building2,
  Package,
  Settings,
  TrendingUp,
  Calculator,
  Wallet,
  Receipt,
  ClipboardList,
  FileCheck,
  FolderOpen,
  Shield,
  UserCheck,
  ScrollText,
  Scan,
  Database,
  Plus,
  StickyNote,
  Github,
  Blocks,
  Code,
  Key,
  Webhook,
  Bot,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      
      if (e.key === "n" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        setLocation("/vouchers");
      }
      
      if (e.key === "s" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        setLocation("/stock");
      }
      
      if (e.key === "r" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        setLocation("/reports");
      }
      
      if (e.key === "p" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        setLocation("/parties");
      }
      
      if (e.key === "b" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        setLocation("/barcode-scanner");
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setLocation]);

  const navigate = (url: string) => {
    setLocation(url);
    setOpen(false);
  };

  const commands = [
    {
      group: "Navigation",
      items: [
        { name: "Dashboard", icon: Home, url: "/", shortcut: "" },
        { name: "AIassist", icon: Bot, url: "/ai-assistant", shortcut: "" },
        { name: "Vouchers", icon: FileText, url: "/vouchers", shortcut: "⌘⇧N" },
        { name: "Stock Management", icon: Package, url: "/stock", shortcut: "⌘⇧S" },
        { name: "Reports", icon: BarChart3, url: "/reports", shortcut: "⌘⇧R" },
        { name: "Parties", icon: Users, url: "/parties", shortcut: "⌘⇧P" },
        { name: "Ledgers", icon: Building2, url: "/ledgers", shortcut: "" },
        { name: "User Management", icon: UserCheck, url: "/users", shortcut: "" },
        { name: "Audit Log", icon: ScrollText, url: "/audit", shortcut: "" },
      ],
    },
    {
      group: "Business Tools",
      items: [
        { name: "Revenue Forecaster", icon: TrendingUp, url: "/tools/revenue-forecaster", shortcut: "" },
        { name: "GST Calculator", icon: Calculator, url: "/tools/gst-calculator", shortcut: "" },
        { name: "Cashflow Analyzer", icon: Wallet, url: "/tools/cashflow", shortcut: "" },
      ],
    },
    {
      group: "Templates",
      items: [
        { name: "Invoice Generator", icon: Receipt, url: "/templates/invoice", shortcut: "" },
        { name: "Quotation Generator", icon: ClipboardList, url: "/templates/quotation", shortcut: "" },
      ],
    },
    {
      group: "GST Compliance",
      items: [
        { name: "GST Registration", icon: FileCheck, url: "/gst/registration", shortcut: "" },
        { name: "File GST Returns", icon: FolderOpen, url: "/gst/returns", shortcut: "" },
        { name: "Generate e-Invoice", icon: Shield, url: "/gst/e-invoice", shortcut: "" },
      ],
    },
    {
      group: "Integrations",
      items: [
        { name: "All Integrations", icon: Blocks, url: "/integrations", shortcut: "" },
        { name: "GitHub", icon: Github, url: "/github", shortcut: "" },
      ],
    },
    {
      group: "Developer",
      items: [
        { name: "API Documentation", icon: Code, url: "/developer/api-docs", shortcut: "" },
        { name: "API Keys", icon: Key, url: "/developer/api-keys", shortcut: "" },
        { name: "Webhooks", icon: Webhook, url: "/developer/webhooks", shortcut: "" },
      ],
    },
    {
      group: "Miscellaneous",
      items: [
        { name: "Notes", icon: StickyNote, url: "/notes", shortcut: "" },
        { name: "Barcode Scanner", icon: Scan, url: "/barcode-scanner", shortcut: "⌘⇧B" },
        { name: "Backup & Restore", icon: Database, url: "/backup-restore", shortcut: "" },
      ],
    },
    {
      group: "Quick Actions",
      items: [
        { name: "Create New Voucher", icon: Plus, url: "/vouchers", shortcut: "⌘⇧N" },
        { name: "Add Stock Item", icon: Plus, url: "/stock", shortcut: "⌘⇧S" },
        { name: "Add Party", icon: Plus, url: "/parties", shortcut: "⌘⇧P" },
      ],
    },
    {
      group: "Settings",
      items: [
        { name: "Company Settings", icon: Settings, url: "/settings", shortcut: "" },
      ],
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Command Palette</DialogTitle>
      <DialogDescription className="sr-only">
        Quick navigation and actions
      </DialogDescription>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commands.map((group) => (
          <div key={group.group}>
            <CommandGroup heading={group.group}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.name}
                    onSelect={() => navigate(item.url)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.shortcut && (
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        {item.shortcut}
                      </kbd>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
