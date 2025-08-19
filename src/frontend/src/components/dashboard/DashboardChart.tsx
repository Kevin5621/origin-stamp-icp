import React, { useState } from "react";

interface ChartData {
  month: string;
  revenue: number;
}

interface DashboardChartProps {
  title: string;
  data: ChartData[];
  type: "line" | "bar" | "pie";
}

const DashboardChart: React.FC<DashboardChartProps> = ({
  title,
  data,
  type: _type, // TODO: Implement different chart types
}) => {
  const [timeRange, setTimeRange] = useState("7d");

  const timeRanges = [
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "90d", label: "90D" },
    { value: "1y", label: "1Y" },
  ];

  return (
    <div className="dashboard-chart">
      <div className="dashboard-chart__header">
        <h3 className="dashboard-chart__title">{title}</h3>
        <div className="dashboard-chart__controls">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`dashboard-chart__control ${
                timeRange === range.value
                  ? "dashboard-chart__control--active"
                  : ""
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      <div className="dashboard-chart__content">
        <div className="dashboard-chart__placeholder">
          <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
          </svg>
          <p>Chart visualization will be implemented here</p>
          <small>Data: {data.length} points</small>
        </div>
      </div>
    </div>
  );
};

export default DashboardChart;
