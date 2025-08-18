import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CategoryFilter } from "./CategoryFilter";
import { PriceFilter } from "./PriceFilter";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface MarketplaceSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onPriceChange: (range: PriceRange) => void;
  className?: string;
}

export const MarketplaceSidebar: React.FC<MarketplaceSidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onPriceChange,
  className = "",
}) => {
  const { t } = useTranslation("marketplace");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className={`marketplace-sidebar ${className}`}>
      <div className="marketplace-sidebar__header">
        <h2 className="marketplace-sidebar__title">{t("filters")}</h2>
        <button
          className="marketplace-sidebar__toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12h18M3 6h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        className={`marketplace-sidebar__content ${isOpen ? "marketplace-sidebar__content--open" : ""}`}
      >
        <div className="marketplace-sidebar__section">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>

        <div className="marketplace-sidebar__section">
          <PriceFilter onPriceChange={onPriceChange} />
        </div>
      </div>
    </aside>
  );
};

export default MarketplaceSidebar;
