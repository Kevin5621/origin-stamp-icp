import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Compass,
  Grid,
  List,
  Anchor,
  Settings,
  Home,
  BarChart3,
  Award,
  Wallet,
  Plus,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface MarketplaceSidebarProps {
  onSectionChange: (section: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export const MarketplaceSidebar: React.FC<MarketplaceSidebarProps> = ({
  onSectionChange,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse,
}) => {
  const { t } = useTranslation("marketplace");
  const location = useLocation();

  // Internal state for collapse if not controlled externally
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);

  const isCollapsed =
    externalIsCollapsed !== undefined
      ? externalIsCollapsed
      : internalIsCollapsed;

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    if (onToggleCollapse) {
      onToggleCollapse(newCollapsedState);
    } else {
      setInternalIsCollapsed(newCollapsedState);
    }
  };

  const menuItems = [
    {
      id: "explore",
      icon: Compass,
      label: t("sidebar.explore"),
      path: "/marketplace",
    },
    {
      id: "collections",
      icon: Grid,
      label: t("sidebar.collections"),
      path: "/marketplace/collections",
    },
    {
      id: "create",
      icon: Plus,
      label: t("sidebar.create"),
      path: "/marketplace/create",
    },
    {
      id: "activity",
      icon: List,
      label: t("sidebar.activity"),
      path: "/marketplace/activity",
    },
    {
      id: "rankings",
      icon: Anchor,
      label: t("sidebar.rankings"),
      path: "/marketplace/rankings",
    },
    {
      id: "stats",
      icon: BarChart3,
      label: t("sidebar.stats"),
      path: "/marketplace/stats",
    },
  ];

  const bottomMenuItems = [
    {
      id: "dashboard",
      icon: Home,
      label: t("common:sidebar.dashboard"),
      path: "/dashboard",
    },
    {
      id: "certificates",
      icon: Award,
      label: t("common:sidebar.certificates"),
      path: "/certificates",
    },
    {
      id: "analytics",
      icon: BarChart3,
      label: t("common:sidebar.analytics"),
      path: "/analytics",
    },
    {
      id: "settings",
      icon: Settings,
      label: t("common:sidebar.settings"),
      path: "/settings",
    },
  ];

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <nav
      className={`marketplace-sidebar ${isCollapsed ? "marketplace-sidebar--collapsed" : ""}`}
    >
      <div className="sidebar-container">
        {/* Collapse Toggle Button */}
        <button
          className="sidebar-collapse-toggle"
          onClick={handleToggleCollapse}
          title={isCollapsed ? t("sidebar.expand") : t("sidebar.collapse")}
        >
          {isCollapsed ? (
            <ChevronsRight size={20} />
          ) : (
            <ChevronsLeft size={20} />
          )}
        </button>

        {/* Logo */}
        <div className="sidebar-logo">
          <Link to="/marketplace" className="logo-link">
            <div className="logo-icon">🎨</div>
            {!isCollapsed && <span className="logo-text">OriginStamp</span>}
          </Link>
        </div>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="sidebar-user">
            <div className="user-avatar">
              <img
                src="https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png"
                alt="User"
              />
            </div>
            <div className="user-info">
              <div className="user-name">{t("user_name")}</div>
              <div className="user-balance">0.00 ICP</div>
            </div>
          </div>
        )}

        {/* Collapsed User Avatar */}
        {isCollapsed && (
          <div className="sidebar-user-collapsed">
            <div className="user-avatar">
              <img
                src="https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png"
                alt="User"
              />
            </div>
          </div>
        )}

        {/* Main Menu Items */}
        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isItemActive = isActive(item.path);
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`menu-item ${isItemActive ? "active" : ""}`}
                  onClick={() => onSectionChange(item.id)}
                  title={item.label}
                >
                  <Icon size={20} />
                  {!isCollapsed && (
                    <span className="menu-label">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="sidebar-quick-actions">
            <h3 className="section-title">{t("common:quick_actions")}</h3>
            <div className="quick-actions-grid">
              <button className="quick-action-btn">
                <Plus size={16} />
                <span>{t("common:create_nft")}</span>
              </button>
              <button className="quick-action-btn">
                <Wallet size={16} />
                <span>{t("common:connect_wallet")}</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Menu Items */}
        <div className="sidebar-bottom">
          <ul className="sidebar-menu">
            {bottomMenuItems.map((item) => {
              const Icon = item.icon;
              const isItemActive = isActive(item.path);
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`menu-item ${isItemActive ? "active" : ""}`}
                    title={item.label}
                  >
                    <Icon size={20} />
                    {!isCollapsed && (
                      <span className="menu-label">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};
