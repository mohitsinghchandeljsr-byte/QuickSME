import { Home, FileText, BarChart3, Users, Building2, Settings } from "lucide-react";
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

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    shortcut: "Alt+D",
  },
  {
    title: "Vouchers",
    url: "/vouchers",
    icon: FileText,
    shortcut: "F2",
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    shortcut: "Alt+R",
  },
  {
    title: "Parties",
    url: "/parties",
    icon: Users,
    shortcut: "Alt+P",
  },
  {
    title: "Ledgers",
    url: "/ledgers",
    icon: Building2,
    shortcut: "Alt+L",
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
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`nav-${item.title.toLowerCase()}`}>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      <span className="ml-auto text-xs font-mono text-muted-foreground">
                        {item.shortcut}
                      </span>
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
                    <span>Settings</span>
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
