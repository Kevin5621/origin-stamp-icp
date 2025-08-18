import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CollectionHeader, CollectionInfo } from "./CollectionHeader";
import { FilterSidebar, FilterOptions } from "./FilterSidebar";
import { NFTGrid } from "./NFTGrid";
import { NFTItem } from "./NFTCard";

interface SortOption {
  id: string;
  label: string;
}

interface CollectionViewProps {
  className?: string;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  className = "",
}) => {
  const { t } = useTranslation("marketplace");
  const [collection, setCollection] = useState<CollectionInfo | null>(null);
  const [nftItems, setNftItems] = useState<NFTItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<NFTItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<FilterOptions>({
    categories: [
      "art",
      "photography",
      "music",
      "video",
      "collectible",
      "virtual_world",
    ],
    selectedCategory: "all",
    priceRange: {
      min: 0,
      max: null,
    },
    status: {
      buyNow: false,
      onAuction: false,
      new: false,
      hasOffers: false,
    },
  });

  const sortOptions: SortOption[] = [
    { id: "recently_listed", label: t("sort.recently_listed") },
    { id: "price_low_high", label: t("sort.price_low_high") },
    { id: "price_high_low", label: t("sort.price_high_low") },
    { id: "most_popular", label: t("sort.most_popular") },
  ];

  const [selectedSort, setSelectedSort] = useState<string>("recently_listed");

  useEffect(() => {
    // Load collection data and NFT items
    loadCollectionData();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    applyFiltersAndSort();
  }, [nftItems, filters, selectedSort]);

  const loadCollectionData = async () => {
    try {
      setIsLoading(true);

      // In a real app, this would be an API call to fetch collection data
      // For now, we'll use dummy data

      // Collection dummy data
      const collectionData: CollectionInfo = {
        id: "cosmic-perspective",
        title: "Cosmic Perspective",
        description:
          "A collection of futuristic digital art pieces exploring themes of technology and human connection. Each piece represents a unique vision of the future and our relationship with the digital realm.",
        bannerImage:
          "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=1200",
        avatarImage:
          "https://images.unsplash.com/photo-1620510625142-b45cbb784397?q=80&w=300",
        creator: {
          name: "DigitalDreamer",
          address: "0x3b96...a28d",
          avatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
          verified: true,
        },
        stats: {
          items: 156,
          owners: 89,
          floorPrice: 1.2,
          volumeTraded: 45.8,
        },
      };

      // NFT items dummy data
      const nftItemsData: NFTItem[] = [
        {
          id: "nft-1",
          title: "Digital Genesis #103",
          image:
            "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=500",
          price: 1.8,
          currency: "ETH",
          creatorName: "DigitalDreamer",
          creatorAvatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
          endTime: new Date(Date.now() + 86400000 * 2), // 2 days from now
          likes: 45,
          status: "auction",
          owner: {
            name: "MetaCollector",
            avatar:
              "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
          },
          isNew: true,
        },
        {
          id: "nft-2",
          title: "Neon Future #17",
          image:
            "https://images.unsplash.com/photo-1675230524988-36dd6739ab18?q=80&w=500",
          price: 0.8,
          currency: "ETH",
          creatorName: "DigitalDreamer",
          creatorAvatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
          endTime: new Date(Date.now() + 86400000 * 1), // 1 day from now
          likes: 32,
          status: "buy",
          owner: {
            name: "CryptoWhale",
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100",
          },
          hasOffers: true,
        },
        {
          id: "nft-3",
          title: "Cyberpunk Cityscape",
          image:
            "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=500",
          price: 3.2,
          currency: "ETH",
          creatorName: "DigitalDreamer",
          creatorAvatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
          endTime: new Date(Date.now() + 86400000 * 4), // 4 days from now
          likes: 89,
          status: "auction",
          owner: {
            name: "ArtCollector123",
            avatar:
              "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=100",
          },
        },
        {
          id: "nft-4",
          title: "Quantum Pixel Series #7",
          image:
            "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=500",
          price: 1.7,
          currency: "ETH",
          creatorName: "DigitalDreamer",
          creatorAvatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
          endTime: new Date(Date.now() + 86400000 * 2.5), // 2.5 days from now
          likes: 51,
          status: "buy",
          owner: {
            name: "NFTEnthusiast",
            avatar:
              "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?q=80&w=100",
          },
          isNew: true,
        },
        {
          id: "nft-5",
          title: "Astral Projection",
          image:
            "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?q=80&w=500",
          price: 2.1,
          currency: "ETH",
          creatorName: "DigitalDreamer",
          creatorAvatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
          endTime: new Date(Date.now() + 86400000 * 3.2), // 3.2 days from now
          likes: 67,
          status: "auction",
          owner: {
            name: "CryptoKing",
            avatar:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
          },
          hasOffers: true,
        },
        {
          id: "nft-6",
          title: "Digital Dreamscape",
          image:
            "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=500",
          price: 4.5,
          currency: "ETH",
          creatorName: "DigitalDreamer",
          creatorAvatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
          endTime: new Date(Date.now() + 86400000 * 5), // 5 days from now
          likes: 112,
          status: "buy",
          owner: {
            name: "BlockchainArtist",
            avatar:
              "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100",
          },
        },
      ];

      setCollection(collectionData);
      setNftItems(nftItemsData);
    } catch (error) {
      console.error("Error loading collection data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...nftItems];

    // Apply category filter
    if (filters.selectedCategory !== "all") {
      // For this example, we don't have category in NFT items
      // In a real app, you would filter based on category
    }

    // Apply price filter
    filtered = filtered.filter(
      (item) =>
        item.price >= filters.priceRange.min &&
        (filters.priceRange.max === null ||
          item.price <= filters.priceRange.max),
    );

    // Apply status filters
    if (
      filters.status.buyNow ||
      filters.status.onAuction ||
      filters.status.new ||
      filters.status.hasOffers
    ) {
      filtered = filtered.filter((item) => {
        if (filters.status.buyNow && item.status === "buy") return true;
        if (filters.status.onAuction && item.status === "auction") return true;
        if (filters.status.new && item.isNew) return true;
        if (filters.status.hasOffers && item.hasOffers) return true;
        return false;
      });
    }

    // Apply sorting
    switch (selectedSort) {
      case "recently_listed":
        // In a real app, you would sort by listing date
        // For this example, we'll use the NFT ID as a proxy for listing date
        filtered.sort(
          (a, b) => parseInt(b.id.split("-")[1]) - parseInt(a.id.split("-")[1]),
        );
        break;
      case "price_low_high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high_low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "most_popular":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
    }

    setFilteredItems(filtered);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSort(e.target.value);
  };

  const handleFollowCollection = (
    collection: CollectionInfo,
    isFollowing: boolean,
  ) => {
    console.log(
      `${isFollowing ? "Following" : "Unfollowed"} collection:`,
      collection.title,
    );
    // In a real app, you would make an API call to follow/unfollow the collection
  };

  const handleNFTClick = (nft: NFTItem) => {
    console.log("NFT clicked:", nft);
    // In a real app, you would navigate to the NFT detail page
  };

  const handlePlaceBid = (nft: NFTItem) => {
    console.log("Place bid on:", nft);
    // In a real app, you would open a bid modal or navigate to a bid page
  };

  const handleLikeNFT = (nft: NFTItem, liked: boolean) => {
    console.log(`${liked ? "Liked" : "Unliked"} NFT:`, nft);

    // Update the likes count in the state
    setNftItems(
      nftItems.map((item) => {
        if (item.id === nft.id) {
          return {
            ...item,
            likes: liked ? item.likes + 1 : Math.max(0, item.likes - 1),
            isLiked: liked,
          };
        }
        return item;
      }),
    );
  };

  if (isLoading || !collection) {
    return (
      <div className={`collection-view ${className}`}>
        <div className="collection-view__loading">
          <div className="collection-view__loading-spinner"></div>
          <p>{t("loading_collection")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`collection-view ${className}`}>
      <CollectionHeader
        collection={collection}
        onFollow={handleFollowCollection}
      />

      <div className="collection-view__content">
        <div className="collection-view__toolbar">
          <div className="collection-view__filter-toggle">
            <button className="collection-view__filter-button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t("filters")}
            </button>
          </div>

          <div className="collection-view__sort">
            <span className="collection-view__sort-label">{t("sort_by")}</span>
            <select
              className="collection-view__sort-select"
              value={selectedSort}
              onChange={handleSortChange}
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="collection-view__layout">
          {/* <aside className="collection-view__sidebar">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside> */}

          <div className="collection-view__main">
            <div className="collection-view__results">
              <p className="collection-view__count">
                {filteredItems.length} {t("items")}
              </p>
            </div>

            <NFTGrid
              items={filteredItems}
              onNFTClick={handleNFTClick}
              onPlaceBid={handlePlaceBid}
              onLike={handleLikeNFT}
            />

            {filteredItems.length === 0 && (
              <div className="collection-view__no-results">
                <p>{t("no_items_found")}</p>
                <button
                  className="collection-view__reset-button"
                  onClick={() =>
                    handleFilterChange({
                      ...filters,
                      selectedCategory: "all",
                      priceRange: { min: 0, max: null },
                      status: {
                        buyNow: false,
                        onAuction: false,
                        new: false,
                        hasOffers: false,
                      },
                    })
                  }
                >
                  {t("reset_filters")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionView;
