import React, { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: ReactNode;
  variant?: "default" | "dashboard";
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
      default:
        baseClass = "layout-with-sidebar";
    }

    if (isCollapsed) {
      baseClass += " layout-with-sidebar--collapsed";
    }

    return baseClass;
  };

  return (
    <div className={getLayoutClass()}>
      {showSidebar && (
        <Sidebar
          onSectionChange={onSectionChange}
          isCollapsed={isCollapsed}
          onToggleCollapse={setIsCollapsed}
        />
      )}

      <main className="layout-main-content">{children}</main>
    </div>
  );
};
