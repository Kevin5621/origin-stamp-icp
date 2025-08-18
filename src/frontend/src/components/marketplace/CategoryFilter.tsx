import React from "react";
import { useTranslation } from "react-i18next";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className = "",
}) => {
  const { t } = useTranslation("marketplace");

  return (
    <div className={`category-filter ${className}`}>
      <div className="category-filter__container">
        <button
          className={`category-filter__item ${
            selectedCategory === "all" ? "category-filter__item--active" : ""
          }`}
          onClick={() => onCategoryChange("all")}
        >
          {t("all_categories")}
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-filter__item ${
              selectedCategory === category.id
                ? "category-filter__item--active"
                : ""
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
            <span className="category-filter__count">({category.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
