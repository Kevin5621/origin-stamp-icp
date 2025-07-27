import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { MarketplaceHeader } from "../../components/marketplace/MarketplaceHeader";
import { CategoryFilter } from "../../components/marketplace/CategoryFilter";
import { MarketplaceSidebar } from "../../components/marketplace/MarketplaceSidebar";
import { MarketplaceMainContent } from "../../components/marketplace/MarketplaceMainContent";

export const CollectionDetailPage: React.FC = () => {
  const { t } = useTranslation("marketplace");
  const { collectionId } = useParams<{ collectionId: string }>();
  const [selectedView, setSelectedView] = useState<"grid" | "list">("grid");
  const [setActiveSection] = useState<(section: string) => void>(() => {});

  // Mock data untuk collection
  const collection = {
    id: collectionId || "off-the-grid",
    name: "Off The Grid",
    creator: "Gunz",
    description:
      "A collection of futuristic digital art pieces exploring themes of technology and human connection.",
    image:
      "https://via.placeholder.com/800x400/1f2937/ffffff?text=Collection+Image",
    bannerImage:
      "https://via.placeholder.com/1200x300/1f2937/ffffff?text=Banner+Image",
    floorPrice: "11.00",
    currency: "GUN",
    items: 6821231,
    totalVolume: "1.6M",
    listedPercentage: "< 0.1%",
    owners: 1250,
    verified: true,
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  const handleConnectWallet = () => {
    console.log("Connect wallet clicked");
  };

  return (
    <div className="marketplace-page">
      {/* Header */}
      <MarketplaceHeader
        onSearch={handleSearch}
        onConnectWallet={handleConnectWallet}
      />

      {/* Left Sidebar */}
      <MarketplaceSidebar onSectionChange={setActiveSection} />

      {/* Main Content */}
      <MarketplaceMainContent>
        {/* Collection Banner */}
        <div className="collection-banner">
          <div className="collection-banner__image">
            <img src={collection.bannerImage} alt={collection.name} />
          </div>

          <div className="collection-banner__info">
            <div className="collection-avatar">
              <img src={collection.image} alt={collection.name} />
            </div>

            <div className="collection-details">
              <h1 className="collection-name">
                {collection.name}
                {collection.verified && (
                  <span className="verified-badge">✓</span>
                )}
              </h1>
              <p className="collection-creator">by {collection.creator}</p>
              <p className="collection-description">{collection.description}</p>
            </div>

            <div className="collection-stats">
              <div className="stat-item">
                <span className="stat-value">
                  {collection.floorPrice} {collection.currency}
                </span>
                <span className="stat-label">{t("floorPrice")}</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {collection.items.toLocaleString()}
                </span>
                <span className="stat-label">{t("items")}</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {collection.totalVolume} {collection.currency}
                </span>
                <span className="stat-label">{t("totalVolume")}</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {collection.owners.toLocaleString()}
                </span>
                <span className="stat-label">Owners</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          selectedCategory="all"
          onCategoryChange={() => {}}
          selectedTimeframe="1d"
          onTimeframeChange={() => {}}
          selectedView={selectedView}
          onViewChange={setSelectedView}
        />

        {/* Collection Items */}
        <div className="collection-items">
          <div className="items-header">
            <h2>Items</h2>
            <p>{collection.items.toLocaleString()} items</p>
          </div>

          <div className="items-grid">
            {/* Placeholder untuk items */}
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="item-card">
                <div className="item-image">
                  <div className="placeholder-image"></div>
                </div>
                <div className="item-info">
                  <h3>Item #{index + 1}</h3>
                  <p>
                    Floor: {collection.floorPrice} {collection.currency}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MarketplaceMainContent>
    </div>
  );
};
