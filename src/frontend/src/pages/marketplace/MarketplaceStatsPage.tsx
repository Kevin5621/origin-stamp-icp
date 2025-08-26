import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "../../components/layout/AppLayout";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  Calendar,
  Eye,
  Target,
  Zap,
  Crown,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";

interface StatCard {
  id: string;
  title: string;
  value: string;
  unit: string;
  change: number;
  period: string;
  icon: React.ReactNode;
  colorClass: string;
}

interface TopCollection {
  id: string;
  name: string;
  volume: number;
  change: number;
  items: number;
  rank: number;
}

interface RecentActivity {
  id: string;
  type: "sale" | "listing" | "user_joined" | "bid";
  text: string;
  time: string;
  value?: string;
}

type TimeFrame = "24h" | "7d" | "30d" | "all";

export const MarketplaceStatsPage: React.FC = () => {
  const { t } = useTranslation("marketplace");
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("30d");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [timeFrame]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Mock data - will be replaced with backend data
  const statCards: StatCard[] = [
    {
      id: "volume",
      title: t("stats.total_volume", "Total Volume"),
      value: "1,234.56",
      unit: "ICP",
      change: 12.3,
      period: t("stats.this_month", "this month"),
      icon: <DollarSign size={14} />,
      colorClass: "success",
    },
    {
      id: "sales",
      title: t("stats.total_sales", "Total Sales"),
      value: "892",
      unit: "Items",
      change: 8.7,
      period: t("stats.this_month", "this month"),
      icon: <ShoppingCart size={14} />,
      colorClass: "info",
    },
    {
      id: "users",
      title: t("stats.active_users", "Active Users"),
      value: "2,456",
      unit: "Users",
      change: 15.2,
      period: t("stats.this_month", "this month"),
      icon: <Users size={14} />,
      colorClass: "purple",
    },
    {
      id: "price",
      title: t("stats.average_price", "Average Price"),
      value: "1.38",
      unit: "ICP",
      change: -3.1,
      period: t("stats.this_month", "this month"),
      icon: <Target size={14} />,
      colorClass: "warning",
    },
    {
      id: "views",
      title: t("stats.total_views", "Total Views"),
      value: "45.2K",
      unit: "Views",
      change: 22.8,
      period: t("stats.this_month", "this month"),
      icon: <Eye size={14} />,
      colorClass: "primary",
    },
    {
      id: "conversion",
      title: t("stats.conversion_rate", "Conversion Rate"),
      value: "3.2",
      unit: "%",
      change: 5.4,
      period: t("stats.this_month", "this month"),
      icon: <Zap size={14} />,
      colorClass: "accent",
    },
  ];

  const topCollections: TopCollection[] = [
    {
      id: "1",
      name: "Digital Artworks",
      volume: 456.78,
      change: 18.5,
      items: 124,
      rank: 1,
    },
    {
      id: "2",
      name: "Abstract Paintings",
      volume: 234.56,
      change: 12.3,
      items: 89,
      rank: 2,
    },
    {
      id: "3",
      name: "Photography Collection",
      volume: 123.45,
      change: -5.2,
      items: 156,
      rank: 3,
    },
    {
      id: "4",
      name: "Modern Sculptures",
      volume: 98.76,
      change: 7.8,
      items: 67,
      rank: 4,
    },
    {
      id: "5",
      name: "Digital Landscapes",
      volume: 87.34,
      change: 25.1,
      items: 203,
      rank: 5,
    },
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: "1",
      type: "sale",
      text: 'Sale completed: "Ocean Waves"',
      time: "2 mins ago",
      value: "2.5 ICP",
    },
    {
      id: "2",
      type: "listing",
      text: 'New artwork listed: "Sunset Dreams"',
      time: "5 mins ago",
    },
    {
      id: "3",
      type: "bid",
      text: 'New bid placed on "Mountain Peak"',
      time: "8 mins ago",
      value: "1.8 ICP",
    },
    {
      id: "4",
      type: "user_joined",
      text: "New user joined the marketplace",
      time: "12 mins ago",
    },
    {
      id: "5",
      type: "sale",
      text: 'Sale completed: "Abstract Mind"',
      time: "15 mins ago",
      value: "3.2 ICP",
    },
  ];

  const getActivityIcon = (type: RecentActivity["type"]) => {
    const iconProps = { size: 12 };

    switch (type) {
      case "sale":
        return <ShoppingCart {...iconProps} />;
      case "listing":
        return <Activity {...iconProps} />;
      case "user_joined":
        return <Users {...iconProps} />;
      case "bid":
        return <TrendingUp {...iconProps} />;
      default:
        return <Activity {...iconProps} />;
    }
  };

  const getActivityColorClass = (type: RecentActivity["type"]) => {
    switch (type) {
      case "sale":
        return "sale";
      case "listing":
        return "listing";
      case "user_joined":
        return "user-joined";
      case "bid":
        return "bid";
      default:
        return "listing";
    }
  };

  if (loading) {
    return (
      <AppLayout variant="marketplace">
        <div className="marketplace-stats">
          <div className="marketplace-stats__container">
            <div className="marketplace-stats__loading">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-subtitle"></div>

              <div className="marketplace-stats__metrics-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="skeleton skeleton-card"></div>
                ))}
              </div>

              <div className="marketplace-stats__sections-grid">
                <div className="skeleton skeleton-section"></div>
                <div className="skeleton skeleton-section"></div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout variant="marketplace">
      <div className="marketplace-stats">
        <div className="marketplace-stats__container">
          {/* Header */}
          <div className="marketplace-stats__header">
            <div className="marketplace-stats__title-section">
              <div className="marketplace-stats__title-icon">
                <BarChart3 />
              </div>
              <div className="marketplace-stats__title-content">
                <h1>{t("stats.title", "Marketplace Statistics")}</h1>
                <p>
                  {t(
                    "stats.subtitle",
                    "Track marketplace performance and trends",
                  )}
                </p>
              </div>
              <div className="marketplace-stats__controls">
                {/* Time Frame Filter */}
                <div className="marketplace-stats__timeframe-selector">
                  <Calendar size={16} />
                  <select
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
                  >
                    <option value="24h">
                      {t("timeframe_24h", "Last 24 Hours")}
                    </option>
                    <option value="7d">
                      {t("timeframe_7d", "Last 7 Days")}
                    </option>
                    <option value="30d">
                      {t("timeframe_30d", "Last 30 Days")}
                    </option>
                    <option value="all">
                      {t("timeframe_all", "All Time")}
                    </option>
                  </select>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="marketplace-stats__refresh-btn"
                >
                  <RefreshCw className={refreshing ? "spinning" : ""} />
                  <span>{t("refresh", "Refresh")}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="marketplace-stats__metrics-grid">
            {statCards.map((stat) => (
              <div key={stat.id} className="marketplace-stats__metric-card">
                <div className="marketplace-stats__metric-card-header">
                  <h3 className="marketplace-stats__metric-card-title">
                    {stat.title}
                  </h3>
                  <div
                    className={`marketplace-stats__metric-card-icon ${stat.colorClass}`}
                  >
                    {stat.icon}
                  </div>
                </div>

                <div className="marketplace-stats__metric-card-value">
                  <span className="value">{stat.value}</span>
                  <span className="unit">{stat.unit}</span>
                </div>

                <div className="marketplace-stats__metric-card-change">
                  <div
                    className={`change-indicator ${
                      stat.change >= 0 ? "positive" : "negative"
                    }`}
                  >
                    {stat.change >= 0 ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                    <span>{Math.abs(stat.change)}%</span>
                  </div>
                  <span className="period">{stat.period}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Stats Sections */}
          <div className="marketplace-stats__sections-grid">
            {/* Top Collections */}
            <div className="marketplace-stats__section-card">
              <div className="marketplace-stats__section-card-header">
                <div className="header-content">
                  <Crown size={14} />
                  <h2>{t("stats.top_collections", "Top Collections")}</h2>
                </div>
              </div>

              <div className="marketplace-stats__section-card-content">
                {topCollections.map((collection) => (
                  <div key={collection.id} className="item">
                    <div className="item-content">
                      <div className="item-left">
                        <div className="rank-badge">
                          <span>{collection.rank}</span>
                        </div>
                        <div className="item-details">
                          <h3>{collection.name}</h3>
                          <p>{collection.items} items</p>
                        </div>
                      </div>
                      <div className="item-right">
                        <div className="item-value">
                          {collection.volume.toFixed(2)} ICP
                        </div>
                        <div
                          className={`change-indicator ${
                            collection.change >= 0 ? "positive" : "negative"
                          }`}
                        >
                          {collection.change >= 0 ? (
                            <TrendingUp size={12} />
                          ) : (
                            <TrendingDown size={12} />
                          )}
                          <span>{Math.abs(collection.change)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="marketplace-stats__section-card">
              <div className="marketplace-stats__section-card-header">
                <div className="header-content">
                  <Activity size={14} />
                  <h2>{t("stats.recent_activity", "Recent Activity")}</h2>
                </div>
              </div>

              <div className="marketplace-stats__section-card-content">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="item">
                    <div className="item-content">
                      <div className="item-left">
                        <div
                          className={`activity-icon ${getActivityColorClass(activity.type)}`}
                        >
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="item-details">
                          <h3>{activity.text}</h3>
                          <div className="item-time">
                            <Clock size={12} />
                            <span>{activity.time}</span>
                          </div>
                        </div>
                      </div>
                      {activity.value && (
                        <div className="item-right">
                          <div className="item-value">{activity.value}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MarketplaceStatsPage;
