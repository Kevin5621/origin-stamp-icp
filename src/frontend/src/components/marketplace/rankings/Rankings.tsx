import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import RankingFilters from "./RankingFilters";
import RankingTable from "./RankingTable";

// Types for collection data
export interface RankingCollection {
  id: string;
  rank: number;
  name: string;
  image: string;
  creator: string;
  volume: number;
  floorPrice: number;
  owners: number;
  items: number;
  percentChange: number;
  blockchain: string;
  category: string;
}

export type TimePeriod = "24h" | "7d" | "30d" | "all";
export type SortOption = "volume" | "floorPrice" | "owners" | "items" | "percentChange";
export type SortDirection = "asc" | "desc";

interface RankingsProps {
  className?: string;
}

export const Rankings: React.FC<RankingsProps> = ({ className = "" }) => {
  const { t } = useTranslation("marketplace");
  const [collections, setCollections] = useState<RankingCollection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<RankingCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter states
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("24h");
  const [category, setCategory] = useState<string>("all");
  const [blockchain, setBlockchain] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("volume");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    // Simulate API call to fetch data
    loadRankingsData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [collections, searchQuery, timePeriod, category, blockchain, sortBy, sortDirection]);

  const loadRankingsData = async () => {
    try {
      setIsLoading(true);

      // In a real app, this would be an API call to fetch data from backend
      // For now, we'll use dummy data
      const dummyCollections = generateDummyCollections(100);
      setCollections(dummyCollections);
      setFilteredCollections(dummyCollections);
    } catch (error) {
      console.error("Error loading rankings data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDummyCollections = (count: number): RankingCollection[] => {
    const categories = ["Art", "Collectibles", "Music", "Games", "Photography", "Virtual Worlds"];
    const blockchains = ["Ethereum", "Solana", "ICP", "Polygon", "Binance"];
    const collections: RankingCollection[] = [];

    for (let i = 0; i < count; i++) {
      const percentChange = Math.random() > 0.5 
        ? Number((Math.random() * 100).toFixed(2)) 
        : Number((Math.random() * -50).toFixed(2));
      
      collections.push({
        id: `collection-${i}`,
        rank: i + 1,
        name: `Collection #${i + 1}`,
        image: `https://picsum.photos/seed/${i + 1}/200/200`,
        creator: `Creator ${i + 1}`,
        volume: Number((Math.random() * 1000).toFixed(2)),
        floorPrice: Number((Math.random() * 10).toFixed(2)),
        owners: Math.floor(Math.random() * 5000) + 100,
        items: Math.floor(Math.random() * 10000) + 500,
        percentChange,
        category: categories[Math.floor(Math.random() * categories.length)],
        blockchain: blockchains[Math.floor(Math.random() * blockchains.length)]
      });
    }

    return collections;
  };

  const applyFilters = () => {
    let filtered = [...collections];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        collection => collection.name.toLowerCase().includes(query) || 
                     collection.creator.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (category !== "all") {
      filtered = filtered.filter(collection => collection.category === category);
    }

    // Apply blockchain filter
    if (blockchain !== "all") {
      filtered = filtered.filter(collection => collection.blockchain === blockchain);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCollections(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTimePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
  };

  const handleBlockchainChange = (newBlockchain: string) => {
    setBlockchain(newBlockchain);
  };

  const handleSortChange = (option: SortOption) => {
    if (sortBy === option) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortDirection("desc"); // Default to descending when changing columns
    }
  };

  if (isLoading) {
    return (
      <div className="rankings__loading">
        <div className="rankings__loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className={`rankings ${className}`}>
      <div className="rankings__header">
        <h1 className="rankings__title">{t("rankings.title", "Rankings")}</h1>
        <p className="rankings__subtitle">
          {t("rankings.subtitle", "Discover top NFT collections by volume, floor price, and more.")}
        </p>
      </div>

      <div className="rankings__search">
        <input
          type="text"
          className="rankings__search-input"
          placeholder={t("rankings.search_placeholder", "Search collections")}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <RankingFilters
        timePeriod={timePeriod}
        category={category}
        blockchain={blockchain}
        onTimePeriodChange={handleTimePeriodChange}
        onCategoryChange={handleCategoryChange}
        onBlockchainChange={handleBlockchainChange}
      />

      <RankingTable 
        collections={filteredCollections}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />
    </div>
  );
};

export default Rankings;
