import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MarketplaceHeader } from "./MarketplaceHeader";
import { SearchBar } from "./SearchBar";
import { MarketplaceSidebar } from "./MarketplaceSidebar";
import { CollectionGrid } from "./CollectionGrid";

interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  artist: string;
  category: string;
  likes: number;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface MarketplaceMainProps {
  className?: string;
}

export const MarketplaceMain: React.FC<MarketplaceMainProps> = ({
  className = "",
}) => {
  const { t } = useTranslation("marketplace");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>(
    [],
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: 0,
    max: Infinity,
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCollections();
    loadCategories();
  }, []);

  useEffect(() => {
    filterCollections();
  }, [collections, selectedCategory, priceRange, searchQuery]);

  const loadCollections = async () => {
    // TODO: Load real collections from backend
    setCollections([]);
  };

  const loadCategories = async () => {
    // TODO: Load real categories from backend
    setCategories([]);
  };

  const filterCollections = () => {
    let filtered = collections;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (collection) => collection.category === selectedCategory,
      );
    }

    filtered = filtered.filter(
      (collection) =>
        collection.price >= priceRange.min &&
        (priceRange.max === Infinity || collection.price <= priceRange.max),
    );

    if (searchQuery) {
      filtered = filtered.filter(
        (collection) =>
          collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          collection.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          collection.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredCollections(filtered);
  };

  const handleCollectionClick = (collection: Collection) => {
    console.log("Collection clicked:", collection);
  };

  return (
    <div className={`marketplace-main ${className}`}>
      <MarketplaceHeader />

      <div className="marketplace-main__content">
        <div className="marketplace-main__search">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="marketplace-main__layout">
          <MarketplaceSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onPriceChange={setPriceRange}
          />

          <div className="marketplace-main__collections">
            <div className="marketplace-main__results">
              <p className="marketplace-main__count">
                {t("results_count", { count: filteredCollections.length })}
              </p>
            </div>
            <CollectionGrid
              collections={filteredCollections}
              onCollectionClick={handleCollectionClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceMain;
