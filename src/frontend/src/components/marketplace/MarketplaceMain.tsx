import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { Zap, User } from "lucide-react";
import { MarketplaceService } from "../../services/marketplaceService";
import { useToastContext } from "../../contexts/ToastContext";
import type { NFT } from "../../types/marketplace";

interface NFTItem {
  id: string;
  title: string;
  image: string;
  currentBid: string;
  endingTime: string;
  creator: {
    name: string;
    avatar: string;
  };
  blockchain: string;
  metadata: string;
  date: string;
  instantPrice: string;
  isLiked: boolean;
}

export const MarketplaceMain: React.FC = () => {
  useTranslation("marketplace");
  const { user } = useAuth();
  const { addToast } = useToastContext();

  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load NFTs from backend
  useEffect(() => {
    const loadNFTs = async () => {
      try {
        setLoading(true);
        setError(null);
        const backendNfts = await MarketplaceService.getNFTs();
        setNfts(backendNfts);

        if (backendNfts.length === 0) {
          addToast("info", "No NFTs found in marketplace");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load NFTs";
        setError(errorMessage);
        addToast("error", errorMessage);
        console.error("Failed to load marketplace NFTs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [addToast]);

  // Convert NFT type to NFTItem type for UI compatibility
  const convertNFTToNFTItem = (nft: NFT): NFTItem => ({
    id: nft.id,
    title: nft.title,
    image:
      nft.imageUrl ||
      `https://via.placeholder.com/400x400/667eea/ffffff?text=${encodeURIComponent(nft.title)}`,
    currentBid: nft.price.amount + " " + nft.price.currency,
    endingTime: "Ongoing", // Could be calculated from auction end time if available
    creator: {
      name: nft.creator.username,
      avatar: nft.creator.avatar,
    },
    blockchain: "Internet Computer",
    metadata: nft.originStamp.verified ? "Verified" : "Pending",
    date: new Date(nft.createdAt).toLocaleDateString(),
    instantPrice: nft.price.amount + " " + nft.price.currency,
    isLiked: false, // Would need to be tracked separately
  });

  // Get featured NFT (first one) and top collection (rest)
  const featuredNFT = nfts.length > 0 ? convertNFTToNFTItem(nfts[0]) : null;
  const topCollection = nfts.slice(1, 4).map(convertNFTToNFTItem);

  // Loading state
  if (loading) {
    return (
      <div className="marketplace">
        <div className="marketplace__container">
          <div className="marketplace__header">
            <div className="marketplace__greeting">
              <h1>Hello, {user?.username || "User"}</h1>
              <p>Loading marketplace...</p>
            </div>
          </div>
          <div className="marketplace__featured">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
                flexDirection: "column",
                gap: "var(--spacing-lg)",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "3px solid var(--color-border)",
                  borderTop: "3px solid var(--color-accent)",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              <p style={{ color: "var(--color-text-secondary)" }}>
                Loading NFTs from blockchain...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="marketplace">
        <div className="marketplace__container">
          <div className="marketplace__header">
            <div className="marketplace__greeting">
              <h1>Hello, {user?.username || "User"}</h1>
              <p>Marketplace unavailable</p>
            </div>
          </div>
          <div className="marketplace__featured">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
                flexDirection: "column",
                gap: "var(--spacing-lg)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  color: "var(--color-error)",
                }}
              >
                ⚠️
              </div>
              <h3 style={{ color: "var(--color-text-primary)", margin: 0 }}>
                Failed to load marketplace
              </h3>
              <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "var(--spacing-md) var(--spacing-xl)",
                  background: "var(--color-accent)",
                  color: "var(--color-surface)",
                  border: "none",
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--font-weight-semibold)",
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (nfts.length === 0) {
    return (
      <div className="marketplace">
        <div className="marketplace__container">
          <div className="marketplace__header">
            <div className="marketplace__greeting">
              <h1>Hello, {user?.username || "User"}</h1>
              <p>No NFTs in marketplace yet</p>
            </div>
          </div>
          <div className="marketplace__featured">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
                flexDirection: "column",
                gap: "var(--spacing-lg)",
                textAlign: "center",
              }}
            >
              <pre
                style={{
                  fontFamily: "monospace",
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                  margin: 0,
                  lineHeight: 1.2,
                  whiteSpace: "pre",
                  textAlign: "center",
                }}
              >{`─────────────███████████████────────────
──────────████▒▒▒▒▒▒▒▒▒▒▒▒▒████─────────
────────███▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒███───────
───────██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒███─────
──────██▒▒▒▒▒▒▒▒▒▒██▒▒▒▒███████▒▒▒██────
─────██▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒██▒▒▒██───
────██▒▒██▒▒▒▒███▒▒▒▒▒▒▒▒▒▒▒▒▒▒███▒▒██──
───██▒▒▒▒▒████▒▒▒▒██▒▒▒██▒▒▒▒▒▒▒▒██▒▒█──
───█▒▒▒▒▒▒▒▒▒▒▒███░█▒▒▒█░███▒▒▒▒▒▒▒▒▒█──
───█▒▒▒▒▒██████░░░░█▒▒▒█░░░░██████▒▒▒█──
───█▒▒▒▒▒▒▒█░░░░▓▓██▒▒▒██▓▓░░░░█▒▒▒▒▒█──
───█▒▒▒▒▒▒▒▒██████▒▒▒▒▒▒▒██████▒█▒▒▒▒█──
───█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒█──
───█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█░█▒▒▒█──
───██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█░█▒▒██──
────██▒▒▒▒▒▒▒▒▒▒▒████████▒▒▒▒▒▒██▒▒██───
─────██▒▒▒▒▒▒█████▒▒▒▒▒▒█████▒▒▒▒▒██────
──────██▒▒▒███▒▒▒▒▒████▒▒▒▒▒███▒▒██─────
───────███▒▒▒▒▒▒▒▒█▒▒▒▒█▒▒▒▒▒▒▒▒██──────
─────────███▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒███───────
───────────█████▒▒▒▒▒▒▒▒▒██████─────────
───────────────████████████─────────────`}</pre>
              <h3 style={{ color: "var(--color-text-primary)", margin: 0 }}>
                No NFTs Available
              </h3>
              <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>
                Be the first to create an NFT through our physical art sessions!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="marketplace">
      <div className="marketplace__container">
        {/* Header Section */}
        <div className="marketplace__header">
          <div className="marketplace__greeting">
            <h1>Hello, {user?.username || "User"}</h1>
            <p>
              {nfts.length} NFT{nfts.length !== 1 ? "s" : ""} in marketplace
            </p>
          </div>
        </div>

        {/* Featured NFT Section */}
        {featuredNFT && (
          <div className="marketplace__featured">
            <div className="marketplace__featured-content">
              {/* Left - NFT Image */}
              <div className="marketplace__nft-image">
                <img
                  src={featuredNFT.image}
                  alt={featuredNFT.title}
                  className="hero-image"
                />

                {/* Countdown Timer Overlay */}
                <div className="marketplace__nft-image-timer">
                  <span>{featuredNFT.endingTime}</span>
                </div>
              </div>

              {/* Right - NFT Details */}
              <div className="marketplace__nft-details">
                <h2>{featuredNFT.title}</h2>

                {/* Current Bid */}
                <div className="marketplace__bid-section">
                  <div className="marketplace__bid-info">
                    <p>Current Bid</p>
                    <p>{featuredNFT.currentBid}</p>
                  </div>
                  <button className="marketplace__bid-btn">Place a Bid</button>
                </div>

                {/* NFT Details */}
                <div className="marketplace__nft-meta">
                  <div className="marketplace__meta-item">
                    <div
                      className="marketplace__meta-item-dot"
                      style={{ backgroundColor: "var(--color-info)" }}
                    ></div>
                    <span>Date: {featuredNFT.date}</span>
                  </div>
                  <div className="marketplace__meta-item">
                    <div
                      className="marketplace__meta-item-dot"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    ></div>
                    <span>Metadata: {featuredNFT.metadata}</span>
                  </div>
                  <div className="marketplace__meta-item">
                    <div
                      className="marketplace__meta-item-dot"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    ></div>
                    <span>Blockchain: {featuredNFT.blockchain}</span>
                  </div>
                </div>

                {/* Creator Info */}
                <div className="marketplace__creator-info">
                  <div className="marketplace__creator">
                    <div className="marketplace__creator-avatar">
                      {featuredNFT.creator.avatar ? (
                        <img
                          src={featuredNFT.creator.avatar}
                          alt="Creator Avatar"
                          className="avatar"
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "var(--color-surface-disabled)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          <User size={18} color="var(--color-text-secondary)" />
                        </div>
                      )}
                    </div>
                    <div className="marketplace__creator-details">
                      <p>{featuredNFT.creator.name}</p>
                      <p>Creator</p>
                    </div>
                  </div>
                  <div className="marketplace__instant-price">
                    <Zap
                      size={16}
                      style={{
                        color: "var(--color-warning)",
                        flexShrink: 0,
                      }}
                    />
                    <span>{featuredNFT.instantPrice}</span>
                    <span>Instant Price</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Collection Section */}
        <div className="top-collection">
          <div className="top-collection__header">
            <h3 className="top-collection__title">Top Collection</h3>
            <a href="#" className="top-collection__view-all">
              View All
            </a>
          </div>
          <div className="top-collection__grid">
            {topCollection.map((nft) => (
              <div key={nft.id} className="top-collection__card">
                {/* NFT Image */}
                <div className="top-collection__card-image">
                  <img
                    src={nft.image}
                    alt={nft.title}
                    className="gallery-image"
                  />

                  {/* Overlay with Bid Button */}
                  <div className="top-collection__card-overlay">
                    <button className="top-collection__bid-button">
                      Place a Bid
                    </button>
                  </div>
                </div>

                {/* NFT Info */}
                <div className="top-collection__card-content">
                  {/* Creator Info */}
                  <div className="top-collection__owner">
                    {nft.creator.avatar ? (
                      <img
                        src={nft.creator.avatar}
                        alt="Creator Avatar"
                        className="avatar avatar--small"
                      />
                    ) : (
                      <div
                        className="avatar avatar--small"
                        style={{
                          backgroundColor: "var(--color-surface-disabled)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        <User size={14} color="var(--color-text-secondary)" />
                      </div>
                    )}
                    <span className="top-collection__owner-name">
                      {nft.creator.name}
                    </span>
                  </div>

                  {/* NFT Title */}
                  <h4 className="top-collection__card-title">{nft.title}</h4>

                  {/* NFT Details */}
                  <div className="top-collection__card-details">
                    <span className="top-collection__end-time">
                      Ending in {nft.endingTime}
                    </span>
                    <span className="top-collection__highest-bid">
                      Highest bid {nft.currentBid}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceMain;
