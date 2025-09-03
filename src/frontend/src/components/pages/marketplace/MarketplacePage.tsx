import React from "react";
import { Store, Heart, Eye, Search, Filter, Grid, List } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const MarketplacePage: React.FC = () => {
  const featuredNFTs = [
    {
      id: "nft_001",
      title: "Abstract Digital Art #896",
      artist: "@digital_artist",
      artistAvatar: "DA",
      price: "2.5 ICP",
      originalPrice: "3.0 ICP",
      status: "available",
      views: 1247,
      likes: 89,
      category: "Digital Art",
      rarity: "Rare",
      thumbnailUrl: "/placeholder-nft-1.jpg",
    },
    {
      id: "nft_002",
      title: "Modern Landscape #542",
      artist: "@nature_photographer",
      artistAvatar: "NP",
      price: "1.8 ICP",
      originalPrice: null,
      status: "available",
      views: 892,
      likes: 64,
      category: "Photography",
      rarity: "Common",
      thumbnailUrl: "/placeholder-nft-2.jpg",
    },
    {
      id: "nft_003",
      title: "Urban Street Art #123",
      artist: "@street_artist",
      artistAvatar: "SA",
      price: "3.2 ICP",
      originalPrice: null,
      status: "sold",
      views: 2156,
      likes: 156,
      category: "Street Art",
      rarity: "Ultra Rare",
      thumbnailUrl: "/placeholder-nft-3.jpg",
    },
    {
      id: "nft_004",
      title: "Sculpture Series #001",
      artist: "@sculptor_bob",
      artistAvatar: "SB",
      price: "4.5 ICP",
      originalPrice: null,
      status: "available",
      views: 657,
      likes: 43,
      category: "Sculpture",
      rarity: "Rare",
      thumbnailUrl: "/placeholder-nft-4.jpg",
    },
  ];

  const categories = [
    { name: "All", count: 245 },
    { name: "Digital Art", count: 89 },
    { name: "Photography", count: 67 },
    { name: "Sculpture", count: 34 },
    { name: "Street Art", count: 28 },
    { name: "Abstract", count: 27 },
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
      case "available":
        return (
          <Badge className="bg-green-500 text-xs text-white">Available</Badge>
        );
      case "sold":
        return (
          <Badge variant="destructive" className="text-xs">
            Sold
          </Badge>
        );
      case "auction":
        return (
          <Badge className="bg-yellow-500 text-xs text-white">Auction</Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-foreground text-2xl font-bold">Marketplace</h2>
            <p className="text-muted-foreground">
              Discover and collect unique NFT artworks from talented artists
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search artworks, artists, or collections..."
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Artworks
            </CardTitle>
            <Store className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-muted-foreground text-xs">+12 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Artists
            </CardTitle>
            <Store className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-muted-foreground text-xs">Creating daily</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Floor Price</CardTitle>
            <Store className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.5 ICP</div>
            <p className="text-muted-foreground text-xs">24h low</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume</CardTitle>
            <Store className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128.5 ICP</div>
            <p className="text-muted-foreground text-xs">24h volume</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Browse by Category</CardTitle>
          <CardDescription>
            Explore different types of digital art and collectibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant="outline"
                size="sm"
                className="h-8"
              >
                {category.name}
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 min-w-5 px-1 text-xs"
                >
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* NFT Grid */}
      <Tabs defaultValue="featured" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="auction">Auction</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredNFTs.map((nft) => (
              <Card
                key={nft.id}
                className="group overflow-hidden transition-all duration-200 hover:shadow-lg"
              >
                {/* NFT Image */}
                <div className="bg-muted/50 relative flex aspect-square items-center justify-center overflow-hidden">
                  <Store className="text-muted-foreground h-16 w-16" />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="sm" variant="secondary">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
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

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary text-lg font-bold">
                          {nft.price}
                        </p>
                        {nft.originalPrice && (
                          <p className="text-muted-foreground text-xs line-through">
                            {nft.originalPrice}
                          </p>
                        )}
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Stats */}
                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{nft.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{nft.likes}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {nft.category}
                      </Badge>
                    </div>

                    {/* Action Button */}
                    {nft.status === "available" ? (
                      <Button className="w-full" size="sm">
                        Buy Now
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        size="sm"
                        disabled
                      >
                        Sold Out
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="py-8 text-center">
            <Store className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground">
              Recently added artworks will be displayed here
            </p>
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="py-8 text-center">
            <Store className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground">
              Trending artworks will be displayed here
            </p>
          </div>
        </TabsContent>

        <TabsContent value="auction" className="space-y-4">
          <div className="py-8 text-center">
            <Store className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-muted-foreground">
              Active auctions will be displayed here
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
