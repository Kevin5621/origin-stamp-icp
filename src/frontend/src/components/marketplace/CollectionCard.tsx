import React from "react";
import { useTranslation } from "react-i18next";
import { BadgeCheck } from "lucide-react";
import styles from "../../css/components/marketplace/CollectionCard.module.scss";

interface CollectionCardProps {
  collection: {
    id: string;
    name: string;
    creator: string;
    image: string;
    floorPrice: string;
    currency: string;
    totalVolume: string;
    items: number;
    verified: boolean;
  };
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
}) => {
  const { t } = useTranslation("marketplace");

  return (
    <div className={styles.collectionCard}>
      {/* Collection Image */}
      <div className={styles.imageContainer}>
        <img
          src={collection.image}
          alt={collection.name}
          className={styles.collectionImage}
        />
      </div>

      {/* Collection Info */}
      <div className={styles.collectionInfo}>
        <div className={styles.collectionHeader}>
          <h3 className={styles.collectionName}>
            {collection.name}
            {collection.verified && (
              <BadgeCheck className={styles.verifiedBadge} size={16} />
            )}
          </h3>
          <p className={styles.collectionCreator}>
            {t("collections.by")} {collection.creator}
          </p>
        </div>

        <div className={styles.collectionStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>
              {t("collections.floorPrice")}
            </span>
            <span className={styles.statValue}>
              {collection.floorPrice} {collection.currency}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>
              {t("collections.totalVolume")}
            </span>
            <span className={styles.statValue}>
              {collection.totalVolume} {collection.currency}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>{t("collections.items")}</span>
            <span className={styles.statValue}>
              {collection.items.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
