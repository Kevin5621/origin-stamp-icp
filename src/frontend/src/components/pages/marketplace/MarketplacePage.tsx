import React from "react";
import { HeroBanner } from "./components/HeroBanner";
import { FeaturedCollections } from "./components/FeaturedCollections";
import { TrendingCreators } from "./components/TrendingCreators";

export const MarketplacePage: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Featured Collections */}
      <FeaturedCollections />

      {/* Trending Creators */}
      <TrendingCreators />
    </div>
  );
};
