import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import StatsSummary from "./StatsSummary";
import StatsChart from "./StatsChart";
import TopCollectionsTable from "./TopCollectionsTable";
import { TimeRange, TimeRangeType } from "./types";
import {
  generateSummaryMetrics,
  generateVolumeData,
  generateSalesData,
  generateTopCollections,
  timeRanges,
} from "./statsData";

interface StatsViewProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  className?: string;
}

export const StatsView: React.FC<StatsViewProps> = ({
  timeRange,
  onTimeRangeChange,
  className = "",
}) => {
  const { t } = useTranslation("marketplace");
  const [isLoading, setIsLoading] = useState(true);
  
  // Data states
  const [metrics, setMetrics] = useState(generateSummaryMetrics("7d"));
  const [volumeData, setVolumeData] = useState(generateVolumeData("7d"));
  const [salesData, setSalesData] = useState(generateSalesData("7d"));
  const [collections, setCollections] = useState(generateTopCollections("7d"));

  useEffect(() => {
    // Simulate API loading
    setIsLoading(true);
    
    setTimeout(() => {
      const typedTimeRange = timeRange as TimeRangeType;
      setMetrics(generateSummaryMetrics(typedTimeRange));
      setVolumeData(generateVolumeData(typedTimeRange));
      setSalesData(generateSalesData(typedTimeRange));
      setCollections(generateTopCollections(typedTimeRange));
      setIsLoading(false);
    }, 500);
  }, [timeRange]);

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTimeRangeChange(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="stats-view__loading">
        <div className="stats-view__loading-spinner"></div>
        <p>{t("loading_marketplace")}</p>
      </div>
    );
  }

  return (
    <div className={`stats-view ${className}`}>
      <div className="stats-view__header">
        <div className="stats-view__title-container">
          <h1 className="stats-view__title">{t("stats.title")}</h1>
          <p className="stats-view__subtitle">{t("stats.subtitle")}</p>
        </div>
        <div className="stats-view__filters">
          <div className="stats-view__time-range">
            <select
              value={timeRange}
              onChange={handleTimeRangeChange}
              className="stats-view__select"
            >
              {timeRanges.map((range) => (
                <option key={range.id} value={range.id}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="stats-view__summary">
        <StatsSummary metrics={metrics} />
      </div>

      <div className="stats-view__charts">
        <StatsChart volumeData={volumeData} salesData={salesData} />
      </div>

      <div className="stats-view__collections">
        <TopCollectionsTable collections={collections} />
      </div>
    </div>
  );
};

export default StatsView;
