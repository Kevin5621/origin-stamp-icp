import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "../../components/layout/AppLayout";
import { Navbar } from "../../components/marketplace/Navbar";
import { Breadcrumb } from "../../components/common/Breadcrumb";
import { CollectionFilterBar } from "../../components/marketplace/CollectionFilterBar";
import { CollectionGrid } from "../../components/marketplace/CollectionGrid";
import { Pagination } from "../../components/common/Pagination";

export const CollectionsPage: React.FC = () => {
  const { t } = useTranslation("marketplace");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Mock data for collections
  const collections = [
    {
      id: "bored-ape",
      name: "Bored Ape Yacht Club",
      creator: "Yuga Labs",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "25.5",
      currency: "ICP",
      totalVolume: "1.6M",
      items: 10000,
      verified: true,
    },
    {
      id: "cryptopunks",
      name: "CryptoPunks",
      creator: "Larva Labs",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "45.2",
      currency: "ICP",
      totalVolume: "2.3M",
      items: 10000,
      verified: true,
    },
    {
      id: "azuki",
      name: "Azuki",
      creator: "Chiru Labs",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "2.08",
      currency: "ICP",
      totalVolume: "750K",
      items: 10000,
      verified: true,
    },
    {
      id: "fidenza",
      name: "Fidenza by Tyler Hobbs",
      creator: "Tyler Hobbs",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "34.89",
      currency: "ICP",
      totalVolume: "520K",
      items: 999,
      verified: false,
    },
    {
      id: "doodles",
      name: "Doodles",
      creator: "Doodles",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "1.04",
      currency: "ICP",
      totalVolume: "430K",
      items: 10000,
      verified: true,
    },
    {
      id: "meebits",
      name: "Meebits",
      creator: "Larva Labs",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "3.75",
      currency: "ICP",
      totalVolume: "320K",
      items: 20000,
      verified: true,
    },
    {
      id: "cool-cats",
      name: "Cool Cats",
      creator: "Cool Cats NFT",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "0.89",
      currency: "ICP",
      totalVolume: "210K",
      items: 9999,
      verified: true,
    },
    {
      id: "world-of-women",
      name: "World of Women",
      creator: "World of Women",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "1.35",
      currency: "ICP",
      totalVolume: "180K",
      items: 10000,
      verified: true,
    },
    {
      id: "moonbirds",
      name: "Moonbirds",
      creator: "PROOF Collective",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "9.25",
      currency: "ICP",
      totalVolume: "950K",
      items: 10000,
      verified: true,
    },
    {
      id: "veefriends",
      name: "VeeFriends",
      creator: "Gary Vaynerchuk",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "4.50",
      currency: "ICP",
      totalVolume: "550K",
      items: 10255,
      verified: true,
    },
    {
      id: "clone-x",
      name: "Clone X",
      creator: "RTFKT Studios",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "5.15",
      currency: "ICP",
      totalVolume: "780K",
      items: 20000,
      verified: true,
    },
    {
      id: "deadfellaz",
      name: "DeadFellaz",
      creator: "Betty",
      image:
        "https://raw.githubusercontent.com/csalab-id/csalab-id.github.io/refs/heads/main/images/logo.png",
      floorPrice: "0.75",
      currency: "ICP",
      totalVolume: "120K",
      items: 10000,
      verified: false,
    },
  ];

  // Filter collections based on category and search query
  const filteredCollections = collections.filter((collection) => {
    // Filter by category
    if (selectedCategory !== "all" && collection.id !== selectedCategory) {
      return false;
    }

    // Filter by search query
    if (
      searchQuery &&
      !collection.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !collection.creator.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Sort collections based on selected sort option
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    switch (selectedSort) {
      case "popular":
        // Sort by total volume for popularity
        return parseFloat(b.totalVolume.replace(/[^0-9.]/g, "")) - 
               parseFloat(a.totalVolume.replace(/[^0-9.]/g, ""));
      case "volume":
        // Sort by total volume
        return parseFloat(b.totalVolume.replace(/[^0-9.]/g, "")) - 
               parseFloat(a.totalVolume.replace(/[^0-9.]/g, ""));
      case "price":
        // Sort by floor price
        return parseFloat(b.floorPrice) - parseFloat(a.floorPrice);
      case "newest":
      default:
        // For demo purposes, just use the current order as "newest"
        return 0;
    }
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCollections.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedCollections.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleConnectWallet = () => {
    console.log("Connect wallet clicked");
    // Implement wallet connection
  };

  return (
    <AppLayout variant="marketplace">
      <div className="marketplace">
        {/* Modern fixed Navbar */}
        <Navbar onSearch={handleSearch} onConnectWallet={handleConnectWallet} />

        {/* Main Layout Container */}
        <div className="marketplace-layout">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: t("nav.marketplace"), href: "/marketplace" },
              { label: t("nav.collections"), href: "/marketplace/collections" },
            ]}
          />

          {/* Page Title */}
          <div className="page-header">
            <h1 className="page-title">{t("collections.title")}</h1>
            <p className="page-subtitle">{t("collections.subtitle")}</p>
          </div>

          {/* Collection Filters */}
          <CollectionFilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
            onSearch={handleSearch}
          />

          {/* Collection Grid */}
          <CollectionGrid collections={currentItems} />

          {/* Pagination */}
          {sortedCollections.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};
