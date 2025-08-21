import React, { useState, useEffect } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { CollectionGrid } from "../../components/marketplace/CollectionGrid";
import { MarketplaceService } from "../../services/marketplaceService";
import { useToastContext } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import PhysicalArtService from "../../services/physicalArtService";
import { backendService } from "../../services/backendService";
import type { Collection as MarketplaceCollection } from "../../types/marketplace";
import type { PhysicalArtSession } from "../../services/physicalArtService";
import { Loader } from "lucide-react";

// Local Collection interface that matches CollectionGrid expectations
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

export const MarketplaceCollectionsPage: React.FC = () => {
  const { addToast } = useToastContext();
  const { user, isAuthenticated } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      console.log("Loading collections...");

      // Try to get sessions data directly to debug
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
        return;
      }

      // Fallback to marketplace service
      console.log("Loading from marketplace service...");
      const collectionsData = await MarketplaceService.getCollections();
      console.log("Marketplace collections loaded:", collectionsData);

      // Convert marketplace collections to local collection format
      const adaptedCollections: Collection[] = collectionsData.map(
        (collection: MarketplaceCollection) => ({
          id: collection.id,
          title: collection.name,
          description: collection.description,
          image:
            collection.coverImage ||
            "https://via.placeholder.com/300x400/4A5568/ffffff?text=" +
              encodeURIComponent(collection.name),
          price: parseFloat(collection.stats.floorPrice) || 0,
          artist: collection.creator.username,
          category: "digital", // Default category since tags aren't available in this Collection type
          likes: 0, // Would need to be tracked separately
        }),
      );

      console.log("Final collections to display:", adaptedCollections);
      setCollections(adaptedCollections);
    } catch (error) {
      console.error("Failed to load collections:", error);
      addToast("error", "Failed to load collections");
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionClick = (collection: Collection) => {
    console.log("Collection clicked:", collection);
    // TODO: Navigate to collection detail page
  };

  return (
    <AppLayout variant="marketplace">
      <div className="marketplace-collections">
        <div className="marketplace-collections__content">
          <div className="marketplace-collections__header">
            <h1 className="marketplace-collections__title">Koleksi NFT</h1>
            <p className="marketplace-collections__subtitle">
              Jelajahi koleksi karya seni digital terverifikasi dari berbagai
              seniman
            </p>
          </div>

          {loading ? (
            <div className="marketplace-collections__loading">
              <Loader size={24} className="animate-spin" />
              <span>Memuat koleksi...</span>
            </div>
          ) : (
            <>
              <div className="marketplace-collections__count">
                <span>{collections.length} koleksi tersedia</span>
              </div>

              <div className="marketplace-collections__grid">
                <CollectionGrid
                  collections={collections}
                  onCollectionClick={handleCollectionClick}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default MarketplaceCollectionsPage;
