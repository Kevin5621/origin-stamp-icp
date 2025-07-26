import React from "react";
import { useTranslation } from "react-i18next";
import {
  Package,
  ShoppingCart,
  Heart,
  Eye,
  Users,
  Plus,
  Check,
  Clock,
  TrendingUp,
  Edit,
  Share2,
} from "lucide-react";

type ActivityType =
  | "nft_created"
  | "nft_sold"
  | "nft_liked"
  | "nft_viewed"
  | "collection_created"
  | "follow_user"
  | "listing_created"
  | "listing_updated"
  | "offer_received"
  | "offer_accepted"
  | "profile_updated";

interface Activity {
  id: string;
  type: ActivityType;
  timestamp: string;
  nftTitle?: string;
  nftId?: string;
  nftImage?: string;
  price?: string;
  buyer?: string;
  seller?: string;
  collectionName?: string;
  collectionId?: string;
  username?: string;
  description?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  loading = false,
  onLoadMore,
  hasMore = false,
}) => {
  const { t } = useTranslation();

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "nft_created":
        return <Plus size={20} />;
      case "nft_sold":
        return <ShoppingCart size={20} />;
      case "nft_liked":
        return <Heart size={20} />;
      case "nft_viewed":
        return <Eye size={20} />;
      case "collection_created":
        return <Package size={20} />;
      case "follow_user":
        return <Users size={20} />;
      case "listing_created":
        return <Plus size={20} />;
      case "listing_updated":
        return <Edit size={20} />;
      case "offer_received":
        return <TrendingUp size={20} />;
      case "offer_accepted":
        return <Check size={20} />;
      case "profile_updated":
        return <Edit size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  const getActivityColor = (type: ActivityType) => {
    switch (type) {
      case "nft_created":
      case "collection_created":
      case "listing_created":
        return "activity-feed__icon--success";
      case "nft_sold":
      case "offer_accepted":
        return "activity-feed__icon--primary";
      case "nft_liked":
      case "follow_user":
        return "activity-feed__icon--warning";
      case "offer_received":
        return "activity-feed__icon--info";
      case "profile_updated":
        return "activity-feed__icon--neutral";
      default:
        return "activity-feed__icon--neutral";
    }
  };

  const formatActivityTitle = (activity: Activity) => {
    switch (activity.type) {
      case "nft_created":
        return t("activity_nft_created", { title: activity.nftTitle });
      case "nft_sold":
        return t("activity_nft_sold", {
          title: activity.nftTitle,
          buyer: activity.buyer,
        });
      case "nft_liked":
        return t("activity_nft_liked", { title: activity.nftTitle });
      case "nft_viewed":
        return t("activity_nft_viewed", { title: activity.nftTitle });
      case "collection_created":
        return t("activity_collection_created", {
          name: activity.collectionName,
        });
      case "follow_user":
        return t("activity_follow_user", { username: activity.username });
      case "listing_created":
        return t("activity_listing_created", { title: activity.nftTitle });
      case "listing_updated":
        return t("activity_listing_updated", { title: activity.nftTitle });
      case "offer_received":
        return t("activity_offer_received", { title: activity.nftTitle });
      case "offer_accepted":
        return t("activity_offer_accepted", { title: activity.nftTitle });
      case "profile_updated":
        return t("activity_profile_updated");
      default:
        return t("activity_unknown");
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return t("time_minutes_ago", { count: diffMinutes });
    } else if (diffHours < 24) {
      return t("time_hours_ago", { count: diffHours });
    } else if (diffDays < 7) {
      return t("time_days_ago", { count: diffDays });
    } else {
      return activityTime.toLocaleDateString();
    }
  };

  if (loading && activities.length === 0) {
    return (
      <div className="activity-feed">
        <div className="activity-feed__header">
          <h3 className="activity-feed__title">{t("recent_activity")}</h3>
        </div>
        <div className="activity-feed__content">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="activity-feed__item activity-feed__item--loading"
            >
              <div className="activity-feed__icon skeleton-icon"></div>
              <div className="activity-feed__details">
                <div className="skeleton-text skeleton-text--title"></div>
                <div className="skeleton-text skeleton-text--subtitle"></div>
              </div>
              <div className="activity-feed__timestamp">
                <div className="skeleton-text skeleton-text--small"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      <div className="activity-feed__header">
        <h3 className="activity-feed__title">{t("recent_activity")}</h3>
        <div className="activity-feed__actions">
          <button className="btn-wireframe btn-wireframe--small">
            <Share2 size={16} />
            <span>{t("share")}</span>
          </button>
        </div>
      </div>

      <div className="activity-feed__content">
        {activities.length === 0 ? (
          <div className="activity-feed__empty">
            <Clock size={48} />
            <h4 className="activity-feed__empty-title">
              {t("no_activity_yet")}
            </h4>
            <p className="activity-feed__empty-description">
              {t("activity_will_appear_here")}
            </p>
          </div>
        ) : (
          <>
            {activities.map((activity) => (
              <div key={activity.id} className="activity-feed__item">
                <div
                  className={`activity-feed__icon ${getActivityColor(activity.type)}`}
                >
                  {getActivityIcon(activity.type)}
                </div>

                <div className="activity-feed__details">
                  <div className="activity-feed__title-row">
                    <h4 className="activity-feed__item-title">
                      {formatActivityTitle(activity)}
                    </h4>
                    {activity.price && (
                      <span className="activity-feed__price">
                        {activity.price}
                      </span>
                    )}
                  </div>

                  {activity.description && (
                    <p className="activity-feed__description">
                      {activity.description}
                    </p>
                  )}

                  <div className="activity-feed__meta">
                    <span className="activity-feed__timestamp">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                    {activity.nftImage && (
                      <div className="activity-feed__nft-preview">
                        <img src={activity.nftImage} alt={activity.nftTitle} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="activity-feed__load-more">
                <button
                  onClick={onLoadMore}
                  disabled={loading}
                  className="btn-wireframe btn-wireframe--secondary"
                >
                  {loading ? (
                    <>
                      <Clock size={16} />
                      <span>{t("loading")}</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>{t("load_more")}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
