import React, { useState, useEffect } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { CollectionGrid } from "../../components/marketplace/CollectionGrid";

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

export const MarketplaceCollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    // TODO: Load real collections from backend
    // For now, showing some dummy data for testing
    setCollections([
      {
        id: "1",
        title: "Digital Dreams Collection",
        description:
          "A stunning collection of digital artworks exploring the realm of dreams.",
        image:
          "https://via.placeholder.com/300x400/4A5568/ffffff?text=Digital+Dreams",
        price: 150,
        artist: "John Doe",
        category: "digital",
        likes: 42,
      },
      {
        id: "2",
        title: "Abstract Visions",
        description:
          "Bold abstract pieces that challenge perception and reality.",
        image:
          "https://via.placeholder.com/300x400/2D3748/ffffff?text=Abstract+Visions",
        price: 280,
        artist: "Jane Smith",
        category: "abstract",
        likes: 18,
      },
      {
        id: "3",
        title: "Traditional Masterpieces",
        description:
          "Classic traditional artworks with modern digital preservation.",
        image:
          "https://via.placeholder.com/300x400/8B5A3C/ffffff?text=Traditional",
        price: 320,
        artist: "Maria Santos",
        category: "traditional",
        likes: 67,
      },
      {
        id: "4",
        title: "Sculpture Gallery",
        description: "3D digital sculptures bringing art into the metaverse.",
        image:
          "https://via.placeholder.com/300x400/2B6CB0/ffffff?text=Sculpture",
        price: 450,
        artist: "Alex Chen",
        category: "sculpture",
        likes: 93,
      },
      {
        id: "5",
        title: "Nature's Canvas",
        description: "Beautiful nature-inspired digital art collection.",
        image: "https://via.placeholder.com/300x400/16A085/ffffff?text=Nature",
        price: 200,
        artist: "Sarah Williams",
        category: "digital",
        likes: 75,
      },
      {
        id: "6",
        title: "Urban Street Art",
        description: "Contemporary street art digitized for the modern world.",
        image:
          "https://via.placeholder.com/300x400/E67E22/ffffff?text=Street+Art",
        price: 180,
        artist: "Mike Rodriguez",
        category: "abstract",
        likes: 55,
      },
    ]);
  };

  const handleCollectionClick = (collection: Collection) => {
    console.log("Collection clicked:", collection);
    // TODO: Navigate to collection detail page
  };

  return (
    <AppLayout variant="marketplace">
      <div className="marketplace-collections">
        <div className="marketplace-collections__content">
          <div className="marketplace-collections__header">
            <h1 className="marketplace-collections__title">Koleksi NFT</h1>
            <p className="marketplace-collections__subtitle">
              Jelajahi koleksi karya seni digital terverifikasi dari berbagai
              seniman
            </p>
          </div>

          <div className="marketplace-collections__count">
            <span>{collections.length} koleksi tersedia</span>
          </div>

          <div className="marketplace-collections__grid">
            <CollectionGrid
              collections={collections}
              onCollectionClick={handleCollectionClick}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MarketplaceCollectionsPage;
