import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MarketplaceHeader } from "./MarketplaceHeader";
import { SearchBar } from "./SearchBar";
import { MarketplaceSidebar } from "./MarketplaceSidebar";
import { CollectionGrid } from "./CollectionGrid";
import { useToastContext } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import PhysicalArtService from "../../services/physicalArtService";
import { backendService } from "../../services/backendService";
import type { PhysicalArtSession } from "../../services/physicalArtService";

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
  const { addToast } = useToastContext();
  const { user, isAuthenticated } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [userCollections, setUserCollections] = useState<Collection[]>([]);
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
  const [activeTab, setActiveTab] = useState<"all-items" | "collections">(
    "all-items",
  );

  useEffect(() => {
    loadAllCollections();
    loadUserCollections();
    // Categories will be loaded as part of loadAllCollections
  }, []);

  useEffect(() => {
    filterCollections();
  }, [
    collections,
    userCollections,
    selectedCategory,
    priceRange,
    searchQuery,
    activeTab,
  ]);

  const loadAllCollections = async () => {
    try {
      console.log("Loading collections from sessions...");

      // Try to get sessions data from all users
      let sessionsToShow: PhysicalArtSession[] = [];

      // First try to get all users and their sessions to ensure we show all available data
      try {
        console.log("Loading all users to get all sessions...");
        const allUsers = await backendService.getAllUsers();
        console.log("All users:", allUsers);

        for (const username of allUsers) {
          try {
            const userSessions =
              await PhysicalArtService.getUserSessions(username);
            console.log(`Sessions for user ${username}:`, userSessions);
            sessionsToShow.push(...userSessions);
          } catch (error) {
            console.warn(
              `Failed to load sessions for user ${username}:`,
              error,
            );
          }
        }
      } catch (error) {
        console.warn("Failed to load all users:", error);

        // Fallback: try current user if authenticated
        if (isAuthenticated && user) {
          console.log(
            "Fallback: loading sessions for current user:",
            user.username,
          );
          try {
            const userSessions = await PhysicalArtService.getUserSessions(
              user.username,
            );
            console.log("User sessions loaded:", userSessions);
            sessionsToShow = userSessions;
          } catch (sessionError) {
            console.error("Failed to load user sessions:", sessionError);
          }
        }
      }

      console.log("Total sessions found:", sessionsToShow);

      if (sessionsToShow.length > 0) {
        console.log("Found sessions, converting to collections...");
        // Convert sessions to collections format
        const sessionCollections: Collection[] = sessionsToShow.map(
          (session) => ({
            id: session.session_id,
            title: session.art_title,
            description: session.description,
            image:
              session.uploaded_photos.length > 0
                ? session.uploaded_photos[session.uploaded_photos.length - 1]
                : "https://via.placeholder.com/300x400/4A5568/ffffff?text=" +
                  encodeURIComponent(session.art_title),
            price: 0,
            artist: session.username,
            category: "physical-art",
            likes: 0,
          }),
        );

        console.log("Session collections created:", sessionCollections);
        setCollections(sessionCollections);

        // Update categories based on loaded data
        const uniqueCategories = ["physical-art", "digital"];
        const categoriesWithCount: Category[] = uniqueCategories.map((cat) => ({
          id: cat,
          name: cat === "physical-art" ? "Physical Art" : "Digital",
          count: sessionCollections.filter((c) => c.category === cat).length,
        }));
        setCategories(categoriesWithCount);

        return;
      } else {
        console.log("No sessions found, setting empty collections");
        setCollections([]);
        setCategories([]);
      }
    } catch (error) {
      console.error("Failed to load collections:", error);
      if (addToast) {
        addToast("error", "Failed to load collections");
      }
      setCollections([]);
    }
  };

  const loadUserCollections = async () => {
    try {
      if (!isAuthenticated || !user) {
        console.log("User not authenticated, clearing user collections");
        setUserCollections([]);
        return;
      }

      console.log("Loading collections for current user:", user.username);

      try {
        const userSessions = await PhysicalArtService.getUserSessions(
          user.username,
        );
        console.log("Current user sessions loaded:", userSessions);

        if (userSessions.length > 0) {
          // Convert sessions to collections format
          const sessionCollections: Collection[] = userSessions.map(
            (session) => ({
              id: session.session_id,
              title: session.art_title,
              description: session.description,
              image:
                session.uploaded_photos.length > 0
                  ? session.uploaded_photos[session.uploaded_photos.length - 1]
                  : "https://via.placeholder.com/300x400/4A5568/ffffff?text=" +
                    encodeURIComponent(session.art_title),
              price: 0,
              artist: session.username,
              category: "physical-art",
              likes: 0,
            }),
          );

          console.log("User session collections created:", sessionCollections);
          setUserCollections(sessionCollections);
        } else {
          console.log("No user sessions found");
          setUserCollections([]);
        }
      } catch (sessionError) {
        console.error("Failed to load user sessions:", sessionError);
        setUserCollections([]);
      }
    } catch (error) {
      console.error("Failed to load user collections:", error);
      setUserCollections([]);
    }
  };

  const filterCollections = () => {
    // Choose data source based on active tab
    let sourceCollections =
      activeTab === "collections" ? userCollections : collections;
    let filtered = sourceCollections;

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
            {/* Tab Navigation */}
            <div className="marketplace-main__tabs">
              <button
                className={`marketplace-main__tab ${
                  activeTab === "all-items"
                    ? "marketplace-main__tab--active"
                    : ""
                }`}
                onClick={() => setActiveTab("all-items")}
              >
                {t("all_items", "All Items")}
              </button>
              <button
                className={`marketplace-main__tab ${
                  activeTab === "collections"
                    ? "marketplace-main__tab--active"
                    : ""
                }`}
                onClick={() => setActiveTab("collections")}
              >
                {t("collections", "Collections")}
              </button>
            </div>

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
