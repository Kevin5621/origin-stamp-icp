import React from "react";
import { NFTCard, NFTItem } from "./NFTCard";

interface NFTGridProps {
  items: NFTItem[];
  onNFTClick?: (nft: NFTItem) => void;
  onPlaceBid?: (nft: NFTItem) => void;
  onLike?: (nft: NFTItem, liked: boolean) => void;
  className?: string;
}

export const NFTGrid: React.FC<NFTGridProps> = ({
  items,
  onNFTClick,
  onPlaceBid,
  onLike,
  className = "",
}) => {
  return (
    <div className={`nft-grid ${className}`}>
      {items.map((nft) => (
        <NFTCard
          key={nft.id}
          nft={nft}
          onClick={onNFTClick}
          onPlaceBid={onPlaceBid}
          onLike={onLike}
        />
      ))}
    </div>
  );
};

export default NFTGrid;
