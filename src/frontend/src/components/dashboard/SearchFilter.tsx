import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onViewChange: (view: 'list' | 'grid') => void;
  currentView: 'list' | 'grid';
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onSort,
  onViewChange,
  currentView
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSort(e.target.value);
  };

  return (
    <section className="search-filter-section">
      {/* Search Input */}
      <div className="search-container">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" strokeWidth="2"/>
          <path d="M21 21l-4.35-4.35" strokeWidth="2"/>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder={t("search_projects_placeholder")}
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
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
        <div className="view-toggle">
          <button
            className={`view-btn ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => onViewChange('list')}
            aria-label={t("list_view")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="8" y1="6" x2="21" y2="6" strokeWidth="2"/>
              <line x1="8" y1="12" x2="21" y2="12" strokeWidth="2"/>
              <line x1="8" y1="18" x2="21" y2="18" strokeWidth="2"/>
              <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="2"/>
              <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="2"/>
              <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="2"/>
            </svg>
          </button>
          <button
            className={`view-btn ${currentView === 'grid' ? 'active' : ''}`}
            onClick={() => onViewChange('grid')}
            aria-label={t("grid_view")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="7" strokeWidth="2"/>
              <rect x="14" y="14" width="7" height="7" strokeWidth="2"/>
              <rect x="3" y="14" width="7" height="7" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SearchFilter; 