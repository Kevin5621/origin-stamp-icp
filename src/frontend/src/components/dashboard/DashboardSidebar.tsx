import React from "react";
import {
  LayoutDashboard,
  Palette,
  CreditCard,
  Store,
  Settings,
  Users,
  BarChart3,
  FileText,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardSidebarProps {
  onSectionChange: (sectionId: string) => void;
  activeSection: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  onSectionChange,
  activeSection,
}) => {
  const mainMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "sessions", label: "Art Sessions", icon: Palette },
    { id: "marketplace", label: "Marketplace", icon: Store },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const managementItems = [
    { id: "users", label: "Users", icon: Users },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <Sidebar variant="inset" className="border-border border-r">
      <SidebarHeader className="border-border border-b">
        <div className="flex items-center gap-2 px-4 py-2">
          <Avatar className="bg-primary h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              OS
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-foreground text-sm font-semibold">
              OriginStamp
            </h2>
            <p className="text-muted-foreground text-xs">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionChange(item.id)}
                      isActive={activeSection === item.id}
                      className="w-full"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionChange(item.id)}
                      isActive={activeSection === item.id}
                      className="w-full"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-border border-t">
        <div className="p-4">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Preferences
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
