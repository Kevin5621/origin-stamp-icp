import React from "react";
import { CollectionCard } from "./CollectionCard";

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
