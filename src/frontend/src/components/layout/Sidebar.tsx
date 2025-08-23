import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Grid,
  Anchor,
  Compass,
  Palette,
  Activity,
  Crown,
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
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Subscription state
  const [subscriptionTier, setSubscriptionTier] = useState<string>("Free");

  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const isCollapsed = externalIsCollapsed ?? internalIsCollapsed;

  // Load user subscription data
  useEffect(() => {
    const loadSubscriptionData = () => {
      if (!user?.username) return;

      // TODO: Replace with real backend call when module resolution is fixed
      // For now, use mock data based on username
      if (user.username === "admin_user") {
        setSubscriptionTier("Enterprise");
      } else if (user.username === "test_user") {
        setSubscriptionTier("Basic");
      } else {
        // All new users default to Free tier
        setSubscriptionTier("Free");
      }
    };

    loadSubscriptionData();
  }, [user?.username]);

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
          id: "activity",
          icon: Activity,
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
          icon: Activity,
          label: t("sidebar.stats"),
          path: "/marketplace/stats",
        },
      ];
    }

    return [
      {
        id: "dashboard",
        icon: LayoutDashboard,
        label: t("sidebar.dashboard"),
        path: "/dashboard",
      },
      {
        id: "session",
        icon: Palette,
        label: t("sidebar.session"),
        path: "/session",
      },
    ];
  };

  const getBottomMenuItems = () => {
    if (variant === "marketplace") {
      return [
        {
          id: "dashboard",
          icon: LayoutDashboard,
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
        id: "subscription",
        icon: Crown,
        label: t("sidebar.subscription"),
        path: "/subscription",
      },
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
    // Exact match for the path
    if (location.pathname === path) {
      return true;
    }

    // For paths that should match sub-routes, but be more specific
    // to avoid false positives
    if (path === "/marketplace") {
      // Only match exact /marketplace, not sub-routes like /marketplace/stats
      return location.pathname === "/marketplace";
    }

    if (path === "/dashboard") {
      // Only match exact /dashboard, not sub-routes
      return location.pathname === "/dashboard";
    }

    // For other paths, use the original logic but with more specific matching
    return location.pathname.startsWith(path + "/");
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
            {/* Subscription Tier Badge */}
            <div className="sidebar__tier-badge">
              <Crown size={12} className="sidebar__tier-icon" />
              <span className="sidebar__tier-text">{subscriptionTier}</span>
            </div>
          </div>
        )}
      </div>

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
