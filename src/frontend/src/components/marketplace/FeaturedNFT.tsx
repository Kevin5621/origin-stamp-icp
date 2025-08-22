import React from "react";
import { useTranslation } from "react-i18next";

interface FeaturedNFTProps {
  className?: string;
  nft?: {
    id: string;
    title: string;
    image: string;
    currentBid: string;
    endTime: string;
    creator: {
      name: string;
      avatar: string;
    };
    instantPrice: string;
  };
}

export const FeaturedNFT: React.FC<FeaturedNFTProps> = ({
  className = "",
  nft,
}) => {
  useTranslation("marketplace");

  // Default featured NFT data
  const defaultNFT = {
    id: "1",
    title: "Purple Mannequin 3d Art Design",
    image:
      "https://via.placeholder.com/600x400/8B5CF6/ffffff?text=Purple+Mannequin+3D+Art",
    currentBid: "0.986 ETH",
    endTime: "5h : 40m : 30s",
    creator: {
      name: "Nadim Amanda",
      avatar: "https://via.placeholder.com/40x40/EC4899/ffffff?text=NA",
    },
    instantPrice: "2.5 ETH",
  };

  const featuredNFT = nft || defaultNFT;

  return (
    <div
      className={`featured-nft ${className}`}
      style={{ padding: "32px", background: "#ffffff" }}
    >
      <div
        className="featured-nft__container"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px",
          maxWidth: "1200px",
          margin: "0 auto",
          alignItems: "center",
        }}
      >
        <div className="featured-nft__image-section">
          <div
            className="featured-nft__image-wrapper"
            style={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img
              src={featuredNFT.image}
              alt={featuredNFT.title}
              className="featured-nft__image"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            <div
              className="featured-nft__countdown"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(transparent, rgba(0, 0, 0, 0.7))",
                padding: "24px 16px 16px",
              }}
            >
              <span
                className="featured-nft__countdown-text"
                style={{
                  color: "white",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  textAlign: "center",
                  display: "block",
                }}
              >
                {featuredNFT.endTime}
              </span>
            </div>
          </div>
        </div>

        <div
          className="featured-nft__details"
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          <h2
            className="featured-nft__title"
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#2d3748",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {featuredNFT.title}
          </h2>

          <div
            className="featured-nft__bid-section"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
            }}
          >
            <div
              className="featured-nft__current-bid"
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <span
                className="featured-nft__bid-label"
                style={{ fontSize: "0.875rem", color: "#6b7280" }}
              >
                Current Bid
              </span>
              <span
                className="featured-nft__bid-amount"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "#2d3748",
                }}
              >
                {featuredNFT.currentBid}
              </span>
            </div>
            <button
              className="featured-nft__bid-button"
              style={{
                padding: "12px 24px",
                background: "#2d3748",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1a202c";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 24px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#2d3748";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.1)";
              }}
            >
              Place a Bid
            </button>
          </div>

          <div
            className="featured-nft__info"
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              className="featured-nft__info-item"
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              <div
                className="featured-nft__info-dot featured-nft__info-dot--blue"
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#3B82F6",
                  flexShrink: 0,
                }}
              ></div>
              <span
                className="featured-nft__info-label"
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  minWidth: "80px",
                }}
              >
                Date:
              </span>
              <span
                className="featured-nft__info-value"
                style={{
                  fontSize: "0.875rem",
                  color: "#2d3748",
                  fontWeight: 500,
                }}
              >
                02-03-2022
              </span>
            </div>
            <div
              className="featured-nft__info-item"
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              <div
                className="featured-nft__info-dot featured-nft__info-dot--dark-blue"
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#1E40AF",
                  flexShrink: 0,
                }}
              ></div>
              <span
                className="featured-nft__info-label"
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  minWidth: "80px",
                }}
              >
                Metadata:
              </span>
              <span
                className="featured-nft__info-value"
                style={{
                  fontSize: "0.875rem",
                  color: "#2d3748",
                  fontWeight: 500,
                }}
              >
                Frozen
              </span>
            </div>
            <div
              className="featured-nft__info-item"
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              <div
                className="featured-nft__info-dot featured-nft__info-dot--pink"
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#EC4899",
                  flexShrink: 0,
                }}
              ></div>
              <span
                className="featured-nft__info-label"
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  minWidth: "80px",
                }}
              >
                Blockchain:
              </span>
              <span
                className="featured-nft__info-value"
                style={{
                  fontSize: "0.875rem",
                  color: "#2d3748",
                  fontWeight: 500,
                }}
              >
                Ethereum
              </span>
            </div>
          </div>

          <div
            className="featured-nft__creator"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
            }}
          >
            <div
              className="featured-nft__creator-info"
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              <img
                src={featuredNFT.creator.avatar}
                alt={featuredNFT.creator.name}
                className="featured-nft__creator-avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div
                className="featured-nft__creator-details"
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <span
                  className="featured-nft__creator-name"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#2d3748",
                  }}
                >
                  {featuredNFT.creator.name}
                </span>
                <span
                  className="featured-nft__creator-role"
                  style={{ fontSize: "0.75rem", color: "#6b7280" }}
                >
                  Creator
                </span>
              </div>
            </div>
            <div
              className="featured-nft__instant-price"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <svg
                className="featured-nft__eth-icon"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                style={{ color: "#2d3748" }}
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="featured-nft__price-amount"
                style={{ fontSize: "1rem", fontWeight: 600, color: "#2d3748" }}
              >
                {featuredNFT.instantPrice}
              </span>
              <span
                className="featured-nft__price-label"
                style={{ fontSize: "0.75rem", color: "#6b7280" }}
              >
                Instant Price
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedNFT;
