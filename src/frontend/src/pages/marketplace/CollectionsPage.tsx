import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "../../components/layout/AppLayout";
import { MarketplaceHeader } from "../../components/marketplace/MarketplaceHeader";
import { SearchBar } from "../../components/marketplace/SearchBar";
import { MarketplaceSidebar } from "../../components/marketplace/MarketplaceSidebar";
import { CollectionGrid } from "../../components/marketplace/CollectionGrid";
import { Pagination } from "../../components/common/Pagination";

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

export const CollectionsPage: React.FC = () => {
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    loadCollections();
    loadCategories();
  }, []);

  useEffect(() => {
    filterCollections();
  }, [collections, selectedCategory, priceRange, searchQuery]);

  const loadCollections = async () => {
    // TODO: Load real collections from backend
    // For now, showing some dummy data for testing
    setCollections([
      {
        id: "1",
        title: "Digital Dreams Collection",
        description:
          "A stunning collection of digital artworks exploring the realm of dreams.",
        image:
          "https://via.placeholder.com/300x400/4A5568/ffffff?text=Digital+Dreams",
        price: 150,
        artist: "John Doe",
        category: "digital",
        likes: 42,
      },
      {
        id: "2",
        title: "Abstract Visions",
        description:
          "Bold abstract pieces that challenge perception and reality.",
        image:
          "https://via.placeholder.com/300x400/2D3748/ffffff?text=Abstract+Visions",
        price: 280,
        artist: "Jane Smith",
        category: "abstract",
        likes: 18,
      },
      {
        id: "3",
        title: "Traditional Masterpieces",
        description:
          "Classic traditional artworks with modern digital preservation.",
        image:
          "https://via.placeholder.com/300x400/8B5A3C/ffffff?text=Traditional",
        price: 320,
        artist: "Maria Santos",
        category: "traditional",
        likes: 67,
      },
      {
        id: "4",
        title: "Sculpture Gallery",
        description: "3D digital sculptures bringing art into the metaverse.",
        image:
          "https://via.placeholder.com/300x400/2B6CB0/ffffff?text=Sculpture",
        price: 450,
        artist: "Alex Chen",
        category: "sculpture",
        likes: 93,
      },
    ]);
  };

  const loadCategories = async () => {
    // TODO: Load real categories from backend
    setCategories([
      { id: "digital", name: "Digital", count: 1 },
      { id: "abstract", name: "Abstract", count: 1 },
      { id: "traditional", name: "Traditional", count: 1 },
      { id: "sculpture", name: "Sculpture", count: 1 },
    ]);
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

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paginatedCollections = filteredCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);

  return (
    <AppLayout variant="marketplace">
      <div className="marketplace-main">
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
                collections={paginatedCollections}
                onCollectionClick={handleCollectionClick}
              />

              {totalPages > 1 && (
                <div className="marketplace-main__pagination">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CollectionsPage;
