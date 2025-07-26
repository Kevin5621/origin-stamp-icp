import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, TrendingUp, Users, DollarSign, Package } from "lucide-react";
import NFTCard from "../../components/marketplace/NFTCard";
import SearchBar from "../../components/marketplace/SearchBar";
import { MarketplaceService } from "../../services/marketplaceService";
import type { NFT, FilterOptions } from "../../types/marketplace";

const MarketplaceHomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [nfts, setNfts] = useState<NFT[]>([]);
  const [featuredNFTs, setFeaturedNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Partial<FilterOptions>>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    loadNFTs();
    loadFeaturedNFTs();
  }, [filters]);

  const loadNFTs = async () => {
    setLoading(true);
    try {
      const data = await MarketplaceService.getNFTs(filters);
      setNfts(data);
    } catch (error) {
      console.error("Failed to load NFTs:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedNFTs = async () => {
    try {
      const data = await MarketplaceService.getNFTs({ sortBy: "popular" });
      setFeaturedNFTs(data.slice(0, 5));
    } catch (error) {
      console.error("Failed to load featured NFTs:", error);
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/marketplace/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleNFTClick = (nftId: string) => {
    navigate(`/marketplace/nft/${nftId}`);
  };

  const handleBuyNFT = (nftId: string) => {
    // Navigate to checkout or show buy modal
    navigate(`/marketplace/checkout?nft=${nftId}`);
  };

  const handleCreateNFT = () => {
    navigate("/marketplace/create");
  };

  const renderLoadingSkeleton = () => (
    <div className="nft-grid">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="nft-card-skeleton wireframe-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-price"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="empty-state">
      <Package size={64} className="empty-state__icon" />
      <h3 className="empty-state__title">
        {t("marketplace.empty.title", "No NFTs Found")}
      </h3>
      <p className="empty-state__description">
        {t(
          "marketplace.empty.description",
          "Try adjusting your filters or search for something else.",
        )}
      </p>
      <button
        className="btn-wireframe btn-wireframe--primary"
        onClick={() => setFilters({})}
      >
        {t("marketplace.empty.clearFilters", "Clear Filters")}
      </button>
    </div>
  );

  return (
    <div className="marketplace-home">
      {/* Hero Section */}
      <section className="marketplace-hero">
        <div className="marketplace-hero__content">
          <h1 className="marketplace-hero__title">
            {t("marketplace.hero.title", "Discover Unique Digital Art")}
          </h1>
          <p className="marketplace-hero__subtitle">
            {t(
              "marketplace.hero.subtitle",
              "Explore verified digital artworks with OriginStamp certification. Each piece tells a unique story of creation.",
            )}
          </p>

          <div className="marketplace-hero__search">
            <SearchBar
              onSearch={handleSearch}
              placeholder={t(
                "marketplace.hero.searchPlaceholder",
                "Search for NFTs, collections, or creators...",
              )}
              showFilters={true}
            />
          </div>

          <div className="marketplace-hero__actions">
            <button
              className="btn-wireframe btn-wireframe--primary"
              onClick={handleCreateNFT}
            >
              <Plus size={20} />
              {t("marketplace.hero.createNFT", "Create & Sell")}
            </button>
          </div>
        </div>

        {/* Featured NFTs Carousel */}
        <div className="marketplace-hero__featured">
          <h3 className="marketplace-hero__featured-title">
            {t("marketplace.hero.featured", "Featured NFTs")}
          </h3>
          <div className="featured-nfts-carousel">
            {featuredNFTs.map((nft) => (
              <div key={nft.id} className="featured-nft-card">
                <img src={nft.imageUrl} alt={nft.title} />
                <div className="featured-nft-info">
                  <h4>{nft.title}</h4>
                  <p>
                    {nft.price.amount} {nft.price.currency}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="marketplace-stats">
        <div className="marketplace-stats__grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon-wrapper">
              <Package size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">15,420</div>
              <div className="stat-label">
                {t("marketplace.stats.totalNFTs", "Total NFTs")}
              </div>
            </div>
          </div>

          <div className="stat-card stat-secondary">
            <div className="stat-icon-wrapper">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">2.45M ICP</div>
              <div className="stat-label">
                {t("marketplace.stats.totalVolume", "Total Volume")}
              </div>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon-wrapper">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">8,920</div>
              <div className="stat-label">
                {t("marketplace.stats.activeUsers", "Active Users")}
              </div>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon-wrapper">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">45,670</div>
              <div className="stat-label">
                {t("marketplace.stats.totalSales", "Total Sales")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="marketplace-main">
        <div className="marketplace-main__header">
          <h2 className="marketplace-main__title">
            {t("marketplace.main.title", "Explore NFTs")}
          </h2>

          <div className="marketplace-main__controls">
            <div className="view-mode-toggle">
              <button
                className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <div className="grid-icon"></div>
              </button>
              <button
                className={`view-mode-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <div className="list-icon"></div>
              </button>
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        <div className="marketplace-main__content">
          {loading ? (
            renderLoadingSkeleton()
          ) : nfts.length > 0 ? (
            <div className={`nft-grid nft-grid--${viewMode}`}>
              {nfts.map((nft) => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  onNFTClick={handleNFTClick}
                  onBuy={handleBuyNFT}
                  className={viewMode === "list" ? "nft-card--list" : ""}
                />
              ))}
            </div>
          ) : (
            renderEmptyState()
          )}
        </div>
      </section>
    </div>
  );
};

export default MarketplaceHomePage;
