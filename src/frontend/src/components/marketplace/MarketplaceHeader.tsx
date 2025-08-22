import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { Search, Filter, Bell, User } from "lucide-react";

interface MarketplaceHeaderProps {
  className?: string;
  onSearch?: (query: string) => void;
}

export const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  className = "",
  onSearch,
}) => {
  useTranslation("marketplace");
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className={`marketplace-header ${className}`}>
      <div className="marketplace-header__container">
        <div className="marketplace-header__left">
          <div className="marketplace-header__greeting">
            <h2
              className="marketplace-header__hello"
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                margin: "0 0 4px 0",
                color: "var(--color-text-primary)",
              }}
            >
              Hello, {user?.username || "User"}
            </h2>
            <p
              className="marketplace-header__subtitle"
              style={{
                fontSize: "0.75rem",
                margin: 0,
                color: "var(--color-text-secondary)",
              }}
            >
              39.506M+ items in NFT market Place!
            </p>
          </div>
        </div>

        <div className="marketplace-header__center">
          <form
            className="marketplace-header__search"
            onSubmit={handleSearchSubmit}
          >
            <div className="marketplace-header__search-wrapper">
              <Search
                size={16}
                color="var(--color-text-secondary)"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 1,
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                className="marketplace-header__search-input"
                placeholder="Search something..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  width: "100%",
                  padding: "8px 8px 8px 36px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  background: "var(--color-surface)",
                  color: "var(--color-text-primary)",
                  fontSize: "0.875rem",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          </form>
        </div>

        <div className="marketplace-header__right">
          <div className="marketplace-header__icons">
            <button
              className="marketplace-header__icon-btn"
              style={{
                width: "32px",
                height: "32px",
                border: "1px solid var(--color-border)",
                borderRadius: "6px",
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(45, 55, 72, 0.1)";
                e.currentTarget.style.borderColor = "var(--color-border-hover)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-surface)";
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Filter
                size={14}
                color="currentColor"
                style={{
                  width: "14px",
                  height: "14px",
                }}
              />
            </button>
            <button
              className="marketplace-header__icon-btn"
              style={{
                width: "32px",
                height: "32px",
                border: "1px solid var(--color-border)",
                borderRadius: "6px",
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(45, 55, 72, 0.1)";
                e.currentTarget.style.borderColor = "var(--color-border-hover)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-surface)";
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Bell
                size={14}
                color="currentColor"
                style={{
                  width: "14px",
                  height: "14px",
                }}
              />
            </button>
            <button
              className="marketplace-header__icon-btn"
              style={{
                width: "32px",
                height: "32px",
                border: "1px solid var(--color-border)",
                borderRadius: "6px",
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(45, 55, 72, 0.1)";
                e.currentTarget.style.borderColor = "var(--color-border-hover)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-surface)";
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <User
                size={14}
                color="currentColor"
                style={{
                  width: "14px",
                  height: "14px",
                }}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MarketplaceHeader;
