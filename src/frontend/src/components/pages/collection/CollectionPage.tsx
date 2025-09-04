import React from "react";
import { Package, Heart, Eye, Filter, Share, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const CollectionPage: React.FC = () => {
  const myCollection = [
    {
      id: "nft_owned_001",
      title: "Abstract Digital Art #896",
      artist: "@digital_artist",
      category: "Digital Art",
      rarity: "Rare",
      acquiredDate: "2024-03-15",
      purchasePrice: "2.5 ICP",
      currentValue: "3.2 ICP",
      certificateId: "cert_896",
      status: "owned",
      thumbnailUrl: "/placeholder-owned-1.jpg",
    },
    {
      id: "nft_owned_002",
      title: "Modern Landscape #542",
      artist: "@nature_photographer",
      category: "Photography",
      rarity: "Common",
      acquiredDate: "2024-03-10",
      purchasePrice: "1.8 ICP",
      currentValue: "2.1 ICP",
      certificateId: "cert_542",
      status: "owned",
      thumbnailUrl: "/placeholder-owned-2.jpg",
    },
    {
      id: "nft_owned_003",
      title: "My First Sculpture",
      artist: "You",
      category: "Sculpture",
      rarity: "Ultra Rare",
      acquiredDate: "2024-03-08",
      purchasePrice: "0 ICP",
      currentValue: "5.5 ICP",
      certificateId: "cert_self_001",
      status: "created",
      thumbnailUrl: "/placeholder-owned-3.jpg",
    },
  ];

  const favoriteNFTs = [
    {
      id: "fav_001",
      title: "Cosmic Dreams #999",
      artist: "@cosmic_artist",
      price: "8.5 ICP",
      thumbnailUrl: "/placeholder-fav-1.jpg",
    },
    {
      id: "fav_002",
      title: "Urban Vibes #203",
      artist: "@street_artist",
      price: "3.2 ICP",
      thumbnailUrl: "/placeholder-fav-2.jpg",
    },
  ];

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case "Ultra Rare":
        return (
          <Badge className="bg-purple-500 text-xs text-white">Ultra Rare</Badge>
        );
      case "Rare":
        return <Badge className="bg-blue-500 text-xs text-white">Rare</Badge>;
      case "Common":
        return (
          <Badge variant="secondary" className="text-xs">
            Common
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {rarity}
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "owned":
        return <Badge className="bg-green-500 text-xs text-white">Owned</Badge>;
      case "created":
        return (
          <Badge className="bg-purple-500 text-xs text-white">
            Created by You
          </Badge>
        );
      case "selling":
        return (
          <Badge className="bg-yellow-500 text-xs text-white">For Sale</Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
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
            <div className="text-2xl font-bold">{myCollection.length}</div>
            <p className="text-muted-foreground text-xs">In your collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Portfolio Value
            </CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10.8 ICP</div>
            <p className="text-xs text-green-600">+18.5% total gain</p>
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
            <div className="text-2xl font-bold">1</div>
            <p className="text-muted-foreground text-xs">Original artworks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favoriteNFTs.length}</div>
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myCollection.map((nft) => {
              const gainLoss = calculateGainLoss(
                nft.purchasePrice,
                nft.currentValue,
              );

              return (
                <Card
                  key={nft.id}
                  className="group overflow-hidden transition-all duration-200 hover:shadow-lg"
                >
                  {/* NFT Image */}
                  <div className="bg-muted/50 relative flex aspect-square items-center justify-center overflow-hidden">
                    <Package className="text-muted-foreground h-16 w-16" />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button size="sm" variant="secondary">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Status badge */}
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(nft.status)}
                    </div>

                    {/* Rarity badge */}
                    <div className="absolute top-2 left-2">
                      {getRarityBadge(nft.rarity)}
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
                          by {nft.artist}
                        </p>
                      </div>

                      {/* Certificate Info */}
                      <div className="bg-muted/50 rounded-md p-2">
                        <p className="text-muted-foreground text-xs">
                          Certificate:{" "}
                          <span className="font-mono">{nft.certificateId}</span>
                        </p>
                      </div>

                      {/* Price Information */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs">
                            Purchase Price:
                          </span>
                          <span className="text-sm font-medium">
                            {nft.purchasePrice}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs">
                            Current Value:
                          </span>
                          <span className="text-primary text-sm font-bold">
                            {nft.currentValue}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs">
                            Gain/Loss:
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              gainLoss.isPositive
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {gainLoss.isPositive ? "+" : ""}
                            {gainLoss.difference} ICP ({gainLoss.percentage}%)
                          </span>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="text-muted-foreground flex items-center justify-between text-xs">
                        <Badge variant="outline" className="text-xs">
                          {nft.category}
                        </Badge>
                        <span>Acquired {nft.acquiredDate}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Details
                        </Button>
                        <Button size="sm" className="flex-1">
                          Sell
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="created" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myCollection
              .filter((nft) => nft.status === "created")
              .map((nft) => (
                <Card key={nft.id} className="overflow-hidden">
                  <div className="from-primary/20 to-secondary/20 flex aspect-square items-center justify-center bg-gradient-to-br">
                    <Package className="text-primary h-16 w-16" />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="text-foreground font-semibold">
                        {nft.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Your original creation
                      </p>
                      <p className="text-primary text-lg font-bold">
                        {nft.currentValue}
                      </p>
                      <Button className="w-full">Manage Listing</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favoriteNFTs.map((nft) => (
              <Card key={nft.id} className="overflow-hidden">
                <div className="bg-muted/50 relative flex aspect-square items-center justify-center">
                  <Heart className="text-muted-foreground h-16 w-16" />
                  <div className="absolute top-2 right-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="text-foreground font-semibold">
                      {nft.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      by {nft.artist}
                    </p>
                    <p className="text-primary text-lg font-bold">
                      {nft.price}
                    </p>
                    <Button className="w-full">Buy Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="py-8 text-center">
            <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground">
              Your collection activity history will be displayed here
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
