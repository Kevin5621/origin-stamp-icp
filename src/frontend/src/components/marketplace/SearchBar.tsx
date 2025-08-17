import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder,
  className = "",
}) => {
  const { t } = useTranslation("marketplace");
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value === "") {
      onSearch("");
    }
  };

  return (
    <form className={`search-bar ${className}`} onSubmit={handleSubmit}>
      <div className="search-bar__container">
        <div className="search-bar__input-wrapper">
          <svg
            className="search-bar__icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            className="search-bar__input"
            placeholder={placeholder || t("search_placeholder")}
            value={query}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="search-bar__button">
          {t("search")}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
