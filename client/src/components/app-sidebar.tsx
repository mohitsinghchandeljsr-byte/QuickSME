import {
  Home,
  FileText,
  BarChart3,
  Users,
  Building2,
  Settings,
  TrendingUp,
  Calculator,
  Wallet,
  FileSpreadsheet,
  Receipt,
  ClipboardList,
  FileCheck,
  FolderOpen,
  Shield,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";

const coreMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Vouchers",
    url: "/vouchers",
    icon: FileText,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Parties",
    url: "/parties",
    icon: Users,
  },
  {
    title: "Ledgers",
    url: "/ledgers",
    icon: Building2,
  },
];

const businessToolsItems = [
  {
    title: "Revenue Forecaster",
    url: "/tools/revenue-forecaster",
    icon: TrendingUp,
  },
  {
    title: "GST Calculator",
    url: "/tools/gst-calculator",
    icon: Calculator,
  },
  {
    title: "Cashflow Generator",
    url: "/tools/cashflow",
    icon: Wallet,
  },
];

const templateItems = [
  {
    title: "Invoice Template",
    url: "/templates/invoice",
    icon: Receipt,
  },
  {
    title: "Quotation Generator",
    url: "/templates/quotation",
    icon: FileSpreadsheet,
  },
  {
    title: "Accounting Templates",
    url: "/templates/accounting",
    icon: ClipboardList,
  },
];

const gstComplianceItems = [
  {
    title: "GST Registration",
    url: "/gst/registration",
    icon: FileCheck,
  },
  {
    title: "File GST Returns",
    url: "/gst/returns",
    icon: FolderOpen,
  },
  {
    title: "GSTR-1",
    url: "/gst/gstr1",
    icon: FileText,
  },
  {
    title: "GSTR-2A Reconciliation",
    url: "/gst/gstr2a",
    icon: FileText,
  },
  {
    title: "GSTR-2B Reconciliation",
    url: "/gst/gstr2b",
    icon: FileText,
  },
  {
    title: "GSTR-3B",
    url: "/gst/gstr3b",
    icon: FileText,
  },
  {
    title: "Generate e-Invoice",
    url: "/gst/e-invoice",
    icon: Shield,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">SME Accounts</h2>
        <p className="text-xs text-muted-foreground">Demo Company Ltd.</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {coreMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Business Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {businessToolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Templates</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {templateItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>GST Compliance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gstComplianceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-testid="nav-settings">
                  <Link href="/settings">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground">FY 2024-25</p>
        <p className="text-xs text-muted-foreground">Apr 2024 - Mar 2025</p>
      </SidebarFooter>
    </Sidebar>
  );
}
