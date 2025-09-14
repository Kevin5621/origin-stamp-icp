import React from "react";
import { CheckCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const FeaturedCollections: React.FC = () => {
  const collections = [
    {
      id: 1,
      name: "SHRIMPERS",
      floorPrice: "0.20 ETH",
      change: "+5.3%",
      changeType: "positive" as const,
      verified: true,
      image: "bg-gradient-to-br from-blue-500 to-orange-500",
      textColor: "text-orange-500",
    },
    {
      id: 2,
      name: "Aeons",
      floorPrice: "0.0044 ETH",
      change: "-7.3%",
      changeType: "negative" as const,
      verified: true,
      image: "bg-gradient-to-br from-gray-800 to-blue-900",
      textColor: "text-blue-400",
    },
    {
      id: 3,
      name: "CyberKongz",
      floorPrice: "3.00 ETH",
      change: "0%",
      changeType: "neutral" as const,
      verified: true,
      image: "bg-gradient-to-br from-gray-900 to-green-900",
      textColor: "text-green-400",
    },
    {
      id: 4,
      name: "Variance",
      floorPrice: "19.70 SOMI",
      change: "-21.2%",
      changeType: "negative" as const,
      verified: false,
      image: "bg-gradient-to-br from-pink-500 to-purple-600",
      textColor: "text-white",
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
    <div className="mb-8">
      <div className="mb-6">
        <h3 className="text-foreground mb-2 text-2xl font-bold">
          Featured Collections
        </h3>
        <p className="text-muted-foreground">This week's curated collections</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {collections.map((collection) => (
          <Card
            key={collection.id}
            className="group border-border/50 hover:border-border cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-xl"
          >
            <CardContent className="p-0">
              {/* Collection Image */}
              <div
                className={`relative h-40 ${collection.image} flex items-center justify-center`}
              >
                <div className="text-center">
                  <h4
                    className={`text-xl font-bold ${collection.textColor} mb-2`}
                  >
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
                    {collection.floorPrice}
                  </span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon(collection.changeType)}
                    <span
                      className={`text-sm font-medium ${getChangeColor(collection.changeType)}`}
                    >
                      {collection.change}
                    </span>
                  </div>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
