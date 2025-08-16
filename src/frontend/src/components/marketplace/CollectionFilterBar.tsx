import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, ChevronDown } from "lucide-react";
import styles from "../../css/components/marketplace/CollectionFilterBar.module.scss";

interface CollectionFilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  onSearch: (query: string) => void;
}

export const CollectionFilterBar: React.FC<CollectionFilterBarProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange,
  onSearch,
}) => {
  const { t } = useTranslation("marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const categories = [
    { id: "all", label: t("categories.all") },
    { id: "art", label: t("categories.art") },
    { id: "gaming", label: t("categories.gaming") },
    { id: "music", label: t("categories.music") },
    { id: "photography", label: t("categories.photography") },
    { id: "membership", label: t("categories.membership") },
    { id: "pfps", label: t("categories.pfps") },
  ];

  const sortOptions = [
    { id: "newest", label: t("sort.newest") },
    { id: "popular", label: t("sort.popular") },
    { id: "volume", label: t("sort.volume") },
    { id: "price", label: t("sort.price") },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen(!isSortDropdownOpen);
  };

  const handleSortSelect = (sort: string) => {
    onSortChange(sort);
    setIsSortDropdownOpen(false);
  };

  return (
    <div className={styles.filterBar}>
      {/* Categories */}
      <div className={styles.categoryFilters}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.categoryButton} ${
              selectedCategory === category.id
                ? styles.categoryButtonActive
                : ""
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className={styles.filterActions}>
        {/* Sort Dropdown */}
        <div className={styles.sortDropdownContainer}>
          <button
            className={styles.sortDropdownButton}
            onClick={toggleSortDropdown}
          >
            {t("sort.sortBy")}:{" "}
            {sortOptions.find((opt) => opt.id === selectedSort)?.label}
            <ChevronDown size={16} />
          </button>

          {isSortDropdownOpen && (
            <div className={styles.sortDropdownMenu}>
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  className={`${styles.sortOption} ${
                    selectedSort === option.id ? styles.sortOptionActive : ""
                  }`}
                  onClick={() => handleSortSelect(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} size={16} />
            <input
              type="text"
              placeholder={t("collections.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
