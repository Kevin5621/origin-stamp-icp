import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "../../components/layout/AppLayout";
import { Navbar } from "../../components/marketplace/Navbar";
import { CategoryFilter } from "../../components/marketplace/CategoryFilter";
import { HeroBanner } from "../../components/marketplace/HeroBanner";
import { FeaturedCollections } from "../../components/marketplace/FeaturedCollections";

export const MarketplaceHomePage: React.FC = () => {
  const { t } = useTranslation("marketplace");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");
  const [selectedView, setSelectedView] = useState<"grid" | "list">("grid");

  // Mock data for featured collection
  const featuredCollection = {
    id: "featured-1",
    name: "Bored Ape Yacht Club",
    creator: "Yuga Labs",
    image:
      "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
    floorPrice: "25.5",
    currency: "ICP",
    items: 10000,
    totalVolume: "1.6M",
    listedPercentage: "< 0.1%",
    previewImages: [
      "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
    ],
    change: 12.5,
    verified: true,
    description: "The most exclusive NFT collection in the world",
  };

  // Mock data for featured collections
  const featuredCollections = [
    {
      id: "bored-ape",
      name: "Bored Ape Yacht Club",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "25.5",
      currency: "ICP",
      change: 12.5,
      verified: true,
    },
    {
      id: "cryptopunks",
      name: "CryptoPunks",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "45.2",
      currency: "ICP",
      change: -2.1,
      verified: true,
    },
    {
      id: "azuki",
      name: "Azuki",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "2.08",
      currency: "ICP",
      change: 6.2,
      verified: true,
    },
    {
      id: "fidenza",
      name: "Fidenza by Tyler Hobbs",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "34.89",
      currency: "ICP",
      change: 2.6,
      verified: false,
    },
    {
      id: "doodles",
      name: "Doodles",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "1.04",
      currency: "ICP",
      change: 6.3,
      verified: true,
    },
  ];

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Implement search functionality
  };

  const handleConnectWallet = () => {
    console.log("Connect wallet clicked");
    // Implement wallet connection
  };

  return (
    <AppLayout variant="marketplace">
      <div className="marketplace">
        {/* Modern fixed Navbar */}
        <Navbar onSearch={handleSearch} onConnectWallet={handleConnectWallet} />

        {/* Main Layout Container - Konsisten dengan dashboard */}
        <div className="marketplace-layout">
          {/* Category Filter */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
            selectedView={selectedView}
            onViewChange={setSelectedView}
          />

          {/* Hero Banner */}
          <HeroBanner featuredCollection={featuredCollection} />

          {/* Featured Collections */}
          <FeaturedCollections
            collections={featuredCollections}
            title={t("featuredCollections.title")}
            subtitle={t("featuredCollections.subtitle")}
          />

          {/* Featured Drops */}
          <FeaturedCollections
            collections={[]}
            title={t("featuredDrops.title")}
            subtitle={t("featuredDrops.subtitle")}
          />
        </div>
      </div>
    </AppLayout>
  );
};
