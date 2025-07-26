import React from "react";
import { useTranslation } from "react-i18next";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Package,
  Users,
  DollarSign,
  Eye,
  Heart,
  ShoppingCart,
  BarChart3,
} from "lucide-react";

type TrendDirection = "up" | "down" | "stable";
type StatColor = "primary" | "success" | "warning" | "info";

interface DashboardStat {
  id: string;
  label: string;
  value: string | number;
  trend?: {
    direction: TrendDirection;
    percentage: number;
    period: string;
  };
  icon: React.ReactNode;
  color: StatColor;
}

interface DashboardStatsProps {
  stats: {
    totalNFTs: number;
    totalCollections: number;
    totalSales: number;
    totalVolume: string;
    activeListings: number;
    totalViews: number;
    totalLikes: number;
    averagePrice: string;
  };
  period?: "7d" | "30d" | "90d";
  loading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  period = "30d",
  loading = false,
}) => {
  const { t } = useTranslation();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getTrendIcon = (direction: TrendDirection) => {
    switch (direction) {
      case "up":
        return <TrendingUp size={16} />;
      case "down":
        return <TrendingDown size={16} />;
      default:
        return <Minus size={16} />;
    }
  };

  const getTrendColor = (direction: TrendDirection) => {
    switch (direction) {
      case "up":
        return "dashboard-stats__trend--positive";
      case "down":
        return "dashboard-stats__trend--negative";
      default:
        return "dashboard-stats__trend--neutral";
    }
  };

  // Mock trend data (in real app, this would come from API)
  const dashboardStats: DashboardStat[] = [
    {
      id: "total_nfts",
      label: t("total_nfts"),
      value: formatNumber(stats.totalNFTs),
      icon: <Package size={24} />,
      color: "primary",
      trend: {
        direction: "up",
        percentage: 12.5,
        period: period,
      },
    },
    {
      id: "total_volume",
      label: t("total_volume"),
      value: `${stats.totalVolume} ICP`,
      icon: <DollarSign size={24} />,
      color: "success",
      trend: {
        direction: "up",
        percentage: 8.3,
        period: period,
      },
    },
    {
      id: "total_sales",
      label: t("total_sales"),
      value: formatNumber(stats.totalSales),
      icon: <ShoppingCart size={24} />,
      color: "info",
      trend: {
        direction: "stable",
        percentage: 0,
        period: period,
      },
    },
    {
      id: "average_price",
      label: t("average_price"),
      value: `${stats.averagePrice} ICP`,
      icon: <BarChart3 size={24} />,
      color: "warning",
      trend: {
        direction: "down",
        percentage: 3.2,
        period: period,
      },
    },
    {
      id: "active_listings",
      label: t("active_listings"),
      value: formatNumber(stats.activeListings),
      icon: <Package size={24} />,
      color: "primary",
    },
    {
      id: "total_views",
      label: t("total_views"),
      value: formatNumber(stats.totalViews),
      icon: <Eye size={24} />,
      color: "info",
    },
    {
      id: "total_likes",
      label: t("total_likes"),
      value: formatNumber(stats.totalLikes),
      icon: <Heart size={24} />,
      color: "success",
    },
    {
      id: "total_collections",
      label: t("total_collections"),
      value: formatNumber(stats.totalCollections),
      icon: <Users size={24} />,
      color: "warning",
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-stats">
        <div className="dashboard-stats__header">
          <h3 className="dashboard-stats__title">{t("dashboard_stats")}</h3>
        </div>
        <div className="dashboard-stats__grid">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="dashboard-stats__card dashboard-stats__card--loading"
            >
              <div className="dashboard-stats__card-content">
                <div className="skeleton-icon"></div>
                <div className="skeleton-text skeleton-text--title"></div>
                <div className="skeleton-text skeleton-text--subtitle"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-stats">
      <div className="dashboard-stats__header">
        <h3 className="dashboard-stats__title">{t("dashboard_stats")}</h3>
        <div className="dashboard-stats__period">
          <span className="dashboard-stats__period-label">{t("period")}:</span>
          <span className="dashboard-stats__period-value">
            {period === "7d" && t("last_7_days")}
            {period === "30d" && t("last_30_days")}
            {period === "90d" && t("last_90_days")}
          </span>
        </div>
      </div>

      <div className="dashboard-stats__grid">
        {dashboardStats.map((stat) => (
          <div
            key={stat.id}
            className={`dashboard-stats__card dashboard-stats__card--${stat.color}`}
          >
            <div className="dashboard-stats__card-content">
              <div className="dashboard-stats__card-header">
                <div className="dashboard-stats__icon">{stat.icon}</div>
                {stat.trend && (
                  <div
                    className={`dashboard-stats__trend ${getTrendColor(stat.trend.direction)}`}
                  >
                    {getTrendIcon(stat.trend.direction)}
                    <span className="dashboard-stats__trend-value">
                      {stat.trend.percentage > 0 && "+"}
                      {stat.trend.percentage}%
                    </span>
                  </div>
                )}
              </div>

              <div className="dashboard-stats__card-body">
                <div className="dashboard-stats__value">{stat.value}</div>
                <div className="dashboard-stats__label">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
