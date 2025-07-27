import React, { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
  variant?: "default" | "marketplace" | "dashboard";
  showSidebar?: boolean;
  onSectionChange?: (section: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  variant = "default",
  showSidebar = true,
  onSectionChange = () => {},
}) => {
  const getLayoutClass = () => {
    if (!showSidebar) return "layout-main-content";

    switch (variant) {
      case "marketplace":
        return "layout-with-sidebar layout-with-sidebar--marketplace";
      case "dashboard":
        return "layout-with-sidebar";
      default:
        return "layout-with-sidebar";
    }
  };

  const getSidebarVariant = () => {
    switch (variant) {
      case "marketplace":
        return "marketplace";
      case "dashboard":
        return "dashboard";
      default:
        return "general";
    }
  };

  return (
    <div className={getLayoutClass()}>
      {showSidebar && (
        <Sidebar
          variant={getSidebarVariant()}
          onSectionChange={onSectionChange}
        />
      )}

      <main className="layout-main-content">{children}</main>
    </div>
  );
};
