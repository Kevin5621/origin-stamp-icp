import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export interface CollectionInfo {
  id: string;
  title: string;
  description: string;
  bannerImage: string;
  avatarImage: string;
  creator: {
    name: string;
    address: string;
    avatar: string;
    verified: boolean;
  };
  stats: {
    items: number;
    owners: number;
    floorPrice: number;
    volumeTraded: number;
  };
  isFollowing?: boolean;
}

interface CollectionHeaderProps {
  collection: CollectionInfo;
  onFollow?: (collection: CollectionInfo, isFollowing: boolean) => void;
  className?: string;
}

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  collection,
  onFollow,
  className = "",
}) => {
  const { t } = useTranslation("marketplace");
  const [isFollowing, setIsFollowing] = useState(
    collection.isFollowing || false,
  );

  const handleFollow = () => {
    const newFollowState = !isFollowing;
    setIsFollowing(newFollowState);
    if (onFollow) {
      onFollow(collection, newFollowState);
    }
  };

  return (
    <div className={`collection-header ${className}`}>
      <div className="collection-header__banner">
        <img
          src={collection.bannerImage}
          alt={`${collection.title} banner`}
          className="collection-header__banner-image"
        />
      </div>

      <div className="collection-header__content">
        <div className="collection-header__avatar-container">
          <img
            src={collection.avatarImage}
            alt={`${collection.title} avatar`}
            className="collection-header__avatar"
          />
        </div>

        <div className="collection-header__info">
          <div className="collection-header__title-row">
            <h1 className="collection-header__title">{collection.title}</h1>
            <button
              className={`collection-header__follow-btn ${isFollowing ? "collection-header__follow-btn--following" : ""}`}
              onClick={handleFollow}
            >
              {isFollowing ? t("following") : t("follow")}
            </button>
          </div>

          <div className="collection-header__creator">
            <span className="collection-header__by">{t("by")}</span>
            <div className="collection-header__creator-info">
              <img
                src={collection.creator.avatar}
                alt={collection.creator.name}
                className="collection-header__creator-avatar"
              />
              <span className="collection-header__creator-name">
                {collection.creator.name}
              </span>
              {collection.creator.verified && (
                <svg
                  className="collection-header__verified-badge"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L12 21.012 21.618 7.984z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>

          <p className="collection-header__description">
            {collection.description}
          </p>

          <div className="collection-header__stats">
            <div className="collection-header__stat">
              <span className="collection-header__stat-value">
                {collection.stats.items}
              </span>
              <span className="collection-header__stat-label">
                {t("items")}
              </span>
            </div>

            <div className="collection-header__stat">
              <span className="collection-header__stat-value">
                {collection.stats.owners}
              </span>
              <span className="collection-header__stat-label">
                {t("owners")}
              </span>
            </div>

            <div className="collection-header__stat">
              <span className="collection-header__stat-value">
                {collection.stats.floorPrice} ETH
              </span>
              <span className="collection-header__stat-label">
                {t("floor_price")}
              </span>
            </div>

            <div className="collection-header__stat">
              <span className="collection-header__stat-value">
                {collection.stats.volumeTraded} ETH
              </span>
              <span className="collection-header__stat-label">
                {t("volume_traded")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionHeader;
