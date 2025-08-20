import React from "react";
import { useTranslation } from "react-i18next";
import { CollectionCard } from "./CollectionCard";
import { EmptyState } from "../common/EmptyState";

interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  artist: string;
  category: string;
  likes: number;
}

interface CollectionGridProps {
  collections: Collection[];
  onCollectionClick?: (collection: Collection) => void;
  className?: string;
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  collections,
  onCollectionClick,
  className = "",
}) => {
  const { t } = useTranslation("marketplace");

  if (collections.length === 0) {
    return (
      <EmptyState
        title={t("no_collections_title")}
        description={t("no_collections_description")}
        icon={
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        action={{
          label: t("browse_marketplace"),
          onClick: () => (window.location.href = "/marketplace"),
        }}
        className={className}
      />
    );
  }

  return (
    <div className={`collection-grid ${className}`}>
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          onClick={onCollectionClick}
        />
      ))}
    </div>
  );
};

export default CollectionGrid;
