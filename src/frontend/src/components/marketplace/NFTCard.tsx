import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export interface NFTItem {
  id: string;
  title: string;
  image: string;
  price: number;
  currency: string;
  creatorName: string;
  creatorAvatar: string;
  endTime: Date;
  likes: number;
  isLiked?: boolean;
}

interface NFTCardProps {
  nft: NFTItem;
  onPlaceBid?: (nft: NFTItem) => void;
  onLike?: (nft: NFTItem, liked: boolean) => void;
  className?: string;
}

export const NFTCard: React.FC<NFTCardProps> = ({
  nft,
  onPlaceBid,
  onLike,
  className = "",
}) => {
  const { t } = useTranslation("marketplace");
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(nft.isLiked || false);

  // Calculate remaining time
  const now = new Date();
  const timeLeft = nft.endTime.getTime() - now.getTime();
  
  // Format time left as hours:minutes:seconds
  const formatTimeLeft = () => {
    if (timeLeft <= 0) return t("auction_ended");
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedState = !liked;
    setLiked(newLikedState);
    if (onLike) {
      onLike(nft, newLikedState);
    }
  };

  const handleBidClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlaceBid) {
      onPlaceBid(nft);
    }
  };

  return (
    <div
      className={`nft-card ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="nft-card__image-container">
        <img 
          src={nft.image} 
          alt={nft.title} 
          className="nft-card__image" 
        />
        
        {/* Overlay with place bid button on hover */}
        <div className={`nft-card__overlay ${isHovered ? 'nft-card__overlay--visible' : ''}`}>
          <button 
            className="nft-card__bid-button" 
            onClick={handleBidClick}
          >
            {t("place_bid")}
          </button>
        </div>
        
        {/* Like button */}
        <button
          className={`nft-card__like-button ${liked ? 'nft-card__like-button--active' : ''}`}
          onClick={handleLikeClick}
          aria-label={liked ? t("unlike") : t("like")}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="nft-card__like-count">{nft.likes}</span>
        </button>
      </div>

      <div className="nft-card__content">
        <div className="nft-card__creator">
          <img 
            src={nft.creatorAvatar} 
            alt={nft.creatorName} 
            className="nft-card__creator-avatar" 
          />
          <span className="nft-card__creator-name">{nft.creatorName}</span>
        </div>
        
        <h3 className="nft-card__title">{nft.title}</h3>
        
        <div className="nft-card__details">
          <div className="nft-card__time">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{formatTimeLeft()}</span>
          </div>
          
          <div className="nft-card__price">
            <span className="nft-card__price-label">{t("highest_bid")}</span>
            <span className="nft-card__price-value">
              {nft.price} {nft.currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
