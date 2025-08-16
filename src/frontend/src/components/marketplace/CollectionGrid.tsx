import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CollectionCard } from "./CollectionCard";
import styles from "../../css/components/marketplace/CollectionGrid.module.scss";

interface Collection {
  id: string;
  name: string;
  creator: string;
  image: string;
  floorPrice: string;
  currency: string;
  totalVolume: string;
  items: number;
  verified: boolean;
}

interface CollectionGridProps {
  collections: Collection[];
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  collections,
}) => {
  const { t } = useTranslation("marketplace");

  if (collections.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>{t("collections.noResults")}</p>
      </div>
    );
  }

  return (
    <div className={styles.collectionGrid}>
      {collections.map((collection) => (
        <Link
          key={collection.id}
          to={`/marketplace/collections/${collection.id}`}
          className={styles.collectionLink}
        >
          <CollectionCard collection={collection} />
        </Link>
      ))}
    </div>
  );
};
