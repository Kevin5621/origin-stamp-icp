import React from "react";
import { useTranslation } from "react-i18next";
import { StatMetric } from "./types";

interface StatsSummaryProps {
  metrics: StatMetric[];
  className?: string;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  metrics,
  className = "",
}) => {
  const { t } = useTranslation("marketplace");

  return (
    <div className={`stats-summary ${className}`}>
      <div className="stats-summary__grid">
        {metrics.map((metric) => (
          <div key={metric.id} className="stats-summary__card">
            <div className="stats-summary__icon">
              <span dangerouslySetInnerHTML={{ __html: metric.icon }} />
            </div>
            <div className="stats-summary__content">
              <h3 className="stats-summary__title">{metric.title}</h3>
              <div className="stats-summary__value-container">
                <span className="stats-summary__value">{metric.value}</span>
                <span
                  className={`stats-summary__trend ${
                    metric.trend >= 0
                      ? "stats-summary__trend--positive"
                      : "stats-summary__trend--negative"
                  }`}
                >
                  {metric.trend >= 0 ? "+" : ""}
                  {metric.trend}%
                  <span className="stats-summary__trend-arrow">
                    {metric.trend >= 0 ? "↑" : "↓"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSummary;
