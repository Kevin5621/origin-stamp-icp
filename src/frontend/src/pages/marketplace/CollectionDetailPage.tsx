import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Share2,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  Grid,
  List,
  CheckCircle
} from 'lucide-react';
import NFTCard from '../../components/marketplace/NFTCard';
import { MarketplaceService } from '../../services/marketplaceService';
import { UserService } from '../../services/userService';
import type { Collection, NFT } from '../../types/marketplace';

const CollectionDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [filteredNFTs, setFilteredNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_low' | 'price_high' | 'popular'>('newest');
  const [isFollowing, setIsFollowing] = useState(false);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (id) {
      loadCollection();
    }
  }, [id]);

  useEffect(() => {
    if (collection) {
      applyFiltersAndSort();
    }
  }, [collection, sortBy]);

  const loadCollection = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const collectionData = await MarketplaceService.getCollectionById(id);
      if (collectionData) {
        setCollection(collectionData);
        setFilteredNFTs(collectionData.nfts);
        
        // Check if following creator
        const followStatus = await UserService.isFollowing('current-user', collectionData.creator.username);
        setIsFollowing(followStatus);
      }
    } catch (error) {
      console.error('Failed to load collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    if (!collection) return;

    let nfts = [...collection.nfts];

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        nfts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        nfts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price_low':
        nfts.sort((a, b) => parseFloat(a.price.amount) - parseFloat(b.price.amount));
        break;
      case 'price_high':
        nfts.sort((a, b) => parseFloat(b.price.amount) - parseFloat(a.price.amount));
        break;
      case 'popular':
        nfts.sort((a, b) => b.likes - a.likes);
        break;
    }

    setFilteredNFTs(nfts);
  };

  const handleFollowCreator = async () => {
    if (!collection) return;

    setFollowing(true);
    try {
      if (isFollowing) {
        await UserService.unfollowUser(collection.creator.username);
        setIsFollowing(false);
      } else {
        await UserService.followUser(collection.creator.username);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Failed to follow/unfollow creator:', error);
    } finally {
      setFollowing(false);
    }
  };

  const handleNFTClick = (nftId: string) => {
    navigate(`/marketplace/nft/${nftId}`);
  };

  const handleCreatorClick = () => {
    if (collection) {
      navigate(`/marketplace/profile/${collection.creator.username}`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: collection?.name,
        text: collection?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const renderLoadingSkeleton = () => (
    <div className="collection-detail-loading">
      <div className="collection-header-skeleton">
        <div className="skeleton-cover"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-stats"></div>
        </div>
      </div>
      <div className="collection-content-skeleton">
        {[...Array(8)].map((_, index) => (
          <div key={`collection-skeleton-nft-${index}`} className="skeleton-nft-card"></div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return renderLoadingSkeleton();
  }

  if (!collection) {
    return (
      <div className="collection-detail-error">
        <h2>{t('marketplace.collection.notFound', 'Collection Not Found')}</h2>
        <p>{t('marketplace.collection.notFoundDescription', 'The collection you are looking for does not exist or has been removed.')}</p>
        <button
          className="btn-wireframe btn-wireframe--primary"
          onClick={() => navigate('/marketplace')}
        >
          {t('marketplace.collection.backToMarketplace', 'Back to Marketplace')}
        </button>
      </div>
    );
  }

  return (
    <div className="collection-detail-page">
      {/* Back Button */}
      <div className="collection-detail__header">
        <button
          className="btn-wireframe btn-wireframe--secondary"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          {t('marketplace.collection.back', 'Back')}
        </button>
      </div>

      {/* Collection Header */}
      <div className="collection-detail__banner">
        <div className="collection-detail__cover">
          <img
            src={collection.coverImage}
            alt={collection.name}
            className="collection-detail__cover-image"
          />
        </div>

        <div className="collection-detail__info">
          <div className="collection-detail__main-info">
            <h1 className="collection-detail__name">{collection.name}</h1>
            <p className="collection-detail__description">{collection.description}</p>

            {/* Creator Info */}
            <button
              className="collection-detail__creator"
              onClick={handleCreatorClick}
              type="button"
            >
              <img
                src={collection.creator.avatar}
                alt={collection.creator.username}
                className="collection-detail__creator-avatar"
              />
              <div className="collection-detail__creator-info">
                <span className="collection-detail__creator-label">
                  {t('marketplace.collection.createdBy', 'Created by')}
                </span>
                <span className="collection-detail__creator-name">
                  @{collection.creator.username}
                  {collection.creator.verified && (
                    <CheckCircle size={16} className="verified-icon" />
                  )}
                </span>
              </div>
            </button>

            {/* Actions */}
            <div className="collection-detail__actions">
              <button
                className={`btn-wireframe ${isFollowing ? 'btn-wireframe--secondary' : 'btn-wireframe--primary'}`}
                onClick={handleFollowCreator}
                disabled={following}
              >
                {(() => {
                  if (following) {
                    return t('marketplace.collection.following', 'Following...');
                  }
                  if (isFollowing) {
                    return t('marketplace.collection.unfollow', 'Unfollow');
                  }
                  return t('marketplace.collection.follow', 'Follow Creator');
                })()}
              </button>
              
              <button
                className="btn-wireframe btn-wireframe--secondary"
                onClick={handleShare}
                aria-label="Share collection"
              >
                <Share2 size={16} />
                {t('marketplace.collection.share', 'Share')}
              </button>
            </div>
          </div>

          {/* Collection Stats */}
          <div className="collection-detail__stats">
            <div className="stat-card">
              <div className="stat-icon">
                <Package size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{collection.stats.totalItems.toLocaleString()}</span>
                <span className="stat-label">{t('marketplace.collection.items', 'Items')}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{collection.stats.owners.toLocaleString()}</span>
                <span className="stat-label">{t('marketplace.collection.owners', 'Owners')}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{collection.stats.floorPrice}</span>
                <span className="stat-label">{t('marketplace.collection.floorPrice', 'Floor Price')}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{collection.stats.totalVolume}</span>
                <span className="stat-label">{t('marketplace.collection.totalVolume', 'Total Volume')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Content */}
      <div className="collection-detail__content">
        {/* Content Header */}
        <div className="collection-detail__content-header">
          <h2 className="collection-detail__content-title">
            {t('marketplace.collection.items', 'Items')} ({filteredNFTs.length})
          </h2>

          <div className="collection-detail__controls">
            {/* Sort Dropdown */}
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="newest">{t('marketplace.collection.sortNewest', 'Newest')}</option>
              <option value="oldest">{t('marketplace.collection.sortOldest', 'Oldest')}</option>
              <option value="price_low">{t('marketplace.collection.sortPriceLow', 'Price: Low to High')}</option>
              <option value="price_high">{t('marketplace.collection.sortPriceHigh', 'Price: High to Low')}</option>
              <option value="popular">{t('marketplace.collection.sortPopular', 'Most Popular')}</option>
            </select>

            {/* View Mode Toggle */}
            <div className="view-mode-toggle">
              <button
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid size={20} />
              </button>
              <button
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* NFTs Grid */}
        <div className="collection-detail__nfts">
          {filteredNFTs.length > 0 ? (
            <div className={`nft-grid nft-grid--${viewMode}`}>
              {filteredNFTs.map((nft) => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  onNFTClick={handleNFTClick}
                  className={viewMode === 'list' ? 'nft-card--list' : ''}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Package size={64} className="empty-state__icon" />
              <h3 className="empty-state__title">
                {t('marketplace.collection.noItems', 'No Items Found')}
              </h3>
              <p className="empty-state__description">
                {t('marketplace.collection.noItemsDescription', 'This collection doesn\'t have any items yet.')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionDetailPage;
