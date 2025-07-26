import React, { useState } from 'react';
import { Heart, Eye, Share2, CheckCircle } from 'lucide-react';
import type { NFT } from '../../types/marketplace';
import { MarketplaceService } from '../../services/marketplaceService';

interface NFTCardProps {
  nft: NFT;
  onBuy?: (nftId: string) => void;
  onLike?: (nftId: string) => void;
  onShare?: (nftId: string) => void;
  onNFTClick?: (nftId: string) => void;
  className?: string;
}

const NFTCard: React.FC<NFTCardProps> = ({
  nft,
  onBuy,
  onLike,
  onShare,
  onNFTClick,
  className = ''
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      if (isLiked) {
        await MarketplaceService.unlikeNFT(nft.id);
      } else {
        await MarketplaceService.likeNFT(nft.id);
      }
      setIsLiked(!isLiked);
      onLike?.(nft.id);
    } catch (error) {
      console.error('Failed to like/unlike NFT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: nft.title,
        text: nft.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    onShare?.(nft.id);
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuy?.(nft.id);
  };

  const handleCardClick = () => {
    onNFTClick?.(nft.id);
  };

  const getStatusBadge = () => {
    switch (nft.status) {
      case 'for_sale':
        return <span className="status-badge status-badge--for-sale">For Sale</span>;
      case 'sold':
        return <span className="status-badge status-badge--sold">Sold</span>;
      case 'auction':
        return <span className="status-badge status-badge--auction">Auction</span>;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`nft-card wireframe-card ${className}`}
      onClick={handleCardClick}
    >
      {/* NFT Image */}
      <div className="nft-card__image-container">
        <img 
          src={nft.imageUrl} 
          alt={nft.title}
          className="nft-card__image"
          loading="lazy"
        />
        
        {/* OriginStamp Badge */}
        {nft.originStamp.verified && (
          <div className="nft-card__originstamp-badge">
            <CheckCircle size={16} />
            <span>OriginStamp</span>
          </div>
        )}
        
        {/* Status Badge */}
        {getStatusBadge()}
        
        {/* Action Buttons */}
        <div className="nft-card__actions">
          <button
            className="nft-card__action-btn"
            onClick={handleLike}
            disabled={isLoading}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart 
              size={18} 
              className={isLiked ? 'filled' : ''}
            />
          </button>
          
          <button
            className="nft-card__action-btn"
            onClick={handleShare}
            aria-label="Share"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* NFT Info */}
      <div className="nft-card__content">
        <div className="nft-card__header">
          <h3 className="nft-card__title">{nft.title}</h3>
          <div className="nft-card__creator">
            <img 
              src={nft.creator.avatar} 
              alt={nft.creator.username}
              className="nft-card__creator-avatar"
            />
            <span className="nft-card__creator-name">
              {nft.creator.username}
              {nft.creator.verified && (
                <CheckCircle size={14} className="verified-icon" />
              )}
            </span>
          </div>
        </div>

        <div className="nft-card__stats">
          <div className="nft-card__stat">
            <Eye size={14} />
            <span>{nft.views.toLocaleString()}</span>
          </div>
          <div className="nft-card__stat">
            <Heart size={14} />
            <span>{nft.likes.toLocaleString()}</span>
          </div>
        </div>

        <div className="nft-card__price">
          <span className="nft-card__price-amount">
            {nft.price.amount} {nft.price.currency}
          </span>
        </div>

        {/* Buy Button */}
        {nft.status === 'for_sale' && (
          <button
            className="btn-wireframe btn-wireframe--primary nft-card__buy-btn"
            onClick={handleBuy}
          >
            Buy Now
          </button>
        )}
      </div>
    </div>
  );
};

export default NFTCard; 