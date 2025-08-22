import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Heart, User } from "lucide-react";
import { MarketplaceService } from "../../services/marketplaceService";
import { useToastContext } from "../../contexts/ToastContext";
import type { Collection } from "../../types/marketplace";

interface TopCollectionNFT {
  id: string;
  title: string;
  image: string;
  owner: {
    name: string;
    avatar: string;
  };
  isLiked: boolean;
  endTime: string;
  highestBid: string;
}

interface TopCollectionProps {
  className?: string;
  collections?: Collection[];
}

export const TopCollection: React.FC<TopCollectionProps> = ({
  className = "",
  collections: propCollections,
}) => {
  useTranslation("marketplace");
  const { addToast } = useToastContext();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load collections from backend
  useEffect(() => {
    const loadCollections = async () => {
      // Use prop collections if provided, otherwise load from backend
      if (propCollections && propCollections.length > 0) {
        setCollections(propCollections);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const backendCollections = await MarketplaceService.getCollections();
        setCollections(backendCollections);

        if (backendCollections.length === 0) {
          console.log("No collections found");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load collections";
        setError(errorMessage);
        console.error("Failed to load collections:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCollections();
  }, [propCollections]);

  // Convert Collection to TopCollectionNFT for UI compatibility
  const convertCollectionToNFT = (
    collection: Collection,
  ): TopCollectionNFT[] => {
    // Take first 3 NFTs from each collection
    return collection.nfts.slice(0, 3).map((nft) => ({
      id: nft.id,
      title: nft.title,
      image:
        nft.imageUrl ||
        `https://via.placeholder.com/300x400/667eea/ffffff?text=${encodeURIComponent(nft.title)}`,
      owner: {
        name: nft.creator.username,
        avatar: nft.creator.avatar,
      },
      isLiked: false, // Would need to be tracked separately
      endTime: "Ongoing",
      highestBid: nft.price.amount + " " + nft.price.currency,
    }));
  };

  // Flatten all collections into NFTs
  const topCollections = collections
    .flatMap(convertCollectionToNFT)
    .slice(0, 3);

  // Loading state
  if (loading) {
    return (
      <div className={`top-collection ${className}`}>
        <div className="top-collection__header">
          <h3 className="top-collection__title">Top Collection</h3>
          <button className="top-collection__view-all" disabled>
            Loading...
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              border: "2px solid var(--color-border)",
              borderTop: "2px solid var(--color-accent)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
            }}
          >
            Loading collections...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`top-collection ${className}`}>
        <div className="top-collection__header">
          <h3 className="top-collection__title">Top Collection</h3>
          <button className="top-collection__view-all" disabled>
            Error
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
            flexDirection: "column",
            gap: "var(--space-3)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "32px", color: "var(--color-error)" }}>
            ⚠️
          </div>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
            }}
          >
            {error}
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (topCollections.length === 0) {
    return (
      <div className={`top-collection ${className}`}>
        <div className="top-collection__header">
          <h3 className="top-collection__title">Top Collection</h3>
          <button className="top-collection__view-all" disabled>
            No Collections
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
            flexDirection: "column",
            gap: "var(--space-3)",
            textAlign: "center",
          }}
        >
          <pre
            style={{
              fontFamily: "monospace",
              fontSize: "8px",
              color: "var(--color-text-secondary)",
              margin: 0,
              lineHeight: 1.1,
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
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
            }}
          >
            No collections available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`top-collection ${className}`}>
      <div className="top-collection__header">
        <h3 className="top-collection__title">Top Collection</h3>
        <button className="top-collection__view-all">View All</button>
      </div>

      <div className="top-collection__grid">
        {topCollections.map((collection) => (
          <div key={collection.id} className="top-collection__card">
            <div className="top-collection__card-header">
              <div className="top-collection__owner">
                {collection.owner.avatar ? (
                  <img
                    src={collection.owner.avatar}
                    alt={collection.owner.name}
                    className="top-collection__owner-avatar"
                  />
                ) : (
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "var(--color-surface-disabled)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <User size={16} color="var(--color-text-secondary)" />
                  </div>
                )}
                <span className="top-collection__owner-name">
                  {collection.owner.name}
                </span>
              </div>
              <button className="top-collection__like-btn">
                <Heart
                  size={14}
                  fill={collection.isLiked ? "currentColor" : "none"}
                  color="currentColor"
                  style={{
                    width: "14px",
                    height: "14px",
                  }}
                />
              </button>
            </div>

            <div className="top-collection__card-image">
              <img
                src={collection.image}
                alt={collection.title}
                className="top-collection__image"
              />
              <div className="top-collection__card-overlay">
                <button className="top-collection__bid-button">
                  Place a Bid
                </button>
              </div>
            </div>

            <div className="top-collection__card-content">
              <h4 className="top-collection__card-title">{collection.title}</h4>
              <div className="top-collection__card-details">
                <span className="top-collection__end-time">
                  Ending in {collection.endTime}
                </span>
                <span className="top-collection__highest-bid">
                  Highest bid {collection.highestBid}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCollection;
