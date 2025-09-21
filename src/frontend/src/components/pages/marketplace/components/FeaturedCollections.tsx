import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  MarketplaceService,
  type FeaturedCollection,
} from "@/services/marketplace";
import { NFTDetailDrawer } from "./NFTDetailDrawer";
import { PurchaseConfirmationModal } from "./PurchaseConfirmationModal";
import { PurchaseSuccessModal } from "./PurchaseSuccessModal";
import { useToastContext } from "@/contexts/ToastContext";
import { TradingService } from "@/services";
import { useAuth } from "@/contexts/AuthContext";

export const FeaturedCollections: React.FC = () => {
  const { error: showError } = useToastContext();
  const { user } = useAuth();
  const [collections, setCollections] = useState<FeaturedCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNFTId, setSelectedNFTId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hoveredCollection, setHoveredCollection] = useState<string | null>(
    null,
  );
  
  // Purchase flow states
  const [isPurchaseConfirmationOpen, setIsPurchaseConfirmationOpen] = useState(false);
  const [isPurchaseSuccessOpen, setIsPurchaseSuccessOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseData, setPurchaseData] = useState<{
    collection: FeaturedCollection | null;
    nftId: string;
    price: string;
    currency: string;
    transactionId?: string;
  } | null>(null);

  useEffect(() => {
    const loadFeaturedCollections = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get active listings directly from backend
        const { getBackendActor } = await import("@/services/core/backend");
        const backendActor = await getBackendActor();
        
        if (!backendActor) {
          throw new Error("Backend not initialized");
        }
        
        const listings = await backendActor.get_active_listings();
        
        // Take first 4 listings and get their details
        const featuredListings = listings.slice(0, 4);
        const collections = await Promise.all(
          featuredListings.map(async (listing) => {
            try {
              const nftDetails = await MarketplaceService.getIndividualNFT(listing.token_id.toString());
              
              const tokenId = listing.token_id.toString();
              
              if (nftDetails) {
                return {
                  id: `nft-${tokenId}`,
                  creatorUsername: nftDetails.creator || "Unknown Artist",
                  creatorAvatar: undefined,
                  totalListedArtworks: 1,
                  floorPrice: nftDetails.price,
                  priceChange24h: 0.0,
                  verified: true,
                  sampleArtworkUrl: nftDetails.image,
                  name: nftDetails.title,
                  tokenId: tokenId,
                  nftTitle: nftDetails.title,
                };
              } else {
                // Fallback if NFT details not found
                return {
                  id: `nft-${tokenId}`,
                  creatorUsername: "Unknown Artist",
                  creatorAvatar: undefined,
                  totalListedArtworks: 1,
                  floorPrice: listing.price,
                  priceChange24h: 0.0,
                  verified: true,
                  sampleArtworkUrl: undefined,
                  name: `NFT #${tokenId}`,
                  tokenId: tokenId,
                  nftTitle: `NFT #${tokenId}`,
                };
              }
            } catch (error) {
              console.error(`Failed to get details for NFT ${listing.token_id}:`, error);
              const tokenId = listing.token_id.toString();
              return {
                id: `nft-${tokenId}`,
                creatorUsername: "Unknown Artist",
                creatorAvatar: undefined,
                totalListedArtworks: 1,
                floorPrice: listing.price,
                priceChange24h: 0.0,
                verified: true,
                sampleArtworkUrl: undefined,
                name: `NFT #${tokenId}`,
                tokenId: tokenId,
                nftTitle: `NFT #${tokenId}`,
              };
            }
          })
        );
        
        setCollections(collections);
      } catch (err) {
        console.error("Failed to load featured collections:", err);
        setError("Failed to load featured collections");
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedCollections();
  }, []);

  const handleCollectionClick = async (collection: FeaturedCollection) => {
    try {
      if (collection.sampleArtworkUrl && collection.tokenId) {
        // Use the actual tokenId from the collection
        setSelectedNFTId(collection.tokenId);
        setIsDrawerOpen(true);
      } else {
        showError("No artwork available for this NFT");
      }
    } catch (error) {
      console.error("Failed to open NFT:", error);
      showError("Failed to open NFT");
    }
  };

  const handleBuyClick = async (
    collection: FeaturedCollection,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation(); // Prevent triggering collection click

    if (!user?.principal) {
      showError("Please connect your wallet to purchase NFTs");
      return;
    }

    try {
      // Check wallet balance
      const balanceCheck = await TradingService.checkSufficientBalance(
        "1.00", // Default price for now
        "ICP",
        user.principal,
      );

      if (!balanceCheck.sufficient) {
        showError(
          `Insufficient balance. Required: ${balanceCheck.requiredAmount}, Available: ${balanceCheck.currentBalance}`,
        );
        return;
      }

      // Use the actual tokenId from the collection
      if (!collection.tokenId) {
        showError("Invalid NFT ID");
        return;
      }
      
      const nftId = collection.tokenId;
      
      // Check if NFT is listed for sale
      const listing = await TradingService.getNFTListing(nftId);
      
      if (!listing.isListed) {
        showError("This NFT is not currently for sale");
        return;
      }

      // Store purchase data and show confirmation modal
      setPurchaseData({
        collection,
        nftId,
        price: listing.price || "0",
        currency: (listing.currency === "ICP" || listing.currency === "USDT") ? listing.currency : "ICP",
      });
      setIsPurchaseConfirmationOpen(true);
      
    } catch {
      showError("Failed to prepare purchase");
    }
  };

  const handleConfirmPurchase = async () => {
    if (!purchaseData || !user?.principal) return;

    setIsPurchasing(true);
    try {
      // Purchase the NFT
      const purchaseResult = await TradingService.purchaseNFT({
        nftId: purchaseData.nftId,
        buyerPrincipal: user.principal,
        price: purchaseData.price,
        currency: purchaseData.currency as "ICP" | "USDT",
      });

      if (purchaseResult.success) {
        // Update purchase data with transaction ID
        setPurchaseData(prev => prev ? {
          ...prev,
          transactionId: purchaseResult.transactionId
        } : null);
        
        // Close confirmation modal and show success modal
        setIsPurchaseConfirmationOpen(false);
        setIsPurchaseSuccessOpen(true);
        
        // Refresh collections data to reflect the purchase
        const updatedCollections = await MarketplaceService.getFeaturedCollections();
        setCollections(updatedCollections);
        
        // Signal to collection page that NFT was purchased
        localStorage.setItem('nft_purchased', 'true');
        
      } else {
        showError(purchaseResult.message);
        setIsPurchaseConfirmationOpen(false);
      }
    } catch {
      showError("Failed to complete purchase");
      setIsPurchaseConfirmationOpen(false);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedNFTId(null);
  };

  const handleClosePurchaseConfirmation = () => {
    setIsPurchaseConfirmationOpen(false);
    setPurchaseData(null);
  };

  const handleClosePurchaseSuccess = () => {
    setIsPurchaseSuccessOpen(false);
    setPurchaseData(null);
  };

  const handleDrawerBuyClick = async (nftId: string) => {
    // Find the collection for this NFT ID
    const collection = collections.find(c => c.tokenId === nftId);
    
    if (!collection) {
      showError("NFT not found");
      return;
    }

    // Use the same buy logic as the collection buy button
    // Create a mock event object that matches the expected interface
    const mockEvent = {
      stopPropagation: () => {},
    } as React.MouseEvent;
    
    await handleBuyClick(collection, mockEvent);
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

  const formatPrice = (price: string | undefined) => {
    if (!price) return "No listings";
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return "No listings";
    return `${numPrice.toFixed(2)} ICP`;
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
            onClick={() => handleCollectionClick(collection)}
            onMouseEnter={() => setHoveredCollection(collection.id.toString())}
            onMouseLeave={() => setHoveredCollection(null)}
          >
            <CardContent className="p-0">
              {/* Collection Image */}
              <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                {collection.sampleArtworkUrl ? (
                  <Image
                    src={collection.sampleArtworkUrl}
                    alt={collection.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

                {/* Hover Overlay with Buy Button */}
                {hoveredCollection === collection.id.toString() && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Button
                      className="bg-green-600 text-white hover:bg-green-700"
                      onClick={(e) => handleBuyClick(collection, e)}
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Buy Now
                    </Button>
                  </div>
                )}
              </div>

              {/* Collection Info */}
              <div className="p-5">
                {/* NFT Title */}
                <div className="mb-3">
                  <h4 className="text-foreground text-lg font-bold line-clamp-2">
                    {collection.nftTitle || collection.name}
                  </h4>
                </div>
                
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-foreground text-lg font-semibold">
                    {formatPrice(collection.floorPrice)}
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

      {/* NFT Detail Drawer */}
      <NFTDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        nftId={selectedNFTId}
        onBuyClick={handleDrawerBuyClick}
        collectionPrice={selectedNFTId ? collections.find(c => c.tokenId === selectedNFTId)?.floorPrice : undefined}
        collectionCurrency="ICP"
      />

      {/* Purchase Confirmation Modal */}
      {purchaseData && (
        <PurchaseConfirmationModal
          isOpen={isPurchaseConfirmationOpen}
          onClose={handleClosePurchaseConfirmation}
          onConfirm={handleConfirmPurchase}
          nftId={purchaseData.nftId}
          price={purchaseData.price}
          currency={purchaseData.currency}
          collectionName={purchaseData.collection?.name || "Unknown Collection"}
          isLoading={isPurchasing}
        />
      )}

      {/* Purchase Success Modal */}
      {purchaseData && (
        <PurchaseSuccessModal
          isOpen={isPurchaseSuccessOpen}
          onClose={handleClosePurchaseSuccess}
          nftId={purchaseData.nftId}
          price={purchaseData.price}
          currency={purchaseData.currency}
          collectionName={purchaseData.collection?.name || "Unknown Collection"}
          transactionId={purchaseData.transactionId || "unknown"}
        />
      )}
    </div>
  );
};
