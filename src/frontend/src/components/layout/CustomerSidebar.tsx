import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Palette,
  Store,
  Package,
  User,
  Wallet,
  CreditCard,
  Crown,
  Sparkles,
  WalletCards,
  CheckCircle,
} from "lucide-react";
import { useICPBalance } from "@/hooks/useICPBalance";
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
import { IntelligentPreloader } from "@/components/common/IntelligentPreloader";
import { LoginModal } from "@/components/auth/LoginModal";

interface CustomerSidebarProps {
  activeSection: string;
}

export const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
  activeSection,
}) => {
  const { user, currentWallet } = useAuth();
  const { formattedBalance, isLoading: isBalanceLoading } = useICPBalance();
  const { currentSubscription, currentPlan, isLoading } = useSubscription();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

    if (!currentSubscription || currentSubscription.name === "Free") {
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
        {currentSubscription.name}
      </Badge>
    );
  };

  const getSubscriptionIcon = () => {
    if (isLoading) return null;

    if (
      currentSubscription?.name === "Premium" ||
      currentSubscription?.name === "Enterprise"
    ) {
      return <Crown className="h-3 w-3 text-yellow-500" />;
    }

    if (currentSubscription?.name === "Basic") {
      return <Sparkles className="h-3 w-3 text-blue-500" />;
    }

    return null;
  };

  const renderWalletSection = () => {
    // Debug logging
    console.log("CustomerSidebar - renderWalletSection:", {
      user: !!user,
      currentWallet,
      isConnected: currentWallet?.isConnected
    });

    if (user && currentWallet && currentWallet.isConnected) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Wallet Connected</span>
            <CheckCircle className="h-3 w-3 text-green-500" />
          </div>
          <div className="flex items-center space-x-2 rounded-lg bg-muted/50 p-2">
            <WalletCards className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentWallet.name}</p>
              <p className="text-xs text-muted-foreground">Ready for trading</p>
            </div>
          </div>
          {/* Balance Section */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">ICP Balance</span>
              <div className="text-right">
                <p className="text-sm font-mono font-medium">
                  {isBalanceLoading ? '...' : `${formattedBalance} ICP`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isBalanceLoading ? 'Loading...' : 'Available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (user && (!currentWallet || !currentWallet.isConnected)) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Wallet Status</span>
            <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Connect your wallet to start trading NFTs
          </p>
          <Button 
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </div>
      );
    }

    return (
      <Button 
        onClick={() => setIsLoginModalOpen(true)}
        className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
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
          {currentPlan && currentSubscription?.name !== "Free" && (
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
                    <IntelligentPreloader
                      route={item.id}
                      preloadOnHover={true}
                      preloadOnFocus={true}
                      preloadDelay={50}
                    >
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
                    </IntelligentPreloader>
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
                    <IntelligentPreloader
                      route={item.id}
                      preloadOnHover={true}
                      preloadOnFocus={true}
                      preloadDelay={50}
                    >
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
                    </IntelligentPreloader>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-border border-t">
        <div className="p-4">
          {renderWalletSection()}
        </div>
        
        {/* Login Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </SidebarFooter>
    </Sidebar>
  );
};
