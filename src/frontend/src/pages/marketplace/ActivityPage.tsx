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
        <div className="marketplace-activity marketplace-activity__loading">
          <div className="marketplace-activity__container">
            <div className="marketplace-activity__header">
              <div className="marketplace-activity__header-content">
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
                </div>
                <div className="marketplace-activity__stats">
                  <div className="marketplace-activity__stat-card">
                    <div className="marketplace-activity__stat-card-value">
                      5
                    </div>
                    <div className="marketplace-activity__stat-card-label">
                      Total
                    </div>
                  </div>
                  <div className="marketplace-activity__stat-card marketplace-activity__stat-card--live">
                    <div className="marketplace-activity__stat-card-value">
                      Live
                    </div>
                    <div className="marketplace-activity__stat-card-label">
                      Status
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="marketplace-activity__feed">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="marketplace-activity__activity-card">
                  <div className="marketplace-activity__activity-content">
                    <div className="marketplace-activity__activity-icon"></div>
                    <div className="marketplace-activity__activity-details">
                      <div className="marketplace-activity__activity-header">
                        <h3 className="marketplace-activity__activity-title"></h3>
                        <span className="marketplace-activity__activity-badge"></span>
                      </div>
                      <p className="marketplace-activity__activity-description"></p>
                      <div className="marketplace-activity__activity-meta">
                        <div className="marketplace-activity__activity-time"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
            <div className="marketplace-activity__header-content">
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
              </div>

              {/* Activity Stats */}
              <div className="marketplace-activity__stats">
                <div className="marketplace-activity__stat-card">
                  <div className="marketplace-activity__stat-card-value">
                    {filteredActivities.length}
                  </div>
                  <div className="marketplace-activity__stat-card-label">
                    Total
                  </div>
                </div>
                <div className="marketplace-activity__stat-card marketplace-activity__stat-card--live">
                  <div className="marketplace-activity__stat-card-value">
                    Live
                  </div>
                  <div className="marketplace-activity__stat-card-label">
                    Status
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="marketplace-activity__filters">
            <div className="marketplace-activity__filters-content">
              {/* Search */}
              <div className="marketplace-activity__search">
                <Search />
                <input
                  type="text"
                  placeholder={t("search_activities", "Search activities...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Buttons */}
              <div className="marketplace-activity__filter-buttons">
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
                    className={`marketplace-activity__filter-btn ${
                      filter === key
                        ? "marketplace-activity__filter-btn--active"
                        : ""
                    }`}
                  >
                    <Icon />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          {filteredActivities.length > 0 ? (
            <div className="marketplace-activity__feed">
              {filteredActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`marketplace-activity__activity-card ${
                    index === 0
                      ? "marketplace-activity__activity-card--latest"
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
                          <Clock />
                          <span>{activity.relativeTime}</span>
                          {index === 0 && (
                            <span className="marketplace-activity__latest-badge">
                              Latest
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              <div className="marketplace-activity__load-more">
                <button>{t("load_more", "Load More Activities")}</button>
              </div>
            </div>
          ) : (
            <div className="marketplace-activity__empty-state">
              <div className="marketplace-activity__empty-icon">
                <Activity />
              </div>
              <h3 className="marketplace-activity__empty-title">
                {t("activity_empty_title", "No Activity Found")}
              </h3>
              <p className="marketplace-activity__empty-description">
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
                  className="marketplace-activity__clear-filters"
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
