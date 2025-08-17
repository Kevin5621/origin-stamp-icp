import React from "react";
import DashboardCard from "./DashboardCard";

interface StatItem {
  title: string;
  value: string | number;
  icon?: string;
  description?: string;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
  action?: {
    label: string;
    href: string;
  };
}

interface DashboardStatsProps {
  stats: StatItem[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="dashboard-stats">
      {stats.map((stat, index) => (
        <DashboardCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
          trend={stat.trend}
          trendType={stat.trendType}
          action={stat.action}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
