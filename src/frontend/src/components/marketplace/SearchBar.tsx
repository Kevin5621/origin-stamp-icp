import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  showFilters?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder,
  className = '',
  showFilters = false
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const defaultPlaceholder = t('marketplace.search.placeholder', 'Search NFTs, collections, creators...');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setShowFilterPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleFilterToggle = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  return (
    <div className={`search-bar ${className}`} ref={searchRef}>
      <form onSubmit={handleSearch} className="search-bar__form">
        <div className={`search-bar__input-container ${isFocused ? 'focused' : ''}`}>
          <Search size={20} className="search-bar__icon" />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder || defaultPlaceholder}
            className="search-bar__input wireframe-input"
            aria-label="Search"
          />
          
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="search-bar__clear-btn"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          
          {showFilters && (
            <button
              type="button"
              onClick={handleFilterToggle}
              className={`search-bar__filter-btn ${showFilterPanel ? 'active' : ''}`}
              aria-label="Toggle filters"
            >
              <Filter size={18} />
            </button>
          )}
        </div>
        
        <button type="submit" className="btn-wireframe btn-wireframe--primary search-bar__submit">
          {t('marketplace.search.button', 'Search')}
        </button>
      </form>

      {/* Filter Panel */}
      {showFilters && showFilterPanel && (
        <div className="search-bar__filter-panel wireframe-card">
          <h4 className="search-bar__filter-title">
            {t('marketplace.search.filters', 'Filters')}
          </h4>
          
          <div className="search-bar__filter-group">
            <label className="search-bar__filter-label">
              {t('marketplace.search.category', 'Category')}
            </label>
            <select className="wireframe-input search-bar__filter-select">
              <option value="">{t('marketplace.search.allCategories', 'All Categories')}</option>
              <option value="digital-art">{t('marketplace.search.digitalArt', 'Digital Art')}</option>
              <option value="photography">{t('marketplace.search.photography', 'Photography')}</option>
              <option value="abstract">{t('marketplace.search.abstract', 'Abstract')}</option>
              <option value="portrait">{t('marketplace.search.portrait', 'Portrait')}</option>
            </select>
          </div>

          <div className="search-bar__filter-group">
            <label className="search-bar__filter-label">
              {t('marketplace.search.priceRange', 'Price Range')}
            </label>
            <div className="search-bar__price-range">
              <input
                type="number"
                placeholder="Min"
                className="wireframe-input search-bar__price-input"
              />
              <span className="search-bar__price-separator">-</span>
              <input
                type="number"
                placeholder="Max"
                className="wireframe-input search-bar__price-input"
              />
            </div>
          </div>

          <div className="search-bar__filter-group">
            <label className="search-bar__filter-label">
              {t('marketplace.search.sortBy', 'Sort By')}
            </label>
            <select className="wireframe-input search-bar__filter-select">
              <option value="newest">{t('marketplace.search.newest', 'Newest')}</option>
              <option value="oldest">{t('marketplace.search.oldest', 'Oldest')}</option>
              <option value="price-low">{t('marketplace.search.priceLow', 'Price: Low to High')}</option>
              <option value="price-high">{t('marketplace.search.priceHigh', 'Price: High to Low')}</option>
              <option value="popular">{t('marketplace.search.popular', 'Most Popular')}</option>
            </select>
          </div>

          <div className="search-bar__filter-options">
            <label className="search-bar__checkbox-label">
              <input type="checkbox" className="search-bar__checkbox" />
              <span>{t('marketplace.search.originStampVerified', 'OriginStamp Verified')}</span>
            </label>
            
            <label className="search-bar__checkbox-label">
              <input type="checkbox" className="search-bar__checkbox" />
              <span>{t('marketplace.search.creatorVerified', 'Verified Creators')}</span>
            </label>
          </div>

          <div className="search-bar__filter-actions">
            <button
              type="button"
              className="btn-wireframe btn-wireframe--secondary"
              onClick={() => setShowFilterPanel(false)}
            >
              {t('marketplace.search.cancel', 'Cancel')}
            </button>
            <button
              type="button"
              className="btn-wireframe btn-wireframe--primary"
              onClick={() => {
                // Apply filters logic here
                setShowFilterPanel(false);
              }}
            >
              {t('marketplace.search.apply', 'Apply Filters')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 