import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Menu, X } from "lucide-react";

interface MarketplaceHeaderProps {
  onSearch: (query: string) => void;
  onConnectWallet: () => void;
}

export const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  onSearch,
}) => {
  const { t } = useTranslation("marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="marketplace-header">
      <div className="marketplace-header__container">
        {/* Logo */}
        <div className="marketplace-header__logo">
          <h1>OriginStamp</h1>
        </div>

        {/* Search Bar */}
        <form className="marketplace-header__search" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder={t("search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-shortcut">/</span>
          </div>
        </form>

        {/* Navigation */}
        <nav className="marketplace-header__nav">
          <ul className="nav-list">
            <li>
              <a href="#explore">{t("nav.explore")}</a>
            </li>
            <li>
              <a href="#create">{t("nav.create")}</a>
            </li>
            <li>
              <a href="#collections">{t("nav.collections")}</a>
            </li>
          </ul>
        </nav>

        {/* Actions */}
        <div className="marketplace-header__actions">
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <ul>
              <li>
                <a href="#explore">{t("nav.explore")}</a>
              </li>
              <li>
                <a href="#create">{t("nav.create")}</a>
              </li>
              <li>
                <a href="#collections">{t("nav.collections")}</a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};
