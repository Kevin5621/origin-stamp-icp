import React, { useState } from "react";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  variant?: "default" | "dashboard" | "marketplace";
  showSidebar?: boolean;
  onSectionChange?: (section: string) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  variant = "default",
  showSidebar = true,
  onSectionChange = () => {},
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getLayoutClass = () => {
    if (!showSidebar) return "layout-main-content";

    let baseClass = "";
    switch (variant) {
      case "dashboard":
        baseClass = "layout-with-sidebar";
        break;
      case "marketplace":
        baseClass = "layout-with-sidebar";
        break;
      default:
        baseClass = "layout-with-sidebar";
    }

    if (isCollapsed) {
      baseClass += " layout-with-sidebar--collapsed";
    }

    return baseClass;
  };

  const getSidebarVariant = () => {
    switch (variant) {
      case "dashboard":
        return "dashboard";
      case "marketplace":
        return "marketplace";
      default:
        return "dashboard";
    }
  };

  return (
    <div className={getLayoutClass()}>
      {showSidebar && (
        <Sidebar
          variant={getSidebarVariant()}
          onSectionChange={onSectionChange}
          isCollapsed={isCollapsed}
          onToggleCollapse={setIsCollapsed}
        />
      )}

      <main className="layout-main-content">{children}</main>
    </div>
  );
};
