import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle, Users, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  MarketplaceService,
  type TrendingCreator,
} from "@/services/marketplace";

export const TrendingCreators: React.FC = () => {
  const [creators, setCreators] = useState<TrendingCreator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrendingCreators = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await MarketplaceService.getTrendingCreators(6);
        setCreators(data);
      } catch (err) {
        console.error("Failed to load trending creators:", err);
        setError("Failed to load trending creators");
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendingCreators();
  }, []);

  const formatJoinDate = (timestamp: number) => {
    const date = new Date(timestamp / 1000000); // Convert nanoseconds to milliseconds
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getAvatarFallback = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="mb-6">
          <h3 className="text-foreground mb-2 flex items-center gap-2 text-2xl font-bold">
            <TrendingUp className="h-6 w-6" />
            Trending Creators
          </h3>
          <p className="text-muted-foreground">
            New artists joining the platform
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-muted h-10 w-10 rounded-full"></div>
                  <div className="flex-1">
                    <div className="bg-muted mb-2 h-4 w-24 rounded"></div>
                    <div className="bg-muted h-3 w-16 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <div className="mb-6">
          <h3 className="text-foreground mb-2 flex items-center gap-2 text-2xl font-bold">
            <TrendingUp className="h-6 w-6" />
            Trending Creators
          </h3>
          <p className="text-muted-foreground">
            New artists joining the platform
          </p>
        </div>
        <div className="p-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="mb-8">
        <div className="mb-6">
          <h3 className="text-foreground mb-2 flex items-center gap-2 text-2xl font-bold">
            <TrendingUp className="h-6 w-6" />
            Trending Creators
          </h3>
          <p className="text-muted-foreground">
            New artists joining the platform
          </p>
        </div>
        <div className="p-8 text-center">
          <Users className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h4 className="text-foreground mb-2 text-lg font-semibold">
            No New Creators Yet
          </h4>
          <p className="text-muted-foreground">
            New creators will appear here when they join and create artwork.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h3 className="text-foreground mb-2 flex items-center gap-2 text-2xl font-bold">
          <TrendingUp className="h-6 w-6" />
          Trending Creators
        </h3>
        <p className="text-muted-foreground">
          New artists joining the platform
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {creators.map((creator) => (
          <Card
            key={creator.username}
            className="group cursor-pointer transition-all duration-200 hover:shadow-lg"
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="relative">
                  {creator.avatarUrl ? (
                    <Image
                      src={creator.avatarUrl}
                      alt={creator.username}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white ${
                      creator.avatarUrl ? "hidden" : ""
                    }`}
                  >
                    {getAvatarFallback(creator.username)}
                  </div>
                  {creator.verified && (
                    <div className="absolute -top-1 -right-1">
                      <CheckCircle className="h-4 w-4 rounded-full bg-white text-blue-400" />
                    </div>
                  )}
                </div>

                {/* Creator Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-foreground truncate text-sm font-semibold">
                      {creator.displayName || creator.username}
                    </h4>
                  </div>

                  <div className="text-muted-foreground space-y-1 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Joined {formatJoinDate(creator.joinedDate)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>
                        {creator.totalArtworks} artwork
                        {creator.totalArtworks !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* New badge for recently joined */}
                <div className="flex-shrink-0">
                  {(() => {
                    const joinedDaysAgo = Math.floor(
                      (Date.now() - creator.joinedDate / 1000000) /
                        (1000 * 60 * 60 * 24),
                    );
                    if (joinedDaysAgo <= 7) {
                      return (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          New
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
