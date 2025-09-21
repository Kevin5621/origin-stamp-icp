import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Package,
  Heart,
  Eye,
  Filter,
  Share,
  DollarSign,
  TrendingUp,
  PieChart,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/contexts/AuthContext";
import { useToastContext } from "@/contexts/ToastContext";
import {
  CollectionService,
  NFTCollectionItem,
  CollectionStats,
  FavoriteItem,
  TradingService,
} from "@/services";

export const CollectionPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useToastContext();

  const [myCollection, setMyCollection] = useState<NFTCollectionItem[]>([]);
  const [createdNFTs, setCreatedNFTs] = useState<NFTCollectionItem[]>([]);
  const [favoriteNFTs, setFavoriteNFTs] = useState<FavoriteItem[]>([]);
  const [collectionStats, setCollectionStats] = useState<CollectionStats>({
    totalItems: 0,
    portfolioValue: "0 ICP",
    createdByMe: 0,
    favorites: 0,
    totalGain: 0,
    gainPercentage: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<NFTCollectionItem | null>(
    null,
  );
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [listingPrice, setListingPrice] = useState("");
  const [listingCurrency, setListingCurrency] = useState<"ICP" | "USDT">("ICP");
  const [isSettingPrice, setIsSettingPrice] = useState(false);

  // Load collection data
  const loadCollectionData = async () => {
    if (!user?.principal || !user?.username) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const [owned, created, favorites, stats] = await Promise.all([
        CollectionService.getUserCollection(user.principal),
        CollectionService.getUserCreatedNFTs(user.username),
        CollectionService.getUserFavorites(user.username),
        CollectionService.getCollectionStats(user.principal, user.username),
      ]);

      setMyCollection(owned);
      setCreatedNFTs(created);
      setFavoriteNFTs(favorites);
      setCollectionStats(stats);
    } catch (error) {
      console.error("Failed to load collection data:", error);
      showError("Failed to load collection data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCollectionData();
  }, [user, showError]);

  // Listen for storage changes to refresh collection when NFT is purchased
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nft_purchased' && e.newValue === 'true') {
        // Refresh collection data when NFT is purchased
        loadCollectionData();
        // Clear the flag
        localStorage.removeItem('nft_purchased');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  const getRarityBadge = (verificationScore: number) => {
    if (verificationScore >= 95) {
      return (
        <Badge className="bg-purple-500 text-xs text-white">Ultra Rare</Badge>
      );
    } else if (verificationScore >= 90) {
      return <Badge className="bg-blue-500 text-xs text-white">Rare</Badge>;
    } else {
      return (
        <Badge variant="secondary" className="text-xs">
          Common
        </Badge>
      );
    }
  };

  const getStatusBadge = (nft: NFTCollectionItem) => {
    if (nft.ownership.isCreator) {
      return (
        <Badge className="bg-purple-500 text-xs text-white">
          Created by You
        </Badge>
      );
    } else if (nft.ownership.isOwner) {
      return <Badge className="bg-green-500 text-xs text-white">Owned</Badge>;
    } else if (nft.listing?.isListed) {
      return (
        <Badge className="bg-yellow-500 text-xs text-white">For Sale</Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-xs">
          Not Listed
        </Badge>
      );
    }
  };

  const calculateGainLoss = (purchasePrice: string, currentValue: string) => {
    const purchase = parseFloat(purchasePrice.replace(" ICP", ""));
    const current = parseFloat(currentValue.replace(" ICP", ""));
    const difference = current - purchase;
    const percentage =
      purchase > 0 ? ((difference / purchase) * 100).toFixed(1) : 0;

    return {
      difference: difference.toFixed(1),
      percentage,
      isPositive: difference >= 0,
    };
  };

  // Pricing information helper - only show real data
  const getPricingInfo = (nft: NFTCollectionItem) => {
    const purchasePrice = nft.ownership.purchasePrice || "0 ICP";
    const currentValue = nft.ownership.currentValue || "0 ICP";
    const gainLoss = calculateGainLoss(purchasePrice, currentValue);

    return {
      purchasePrice,
      currentValue,
      gainLoss,
      isListed: nft.listing?.isListed || false,
      listPrice: nft.listing?.price || null,
      isCreated: nft.ownership.isCreator || false,
    };
  };

  const handleViewDetails = (nft: NFTCollectionItem) => {
    router.push(`/dashboard/collection/${nft.id}`);
  };

  const handleSetPrice = (nft: NFTCollectionItem) => {
    setSelectedNFT(nft);
    setListingPrice(nft.listing?.price?.replace(/\s+(ICP|USDT)/, "") || "");
    setListingCurrency(nft.listing?.currency || "ICP");
    setPriceDialogOpen(true);
  };

  const handleSavePrice = async () => {
    if (!selectedNFT || !listingPrice) {
      showError("Please enter a valid price");
      return;
    }

    try {
      setIsSettingPrice(true);

      // Use TradingService to list NFT
      const result = await TradingService.listNFT(
        selectedNFT.id,
        listingPrice,
        listingCurrency,
      );

      if (result.success) {
        showSuccess(result.message);
        setPriceDialogOpen(false);

        // Refresh collection data
        if (user?.principal && user?.username) {
          const [owned, stats] = await Promise.all([
            CollectionService.getUserCollection(user.principal),
            CollectionService.getCollectionStats(user.principal, user.username),
          ]);
          setMyCollection(owned);
          setCollectionStats(stats);
        }
      } else {
        showError(result.message);
      }
    } catch (error) {
      console.error("Failed to set price:", error);
      showError("Failed to set price");
    } finally {
      setIsSettingPrice(false);
    }
  };

  const handleDelistNFT = async () => {
    if (!selectedNFT) {
      showError("No NFT selected");
      return;
    }

    try {
      setIsSettingPrice(true);

      // Use TradingService to delist NFT
      const result = await TradingService.delistNFT(selectedNFT.id);

      if (result.success) {
        showSuccess(result.message);
        setPriceDialogOpen(false);

        // Refresh collection data
        if (user?.principal && user?.username) {
          const [owned, stats] = await Promise.all([
            CollectionService.getUserCollection(user.principal),
            CollectionService.getCollectionStats(user.principal, user.username),
          ]);
          setMyCollection(owned);
          setCollectionStats(stats);
        }
      } else {
        showError(result.message);
      }
    } catch (error) {
      console.error("Failed to delist NFT:", error);
      showError("Failed to remove NFT from sale");
    } finally {
      setIsSettingPrice(false);
    }
  };

  const handleAddToFavorites = async (nft: NFTCollectionItem) => {
    if (!user?.username) return;

    try {
      await CollectionService.addToFavorites(nft.id, user.username);
      showSuccess("Added to favorites");

      // Refresh favorites
      const favorites = await CollectionService.getUserFavorites(user.username);
      setFavoriteNFTs(favorites);
    } catch (error) {
      console.error("Failed to add to favorites:", error);
      showError("Failed to add to favorites");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner variant="infinite" size="md" />
          <span className="text-muted-foreground ml-2">
            Loading collection...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-bold">My Collection</h2>
          <p className="text-muted-foreground">
            Your NFTs, certificates, and favorite artworks
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share Collection
          </Button>
        </div>
      </div>

      {/* Collection Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {collectionStats.totalItems}
            </div>
            <p className="text-muted-foreground text-xs">In your collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Portfolio Value
            </CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {collectionStats.portfolioValue}
            </div>
            <p
              className={`text-xs ${collectionStats.gainPercentage >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {collectionStats.gainPercentage >= 0 ? "+" : ""}
              {collectionStats.gainPercentage.toFixed(1)}% total gain
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Created by You
            </CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {collectionStats.createdByMe}
            </div>
            <p className="text-muted-foreground text-xs">Original artworks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {collectionStats.favorites}
            </div>
            <p className="text-muted-foreground text-xs">Wishlisted items</p>
          </CardContent>
        </Card>
      </div>

      {/* Collection Tabs */}
      <Tabs defaultValue="owned" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="owned">Owned NFTs</TabsTrigger>
          <TabsTrigger value="created">Created by Me</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="owned" className="space-y-4">
          {myCollection.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No NFTs Owned
                </h3>
                <p className="text-muted-foreground mb-4">
                  You don&apos;t have any NFTs in your collection yet.
                </p>
                <Button onClick={() => router.push("/dashboard/marketplace")}>
                  Browse Marketplace
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myCollection.map((nft) => {
                const pricingInfo = getPricingInfo(nft);

                return (
                  <Card
                    key={nft.id}
                    className="group overflow-hidden transition-all duration-200 hover:shadow-lg"
                  >
                    {/* NFT Image */}
                    <div className="bg-muted/50 relative flex aspect-square items-center justify-center overflow-hidden">
                      {nft.imageUrl ? (
                        <Image
                          src={nft.imageUrl}
                          alt={nft.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.nextElementSibling?.classList.remove(
                              "hidden",
                            );
                          }}
                        />
                      ) : null}
                      <Package
                        className={`text-muted-foreground h-16 w-16 ${nft.imageUrl ? "hidden" : ""}`}
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleViewDetails(nft)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddToFavorites(nft)}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Status badge */}
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(nft)}
                      </div>

                      {/* Rarity badge */}
                      <div className="absolute top-2 left-2">
                        {getRarityBadge(nft.metadata.verificationScore)}
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Title and Artist */}
                        <div>
                          <h3 className="text-foreground line-clamp-1 text-sm font-semibold">
                            {nft.title}
                          </h3>
                          <p className="text-muted-foreground text-xs">
                            by {nft.creator.username}
                          </p>
                        </div>

                        {/* Certificate Info */}
                        <div className="bg-muted/50 rounded-md p-2">
                          <p className="text-muted-foreground text-xs">
                            Certificate:{" "}
                            <span className="font-mono">
                              {nft.metadata.certificateId || "N/A"}
                            </span>
                          </p>
                        </div>

                        {/* Simplified Price Information */}
                        <div className="space-y-2">
                          {/* Listing Status - Show if listed */}
                          {pricingInfo.isListed && (
                            <div className="rounded-md border border-green-200 bg-green-50 p-2 dark:border-green-800 dark:bg-green-900/20">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <ShoppingBag className="h-3 w-3 text-green-600" />
                                  <span className="text-xs font-medium text-green-800 dark:text-green-200">
                                    Listed for Sale
                                  </span>
                                </div>
                                <span className="text-sm font-bold text-green-600">
                                  {pricingInfo.listPrice}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Creator Status - Show if created by user */}
                          {pricingInfo.isCreated && (
                            <div className="rounded-md border border-purple-200 bg-purple-50 p-2 dark:border-purple-800 dark:bg-purple-900/20">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <PieChart className="h-3 w-3 text-purple-600" />
                                  <span className="text-xs font-medium text-purple-800 dark:text-purple-200">
                                    Your Creation
                                  </span>
                                </div>
                                <span className="text-xs text-purple-600">
                                  {pricingInfo.isListed
                                    ? "Listed"
                                    : "Not for sale"}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Purchase Price and Current Value - Always show for non-created NFTs */}
                          {!pricingInfo.isCreated && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3 text-blue-600" />
                                  <span className="text-muted-foreground text-xs">
                                    Purchase Price:
                                  </span>
                                </div>
                                <span className="text-sm font-medium">
                                  {pricingInfo.purchasePrice}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3 text-green-600" />
                                  <span className="text-muted-foreground text-xs">
                                    Current Value:
                                  </span>
                                </div>
                                <span className="text-primary text-sm font-bold">
                                  {pricingInfo.currentValue}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Meta Info */}
                        <div className="text-muted-foreground flex items-center justify-between text-xs">
                          <Badge variant="outline" className="text-xs">
                            {nft.metadata.blockchain}
                          </Badge>
                          <span>
                            Acquired{" "}
                            {new Date(
                              nft.ownership.purchaseDate || nft.stats.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleViewDetails(nft)}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleSetPrice(nft)}
                          >
                            <DollarSign className="mr-1 h-3 w-3" />
                            {pricingInfo.isListed
                              ? "Manage Listing"
                              : "Set Price"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="created" className="space-y-4">
          {createdNFTs.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No Created NFTs
                </h3>
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t created any NFTs yet.
                </p>
                <Button
                  onClick={() => router.push("/dashboard/sessions/create")}
                >
                  Create Your First NFT
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {createdNFTs.map((nft) => (
                <Card
                  key={nft.id}
                  className="group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                  onClick={() => handleViewDetails(nft)}
                >
                  <div className="from-primary/20 to-secondary/20 relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br">
                    {nft.imageUrl ? (
                      <Image
                        src={nft.imageUrl}
                        alt={nft.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <Package
                      className={`text-primary h-16 w-16 ${nft.imageUrl ? "hidden" : ""}`}
                    />

                    {/* Hover overlay with View button */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="border-0 bg-white/90 text-black hover:bg-white"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>

                    {/* Creator badge */}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-purple-500 text-xs text-white">
                        Created
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="space-y-1">
                      <h3 className="text-foreground truncate text-sm font-semibold">
                        {nft.title}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        Your creation
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          {favoriteNFTs.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <Heart className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  No Favorites Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start adding NFTs to your favorites by clicking the heart
                  icon.
                </p>
                <Button onClick={() => router.push("/dashboard/marketplace")}>
                  Browse Marketplace
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {favoriteNFTs.map((fav) => (
                <Card key={fav.id} className="overflow-hidden">
                  <div className="bg-muted/50 relative flex aspect-square items-center justify-center overflow-hidden">
                    {fav.imageUrl ? (
                      <Image
                        src={fav.imageUrl}
                        alt={fav.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <Heart
                      className={`text-muted-foreground h-16 w-16 ${fav.imageUrl ? "hidden" : ""}`}
                    />
                    <div className="absolute top-2 right-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="text-foreground font-semibold">
                        {fav.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        by {fav.artist}
                      </p>
                      <p className="text-primary text-lg font-bold">
                        {fav.price}
                      </p>
                      <Button className="w-full">Buy Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">
                Your collection activity history will be displayed here
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Price Setting Dialog */}
      <Dialog open={priceDialogOpen} onOpenChange={setPriceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedNFT?.listing?.isListed
                ? "Update NFT Price"
                : "Set NFT Price"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                value={listingCurrency}
                onChange={(e) =>
                  setListingCurrency(e.target.value as "ICP" | "USDT")
                }
              >
                <option value="ICP">ICP</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPriceDialogOpen(false)}
              >
                Cancel
              </Button>
              {selectedNFT?.listing?.isListed && (
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDelistNFT}
                  disabled={isSettingPrice}
                >
                  {isSettingPrice ? (
                    <>
                      <LoadingSpinner
                        variant="infinite"
                        size="sm"
                        className="mr-2"
                      />
                      Delisting...
                    </>
                  ) : (
                    "Delist"
                  )}
                </Button>
              )}
              <Button
                className="flex-1"
                onClick={handleSavePrice}
                disabled={isSettingPrice || !listingPrice}
              >
                {isSettingPrice ? (
                  <>
                    <LoadingSpinner
                      variant="infinite"
                      size="sm"
                      className="mr-2"
                    />
                    Setting...
                  </>
                ) : selectedNFT?.listing?.isListed ? (
                  "Update Price"
                ) : (
                  "List for Sale"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
