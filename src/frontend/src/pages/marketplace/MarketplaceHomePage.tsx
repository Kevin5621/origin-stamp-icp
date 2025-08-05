import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MarketplaceHeader } from "../../components/marketplace/MarketplaceHeader";
import { CategoryFilter } from "../../components/marketplace/CategoryFilter";
import { HeroBanner } from "../../components/marketplace/HeroBanner";
import { FeaturedCollections } from "../../components/marketplace/FeaturedCollections";
import { MarketplaceSidebar } from "../../components/marketplace/MarketplaceSidebar";
import { MarketplaceMainContent } from "../../components/marketplace/MarketplaceMainContent";
import { MarketplacePriceList } from "../../components/marketplace/MarketplacePriceList";

export const MarketplaceHomePage: React.FC = () => {
  const { t } = useTranslation("marketplace");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1d");
  const [selectedView, setSelectedView] = useState<"grid" | "list">("grid");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPriceListCollapsed, setIsPriceListCollapsed] = useState(false);

  // Mock data untuk featured collection
  const featuredCollection = {
    id: "off-the-grid",
    name: "Off The Grid",
    creator: "Gunz",
    image: "https://placehold.co/800x400",
    floorPrice: "11.00",
    currency: "ICP",
    items: 6821231,
    totalVolume: "1.6M",
    listedPercentage: "< 0.1%",
    previewImages: [
      "https://placehold.co/100x100",
      "https://placehold.co/100x100",
      "https://placehold.co/100x100",
    ],
  };

  // Mock data untuk featured collections
  const featuredCollections = [
    {
      id: "moonbirds",
      name: "Moonbirds",
      image: "https://placehold.co/300x200",
      floorPrice: "1.92",
      currency: "ICP",
      change: 17.1,
      verified: true,
    },
    {
      id: "off-the-grid",
      name: "Off The Grid",
      image: "https://placehold.co/300x200",
      floorPrice: "11.00",
      currency: "ICP",
      change: -75.6,
      verified: true,
    },
    {
      id: "on-chain-all-stars",
      name: "On-Chain All-Stars",
      image: "https://placehold.co/300x200",
      floorPrice: "0.0035",
      currency: "ICP",
      change: -18.7,
      verified: false,
    },
    {
      id: "overture",
      name: "Overture by Mitchell F. Chan",
      image: "https://placehold.co/300x200",
      floorPrice: "0.32",
      currency: "ICP",
      change: 0,
      verified: false,
    },
  ];

  // Mock data untuk collection list
  const topCollections = [
    {
      id: "pudgy-penguins",
      name: "Pudgy Penguins",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "15.96",
      currency: "ICP",
      change: 1.3,
      verified: true,
    },
    {
      id: "cryptopunks",
      name: "CryptoPunks",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "50.99",
      currency: "ICP",
      change: 0,
      verified: true,
    },
    {
      id: "bored-ape-yacht-club",
      name: "Bored Ape Yacht Club",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "12.67",
      currency: "ICP",
      change: 4.6,
      verified: true,
    },
    {
      id: "milady-maker",
      name: "Milady Maker",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "3.20",
      currency: "ICP",
      change: 5.8,
      verified: false,
    },
    {
      id: "moonbirds",
      name: "Moonbirds",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "1.92",
      currency: "ICP",
      change: 17.1,
      verified: true,
    },
    {
      id: "rektguy",
      name: "rektguy",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "1.35",
      currency: "ICP",
      change: 18.5,
      verified: false,
    },
    {
      id: "lil-pudgys",
      name: "Lil Pudgys",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "1.73",
      currency: "ICP",
      change: 4.3,
      verified: false,
    },
    {
      id: "dx-terminal",
      name: "DX Terminal",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "< 0.01",
      currency: "ICP",
      change: 0.9,
      verified: false,
    },
    {
      id: "mutant-ape-yacht-club",
      name: "Mutant Ape Yacht Club",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "1.89",
      currency: "ICP",
      change: 4.6,
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
    <div
      className={`marketplace-page ${isSidebarCollapsed ? "marketplace-layout--sidebar-collapsed" : ""} ${isPriceListCollapsed ? "marketplace-layout--pricelist-collapsed" : ""}`}
    >
      {/* Header */}
      <MarketplaceHeader
        onSearch={handleSearch}
        onConnectWallet={handleConnectWallet}
      />

      {/* Left Sidebar */}
      <MarketplaceSidebar
        onSectionChange={() => {}}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={setIsSidebarCollapsed}
      />

      {/* Main Content */}
      <MarketplaceMainContent>
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
      </MarketplaceMainContent>

      {/* Right Price List Sidebar */}
      <MarketplacePriceList
        collections={topCollections}
        title="TOP COLLECTIONS"
        isCollapsed={isPriceListCollapsed}
        onToggleCollapse={setIsPriceListCollapsed}
      />
    </div>
  );
};
