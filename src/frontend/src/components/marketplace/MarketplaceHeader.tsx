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
      </div>
    </header>
  );
};

export default MarketplaceHeader;
