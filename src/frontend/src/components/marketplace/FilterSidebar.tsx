import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export interface FilterOptions {
  categories: string[];
  selectedCategory: string;
  priceRange: {
    min: number;
    max: number | null;
  };
  status: {
    buyNow: boolean;
    onAuction: boolean;
    new: boolean;
    hasOffers: boolean;
  };
}

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  className?: string;
  isMobile?: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  className = "",
  isMobile = false,
}) => {
  const { t } = useTranslation("marketplace");
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCategoryChange = (category: string) => {
    const updatedFilters = {
      ...localFilters,
      selectedCategory: category,
    };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handlePriceChange = (field: "min" | "max", value: string) => {
    const numValue =
      value === "" ? (field === "min" ? 0 : null) : parseFloat(value);
    const updatedFilters = {
      ...localFilters,
      priceRange: {
        ...localFilters.priceRange,
        [field]: numValue,
      },
    };
    setLocalFilters(updatedFilters);
  };

  const handlePriceApply = () => {
    onFilterChange(localFilters);
  };

  const handleStatusChange = (status: keyof FilterOptions["status"]) => {
    const updatedFilters = {
      ...localFilters,
      status: {
        ...localFilters.status,
        [status]: !localFilters.status[status],
      },
    };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      categories: filters.categories,
      selectedCategory: "all",
      priceRange: {
        min: 0,
        max: null,
      },
      status: {
        buyNow: false,
        onAuction: false,
        new: false,
        hasOffers: false,
      },
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div
      className={`filter-sidebar ${className} ${isExpanded ? "filter-sidebar--expanded" : ""}`}
    >
      <div className="filter-sidebar__header">
        <h2 className="filter-sidebar__title">{t("filters")}</h2>
        <button className="filter-sidebar__toggle" onClick={handleToggle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d={
                isExpanded ? "M6 18L18 6M6 6l12 12" : "M3 12h18M3 6h18M3 18h18"
              }
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="filter-sidebar__content">
          <div className="filter-sidebar__section">
            <h3 className="filter-sidebar__section-title">{t("categories")}</h3>
            <div className="filter-sidebar__category-list">
              <div
                className={`filter-sidebar__category ${
                  localFilters.selectedCategory === "all"
                    ? "filter-sidebar__category--selected"
                    : ""
                }`}
                onClick={() => handleCategoryChange("all")}
              >
                {t("all_categories")}
              </div>

              {localFilters.categories.map((category) => (
                <div
                  key={category}
                  className={`filter-sidebar__category ${
                    localFilters.selectedCategory === category
                      ? "filter-sidebar__category--selected"
                      : ""
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {t(`categories.${category.toLowerCase()}`)}
                </div>
              ))}
            </div>
          </div>

          <div className="filter-sidebar__section">
            <h3 className="filter-sidebar__section-title">
              {t("price_range")}
            </h3>
            <div className="filter-sidebar__price-inputs">
              <div className="filter-sidebar__price-input-group">
                <label className="filter-sidebar__price-label">
                  {t("min_price")}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={localFilters.priceRange.min}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  className="filter-sidebar__price-input"
                  placeholder="0"
                />
              </div>

              <div className="filter-sidebar__price-input-group">
                <label className="filter-sidebar__price-label">
                  {t("max_price")}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    localFilters.priceRange.max === null
                      ? ""
                      : localFilters.priceRange.max
                  }
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  className="filter-sidebar__price-input"
                  placeholder={t("no_limit")}
                />
              </div>
            </div>

            <div className="filter-sidebar__price-actions">
              <button
                className="filter-sidebar__price-apply"
                onClick={handlePriceApply}
              >
                {t("apply")}
              </button>
            </div>
          </div>

          <div className="filter-sidebar__section">
            <h3 className="filter-sidebar__section-title">{t("status")}</h3>
            <div className="filter-sidebar__status-list">
              <div className="filter-sidebar__status-item">
                <input
                  type="checkbox"
                  id="status-buy-now"
                  checked={localFilters.status.buyNow}
                  onChange={() => handleStatusChange("buyNow")}
                  className="filter-sidebar__status-checkbox"
                />
                <label
                  htmlFor="status-buy-now"
                  className="filter-sidebar__status-label"
                >
                  {t("buy_now")}
                </label>
              </div>

              <div className="filter-sidebar__status-item">
                <input
                  type="checkbox"
                  id="status-on-auction"
                  checked={localFilters.status.onAuction}
                  onChange={() => handleStatusChange("onAuction")}
                  className="filter-sidebar__status-checkbox"
                />
                <label
                  htmlFor="status-on-auction"
                  className="filter-sidebar__status-label"
                >
                  {t("on_auction")}
                </label>
              </div>

              <div className="filter-sidebar__status-item">
                <input
                  type="checkbox"
                  id="status-new"
                  checked={localFilters.status.new}
                  onChange={() => handleStatusChange("new")}
                  className="filter-sidebar__status-checkbox"
                />
                <label
                  htmlFor="status-new"
                  className="filter-sidebar__status-label"
                >
                  {t("new")}
                </label>
              </div>

              <div className="filter-sidebar__status-item">
                <input
                  type="checkbox"
                  id="status-has-offers"
                  checked={localFilters.status.hasOffers}
                  onChange={() => handleStatusChange("hasOffers")}
                  className="filter-sidebar__status-checkbox"
                />
                <label
                  htmlFor="status-has-offers"
                  className="filter-sidebar__status-label"
                >
                  {t("has_offers")}
                </label>
              </div>
            </div>
          </div>

          <div className="filter-sidebar__footer">
            <button
              className="filter-sidebar__reset-button"
              onClick={handleReset}
            >
              {t("reset_all")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
