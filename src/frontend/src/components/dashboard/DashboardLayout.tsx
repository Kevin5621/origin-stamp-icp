import React, { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardPage } from "./DashboardPage";
import { ArtSessionsPage } from "./pages/ArtSessionsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SubscriptionPage } from "./pages/SubscriptionPage";
import { UsersPage } from "./pages/UsersPage";

interface DashboardLayoutProps {
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  className,
}) => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case "dashboard":
        return "Dashboard";
      case "sessions":
        return "Art Sessions";
      case "marketplace":
        return "Marketplace";
      case "analytics":
        return "Analytics";
      case "users":
        return "User Management";
      case "subscription":
        return "Subscription";
      case "reports":
        return "Reports";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  const getSectionSubtitle = (section: string) => {
    switch (section) {
      case "dashboard":
        return "Welcome back! Here's what's happening with your OriginStamp platform.";
      case "sessions":
        return "Manage physical art sessions and photo uploads.";
      case "marketplace":
        return "Browse and manage NFT artworks and certificates.";
      case "analytics":
        return "View detailed analytics and performance metrics.";
      case "users":
        return "Manage user accounts and permissions.";
      case "subscription":
        return "Manage subscription plans and billing.";
      case "reports":
        return "Generate and view platform reports.";
      case "settings":
        return "Configure your account and platform preferences.";
      default:
        return "";
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardPage />;
      case "sessions":
        return <ArtSessionsPage />;
      case "marketplace":
        return <MarketplacePage />;
      case "analytics":
        return <AnalyticsPage />;
      case "users":
        return <UsersPage />;
      case "subscription":
        return <SubscriptionPage />;
      case "reports":
        return <ReportsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <SidebarProvider>
      <div className={`bg-background flex min-h-screen ${className || ""}`}>
        <DashboardSidebar
          onSectionChange={handleSectionChange}
          activeSection={activeSection}
        />

        <SidebarInset className="flex-1">
          <DashboardHeader
            title={getSectionTitle(activeSection)}
            subtitle={getSectionSubtitle(activeSection)}
          />

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">{renderContent()}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
