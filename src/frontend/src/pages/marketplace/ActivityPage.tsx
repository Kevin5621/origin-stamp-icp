import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "../../components/layout/AppLayout";
import {
  Sparkles,
  CheckCircle,
  TrendingUp,
  UserPlus,
  Star,
  Activity,
  Clock,
  Search,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type:
    | "collection_created"
    | "certificate_verified"
    | "high_volume"
    | "artist_joined"
    | "featured";
  title: string;
  description: string;
  timestamp: string;
  relativeTime: string;
}

export const ActivityPage: React.FC = () => {
  const { t } = useTranslation("marketplace");
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Mock activity data - in real app this would come from backend
  const [activities] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "collection_created",
      title: "Digital Art Collection Created",
      description: 'New collection "Modern Abstracts" added to marketplace',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      relativeTime: "2 hours ago",
    },
    {
      id: "2",
      type: "certificate_verified",
      title: "Certificate Verified",
      description: 'Artwork "Sunset Canvas" certificate has been verified',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      relativeTime: "5 hours ago",
    },
    {
      id: "3",
      type: "high_volume",
      title: "High Volume Trading",
      description: 'Increased activity in "Contemporary Art" category',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      relativeTime: "1 day ago",
    },
    {
      id: "4",
      type: "artist_joined",
      title: "New Artist Joined",
      description: 'Artist "Marina K." joined the marketplace',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      relativeTime: "2 days ago",
    },
    {
      id: "5",
      type: "featured",
      title: "Featured Collection",
      description: '"Urban Landscapes" has been featured on homepage',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      relativeTime: "3 days ago",
    },
  ]);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getActivityIcon = (type: ActivityItem["type"]) => {
    const iconProps = { size: 20, className: "text-current" };

    switch (type) {
      case "collection_created":
        return <Sparkles {...iconProps} />;
      case "certificate_verified":
        return <CheckCircle {...iconProps} />;
      case "high_volume":
        return <TrendingUp {...iconProps} />;
      case "artist_joined":
        return <UserPlus {...iconProps} />;
      case "featured":
        return <Star {...iconProps} />;
      default:
        return <Activity {...iconProps} />;
    }
  };

  const getActivityIconColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "collection_created":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
      case "certificate_verified":
        return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400";
      case "high_volume":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case "artist_joined":
        return "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400";
      case "featured":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesFilter = filter === "all" || activity.type === filter;
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <AppLayout variant="marketplace">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="mb-4 h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="mb-8 h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="flex-1">
                        <div className="mb-2 h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                        <div className="mb-2 h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-3 w-1/6 rounded bg-gray-200 dark:bg-gray-700"></div>
                      </div>
                    </div>
                  </div>
                ))}
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
        <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl dark:text-white">
                    {t("activity_title", "Marketplace Activity")}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600 sm:text-base lg:text-lg dark:text-gray-300">
                    {t(
                      "activity_subtitle",
                      "Recent transactions and marketplace events",
                    )}
                  </p>
                </div>
              </div>

              {/* Activity Stats */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-center dark:border-gray-700 dark:bg-gray-800">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {filteredActivities.length}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">Total</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-center dark:border-gray-700 dark:bg-gray-800">
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    Live
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">Status</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="p-4 lg:p-6">
              <div className="flex flex-col gap-4 lg:flex-row">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="text"
                      placeholder={t(
                        "search_activities",
                        "Search activities...",
                      )}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pr-4 pl-10 text-gray-900 placeholder-gray-500 transition-all focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      key: "all",
                      label: t("filter_all", "All Activities"),
                      icon: Activity,
                    },
                    {
                      key: "collection_created",
                      label: t("filter_collections", "Collections"),
                      icon: Sparkles,
                    },
                    {
                      key: "certificate_verified",
                      label: t("filter_certificates", "Certificates"),
                      icon: CheckCircle,
                    },
                    {
                      key: "high_volume",
                      label: t("filter_trading", "Trading"),
                      icon: TrendingUp,
                    },
                    {
                      key: "artist_joined",
                      label: t("filter_artists", "Artists"),
                      icon: UserPlus,
                    },
                    {
                      key: "featured",
                      label: t("filter_featured", "Featured"),
                      icon: Star,
                    },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        filter === key
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          {filteredActivities.length > 0 ? (
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-indigo-300 hover:shadow-lg lg:p-6 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-600 ${
                    index === 0
                      ? "ring-2 ring-indigo-100 dark:ring-indigo-900/20"
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${getActivityIconColor(activity.type)} shadow-sm`}
                    >
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <h3 className="mb-2 text-lg leading-tight font-semibold text-gray-900 dark:text-white">
                            {activity.title}
                          </h3>
                          <p className="mb-3 leading-relaxed text-gray-600 dark:text-gray-300">
                            {activity.description}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>{activity.relativeTime}</span>
                            {index === 0 && (
                              <span className="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                Latest
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Activity Type Badge */}
                        <div className="flex-shrink-0">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                              activity.type === "collection_created"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                                : activity.type === "certificate_verified"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                  : activity.type === "high_volume"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                                    : activity.type === "artist_joined"
                                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
                                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                            }`}
                          >
                            {activity.type
                              .replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              <div className="pt-6 text-center">
                <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl">
                  {t("load_more", "Load More Activities")}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center lg:p-12 dark:border-gray-700 dark:bg-gray-800">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                <Activity className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                {t("activity_empty_title", "No Activity Found")}
              </h3>
              <p className="mx-auto mb-6 max-w-md leading-relaxed text-gray-600 dark:text-gray-300">
                {searchTerm || filter !== "all"
                  ? t(
                      "activity_no_results",
                      "No activities match your current filters. Try adjusting your search or filter settings.",
                    )
                  : t(
                      "activity_empty_description",
                      "Marketplace activity will appear here once transactions begin.",
                    )}
              </p>
              {(searchTerm || filter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                  className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg transition-colors hover:bg-indigo-700"
                >
                  {t("clear_filters", "Clear Filters")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ActivityPage;
