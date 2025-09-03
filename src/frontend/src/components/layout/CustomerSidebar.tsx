import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Palette,
  Store,
  Package,
  User,
  Heart,
  Wallet,
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
import { useAuth } from "@/contexts/AuthContext";

interface CustomerSidebarProps {
  activeSection: string;
}

export const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
  activeSection,
}) => {
  const { user } = useAuth();

  const mainMenuItems = [
    { id: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "/dashboard/marketplace", label: "Marketplace", icon: Store },
    { id: "/dashboard/sessions", label: "My Art Sessions", icon: Palette },
    { id: "/dashboard/collection", label: "My Collection", icon: Package },
  ];

  const accountItems = [
    { id: "/dashboard/profile", label: "My Profile", icon: User },
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
            <p className="text-muted-foreground text-xs">
              Welcome, {user?.username || "Artist"}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeSection === item.id}
                      className="w-full"
                    >
                      <Link href={item.id}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeSection === item.id}
                      className="w-full"
                    >
                      <Link href={item.id}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-border border-t">
        <div className="space-y-2 p-4">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Heart className="mr-2 h-4 w-4" />
            Support
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
