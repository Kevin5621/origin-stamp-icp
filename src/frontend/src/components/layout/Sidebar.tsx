import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Compass,
  Settings,
  Home,
  BarChart3,
  Award,
  Wallet,
  Plus,
  User,
  Folder,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Anchor,
  Bell,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps {
  onSectionChange?: (section: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  variant?: "dashboard" | "marketplace";
}

export const Sidebar: React.FC<SidebarProps> = ({
  onSectionChange = () => {},
  isCollapsed: externalIsCollapsed,
  onToggleCollapse,
  variant = "dashboard",
}) => {
  const { t } = useTranslation("common");
  const { t: tMarketplace } = useTranslation("marketplace");
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

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

  const getMenuItems = () => {
    if (variant === "marketplace") {
      return [
        {
          id: "explore",
          icon: Compass,
          label: tMarketplace("sidebar.explore"),
          path: "/marketplace",
        },
        {
          id: "collections",
          icon: Grid,
          label: tMarketplace("sidebar.collections"),
          path: "/marketplace/collections",
        },
        {
          id: "create",
          icon: Plus,
          label: tMarketplace("sidebar.create"),
          path: "/marketplace/create",
        },
        {
          id: "activity",
          icon: List,
          label: tMarketplace("sidebar.activity"),
          path: "/marketplace/activity",
        },
        {
          id: "rankings",
          icon: Anchor,
          label: tMarketplace("sidebar.rankings"),
          path: "/marketplace/rankings",
        },
        {
          id: "stats",
          icon: BarChart3,
          label: tMarketplace("sidebar.stats"),
          path: "/marketplace/stats",
        },
      ];
    }

    // Dashboard menu items
    return [
      {
        id: "dashboard",
        icon: Home,
        label: t("sidebar.dashboard"),
        path: "/dashboard",
      },
      {
        id: "session",
        icon: User,
        label: t("sidebar.session"),
        path: "/session",
      },
      {
        id: "certificates",
        icon: Award,
        label: t("sidebar.certificates"),
        path: "/certificates",
      },
      {
        id: "analytics",
        icon: BarChart3,
        label: t("sidebar.analytics"),
        path: "/analytics",
      },
      {
        id: "portfolio",
        icon: Folder,
        label: t("sidebar.portfolio"),
        path: "/portfolio",
      },
      {
        id: "settings",
        icon: Settings,
        label: t("sidebar.settings"),
        path: "/settings",
      },
    ];
  };

  const getBottomMenuItems = () => {
    if (variant === "marketplace") {
      return [
        {
          id: "dashboard",
          icon: Home,
          label: t("sidebar.dashboard"),
          path: "/dashboard",
        },
        {
          id: "certificates",
          icon: Award,
          label: t("sidebar.certificates"),
          path: "/certificates",
        },
        {
          id: "analytics",
          icon: BarChart3,
          label: t("sidebar.analytics"),
          path: "/analytics",
        },
        {
          id: "settings",
          icon: Settings,
          label: t("sidebar.settings"),
          path: "/settings",
        },
      ];
    }

    return [
      {
        id: "marketplace",
        icon: Compass,
        label: t("sidebar.marketplace"),
        path: "/marketplace",
      },
      { id: "home", icon: Home, label: t("sidebar.home"), path: "/" },
    ];
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const getUserBalance = () => {
    // Mock balance - in real app this would come from wallet
    return isAuthenticated ? "0.00 ICP" : "0.00 ICP";
  };

  const getUserName = () => {
    if (!isAuthenticated) return t("sidebar.guest_user");
    return user?.username || t("sidebar.user");
  };

  const getUserAvatar = () => {
    if (!isAuthenticated)
      return "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png";
    return (
      user?.picture ||
      "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png"
    );
  };

  const getLogoText = () => {
    return variant === "marketplace" ? "IC Vibe" : "OriginStamp";
  };

  const getLogoIcon = () => {
    return variant === "marketplace" ? "IC" : "OS";
  };

  const getLogoPath = () => {
    return variant === "marketplace" ? "/marketplace" : "/";
  };

  return (
    <nav
      className={`app-sidebar ${isCollapsed ? "app-sidebar--collapsed" : ""} app-sidebar--${variant}`}
    >
      <div className="sidebar-container">
        {/* Collapse Toggle Button */}
        <button
          className="sidebar-collapse-toggle"
          onClick={handleToggleCollapse}
          title={isCollapsed ? t("sidebar.expand") : t("sidebar.collapse")}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* Logo */}
        <div className="sidebar-logo">
          <Link to={getLogoPath()} className="logo-link">
            <div className="logo-icon">{getLogoIcon()}</div>
            {!isCollapsed && <span className="logo-text">{getLogoText()}</span>}
          </Link>
        </div>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="sidebar-user">
            <div className="user-avatar">
              <img src={getUserAvatar()} alt="User" />
            </div>
            <div className="user-info">
              <div className="user-name">{getUserName()}</div>
              <div className="user-balance">{getUserBalance()}</div>
            </div>
          </div>
        )}

        {/* Collapsed User Avatar */}
        {isCollapsed && (
          <div className="sidebar-user-collapsed">
            <div className="user-avatar">
              <img src={getUserAvatar()} alt="User" />
            </div>
          </div>
        )}

        {/* Main Menu Items */}
        <ul className="sidebar-menu">
          {getMenuItems().map((item) => {
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
            <h3 className="section-title">{t("quick_actions")}</h3>
            <div className="quick-actions-grid">
              <button className="quick-action-btn">
                <Plus size={16} />
                <span>{t("create_nft")}</span>
              </button>
              <button className="quick-action-btn">
                <Wallet size={16} />
                <span>{t("connect_wallet")}</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Menu Items */}
        <div className="sidebar-bottom">
          <ul className="sidebar-menu">
            {getBottomMenuItems().map((item) => {
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
