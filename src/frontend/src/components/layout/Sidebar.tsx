import React from "react";
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
  Bell,
  Plus,
  User,
  Folder,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps {
  onSectionChange?: (section: string) => void;
  variant?: "marketplace" | "dashboard" | "general";
}

export const Sidebar: React.FC<SidebarProps> = ({
  onSectionChange = () => {},
  variant = "general",
}) => {
  const { t } = useTranslation("common");
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

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
    } else {
      return [
        { id: "dashboard", icon: Home, label: "Dashboard", path: "/dashboard" },
        { id: "session", icon: User, label: "Session", path: "/session" },
        {
          id: "certificates",
          icon: Award,
          label: "Certificates",
          path: "/certificates",
        },
        {
          id: "analytics",
          icon: BarChart3,
          label: "Analytics",
          path: "/analytics",
        },
        {
          id: "portfolio",
          icon: Folder,
          label: "Portfolio",
          path: "/portfolio",
        },
        {
          id: "settings",
          icon: Settings,
          label: "Settings",
          path: "/settings",
        },
      ];
    }
  };

  const bottomMenuItems = [
    {
      id: "marketplace",
      icon: Compass,
      label: "Marketplace",
      path: "/marketplace",
    },
    { id: "home", icon: Home, label: "Home", path: "/" },
  ];

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
    if (!isAuthenticated) return "Guest User";
    return user?.username || "User";
  };

  const getUserAvatar = () => {
    if (!isAuthenticated) return "/api/placeholder/40/40";
    return user?.picture || "/api/placeholder/40/40";
  };

  return (
    <nav className="app-sidebar">
      <div className="sidebar-container">
        {/* Logo */}
        <div className="sidebar-logo">
          <Link to="/" className="logo-link">
            <div className="logo-icon">🖼️</div>
            <span className="logo-text">OriginStamp</span>
          </Link>
        </div>

        {/* User Profile Section */}
        <div className="sidebar-user">
          <div className="user-avatar">
            <img src={getUserAvatar()} alt="User" />
          </div>
          <div className="user-info">
            <div className="user-name">{getUserName()}</div>
            <div className="user-balance">{getUserBalance()}</div>
          </div>
          <div className="user-actions">
            <button className="action-btn" title="Wallet">
              <Wallet size={16} />
            </button>
            <button className="action-btn" title="Notifications">
              <Bell size={16} />
            </button>
          </div>
        </div>

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
                  <span className="menu-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Quick Actions */}
        <div className="sidebar-quick-actions">
          <h3 className="section-title">Quick Actions</h3>
          <div className="quick-actions-grid">
            <button className="quick-action-btn">
              <Plus size={16} />
              <span>Create NFT</span>
            </button>
            <button className="quick-action-btn">
              <Wallet size={16} />
              <span>Connect Wallet</span>
            </button>
          </div>
        </div>

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
                    <span className="menu-label">{item.label}</span>
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
