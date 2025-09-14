import React from "react";
import {
  CheckCircle,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  List,
  Grid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrendingSidebarProps {
  onCollapse?: () => void;
}

export const TrendingSidebar: React.FC<TrendingSidebarProps> = ({
  onCollapse,
}) => {
  const trendingCollections = [
    {
      id: 1,
      name: "CryptoPunks",
      floorPrice: "46.99 ETH",
      change: "+0.8%",
      changeType: "positive" as const,
      verified: true,
      avatar: "🔴",
    },
    {
      id: 2,
      name: "Pudgy Penguins",
      floorPrice: "10.34 ETH",
      change: "-0.4%",
      changeType: "negative" as const,
      verified: true,
      avatar: "🐧",
    },
    {
      id: 3,
      name: "Moonbirds",
      floorPrice: "2.69 ETH",
      change: "+3.9%",
      changeType: "positive" as const,
      verified: true,
      avatar: "🦉",
    },
    {
      id: 4,
      name: "Mutant Ape Yacht Club",
      floorPrice: "1.33 ETH",
      change: "+1.2%",
      changeType: "positive" as const,
      verified: true,
      avatar: "💀",
    },
    {
      id: 5,
      name: "Lil Pudgys",
      floorPrice: "1.26 ETH",
      change: "+1.6%",
      changeType: "positive" as const,
      verified: true,
      avatar: "🐧",
    },
    {
      id: 6,
      name: "Azuki",
      floorPrice: "1.58 ETH",
      change: "-3.1%",
      changeType: "negative" as const,
      verified: true,
      avatar: "🔴",
    },
    {
      id: 7,
      name: "Bored Ape Yacht Club",
      floorPrice: "9.16 ETH",
      change: "+0.8%",
      changeType: "positive" as const,
      verified: true,
      avatar: "🐵",
    },
    {
      id: 8,
      name: "Doodles",
      floorPrice: "0.73 ETH",
      change: "-4.1%",
      changeType: "negative" as const,
      verified: true,
      avatar: "🌈",
    },
    {
      id: 9,
      name: "Milady Maker",
      floorPrice: "1.96 ETH",
      change: "+2.4%",
      changeType: "positive" as const,
      verified: true,
      avatar: "👩",
    },
    {
      id: 10,
      name: "Otherside Koda",
      floorPrice: "0.83 ETH",
      change: "-3.3%",
      changeType: "negative" as const,
      verified: true,
      avatar: "👹",
    },
    {
      id: 11,
      name: "BEEPLE: EVERYDAYS - THE 2020 COLLE...",
      floorPrice: "8.20 ETH",
      change: "-8.9%",
      changeType: "negative" as const,
      verified: true,
      avatar: "👨",
    },
    {
      id: 12,
      name: "Good Vibes Club",
      floorPrice: "0.36 ETH",
      change: "+24.1%",
      changeType: "positive" as const,
      verified: true,
      avatar: "🤙",
    },
  ];

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case "negative":
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case "positive":
        return "text-green-500";
      case "negative":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <Tabs defaultValue="top" className="flex h-full w-full flex-col">
        {/* Sticky Header */}
        <div className="bg-background border-border sticky top-0 z-10 border-b pb-3">
          <div className="mb-3 flex items-center justify-between">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="top" className="text-sm">
                Top
              </TabsTrigger>
              <TabsTrigger value="trending" className="text-sm">
                Trending
              </TabsTrigger>
            </TabsList>

            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-muted h-7 w-7 p-0"
              onClick={onCollapse}
              title="Collapse sidebar"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
              1d
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <List className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Grid className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="top" className="mt-0 space-y-0">
            <div className="space-y-0">
              {trendingCollections.map((collection) => (
                <div
                  key={collection.id}
                  className="hover:bg-muted/30 group border-border/50 flex cursor-pointer items-center justify-between border-b p-3 transition-colors last:border-b-0"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full text-lg">
                        {collection.avatar}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-1">
                        <span className="text-foreground truncate text-sm font-medium">
                          {collection.name}
                        </span>
                        {collection.verified && (
                          <CheckCircle className="h-3 w-3 flex-shrink-0 text-blue-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-foreground text-sm font-medium">
                      {collection.floorPrice}
                    </span>
                    <div className="flex items-center gap-1">
                      {getChangeIcon(collection.changeType)}
                      <span
                        className={`text-xs font-medium ${getChangeColor(collection.changeType)}`}
                      >
                        {collection.change}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-0 space-y-2">
            <div className="py-8 text-center">
              <p className="text-muted-foreground text-sm">
                Trending collections will be displayed here
              </p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
