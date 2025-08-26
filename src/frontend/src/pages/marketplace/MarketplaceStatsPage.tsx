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
  color: string;
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
      icon: <DollarSign className="h-6 w-6" />,
      color:
        "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      id: "sales",
      title: t("stats.total_sales", "Total Sales"),
      value: "892",
      unit: "Items",
      change: 8.7,
      period: t("stats.this_month", "this month"),
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      id: "users",
      title: t("stats.active_users", "Active Users"),
      value: "2,456",
      unit: "Users",
      change: 15.2,
      period: t("stats.this_month", "this month"),
      icon: <Users className="h-6 w-6" />,
      color:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      id: "price",
      title: t("stats.average_price", "Average Price"),
      value: "1.38",
      unit: "ICP",
      change: -3.1,
      period: t("stats.this_month", "this month"),
      icon: <Target className="h-6 w-6" />,
      color:
        "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    },
    {
      id: "views",
      title: t("stats.total_views", "Total Views"),
      value: "45.2K",
      unit: "Views",
      change: 22.8,
      period: t("stats.this_month", "this month"),
      icon: <Eye className="h-6 w-6" />,
      color:
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    },
    {
      id: "conversion",
      title: t("stats.conversion_rate", "Conversion Rate"),
      value: "3.2",
      unit: "%",
      change: 5.4,
      period: t("stats.this_month", "this month"),
      icon: <Zap className="h-6 w-6" />,
      color:
        "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
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
    const iconProps = { size: 16, className: "text-current" };

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

  const getActivityColor = (type: RecentActivity["type"]) => {
    switch (type) {
      case "sale":
        return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      case "listing":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case "user_joined":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
      case "bid":
        return "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <AppLayout variant="marketplace">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="mb-4 h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="mb-8 h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="mb-4 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="mb-2 h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div
                        key={j}
                        className="h-4 rounded bg-gray-200 dark:bg-gray-700"
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div
                        key={j}
                        className="h-4 rounded bg-gray-200 dark:bg-gray-700"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout variant="marketplace">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl dark:text-white">
                    {t("stats.title", "Marketplace Statistics")}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600 sm:text-base lg:text-lg dark:text-gray-300">
                    {t(
                      "stats.subtitle",
                      "Track marketplace performance and trends",
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                {/* Time Frame Filter */}
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 flex-shrink-0 text-gray-500" />
                  <select
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                  className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  <span>{t("refresh", "Refresh")}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mb-8 lg:grid-cols-3 lg:gap-6">
            {statCards.map((stat, index) => (
              <div
                key={stat.id}
                className={`rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:scale-105 hover:shadow-lg lg:p-6 dark:border-gray-700 dark:bg-gray-800 ${
                  index < 3 ? "lg:transform lg:hover:scale-105" : ""
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {stat.title}
                  </h3>
                  <div className={`rounded-xl p-2.5 ${stat.color} shadow-sm`}>
                    {stat.icon}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
                      {stat.value}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.unit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div
                      className={`flex items-center space-x-1 text-sm ${
                        stat.change >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {stat.change >= 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {Math.abs(stat.change)}%
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.period}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Stats Sections */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Top Collections */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t("stats.top_collections", "Top Collections")}
                  </h2>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {topCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className="p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                          <span className="text-sm font-bold text-white">
                            {collection.rank}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {collection.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {collection.items} items
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {collection.volume.toFixed(2)} ICP
                        </div>
                        <div
                          className={`flex items-center space-x-1 text-sm ${
                            collection.change >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {collection.change >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
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
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t("stats.recent_activity", "Recent Activity")}
                  </h2>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.text}
                          </p>
                          {activity.value && (
                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                              {activity.value}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>{activity.time}</span>
                        </div>
                      </div>
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
