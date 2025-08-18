import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NFTItem } from "./NFTCard";

export interface FeaturedNFTItem extends NFTItem {
  instantPrice: number;
  metadata: {
    date: string;
    category: string;
    blockchain: string;
  };
  description: string;
}

interface FeaturedNFTProps {
  nft: FeaturedNFTItem;
  onPlaceBid?: (nft: FeaturedNFTItem) => void;
  className?: string;
}

export const FeaturedNFT: React.FC<FeaturedNFTProps> = ({
  nft,
  onPlaceBid,
  className = "",
}) => {
  const { t } = useTranslation("marketplace");
  const [timeLeft, setTimeLeft] = useState("");
  
  // Calculate and update countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = nft.endTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft(t("auction_ended"));
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft(
        `${days > 0 ? days + "d " : ""}${hours}h ${minutes}m ${seconds}s`
      );
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [nft.endTime, t]);

  const handlePlaceBid = () => {
    if (onPlaceBid) {
      onPlaceBid(nft);
    }
  };

  return (
    <div className={`featured-nft ${className}`}>
      <div className="featured-nft__container">
        <div className="featured-nft__image">
          <img src={nft.image} alt={nft.title} />
        </div>
        
        <div className="featured-nft__content">
          <h1 className="featured-nft__title">{nft.title}</h1>
          <p className="featured-nft__description">{nft.description}</p>
          
          <div className="featured-nft__creator">
            <img 
              src={nft.creatorAvatar} 
              alt={nft.creatorName}
              className="featured-nft__creator-avatar" 
            />
            <span className="featured-nft__creator-name">{nft.creatorName}</span>
          </div>
          
          <div className="featured-nft__details">
            <div className="featured-nft__detail-item">
              <span className="featured-nft__detail-label">{t("current_bid")}</span>
              <span className="featured-nft__detail-value featured-nft__price">
                {nft.price} {nft.currency}
              </span>
            </div>
            
            <div className="featured-nft__detail-item">
              <span className="featured-nft__detail-label">{t("instant_price")}</span>
              <span className="featured-nft__detail-value featured-nft__instant-price">
                {nft.instantPrice} {nft.currency}
              </span>
            </div>
            
            <div className="featured-nft__detail-item">
              <span className="featured-nft__detail-label">{t("auction_ends_in")}</span>
              <div className="featured-nft__countdown">
                <div className="featured-nft__countdown-timer">{timeLeft}</div>
              </div>
            </div>
          </div>
          
          <div className="featured-nft__metadata">
            <div className="featured-nft__metadata-item">
              <span className="featured-nft__metadata-label">{t("date")}</span>
              <span className="featured-nft__metadata-value">{nft.metadata.date}</span>
            </div>
            
            <div className="featured-nft__metadata-item">
              <span className="featured-nft__metadata-label">{t("category")}</span>
              <span className="featured-nft__metadata-value">{nft.metadata.category}</span>
            </div>
            
            <div className="featured-nft__metadata-item">
              <span className="featured-nft__metadata-label">{t("blockchain")}</span>
              <span className="featured-nft__metadata-value">{nft.metadata.blockchain}</span>
            </div>
          </div>
          
          <div className="featured-nft__action">
            <button 
              className="featured-nft__bid-button" 
              onClick={handlePlaceBid}
            >
              {t("place_bid")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedNFT;
