import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NFTCard, NFTItem } from "./NFTCard";
import { FeaturedNFT, FeaturedNFTItem } from "./FeaturedNFT";

interface HomeMarketplaceProps {
  className?: string;
}

export const HomeMarketplace: React.FC<HomeMarketplaceProps> = ({
  className = "",
}) => {
  const { t } = useTranslation("marketplace");
  const [featuredNFT, setFeaturedNFT] = useState<FeaturedNFTItem | null>(null);
  const [topCollections, setTopCollections] = useState<NFTItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch data
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, these would be API calls to fetch data from backend
      // For now, we'll use dummy data
      
      // Featured NFT dummy data
      const featuredNFTData: FeaturedNFTItem = {
        id: "featured-1",
        title: "Ethereal Dreamscape #42",
        description: "A mesmerizing digital artwork that transports viewers to a dreamlike landscape where reality and imagination intertwine.",
        image: "https://images.unsplash.com/photo-1644333192098-75573dacbb0c?q=80&w=1000",
        price: 2.5,
        instantPrice: 10,
        currency: "ETH",
        creatorName: "Aria Digital",
        creatorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100",
        endTime: new Date(Date.now() + 86400000 * 3), // 3 days from now
        likes: 128,
        isLiked: false,
        metadata: {
          date: "2025-08-15",
          category: "Digital Art",
          blockchain: "Ethereum",
        },
      };
      
      // Top Collections dummy data
      const topCollectionsData: NFTItem[] = [
        {
          id: "nft-1",
          title: "Abstract Dimensions #28",
          image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=500",
          price: 1.2,
          currency: "ETH",
          creatorName: "DigitalDreamer",
          creatorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
          endTime: new Date(Date.now() + 86400000 * 2), // 2 days from now
          likes: 45,
        },
        {
          id: "nft-2",
          title: "Neon Future #17",
          image: "https://images.unsplash.com/photo-1675230524988-36dd6739ab18?q=80&w=500",
          price: 0.8,
          currency: "ETH",
          creatorName: "CryptoCreator",
          creatorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100",
          endTime: new Date(Date.now() + 86400000 * 1), // 1 day from now
          likes: 32,
        },
        {
          id: "nft-3",
          title: "Cyberpunk Cityscape",
          image: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=500",
          price: 3.2,
          currency: "ETH",
          creatorName: "DigitalArtLabs",
          creatorAvatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=100",
          endTime: new Date(Date.now() + 86400000 * 4), // 4 days from now
          likes: 89,
        },
        {
          id: "nft-4",
          title: "Quantum Pixel Series #7",
          image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=500",
          price: 1.7,
          currency: "ETH",
          creatorName: "PixelMaster",
          creatorAvatar: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?q=80&w=100",
          endTime: new Date(Date.now() + 86400000 * 2.5), // 2.5 days from now
          likes: 51,
        },
        {
          id: "nft-5",
          title: "Astral Projection",
          image: "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?q=80&w=500",
          price: 2.1,
          currency: "ETH",
          creatorName: "CosmicArtistry",
          creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
          endTime: new Date(Date.now() + 86400000 * 3.2), // 3.2 days from now
          likes: 67,
        },
        {
          id: "nft-6",
          title: "Digital Genesis #103",
          image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=500",
          price: 4.5,
          currency: "ETH",
          creatorName: "BlockchainDesigns",
          creatorAvatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100",
          endTime: new Date(Date.now() + 86400000 * 5), // 5 days from now
          likes: 112,
        },
      ];
      
      setFeaturedNFT(featuredNFTData);
      setTopCollections(topCollectionsData);
    } catch (error) {
      console.error("Error loading marketplace data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceBid = (nft: NFTItem | FeaturedNFTItem) => {
    console.log("Place bid on:", nft);
    // In a real app, this would open a bid modal or navigate to a bid page
  };

  const handleLikeNFT = (nft: NFTItem, liked: boolean) => {
    console.log(`${liked ? 'Liked' : 'Unliked'} NFT:`, nft);
    
    // Update the likes count in the state
    setTopCollections(
      topCollections.map((item) => {
        if (item.id === nft.id) {
          return {
            ...item,
            likes: liked ? item.likes + 1 : Math.max(0, item.likes - 1),
            isLiked: liked,
          };
        }
        return item;
      })
    );
  };

  if (isLoading) {
    return (
      <div className={`home-marketplace ${className}`}>
        <div className="home-marketplace__loading">
          <div className="home-marketplace__loading-spinner"></div>
          <p>{t("loading_marketplace")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`home-marketplace ${className}`}>
      <section className="home-marketplace__featured">
        {featuredNFT && (
          <FeaturedNFT
            nft={featuredNFT}
            onPlaceBid={handlePlaceBid}
          />
        )}
      </section>

      <section className="home-marketplace__collections">
        <div className="home-marketplace__section-header">
          <h2 className="home-marketplace__section-title">{t("top_collections")}</h2>
          <p className="home-marketplace__section-subtitle">
            {t("discover_unique_digital_assets")}
          </p>
        </div>

        <div className="home-marketplace__grid">
          {topCollections.map((nft) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              onPlaceBid={handlePlaceBid}
              onLike={handleLikeNFT}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeMarketplace;
