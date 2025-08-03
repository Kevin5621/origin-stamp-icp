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
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface MarketplaceSidebarProps {
  onSectionChange: (section: string) => void;
}

export const MarketplaceSidebar: React.FC<MarketplaceSidebarProps> = ({
  onSectionChange,
}) => {
  const { t } = useTranslation("marketplace");
  const location = useLocation();

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
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/dashboard" },
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
    { id: "settings", icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <nav className="marketplace-sidebar">
      <div className="sidebar-container">
        {/* Logo */}
        <div className="sidebar-logo">
          <Link to="/marketplace" className="logo-link">
            <div className="logo-icon">🎨</div>
            <span className="logo-text">OriginStamp</span>
          </Link>
        </div>

        {/* User Profile Section */}
        <div className="sidebar-user">
          <div className="user-avatar">
            <img
              src="https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png"
              alt="User"
            />
          </div>
          <div className="user-info">
            <div className="user-name">User Name</div>
            <div className="user-balance">0.00 ICP</div>
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
