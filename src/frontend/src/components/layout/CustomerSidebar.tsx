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
  CreditCard,
  Crown,
  Sparkles,
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface CustomerSidebarProps {
  activeSection: string;
}

export const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
  activeSection,
}) => {
  const { user } = useAuth();
  const { currentSubscription, currentPlan, isLoading } = useSubscription();

  const mainMenuItems = [
    { id: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "/dashboard/marketplace", label: "Marketplace", icon: Store },
    { id: "/dashboard/sessions", label: "My Art Sessions", icon: Palette },
    { id: "/dashboard/collection", label: "My Collection", icon: Package },
  ];

  const accountItems = [
    { id: "/dashboard/profile", label: "My Profile", icon: User },
    { id: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
  ];

  const getSubscriptionBadge = () => {
    if (isLoading) {
      return (
        <Badge variant="secondary" className="text-xs">
          Loading...
        </Badge>
      );
    }

    if (!currentSubscription || currentSubscription === "Free") {
      return (
        <Badge variant="outline" className="text-xs">
          Free
        </Badge>
      );
    }

    const isPopular = currentPlan?.popular;
    return (
      <Badge variant={isPopular ? "default" : "secondary"} className="text-xs">
        {isPopular && <Crown className="mr-1 h-3 w-3" />}
        {currentSubscription}
      </Badge>
    );
  };

  const getSubscriptionIcon = () => {
    if (isLoading) return null;

    if (
      currentSubscription === "Premium" ||
      currentSubscription === "Enterprise"
    ) {
      return <Crown className="h-3 w-3 text-yellow-500" />;
    }

    if (currentSubscription === "Basic") {
      return <Sparkles className="h-3 w-3 text-blue-500" />;
    }

    return null;
  };

  return (
    <Sidebar
      variant="inset"
      className="border-border w-64 flex-shrink-0 border-r"
    >
      <SidebarHeader className="border-border border-b">
        <div className="flex items-center gap-2 px-4 py-2">
          <Avatar className="bg-primary h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              OS
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-foreground text-sm font-semibold">
              OriginStamp
            </h2>
            <p className="text-muted-foreground text-xs">
              Welcome, {user?.username || "Artist"}
            </p>
          </div>
          {getSubscriptionIcon()}
        </div>

        {/* Subscription Status */}
        <div className="px-4 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">Plan:</span>
            {getSubscriptionBadge()}
          </div>
          {currentPlan && currentSubscription !== "Free" && (
            <p className="text-muted-foreground mt-1 text-xs">
              {currentPlan.limits.max_photos} photos •{" "}
              {currentPlan.limits.max_file_size_mb}MB files
            </p>
          )}
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
        <div className="p-4">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
