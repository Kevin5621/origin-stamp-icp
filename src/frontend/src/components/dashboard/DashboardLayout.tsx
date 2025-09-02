import React, { useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import { DashboardPage } from "./DashboardPage";

interface DashboardLayoutProps {
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  className,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <div className={`bg-background min-h-screen ${className || ""}`}>
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        onSectionChange={handleSectionChange}
        variant="dashboard"
      />

      {/* Main Content */}
      <div
        className={`layout-with-sidebar ${isCollapsed ? "layout-with-sidebar--collapsed" : ""}`}
      >
        <div className="layout-content-wrapper">
          <main className="flex-1 overflow-auto">
            {activeSection === "dashboard" && <DashboardPage />}
            {activeSection === "session" && (
              <div className="p-6">
                <h1 className="text-foreground text-3xl font-bold">
                  Art Sessions
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage your physical art sessions here.
                </p>
              </div>
            )}
            {activeSection === "subscription" && (
              <div className="p-6">
                <h1 className="text-foreground text-3xl font-bold">
                  Subscription
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage your subscription plan.
                </p>
              </div>
            )}
            {activeSection === "marketplace" && (
              <div className="p-6">
                <h1 className="text-foreground text-3xl font-bold">
                  Marketplace
                </h1>
                <p className="text-muted-foreground mt-2">
                  Browse and discover NFT artworks.
                </p>
              </div>
            )}
            {activeSection === "settings" && (
              <div className="p-6">
                <h1 className="text-foreground text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-2">
                  Configure your account and preferences.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
