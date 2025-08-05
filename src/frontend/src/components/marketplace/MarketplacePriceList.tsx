import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

interface Collection {
  id: string;
  name: string;
  image: string;
  floorPrice: string;
  currency: string;
  change: number;
  verified: boolean;
}

interface MarketplacePriceListProps {
  collections: Collection[];
  title: string;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export const MarketplacePriceList: React.FC<MarketplacePriceListProps> = ({
  collections,
  title,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { t } = useTranslation("marketplace");
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const collapsed = onToggleCollapse ? isCollapsed : internalCollapsed;
  const toggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse(!collapsed);
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    const color = isPositive ? "positive" : "negative";

    return (
      <span className={`change-percentage ${color}`}>
        {isPositive ? "+" : ""}
        {change}%
      </span>
    );
  };

  return (
    <aside className={`marketplace-price-list ${collapsed ? "collapsed" : ""}`}>
      <div className="marketplace-price-list__header">
        <h3 className="list-title">{collapsed ? "" : title}</h3>
        <button
          className="price-list-collapse-toggle"
          onClick={toggleCollapse}
          aria-label={collapsed ? t("common:expand") : t("common:collapse")}
        >
          {collapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {!collapsed && (
        <div className="marketplace-price-list__content">
          <div className="list-header">
            <span className="header-collection">{t("collection")}</span>
            <span className="header-floor">{t("floor")}</span>
          </div>

          <div className="list-items">
            {collections.map((collection) => (
              <div key={collection.id} className="list-item">
                <div className="item-collection">
                  <div className="collection-avatar">
                    <img src={collection.image} alt={collection.name} />
                  </div>
                  <div className="collection-info">
                    <span className="collection-name">
                      {collection.name}
                      {collection.verified && (
                        <Check className="verified-icon" size={12} />
                      )}
                    </span>
                  </div>
                </div>

                <div className="item-floor">
                  <span className="floor-price">
                    {collection.floorPrice} {collection.currency}
                  </span>
                  {formatChange(collection.change)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
