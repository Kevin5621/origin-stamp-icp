import React from "react";
import { Store, TrendingUp, Eye, ShoppingCart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const MarketplacePage: React.FC = () => {
  const nfts = [
    {
      id: "nft_001",
      title: "Abstract Digital Art #896",
      artist: "@digital_artist",
      price: "2.5 ICP",
      status: "verified",
      views: 1247,
      likes: 89,
    },
    {
      id: "nft_002",
      title: "Modern Landscape #542",
      artist: "@nature_photographer",
      price: "1.8 ICP",
      status: "pending",
      views: 892,
      likes: 64,
    },
    {
      id: "nft_003",
      title: "Urban Street Art #123",
      artist: "@street_artist",
      price: "3.2 ICP",
      status: "verified",
      views: 2156,
      likes: 156,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500 text-white">Verified</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-bold">Marketplace</h2>
          <p className="text-muted-foreground">
            Browse and manage NFT artworks and certificates
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Store className="mr-2 h-4 w-4" />
          Add New NFT
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total NFTs</CardTitle>
            <Store className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">896</div>
            <p className="text-muted-foreground text-xs">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245.8 ICP</div>
            <p className="text-muted-foreground text-xs">
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,568</div>
            <p className="text-muted-foreground text-xs">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Listings
            </CardTitle>
            <ShoppingCart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-muted-foreground text-xs">Currently for sale</p>
          </CardContent>
        </Card>
      </div>

      {/* NFT Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Featured NFTs</CardTitle>
          <CardDescription>
            Latest verified NFT artworks in the marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {nfts.map((nft) => (
              <Card key={nft.id} className="overflow-hidden">
                <div className="bg-muted/50 flex aspect-square items-center justify-center">
                  <Store className="text-muted-foreground h-12 w-12" />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-foreground truncate font-medium">
                        {nft.title}
                      </h3>
                      {getStatusBadge(nft.status)}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {nft.artist}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold">
                        {nft.price}
                      </span>
                      <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                        <Eye className="h-3 w-3" />
                        <span>{nft.views}</span>
                        <span>•</span>
                        <span>{nft.likes} likes</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
