import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Grid3X3,
  List,
  Sparkles,
  Crown,
  Zap,
  Heart,
  Eye,
  ArrowRight,
  Star,
  Verified,
} from "lucide-react";
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
        <div
          key={`skeleton-${index}`}
          className="nft-card-skeleton wireframe-card"
        >
          <div className="skeleton-image">
            <Package size={32} className="skeleton-icon" />
          </div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-price">
              <Zap size={14} className="skeleton-price-icon" />
            </div>
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
      {/* Revolutionary Hero Section */}
      <section className="marketplace-hero">
        <div className="hero-grid">
          {/* Main Content Area */}
          <div className="hero-main">
            <div className="hero-badge">
              <Verified size={14} />
              <span>{t("marketplace.hero.badge", "Blockchain Certified")}</span>
              <Sparkles size={12} />
            </div>

            <h1 className="hero-title">
              <div className="title-line">
                <Crown size={32} className="title-icon" />
                <span className="title-text">
                  {t("marketplace.hero.title", "Digital")}
                </span>
              </div>
              <div className="title-line title-accent">
                <span className="title-text">
                  {t("marketplace.hero.title2", "Art Universe")}
                </span>
                <Zap size={28} className="title-icon" />
              </div>
            </h1>

            <p className="hero-description">
              {t(
                "marketplace.hero.subtitle",
                "Immerse yourself in a curated universe of authenticated digital masterpieces. Every NFT tells a story of creativity, innovation, and blockchain-verified provenance.",
              )}
            </p>

            <div className="hero-search-section">
              <SearchBar
                onSearch={handleSearch}
                placeholder={t(
                  "marketplace.hero.searchPlaceholder",
                  "Search artworks, creators, collections...",
                )}
                showFilters={true}
              />
            </div>

            <div className="hero-actions">
              <button className="btn-hero-primary" onClick={handleCreateNFT}>
                <Plus size={18} />
                <span>{t("marketplace.hero.createNFT", "Create Art")}</span>
                <ArrowRight size={16} />
              </button>

              <button className="btn-hero-secondary">
                <Eye size={18} />
                <span>{t("marketplace.hero.explore", "Explore")}</span>
              </button>
            </div>
          </div>

          {/* Featured Showcase */}
          <div className="hero-showcase">
            <div className="showcase-frame">
              <div className="showcase-header">
                <Star size={16} />
                <span>
                  {t("marketplace.hero.featured", "Curated Selection")}
                </span>
              </div>

              <div className="featured-stack">
                {featuredNFTs.slice(0, 3).map((nft, index) => (
                  <button
                    key={nft.id}
                    className={`featured-item featured-item--${index}`}
                    onClick={() => handleNFTClick(nft.id)}
                    type="button"
                  >
                    <div className="featured-image">
                      <img src={nft.imageUrl} alt={nft.title} />
                      <div className="featured-overlay">
                        <Heart size={12} />
                      </div>
                    </div>
                    <div className="featured-details">
                      <h4>{nft.title}</h4>
                      <div className="featured-price">
                        <DollarSign size={12} />
                        <span>
                          {nft.price.amount} {nft.price.currency}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Stats Section */}
      <section className="marketplace-stats">
        <div className="stats-container">
          <div className="stats-header">
            <TrendingUp size={20} />
            <h2>{t("marketplace.stats.title", "Live Market Data")}</h2>
            <div className="stats-indicator">
              <div className="pulse-dot"></div>
              <span>Live</span>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-cell stat-primary">
              <div className="stat-visual">
                <Package size={24} />
                <div className="stat-bg-pattern"></div>
              </div>
              <div className="stat-data">
                <div className="stat-number">15,420</div>
                <div className="stat-label">
                  {t("marketplace.stats.totalNFTs", "Total Artworks")}
                </div>
                <div className="stat-change positive">
                  <TrendingUp size={12} />
                  <span>+12%</span>
                </div>
              </div>
            </div>

            <div className="stat-cell stat-secondary">
              <div className="stat-visual">
                <DollarSign size={24} />
                <div className="stat-bg-pattern"></div>
              </div>
              <div className="stat-data">
                <div className="stat-number">2.45M</div>
                <div className="stat-label">
                  {t("marketplace.stats.totalVolume", "Volume (ICP)")}
                </div>
                <div className="stat-change positive">
                  <ArrowRight size={12} />
                  <span>+8%</span>
                </div>
              </div>
            </div>

            <div className="stat-cell stat-accent">
              <div className="stat-visual">
                <Users size={24} />
                <div className="stat-bg-pattern"></div>
              </div>
              <div className="stat-data">
                <div className="stat-number">8,920</div>
                <div className="stat-label">
                  {t("marketplace.stats.activeUsers", "Collectors")}
                </div>
                <div className="stat-change positive">
                  <Heart size={12} />
                  <span>+15%</span>
                </div>
              </div>
            </div>

            <div className="stat-cell stat-info">
              <div className="stat-visual">
                <Zap size={24} />
                <div className="stat-bg-pattern"></div>
              </div>
              <div className="stat-data">
                <div className="stat-number">45.7K</div>
                <div className="stat-label">
                  {t("marketplace.stats.totalSales", "Transactions")}
                </div>
                <div className="stat-change positive">
                  <Star size={12} />
                  <span>+22%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Gallery Section */}
      <section className="marketplace-gallery">
        <div className="gallery-container">
          <div className="gallery-header">
            <div className="header-main">
              <div className="header-icon-group">
                <Package size={20} />
                <Sparkles size={16} />
              </div>
              <div className="header-text">
                <h2>{t("marketplace.main.title", "Digital Art Gallery")}</h2>
                <p>
                  {t(
                    "marketplace.main.subtitle",
                    "Discover authenticated masterpieces",
                  )}
                </p>
              </div>
            </div>

            <div className="gallery-controls">
              <div className="view-toggle">
                <button
                  className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="gallery-content">
            {loading && renderLoadingSkeleton()}
            {!loading && nfts.length > 0 && (
              <div className={`gallery-grid gallery-grid--${viewMode}`}>
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
            )}
            {!loading && nfts.length === 0 && renderEmptyState()}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketplaceHomePage;
