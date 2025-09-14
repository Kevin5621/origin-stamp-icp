import React from "react";
import { HeroBanner } from "./components/HeroBanner";
import { FeaturedCollections } from "./components/FeaturedCollections";

export const MarketplacePage: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Featured Collections */}
      <FeaturedCollections />
    </div>
  );
};
