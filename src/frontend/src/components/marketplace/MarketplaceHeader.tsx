import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

interface MarketplaceHeaderProps {
  className?: string;
}

export const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  className = "",
}) => {
  const { t } = useTranslation("marketplace");
  const location = useLocation();

  // const navItems = [
  //   { path: "/marketplace", label: "All Items", key: "all_items" },
  //   {
  //     path: "/marketplace/collections",
  //     label: "Collections",
  //     key: "collections",
  //   },
  // ];

  return (
    <header className={`marketplace-header ${className}`}>
      <div className="marketplace-header__container">
        <div className="marketplace-header__content">
          <h1 className="marketplace-header__title">{t("title")}</h1>
          <p className="marketplace-header__subtitle">{t("subtitle")}</p>
        </div>

        {/* <nav className="marketplace-header__nav">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`marketplace-header__nav-link ${
                location.pathname === item.path
                  ? "marketplace-header__nav-link--active"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav> */}
      </div>
    </header>
  );
};

export default MarketplaceHeader;
