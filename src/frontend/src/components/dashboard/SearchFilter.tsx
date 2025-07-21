import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, List, Grid3X3 } from "lucide-react";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onViewChange: (view: "list" | "grid") => void;
  currentView: "list" | "grid";
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onSort,
  onViewChange,
  currentView,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSort(e.target.value);
  };

  return (
    <div className="projects-controls">
      {/* Search Input */}
      <div style={{ position: "relative", flex: 1 }}>
        <Search
          size={16}
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-text-tertiary)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          className="search-input"
          placeholder={t("search_projects_placeholder")}
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ paddingLeft: "40px" }}
        />
      </div>

      {/* Sort Dropdown */}
      <select
        className="sort-select"
        onChange={handleSortChange}
        defaultValue="newest"
      >
        <option value="newest">{t("sort_newest")}</option>
        <option value="oldest">{t("sort_oldest")}</option>
        <option value="name">{t("sort_name")}</option>
        <option value="progress">{t("sort_progress")}</option>
      </select>

      {/* View Toggle */}
      <button
        className="view-toggle"
        onClick={() => onViewChange(currentView === "list" ? "grid" : "list")}
        aria-label={currentView === "list" ? t("grid_view") : t("list_view")}
      >
        {currentView === "list" ? (
          <Grid3X3 size={16} strokeWidth={2} />
        ) : (
          <List size={16} strokeWidth={2} />
        )}
      </button>
    </div>
  );
};

export default SearchFilter;
