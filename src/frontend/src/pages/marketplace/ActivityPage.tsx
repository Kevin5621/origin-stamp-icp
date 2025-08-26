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
      title: t("activity_page.mock_activities.collection_created.title"),
      description: t(
        "activity_page.mock_activities.collection_created.description",
        { name: "Modern Abstracts" },
      ),
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      relativeTime: t("activity_page.time_ago.hours", { count: 2 }),
    },
    {
      id: "2",
      type: "certificate_verified",
      title: t("activity_page.mock_activities.certificate_verified.title"),
      description: t(
        "activity_page.mock_activities.certificate_verified.description",
        { name: "Sunset Canvas" },
      ),
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      relativeTime: t("activity_page.time_ago.hours", { count: 5 }),
    },
    {
      id: "3",
      type: "high_volume",
      title: t("activity_page.mock_activities.high_volume.title"),
      description: t("activity_page.mock_activities.high_volume.description", {
        category: "Contemporary Art",
      }),
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      relativeTime: t("activity_page.time_ago.days", { count: 1 }),
    },
    {
      id: "4",
      type: "artist_joined",
      title: t("activity_page.mock_activities.artist_joined.title"),
      description: t(
        "activity_page.mock_activities.artist_joined.description",
        { name: "Marina K." },
      ),
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      relativeTime: t("activity_page.time_ago.days", { count: 2 }),
    },
    {
      id: "5",
      type: "featured",
      title: t("activity_page.mock_activities.featured.title"),
      description: t("activity_page.mock_activities.featured.description", {
        name: "Urban Landscapes",
      }),
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      relativeTime: t("activity_page.time_ago.days", { count: 3 }),
    },
  ]);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getActivityIcon = (type: ActivityItem["type"]) => {
    const iconProps = { size: 18, className: "text-current" };

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

  const getActivityIconClass = (type: ActivityItem["type"]) => {
    switch (type) {
      case "collection_created":
        return "marketplace-activity__activity-icon--collection";
      case "certificate_verified":
        return "marketplace-activity__activity-icon--certificate";
      case "high_volume":
        return "marketplace-activity__activity-icon--trading";
      case "artist_joined":
        return "marketplace-activity__activity-icon--artist";
      case "featured":
        return "marketplace-activity__activity-icon--featured";
      default:
        return "";
    }
  };

  const getActivityBadgeClass = (type: ActivityItem["type"]) => {
    switch (type) {
      case "collection_created":
        return "marketplace-activity__activity-badge--collection";
      case "certificate_verified":
        return "marketplace-activity__activity-badge--certificate";
      case "high_volume":
        return "marketplace-activity__activity-badge--trading";
      case "artist_joined":
        return "marketplace-activity__activity-badge--artist";
      case "featured":
        return "marketplace-activity__activity-badge--featured";
      default:
        return "";
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
        <div className="marketplace-activity">
          <div className="marketplace-activity__container">
            <div className="marketplace-activity__loading">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-subtitle"></div>

              <div className="marketplace-activity__loading-filters">
                <div className="skeleton skeleton-search"></div>
                <div className="skeleton skeleton-filters"></div>
              </div>

              <div className="marketplace-activity__loading-list">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="skeleton skeleton-item"></div>
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
      <div className="marketplace-activity">
        <div className="marketplace-activity__container">
          {/* Header */}
          <div className="marketplace-activity__header">
            <div className="marketplace-activity__title-section">
              <div className="marketplace-activity__title-icon">
                <Activity />
              </div>
              <div className="marketplace-activity__title-content">
                <h1>{t("activity_title", "Marketplace Activity")}</h1>
                <p>
                  {t(
                    "activity_subtitle",
                    "Recent transactions and marketplace events",
                  )}
                </p>
              </div>
              <div className="marketplace-activity__controls">
                {/* Filter Buttons */}
                <div className="marketplace-activity__filter-buttons">
                  {[
                    {
                      key: "all",
                      label: t("activity_page.filter_all"),
                      icon: Activity,
                    },
                    {
                      key: "collection_created",
                      label: t("activity_page.filter_collections"),
                      icon: Sparkles,
                    },
                    {
                      key: "certificate_verified",
                      label: t("activity_page.filter_certificates"),
                      icon: CheckCircle,
                    },
                    {
                      key: "high_volume",
                      label: t("activity_page.filter_trading"),
                      icon: TrendingUp,
                    },
                    {
                      key: "artist_joined",
                      label: t("activity_page.filter_artists"),
                      icon: UserPlus,
                    },
                    {
                      key: "featured",
                      label: t("activity_page.filter_featured"),
                      icon: Star,
                    },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`marketplace-activity__filter-btn ${
                        filter === key
                          ? "marketplace-activity__filter-btn--active"
                          : ""
                      }`}
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="marketplace-activity__search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder={t("activity_page.search_activities")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          {filteredActivities.length > 0 ? (
            <div className="marketplace-activity__activity-list">
              <div className="marketplace-activity__list-header">
                <Activity size={18} />
                <h2>{t("activity_page.activity_feed")}</h2>
                <span>
                  (
                  {t("activity_page.activities_count", {
                    count: filteredActivities.length,
                  })}
                  )
                </span>
              </div>

              <div className="marketplace-activity__list-content">
                {filteredActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`marketplace-activity__activity-item ${
                      index === 0
                        ? "marketplace-activity__activity-item--latest"
                        : ""
                    }`}
                  >
                    <div className="marketplace-activity__activity-content">
                      <div
                        className={`marketplace-activity__activity-icon ${getActivityIconClass(activity.type)}`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="marketplace-activity__activity-details">
                        <div className="marketplace-activity__activity-header">
                          <h3 className="marketplace-activity__activity-title">
                            {activity.title}
                          </h3>
                          <span
                            className={`marketplace-activity__activity-badge ${getActivityBadgeClass(activity.type)}`}
                          >
                            {activity.type
                              .replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        </div>
                        <p className="marketplace-activity__activity-description">
                          {activity.description}
                        </p>
                        <div className="marketplace-activity__activity-meta">
                          <div className="marketplace-activity__activity-time">
                            <Clock size={14} />
                            <span>{activity.relativeTime}</span>
                            {index === 0 && (
                              <span className="marketplace-activity__latest-badge">
                                {t("activity_page.latest")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="marketplace-activity__empty">
              <div className="marketplace-activity__empty-icon">
                <Activity />
              </div>
              <h3 className="marketplace-activity__empty-title">
                {t("activity_page.activity_empty_title")}
              </h3>
              <p className="marketplace-activity__empty-description">
                {searchTerm || filter !== "all"
                  ? t("activity_page.activity_no_results")
                  : t("activity_page.activity_empty_description")}
              </p>
              {(searchTerm || filter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                  className="marketplace-activity__clear-filters"
                >
                  {t("activity_page.clear_filters")}
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
