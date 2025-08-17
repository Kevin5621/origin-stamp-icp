import React from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { MarketplaceHeader } from "../../components/marketplace/MarketplaceHeader";
import { CollectionGrid } from "../../components/marketplace/CollectionGrid";

interface CollectionItem {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  artist: string;
  category: string;
  likes: number;
}

export const CollectionDetailPage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();

  const collection = {
    id: collectionId || "off-the-grid",
    name: "Off The Grid",
    creator: "Gunz",
    description:
      "A collection of futuristic digital art pieces exploring themes of technology and human connection.",
    image: "/api/placeholder/800/400",
    bannerImage: "/api/placeholder/1200/300",
    floorPrice: 11.0,
    currency: "GUN",
    items: 6821231,
    totalVolume: "1.6M",
    owners: 1250,
    verified: true,
  };

  const collectionItems: CollectionItem[] = Array.from(
    { length: 12 },
    (_, i) => ({
      id: `${i + 1}`,
      title: `Item #${i + 1}`,
      description: `Digital artwork from ${collection.name} collection`,
      image: `/api/placeholder/300/400`,
      price: 0.5,
      artist: collection.creator,
      category: "digital",
      likes: Math.floor(Math.random() * 100),
    }),
  );

  const handleCollectionClick = (item: CollectionItem) => {
    console.log("Collection item clicked:", item);
  };

  return (
    <AppLayout variant="marketplace">
      <div className="marketplace-main">
        <MarketplaceHeader />

        <div className="marketplace-main__content">
          {/* Collection Banner */}
          <div className="collection-detail-banner">
            <div className="collection-detail-banner__image">
              <img src={collection.bannerImage} alt={collection.name} />
            </div>

            <div className="collection-detail-banner__info">
              <div className="collection-detail-avatar">
                <img src={collection.image} alt={collection.name} />
              </div>

              <div className="collection-detail-details">
                <h1 className="collection-detail-name">
                  {collection.name}
                  {collection.verified && (
                    <span className="collection-detail-verified">✓</span>
                  )}
                </h1>
                <p className="collection-detail-creator">
                  by {collection.creator}
                </p>
                <p className="collection-detail-description">
                  {collection.description}
                </p>
              </div>

              <div className="collection-detail-stats">
                <div className="collection-detail-stat">
                  <span className="collection-detail-stat-value">
                    {collection.floorPrice} {collection.currency}
                  </span>
                  <span className="collection-detail-stat-label">
                    Floor Price
                  </span>
                </div>
                <div className="collection-detail-stat">
                  <span className="collection-detail-stat-value">
                    {collection.items.toLocaleString()}
                  </span>
                  <span className="collection-detail-stat-label">Items</span>
                </div>
                <div className="collection-detail-stat">
                  <span className="collection-detail-stat-value">
                    {collection.totalVolume} {collection.currency}
                  </span>
                  <span className="collection-detail-stat-label">
                    Total Volume
                  </span>
                </div>
                <div className="collection-detail-stat">
                  <span className="collection-detail-stat-value">
                    {collection.owners.toLocaleString()}
                  </span>
                  <span className="collection-detail-stat-label">Owners</span>
                </div>
              </div>
            </div>
          </div>

          {/* Collection Items */}
          <div className="collection-detail-items">
            <div className="collection-detail-items__header">
              <h2 className="collection-detail-items__title">
                Items in this collection
              </h2>
              <p className="collection-detail-items__count">
                {collectionItems.length} items
              </p>
            </div>

            <CollectionGrid
              collections={collectionItems}
              onCollectionClick={handleCollectionClick}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CollectionDetailPage;
