import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Package, Users, FolderOpen } from "lucide-react";
import NFTCard from "../../components/marketplace/NFTCard";
import { MarketplaceService } from "../../services/marketplaceService";
import type { NFT, Collection, User } from "../../types/marketplace";

const SearchResultsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState<{
    nfts: NFT[];
    collections: Collection[];
    users: User[];
  }>({ nfts: [], collections: [], users: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "all" | "nfts" | "collections" | "users"
  >("all");
  const [totalResults, setTotalResults] = useState(0);

  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const results = await MarketplaceService.searchNFTs(query);
      setSearchResults({
        nfts: results.nfts,
        collections: results.collections,
        users: results.users,
      });
      setTotalResults(results.total);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNFTClick = (nftId: string) => {
    navigate(`/marketplace/nft/${nftId}`);
  };

  const handleCollectionClick = (collectionId: string) => {
    navigate(`/marketplace/collection/${collectionId}`);
  };

  const handleUserClick = (username: string) => {
    navigate(`/marketplace/profile/${username}`);
  };

  const handleBuyNFT = (nftId: string) => {
    navigate(`/marketplace/checkout?nft=${nftId}`);
  };

  const renderLoadingSkeleton = () => (
    <div className="search-results-loading">
      {Array.from({ length: 6 }).map((_, index) => (
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
    <div className="search-results-empty">
      <Search size={64} className="empty-icon" />
      <h3 className="empty-title">
        {t("marketplace.search.noResults", "No results found")}
      </h3>
      <p className="empty-description">
        {t(
          "marketplace.search.noResultsDescription",
          "Try adjusting your search terms or browse our marketplace.",
        )}
      </p>
      <button
        className="btn-wireframe btn-wireframe--primary"
        onClick={() => navigate("/marketplace")}
      >
        {t("marketplace.search.browseMarketplace", "Browse Marketplace")}
      </button>
    </div>
  );

  const renderNFTs = () => (
    <div className="search-results__nfts">
      <div className="nft-grid">
        {searchResults.nfts.map((nft) => (
          <NFTCard
            key={nft.id}
            nft={nft}
            onNFTClick={handleNFTClick}
            onBuy={handleBuyNFT}
          />
        ))}
      </div>
    </div>
  );

  const renderCollections = () => (
    <div className="search-results__collections">
      <div className="collections-grid">
        {searchResults.collections.map((collection) => (
          <div
            key={collection.id}
            className="collection-card wireframe-card"
            onClick={() => handleCollectionClick(collection.id)}
          >
            <div className="collection-card__image">
              <img src={collection.coverImage} alt={collection.name} />
            </div>
            <div className="collection-card__content">
              <h3 className="collection-card__title">{collection.name}</h3>
              <p className="collection-card__description">
                {collection.description}
              </p>
              <div className="collection-card__stats">
                <span>{collection.stats.totalItems} items</span>
                <span>{collection.stats.floorPrice} floor</span>
              </div>
              <div className="collection-card__creator">
                <img
                  src={collection.creator.avatar}
                  alt={collection.creator.username}
                />
                <span>{collection.creator.username}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="search-results__users">
      <div className="users-grid">
        {searchResults.users.map((user) => (
          <div
            key={user.username}
            className="user-card wireframe-card"
            onClick={() => handleUserClick(user.username)}
          >
            <div className="user-card__header">
              <img
                src={user.avatar}
                alt={user.username}
                className="user-card__avatar"
              />
              <div className="user-card__info">
                <h3 className="user-card__name">
                  {user.username}
                  {user.verified && <span className="verified-badge">✓</span>}
                </h3>
                <p className="user-card__bio">{user.bio}</p>
              </div>
            </div>
            <div className="user-card__stats">
              <div className="user-card__stat">
                <span className="stat-value">
                  {user.followers.toLocaleString()}
                </span>
                <span className="stat-label">
                  {t("marketplace.search.followers", "Followers")}
                </span>
              </div>
              <div className="user-card__stat">
                <span className="stat-value">{user.totalSales}</span>
                <span className="stat-label">
                  {t("marketplace.search.sales", "Sales")}
                </span>
              </div>
              <div className="user-card__stat">
                <span className="stat-value">{user.totalVolume}</span>
                <span className="stat-label">
                  {t("marketplace.search.volume", "Volume")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResults = () => {
    if (activeTab === "all") {
      return (
        <div className="search-results__all">
          {searchResults.nfts.length > 0 && (
            <section className="search-results__section">
              <h3 className="search-results__section-title">
                <Package size={20} />
                {t("marketplace.search.nfts", "NFTs")} (
                {searchResults.nfts.length})
              </h3>
              {renderNFTs()}
            </section>
          )}

          {searchResults.collections.length > 0 && (
            <section className="search-results__section">
              <h3 className="search-results__section-title">
                <FolderOpen size={20} />
                {t("marketplace.search.collections", "Collections")} (
                {searchResults.collections.length})
              </h3>
              {renderCollections()}
            </section>
          )}

          {searchResults.users.length > 0 && (
            <section className="search-results__section">
              <h3 className="search-results__section-title">
                <Users size={20} />
                {t("marketplace.search.users", "Users")} (
                {searchResults.users.length})
              </h3>
              {renderUsers()}
            </section>
          )}
        </div>
      );
    }

    switch (activeTab) {
      case "nfts":
        return renderNFTs();
      case "collections":
        return renderCollections();
      case "users":
        return renderUsers();
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="search-results-page">
        <div className="search-results__header">
          <h1 className="search-results__title">
            {t("marketplace.search.searching", "Searching...")}
          </h1>
        </div>
        {renderLoadingSkeleton()}
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <div className="search-results__header">
        <h1 className="search-results__title">
          {t("marketplace.search.resultsFor", "Search results for")}: "{query}"
        </h1>
        <p className="search-results__subtitle">
          {totalResults} {t("marketplace.search.resultsFound", "results found")}
        </p>

        {/* Filter Tabs */}
        <div className="search-results__tabs">
          <button
            className={`search-results__tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            {t("marketplace.search.all", "All")} ({totalResults})
          </button>
          <button
            className={`search-results__tab ${activeTab === "nfts" ? "active" : ""}`}
            onClick={() => setActiveTab("nfts")}
          >
            {t("marketplace.search.nfts", "NFTs")} ({searchResults.nfts.length})
          </button>
          <button
            className={`search-results__tab ${activeTab === "collections" ? "active" : ""}`}
            onClick={() => setActiveTab("collections")}
          >
            {t("marketplace.search.collections", "Collections")} (
            {searchResults.collections.length})
          </button>
          <button
            className={`search-results__tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            {t("marketplace.search.users", "Users")} (
            {searchResults.users.length})
          </button>
        </div>
      </div>

      <div className="search-results__content">
        {totalResults === 0 ? renderEmptyState() : renderResults()}
      </div>
    </div>
  );
};

export default SearchResultsPage;
