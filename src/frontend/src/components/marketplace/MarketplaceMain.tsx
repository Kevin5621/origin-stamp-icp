import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { Heart, Zap, User } from "lucide-react";
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
      <div className="dashboard">
        <div className="dashboard__content">
          <div className="dashboard__main">
            <div className="dashboard__section">
              <div className="dashboard__header">
                <h1 className="dashboard__title">
                  Hello, {user?.username || "User"}
                </h1>
                <p className="dashboard__subtitle">Loading marketplace...</p>
              </div>
            </div>
            <div className="dashboard__section">
              <div className="dashboard-card">
                <div className="dashboard-card__content">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "400px",
                      flexDirection: "column",
                      gap: "var(--space-4)",
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
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard__content">
          <div className="dashboard__main">
            <div className="dashboard__section">
              <div className="dashboard__header">
                <h1 className="dashboard__title">
                  Hello, {user?.username || "User"}
                </h1>
                <p className="dashboard__subtitle">Marketplace unavailable</p>
              </div>
            </div>
            <div className="dashboard__section">
              <div className="dashboard-card">
                <div className="dashboard-card__content">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "400px",
                      flexDirection: "column",
                      gap: "var(--space-4)",
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
                    <h3
                      style={{ color: "var(--color-text-primary)", margin: 0 }}
                    >
                      Failed to load marketplace
                    </h3>
                    <p
                      style={{
                        color: "var(--color-text-secondary)",
                        margin: 0,
                      }}
                    >
                      {error}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      style={{
                        padding: "var(--space-3) var(--space-6)",
                        background: "var(--color-accent)",
                        color: "var(--color-surface)",
                        border: "none",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        fontWeight: "var(--font-weight-medium)",
                      }}
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (nfts.length === 0) {
    return (
      <div className="dashboard">
        <div className="dashboard__content">
          <div className="dashboard__main">
            <div className="dashboard__section">
              <div className="dashboard__header">
                <h1 className="dashboard__title">
                  Hello, {user?.username || "User"}
                </h1>
                <p className="dashboard__subtitle">
                  No NFTs in marketplace yet
                </p>
              </div>
            </div>
            <div className="dashboard__section">
              <div className="dashboard-card">
                <div className="dashboard-card__content">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "400px",
                      flexDirection: "column",
                      gap: "var(--space-4)",
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
                    <h3
                      style={{ color: "var(--color-text-primary)", margin: 0 }}
                    >
                      No NFTs Available
                    </h3>
                    <p
                      style={{
                        color: "var(--color-text-secondary)",
                        margin: 0,
                      }}
                    >
                      Be the first to create an NFT through our physical art
                      sessions!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__content">
        <div className="dashboard__main">
          {/* Header Section */}
          <div className="dashboard__section">
            <div className="dashboard__header">
              <h1 className="dashboard__title">
                Hello, {user?.username || "User"}
              </h1>
              <p className="dashboard__subtitle">
                {nfts.length} NFT{nfts.length !== 1 ? "s" : ""} in marketplace
              </p>
            </div>
          </div>

          {/* Featured NFT Section */}
          {featuredNFT && (
            <div className="dashboard__section">
              <div className="dashboard-card">
                <div className="dashboard-card__header">
                  <h2 className="dashboard-card__title">Featured NFT</h2>
                </div>
                <div className="dashboard-card__content">
                  <div className="marketplace__featured-content">
                    {/* Left - NFT Image */}
                    <div className="marketplace__nft-image">
                      <img
                        src={featuredNFT.image}
                        alt={featuredNFT.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
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
                        <button className="marketplace__bid-btn">
                          Place a Bid
                        </button>
                      </div>

                      {/* NFT Details */}
                      <div className="marketplace__nft-meta">
                        <div className="marketplace__meta-item">
                          <div
                            className="marketplace__meta-item-dot"
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "var(--color-info)",
                              marginRight: "12px",
                            }}
                          ></div>
                          <span>Date: {featuredNFT.date}</span>
                        </div>
                        <div className="marketplace__meta-item">
                          <div
                            className="marketplace__meta-item-dot"
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "var(--color-primary)",
                              marginRight: "12px",
                            }}
                          ></div>
                          <span>Metadata: {featuredNFT.metadata}</span>
                        </div>
                        <div className="marketplace__meta-item">
                          <div
                            className="marketplace__meta-item-dot"
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "var(--color-accent)",
                              marginRight: "12px",
                            }}
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
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "50%",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  backgroundColor:
                                    "var(--color-surface-disabled)",
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  border: "1px solid var(--color-border)",
                                }}
                              >
                                <User
                                  size={20}
                                  color="var(--color-text-secondary)"
                                />
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
              </div>
            </div>
          )}

          {/* Top Collection Section */}
          <div className="dashboard__section">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">Top Collection</h2>
                <a
                  href="#"
                  style={{
                    color: "var(--color-accent)",
                    textDecoration: "none",
                  }}
                >
                  View All
                </a>
              </div>
              <div className="dashboard-card__content">
                <div className="marketplace__top-collection-grid">
                  {topCollection.map((nft) => (
                    <div key={nft.id} className="marketplace__nft-card">
                      {/* NFT Image */}
                      <div className="marketplace__card-image">
                        <img
                          src={nft.image}
                          alt={nft.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />

                        {/* Place a Bid Button Overlay */}
                        <button className="marketplace__card-image-btn">
                          Place a Bid
                        </button>
                      </div>

                      {/* NFT Info */}
                      <div className="marketplace__card-content">
                        {/* Creator Info */}
                        <div className="marketplace__card-creator">
                          <div className="marketplace__card-creator-info">
                            <div className="marketplace__card-creator-info-avatar">
                              {nft.creator.avatar ? (
                                <img
                                  src={nft.creator.avatar}
                                  alt="Creator Avatar"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor:
                                      "var(--color-surface-disabled)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid var(--color-border)",
                                  }}
                                >
                                  <User
                                    size={12}
                                    color="var(--color-text-secondary)"
                                  />
                                </div>
                              )}
                            </div>
                            <span>{nft.creator.name}</span>
                          </div>
                          <div className="marketplace__card-creator-like">
                            <Heart
                              size={16}
                              fill={nft.isLiked ? "var(--color-error)" : "none"}
                              color={
                                nft.isLiked
                                  ? "var(--color-error)"
                                  : "var(--color-text-tertiary)"
                              }
                              style={{
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                              }}
                            />
                          </div>
                        </div>

                        {/* NFT Title */}
                        <h4 className="marketplace__card-title">{nft.title}</h4>

                        {/* NFT Details */}
                        <div className="marketplace__card-details">
                          <div>
                            <p>Ending in {nft.endingTime}</p>
                            <p>Highest bid {nft.currentBid}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceMain;
