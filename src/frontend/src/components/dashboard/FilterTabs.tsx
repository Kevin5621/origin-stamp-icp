import React from "react";
import { useTranslation } from "react-i18next";

interface FilterTabsProps {
  selectedFilter: "all" | "active" | "completed";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="filter-tabs wireframe-tabs">
      <button
        className={`filter-tab wireframe-tab ${selectedFilter === "all" ? "active" : ""}`}
        onClick={() => onFilterChange("all")}
      >
        {t("all_projects")}
      </button>
      <button
        className={`filter-tab wireframe-tab ${selectedFilter === "active" ? "active" : ""}`}
        onClick={() => onFilterChange("active")}
      >
        {t("active_projects")}
      </button>
      <button
        className={`filter-tab wireframe-tab ${selectedFilter === "completed" ? "active" : ""}`}
        onClick={() => onFilterChange("completed")}
      >
        {t("completed_projects")}
      </button>
    </div>
  );
};

export default FilterTabs;
