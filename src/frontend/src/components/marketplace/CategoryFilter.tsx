import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  selectedView: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedTimeframe,
  selectedView,
  onViewChange,
}) => {
  const { t } = useTranslation("marketplace");

  const categories = [
    { id: "all", label: t("categories.all") },
    { id: "art", label: t("categories.art") },
    { id: "gaming", label: t("categories.gaming") },
    { id: "pfps", label: t("categories.pfps") },
    { id: "memberships", label: t("categories.memberships") },
    { id: "music", label: t("categories.music") },
    { id: "photography", label: t("categories.photography") },
  ];

  const timeframes = [
    { id: "1d", label: "1d" },
    { id: "7d", label: "7d" },
    { id: "30d", label: "30d" },
    { id: "all", label: t("timeframes.all") },
  ];

  return (
    <div className="category-filter">
      <div className="category-filter__container">
        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-tab ${selectedCategory === category.id ? "active" : ""}`}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Additional Filters */}
        <div className="filter-controls">
          {/* Chain Icons */}
          <div className="chain-icons">
            <div className="chain-icon chain-icon--ethereum"></div>
            <div className="chain-icon chain-icon--polygon"></div>
            <div className="chain-icon chain-icon--arbitrum"></div>
            <div className="chain-icon chain-icon--more">
              <span>...</span>
            </div>
          </div>

          {/* Sort Options */}
          <div className="sort-options">
            <button className="sort-tab active">{t("sort.top")}</button>
            <button className="sort-tab">{t("sort.trending")}</button>
          </div>

          {/* Timeframe Dropdown */}
          <div className="timeframe-dropdown">
            <button className="timeframe-btn">
              {timeframes.find((t) => t.id === selectedTimeframe)?.label ||
                "1d"}
              <ChevronDown size={16} />
            </button>
          </div>

          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={`view-btn ${selectedView === "list" ? "active" : ""}`}
              onClick={() => onViewChange("list")}
              title={t("view.list")}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect
                  x="3"
                  y="4"
                  width="14"
                  height="2"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  x="3"
                  y="9"
                  width="14"
                  height="2"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  x="3"
                  y="14"
                  width="14"
                  height="2"
                  rx="1"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button
              className={`view-btn ${selectedView === "grid" ? "active" : ""}`}
              onClick={() => onViewChange("grid")}
              title={t("view.grid")}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="6"
                  height="6"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  x="11"
                  y="3"
                  width="6"
                  height="6"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  x="3"
                  y="11"
                  width="6"
                  height="6"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  x="11"
                  y="11"
                  width="6"
                  height="6"
                  rx="1"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
