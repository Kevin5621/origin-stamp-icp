import React from "react";
import { useTranslation } from "react-i18next";

interface MarketplaceHeaderProps {
  className?: string;
}

export const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  className = "",
}) => {
  const { t } = useTranslation("marketplace");

  return (
    <header className={`marketplace-header ${className}`}>
      <div className="marketplace-header__container">
        <div className="marketplace-header__content">
          <h1 className="marketplace-header__title">{t("title")}</h1>
          <p className="marketplace-header__subtitle">{t("subtitle")}</p>
        </div>
        <div className="marketplace-header__actions">
          <button className="marketplace-header__search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("search")}
          </button>
        </div>
      </div>
    </header>
  );
};

export default MarketplaceHeader;
