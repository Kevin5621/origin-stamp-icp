import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Grid, List } from "lucide-react";
import NFTCard from "../../components/marketplace/NFTCard";
import UserProfile from "../../components/marketplace/UserProfile";
import { UserService } from "../../services/userService";
import type { User, NFT, Collection } from "../../types/marketplace";

const UserProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [createdNFTs, setCreatedNFTs] = useState<NFT[]>([]);
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "created" | "owned" | "collections"
  >("created");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFollowing, setIsFollowing] = useState(false);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (username) {
      loadUserProfile();
    }
  }, [username]);

  const loadUserProfile = async () => {
    if (!username) return;

    setLoading(true);
    try {
      const [userProfile, created, owned, userCollections, followStatus] =
        await Promise.all([
          UserService.getUserProfile(username),
          UserService.getUserCreatedNFTs(username),
          UserService.getUserOwnedNFTs(username),
          UserService.getUserCollections(username),
          UserService.isFollowing
            ? UserService.isFollowing("current-user", username)
            : Promise.resolve(false),
        ]);

      setUser(userProfile);
      setCreatedNFTs(created);
      setOwnedNFTs(owned);
      setCollections(userCollections);
      setIsFollowing(followStatus);
    } catch (error) {
      console.error("Failed to load user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!username || !user) return;

    setFollowing(true);
    try {
      if (UserService.followUser) {
        await UserService.followUser(username);
      }
      setIsFollowing(true);
    } catch (error) {
      console.error("Failed to follow user:", error);
    } finally {
      setFollowing(false);
    }
  };

  const handleUnfollow = async () => {
    if (!username) return;

    setFollowing(true);
    try {
      if (UserService.unfollowUser) {
        await UserService.unfollowUser(username);
      }
      setIsFollowing(false);
    } catch (error) {
      console.error("Failed to unfollow user:", error);
    } finally {
      setFollowing(false);
    }
  };

  const handleCollectionClick = (collectionId: string) => {
    navigate(`/marketplace/collection/${collectionId}`);
  };

  const renderLoadingSkeleton = () => (
    <div className="user-profile-loading">
      <div className="user-profile-header-skeleton">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-subtitle"></div>
          <div className="skeleton-stats"></div>
        </div>
      </div>
      <div className="skeleton-nfts-grid">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={`skeleton-${index}`} className="skeleton-nft-card"></div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return renderLoadingSkeleton();
  }

  if (!user) {
    return (
      <div className="user-profile-error">
        <h1>{t("marketplace.profile.user_not_found", "User not found")}</h1>
        <p>
          {t(
            "marketplace.profile.user_not_found_description",
            "The user you are looking for does not exist.",
          )}
        </p>
        <button
          onClick={() => navigate("/marketplace")}
          className="btn-wireframe btn-wireframe--primary"
        >
          {t("marketplace.profile.back_to_marketplace", "Back to Marketplace")}
        </button>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <UserProfile
        user={user}
        isFollowing={isFollowing}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
        loading={following}
      />

      {/* Content Navigation */}
      <div className="user-profile-tabs">
        <button
          onClick={() => setActiveTab("created")}
          className={`user-profile-tab ${activeTab === "created" ? "active" : ""}`}
        >
          <span>
            {t("marketplace.profile.created_nfts", "Created NFTs")} (
            {createdNFTs.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("owned")}
          className={`user-profile-tab ${activeTab === "owned" ? "active" : ""}`}
        >
          <span>
            {t("marketplace.profile.owned_nfts", "Owned NFTs")} (
            {ownedNFTs.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab("collections")}
          className={`user-profile-tab ${activeTab === "collections" ? "active" : ""}`}
        >
          <span>
            {t("marketplace.profile.collections", "Collections")} (
            {collections.length})
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="user-profile-content">
        {activeTab === "created" && (
          <div className="user-profile-nfts">
            <div className="user-profile-controls">
              <button
                onClick={() => setViewMode("grid")}
                className={`view-toggle ${viewMode === "grid" ? "active" : ""}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`view-toggle ${viewMode === "list" ? "active" : ""}`}
              >
                <List size={16} />
              </button>
            </div>

            {createdNFTs.length === 0 ? (
              <div className="empty-state">
                <p>
                  {t(
                    "marketplace.profile.no_created_nfts",
                    "No NFTs created yet",
                  )}
                </p>
              </div>
            ) : (
              <div
                className={`nfts-grid ${viewMode === "list" ? "nfts-list" : ""}`}
              >
                {createdNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "owned" && (
          <div className="user-profile-nfts">
            <div className="user-profile-controls">
              <button
                onClick={() => setViewMode("grid")}
                className={`view-toggle ${viewMode === "grid" ? "active" : ""}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`view-toggle ${viewMode === "list" ? "active" : ""}`}
              >
                <List size={16} />
              </button>
            </div>

            {ownedNFTs.length === 0 ? (
              <div className="empty-state">
                <p>
                  {t("marketplace.profile.no_owned_nfts", "No NFTs owned yet")}
                </p>
              </div>
            ) : (
              <div
                className={`nfts-grid ${viewMode === "list" ? "nfts-list" : ""}`}
              >
                {ownedNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "collections" && (
          <div className="user-profile-collections">
            {collections.length === 0 ? (
              <div className="empty-state">
                <p>
                  {t(
                    "marketplace.profile.no_collections",
                    "No collections created yet",
                  )}
                </p>
              </div>
            ) : (
              <div className="collections-grid">
                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    className="collection-card wireframe-card"
                    onClick={() => handleCollectionClick(collection.id)}
                  >
                    <img src={collection.coverImage} alt={collection.name} />
                    <div className="collection-info">
                      <h3>{collection.name}</h3>
                      <p>{collection.stats.totalItems} items</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
