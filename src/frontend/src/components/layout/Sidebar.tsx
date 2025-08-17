import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Compass,
  Settings,
  Home,
  BarChart3,
  Award,
  User,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Anchor,
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

  const isCollapsed = externalIsCollapsed ?? internalIsCollapsed;

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
          path: "/marketplace-collections",
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

    // Dashboard menu items (removed portfolio and deprecated buttons)
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
      {
        id: "settings",
        icon: Settings,
        label: t("sidebar.settings"),
        path: "/settings",
      },
    ];
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
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
    return variant === "marketplace" ? "Marketplace" : "OriginStamp";
  };

  const getLogoPath = () => {
    return variant === "marketplace" ? "/marketplace" : "/";
  };

  return (
    <nav
      className={`sidebar ${isCollapsed ? "sidebar--collapsed" : ""} sidebar--${variant}`}
      aria-label={t("sidebar.main_navigation")}
    >
      {/* Header */}
      <header className="sidebar__header">
        <Link
          to={getLogoPath()}
          className="sidebar__logo"
          aria-label={getLogoText()}
        >
          {!isCollapsed && (
            <span className="sidebar__logo-text">{getLogoText()}</span>
          )}
          {isCollapsed && (
            <span className="sidebar__logo-icon" aria-hidden="true">
              {variant === "marketplace" ? "M" : "O"}
            </span>
          )}
        </Link>

        <button
          className="sidebar__toggle"
          onClick={handleToggleCollapse}
          aria-label={isCollapsed ? t("sidebar.expand") : t("sidebar.collapse")}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </header>

      {/* User Profile */}
      <div className="sidebar__user">
        <div className="sidebar__avatar">
          <img
            src={getUserAvatar()}
            alt={getUserName()}
            className="sidebar__avatar-img"
          />
        </div>
        {!isCollapsed && (
          <div className="sidebar__user-info">
            <div className="sidebar__user-name">{getUserName()}</div>
            <div className="sidebar__user-status">
              {isAuthenticated ? t("sidebar.online") : t("sidebar.offline")}
            </div>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav
        className="sidebar__nav"
        aria-label={t("sidebar.primary_navigation")}
      >
        <ul className="sidebar__menu">
          {getMenuItems().map((item) => {
            const Icon = item.icon;
            const isItemActive = isActive(item.path);
            return (
              <li key={item.id} className="sidebar__menu-item">
                <Link
                  to={item.path}
                  className={`sidebar__link ${isItemActive ? "sidebar__link--active" : ""}`}
                  onClick={() => onSectionChange(item.id)}
                  aria-current={isItemActive ? "page" : undefined}
                >
                  <Icon size={20} className="sidebar__icon" />
                  {!isCollapsed && (
                    <span className="sidebar__label">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Secondary Navigation */}
      <nav
        className="sidebar__secondary"
        aria-label={t("sidebar.secondary_navigation")}
      >
        <ul className="sidebar__menu">
          {getBottomMenuItems().map((item) => {
            const Icon = item.icon;
            const isItemActive = isActive(item.path);
            return (
              <li key={item.id} className="sidebar__menu-item">
                <Link
                  to={item.path}
                  className={`sidebar__link ${isItemActive ? "sidebar__link--active" : ""}`}
                  aria-current={isItemActive ? "page" : undefined}
                >
                  <Icon size={20} className="sidebar__icon" />
                  {!isCollapsed && (
                    <span className="sidebar__label">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </nav>
  );
};
