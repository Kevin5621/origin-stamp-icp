import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Menu, X, ShoppingBag, Plus } from "lucide-react";
import styles from "../../css/components/marketplace/Navbar.module.scss";

interface NavbarProps {
  onSearch?: (query: string) => void;
  onConnectWallet?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearch = () => {},
  onConnectWallet = () => {},
}) => {
  const { t } = useTranslation("marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.navbarInner}>
          {/* Left Side - Logo and Navigation */}
          <div className={styles.navLeft}>
            {/* Logo */}
            <div className={styles.logo}>
              <ShoppingBag size={22} />
              <span className={styles.logoText}>MARKETPLACE</span>
            </div>

            {/* Desktop Navigation */}
            <nav>
              <ul className={styles.navLinks}>
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

          {/* Center - Search Bar */}
          <div className={styles.navCenter}>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <div className={styles.searchInputWrapper}>
                <Search className={styles.searchIcon} size={16} />
                <input
                  type="text"
                  placeholder={t("search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                <span className={styles.searchShortcut}>/</span>
              </div>
            </form>
          </div>

          {/* Right Side - Actions */}
          <div className={styles.navRight}>
            <button className={styles.createBtn}>
              <Plus size={16} />
              <span>{t("nav.create")}</span>
            </button>

            <button className={styles.connectBtn} onClick={onConnectWallet}>
              <span>{t("nav.connectWallet")}</span>
            </button>

            <button
              className={styles.mobileMenuBtn}
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            {/* Mobile Search */}
            <form className={styles.mobileSearchForm} onSubmit={handleSearch}>
              <div className={styles.searchInputWrapper}>
                <Search className={styles.searchIcon} size={16} />
                <input
                  type="text"
                  placeholder={t("search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </form>

            {/* Mobile Nav Links */}
            <nav>
              <ul className={styles.mobileNavList}>
                <li>
                  <a href="#explore" onClick={toggleMobileMenu}>
                    {t("nav.explore")}
                  </a>
                </li>
                <li>
                  <a href="#create" onClick={toggleMobileMenu}>
                    {t("nav.create")}
                  </a>
                </li>
                <li>
                  <a href="#collections" onClick={toggleMobileMenu}>
                    {t("nav.collections")}
                  </a>
                </li>
              </ul>
            </nav>

            {/* Mobile Actions */}
            <div className={styles.mobileActions}>
              <button
                className={styles.connectBtn}
                onClick={() => {
                  onConnectWallet();
                  toggleMobileMenu();
                }}
              >
                <span>{t("nav.connectWallet")}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent content from being hidden beneath navbar */}
      <div className={styles.navbarSpacer}></div>
    </>
  );
};
