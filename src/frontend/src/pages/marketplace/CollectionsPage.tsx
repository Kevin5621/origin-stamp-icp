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
    const mockCollections: Collection[] = [
      {
        id: "1",
        title: "Abstract Harmony",
        description: "Modern abstract composition with vibrant colors",
        image: "/api/placeholder/300/400",
        price: 1500,
        artist: "Sarah Chen",
        category: "abstract",
        likes: 42,
      },
      {
        id: "2",
        title: "Digital Dreams",
        description: "Futuristic digital art piece",
        image: "/api/placeholder/300/400",
        price: 800,
        artist: "Alex Rivera",
        category: "digital",
        likes: 28,
      },
      {
        id: "3",
        title: "Traditional Beauty",
        description: "Classical oil painting technique",
        image: "/api/placeholder/300/400",
        price: 2200,
        artist: "Maria Santos",
        category: "traditional",
        likes: 35,
      },
      {
        id: "4",
        title: "Sculptural Form",
        description: "3D digital sculpture",
        image: "/api/placeholder/300/400",
        price: 1200,
        artist: "David Kim",
        category: "sculpture",
        likes: 19,
      },
      {
        id: "5",
        title: "Color Symphony",
        description: "Vibrant color exploration",
        image: "/api/placeholder/300/400",
        price: 950,
        artist: "Lisa Wang",
        category: "abstract",
        likes: 31,
      },
      {
        id: "6",
        title: "Future City",
        description: "Cyberpunk urban landscape",
        image: "/api/placeholder/300/400",
        price: 1800,
        artist: "Carlos Mendez",
        category: "digital",
        likes: 47,
      },
    ];
    setCollections(mockCollections);
  };

  const loadCategories = async () => {
    const mockCategories: Category[] = [
      { id: "abstract", name: t("categories.abstract"), count: 15 },
      { id: "digital", name: t("categories.digital"), count: 23 },
      { id: "traditional", name: t("categories.traditional"), count: 8 },
      { id: "sculpture", name: t("categories.sculpture"), count: 12 },
    ];
    setCategories(mockCategories);
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
