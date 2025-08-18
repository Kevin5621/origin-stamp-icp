import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface PriceRange {
  min: number;
  max: number;
}

interface PriceFilterProps {
  onPriceChange: (range: PriceRange) => void;
  className?: string;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  onPriceChange,
  className = "",
}) => {
  const { t } = useTranslation("marketplace");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleApply = () => {
    const range: PriceRange = {
      min: minPrice ? parseFloat(minPrice) : 0,
      max: maxPrice ? parseFloat(maxPrice) : Infinity,
    };
    onPriceChange(range);
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    onPriceChange({ min: 0, max: Infinity });
  };

  return (
    <div className={`price-filter ${className}`}>
      <h3 className="price-filter__title">{t("price_range")}</h3>
      <div className="price-filter__inputs">
        <div className="price-filter__input-group">
          <label className="price-filter__label">{t("min_price")}</label>
          <input
            type="number"
            className="price-filter__input"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className="price-filter__input-group">
          <label className="price-filter__label">{t("max_price")}</label>
          <input
            type="number"
            className="price-filter__input"
            placeholder="∞"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
      <div className="price-filter__actions">
        <button className="price-filter__apply" onClick={handleApply}>
          {t("apply")}
        </button>
        <button className="price-filter__reset" onClick={handleReset}>
          {t("reset")}
        </button>
      </div>
    </div>
  );
};

export default PriceFilter;
