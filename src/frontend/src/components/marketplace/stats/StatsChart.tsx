import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTranslation } from "react-i18next";
import { ChartDataPoint } from "./types";

interface StatsChartProps {
  volumeData: ChartDataPoint[];
  salesData: ChartDataPoint[];
  className?: string;
}

export const StatsChart: React.FC<StatsChartProps> = ({
  volumeData,
  salesData,
  className = "",
}) => {
  const { t } = useTranslation("marketplace");

  const formatVolume = (value: number) => {
    return `${value.toFixed(2)} ETH`;
  };

  return (
    <div className={`stats-charts ${className}`}>
      <div className="stats-charts__container">
        <div className="stats-charts__item">
          <h3 className="stats-charts__title">{t("stats.volume_over_time")}</h3>
          <div className="stats-charts__content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={volumeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stats-charts__grid"
                />
                <XAxis
                  dataKey="date"
                  className="stats-charts__axis"
                  tickMargin={10}
                />
                <YAxis
                  className="stats-charts__axis"
                  tickFormatter={formatVolume}
                  tickMargin={10}
                />
                <Tooltip
                  formatter={formatVolume}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name={t("stats.volume")}
                  className="stats-charts__line"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stats-charts__item">
          <h3 className="stats-charts__title">{t("stats.sales_per_day")}</h3>
          <div className="stats-charts__content">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={salesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stats-charts__grid"
                />
                <XAxis
                  dataKey="date"
                  className="stats-charts__axis"
                  tickMargin={10}
                />
                <YAxis className="stats-charts__axis" tickMargin={10} />
                <Tooltip
                  formatter={(value: number) => [`${value} sales`, "Sales"]}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="sales"
                  name={t("stats.sales")}
                  className="stats-charts__area"
                  strokeWidth={2}
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsChart;
