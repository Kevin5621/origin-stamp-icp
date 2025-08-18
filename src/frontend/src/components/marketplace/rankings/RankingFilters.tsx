import React from "react";
import { useTranslation } from "react-i18next";
import { TimePeriod } from "./Rankings";

interface RankingFiltersProps {
  timePeriod: TimePeriod;
  category: string;
  blockchain: string;
  onTimePeriodChange: (period: TimePeriod) => void;
  onCategoryChange: (category: string) => void;
  onBlockchainChange: (blockchain: string) => void;
}

const RankingFilters: React.FC<RankingFiltersProps> = ({
  timePeriod,
  category,
  blockchain,
  onTimePeriodChange,
  onCategoryChange,
  onBlockchainChange
}) => {
  const { t } = useTranslation("marketplace");

  const timePeriodOptions: { value: TimePeriod; label: string }[] = [
    { value: "24h", label: t("rankings.time_period.24h", "24h") },
    { value: "7d", label: t("rankings.time_period.7d", "7d") },
    { value: "30d", label: t("rankings.time_period.30d", "30d") },
    { value: "all", label: t("rankings.time_period.all", "All Time") }
  ];

  const categoryOptions = [
    { value: "all", label: t("rankings.category.all", "All Categories") },
    { value: "Art", label: t("rankings.category.art", "Art") },
    { value: "Collectibles", label: t("rankings.category.collectibles", "Collectibles") },
    { value: "Music", label: t("rankings.category.music", "Music") },
    { value: "Games", label: t("rankings.category.games", "Games") },
    { value: "Photography", label: t("rankings.category.photography", "Photography") },
    { value: "Virtual Worlds", label: t("rankings.category.virtual_worlds", "Virtual Worlds") }
  ];

  const blockchainOptions = [
    { value: "all", label: t("rankings.blockchain.all", "All Blockchains") },
    { value: "Ethereum", label: t("rankings.blockchain.ethereum", "Ethereum") },
    { value: "Solana", label: t("rankings.blockchain.solana", "Solana") },
    { value: "ICP", label: t("rankings.blockchain.icp", "Internet Computer") },
    { value: "Polygon", label: t("rankings.blockchain.polygon", "Polygon") },
    { value: "Binance", label: t("rankings.blockchain.binance", "Binance") }
  ];

  return (
    <div className="ranking-filters">
      <div className="ranking-filters__group ranking-filters__time">
        <ul className="ranking-filters__time-list">
          {timePeriodOptions.map((option) => (
            <li key={option.value}>
              <button
                className={`ranking-filters__time-button ${
                  timePeriod === option.value ? "ranking-filters__time-button--active" : ""
                }`}
                onClick={() => onTimePeriodChange(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="ranking-filters__group">
        <select
          className="ranking-filters__select"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="ranking-filters__group">
        <select
          className="ranking-filters__select"
          value={blockchain}
          onChange={(e) => onBlockchainChange(e.target.value)}
        >
          {blockchainOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RankingFilters;
