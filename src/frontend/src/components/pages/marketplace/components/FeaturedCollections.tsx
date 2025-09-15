import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle, TrendingUp, TrendingDown, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  MarketplaceService,
  type FeaturedCollection,
} from "@/services/marketplace";
import { NFTDetailModal } from "./NFTDetailModal";

export const FeaturedCollections: React.FC = () => {
  const [collections, setCollections] = useState<FeaturedCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNFTId, setSelectedNFTId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadFeaturedCollections = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await MarketplaceService.getFeaturedCollections();
        setCollections(data);
      } catch (err) {
        console.error("Failed to load featured collections:", err);
        setError("Failed to load featured collections");
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedCollections();
  }, []);

  const handleCollectionClick = () => {
    // For now, open modal with a placeholder NFT ID
    // In a real implementation, you would navigate to the collection or select a specific NFT
    setSelectedNFTId("1"); // Placeholder - replace with actual NFT selection logic
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNFTId(null);
  };

  const getChangeIcon = (changeType: number) => {
    if (changeType > 0) {
      return <TrendingUp className="h-3 w-3 text-green-500" />;
    } else if (changeType < 0) {
      return <TrendingDown className="h-3 w-3 text-red-500" />;
    }
    return null;
  };

  const getChangeColor = (changeType: number) => {
    if (changeType > 0) {
      return "text-green-500";
    } else if (changeType < 0) {
      return "text-red-500";
    }
    return "text-muted-foreground";
  };

  const formatPriceChange = (change: number) => {
    if (change === 0) return "0%";
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="mb-6">
          <h3 className="text-foreground mb-2 text-2xl font-bold">
            Featured Collections
          </h3>
          <p className="text-muted-foreground">
            This week&apos;s curated collections
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => `skeleton-${index}`).map(
            (id) => (
              <Card key={id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-muted relative flex h-40 items-center justify-center">
                    <LoadingSpinner variant="infinite" size="sm" />
                  </div>
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="bg-muted h-4 w-20 rounded"></div>
                      <div className="bg-muted h-4 w-12 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ),
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <div className="mb-6">
          <h3 className="text-foreground mb-2 text-2xl font-bold">
            Featured Collections
          </h3>
          <p className="text-muted-foreground">
            This week&apos;s curated collections
          </p>
        </div>
        <div className="p-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="mb-8">
        <div className="mb-6">
          <h3 className="text-foreground mb-2 text-2xl font-bold">
            Featured Collections
          </h3>
          <p className="text-muted-foreground">
            This week&apos;s curated collections
          </p>
        </div>
        <div className="p-8 text-center">
          <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h4 className="text-foreground mb-2 text-lg font-semibold">
            No Collections Yet
          </h4>
          <p className="text-muted-foreground">
            Featured collections will appear here when artists list their work.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h3 className="text-foreground mb-2 text-2xl font-bold">
          Featured Collections
        </h3>
        <p className="text-muted-foreground">
          This week&apos;s curated collections
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {collections.map((collection) => (
          <Card
            key={collection.id}
            className="group border-border/50 hover:border-border cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-xl"
            onClick={() => handleCollectionClick()}
          >
            <CardContent className="p-0">
              {/* Collection Image */}
              <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                {collection.sampleArtworkUrl ? (
                  <Image
                    src={collection.sampleArtworkUrl}
                    alt={collection.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <div
                  className={`text-center ${collection.sampleArtworkUrl ? "hidden" : ""}`}
                >
                  <h4 className="mb-2 text-xl font-bold text-white">
                    {collection.name}
                  </h4>
                  {collection.verified && (
                    <CheckCircle className="mx-auto h-5 w-5 text-blue-400" />
                  )}
                </div>
              </div>

              {/* Collection Info */}
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-foreground text-lg font-semibold">
                    {collection.floorPrice || "No listings"}
                  </span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(collection.priceChange24h)}
                    <span
                      className={`text-sm font-medium ${getChangeColor(collection.priceChange24h)}`}
                    >
                      {formatPriceChange(collection.priceChange24h)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Creator:</span>
                    <span className="text-foreground">
                      {collection.creatorUsername}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Listed:</span>
                    <span className="text-foreground">
                      {collection.totalListedArtworks} artworks
                    </span>
                  </div>

                  {collection.verified && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-muted-foreground text-sm">
                        Verified
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* NFT Detail Modal */}
      <NFTDetailModal
        isOpen={isModalOpen}
        nftId={selectedNFTId}
        onClose={handleCloseModal}
      />
    </div>
  );
};
