import React from "react";
import { Button } from "../ui/button";
import {
  LayoutDashboard,
  Palette,
  CreditCard,
  Store,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSectionChange: (sectionId: string) => void;
  variant?: "dashboard";
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  onSectionChange,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "session", label: "Art Sessions", icon: Palette },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "marketplace", label: "Marketplace", icon: Store },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`bg-card border-border border-r transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="border-border flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <h2 className="text-foreground text-lg font-semibold">OriginStamp</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hover:bg-muted w-full justify-start"
                  onClick={() => onSectionChange(item.id)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {!isCollapsed && item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
