import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Package,
  TrendingUp,
  DollarSign,
  Share2,
  UserPlus,
  UserMinus,
  CheckCircle
} from 'lucide-react';
import type { Collection } from '../../types/marketplace';

interface CollectionHeaderProps {
  collection: Collection;
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  onShare: () => void;
  loading?: boolean;
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  collection,
  isFollowing,
  onFollow,
  onUnfollow,
  onShare,
  loading = false
}) => {
  const { t } = useTranslation();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="collection-header wireframe-card">
      {/* Cover Image */}
      <div className="collection-header__cover">
        <img src={collection.coverImage} alt={collection.name} />
        <div className="collection-header__overlay"></div>
      </div>

      {/* Collection Info */}
      <div className="collection-header__content">
        <div className="collection-header__main">
          <div className="collection-header__info">
            <h1 className="collection-header__title">{collection.name}</h1>
            <p className="collection-header__description">{collection.description}</p>
            
            {/* Creator Info */}
            <div className="collection-header__creator">
              <div className="collection-header__creator-avatar">
                <img src={collection.creator.avatar} alt={collection.creator.username} />
                {collection.creator.verified && (
                  <CheckCircle size={16} className="collection-header__verified" />
                )}
              </div>
              <div className="collection-header__creator-info">
                <span className="collection-header__creator-label">{t('created_by')}</span>
                <span className="collection-header__creator-name">
                  @{collection.creator.username}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="collection-header__actions">
            <button
              onClick={isFollowing ? onUnfollow : onFollow}
              disabled={loading}
              className={`btn-wireframe ${isFollowing ? 'btn-wireframe--secondary' : 'btn-wireframe--primary'}`}
            >
              {isFollowing ? (
                <>
                  <UserMinus size={16} />
                  <span>{t('unfollow')}</span>
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  <span>{t('follow_creator')}</span>
                </>
              )}
            </button>
            
            <button
              onClick={onShare}
              className="btn-wireframe btn-wireframe--secondary"
            >
              <Share2 size={16} />
              <span>{t('share')}</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="collection-header__stats">
          <div className="collection-header__stat">
            <div className="collection-header__stat-icon">
              <Package size={20} />
            </div>
            <div className="collection-header__stat-content">
              <span className="collection-header__stat-value">
                {formatNumber(collection.stats.totalItems)}
              </span>
              <span className="collection-header__stat-label">
                {t('items')}
              </span>
            </div>
          </div>
          
          <div className="collection-header__stat">
            <div className="collection-header__stat-icon">
              <Users size={20} />
            </div>
            <div className="collection-header__stat-content">
              <span className="collection-header__stat-value">
                {formatNumber(collection.stats.owners)}
              </span>
              <span className="collection-header__stat-label">
                {t('owners')}
              </span>
            </div>
          </div>
          
          <div className="collection-header__stat">
            <div className="collection-header__stat-icon">
              <DollarSign size={20} />
            </div>
            <div className="collection-header__stat-content">
              <span className="collection-header__stat-value">
                {collection.stats.floorPrice} ICP
              </span>
              <span className="collection-header__stat-label">
                {t('floor_price')}
              </span>
            </div>
          </div>
          
          <div className="collection-header__stat">
            <div className="collection-header__stat-icon">
              <TrendingUp size={20} />
            </div>
            <div className="collection-header__stat-content">
              <span className="collection-header__stat-value">
                {collection.stats.totalVolume} ICP
              </span>
              <span className="collection-header__stat-label">
                {t('total_volume')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionHeader;
