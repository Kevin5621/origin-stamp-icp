import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Globe,
  UserPlus,
  UserMinus,
  CheckCircle
} from 'lucide-react';
import type { User } from '../../types/marketplace';

interface UserProfileProps {
  user: User;
  isFollowing: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  isCurrentUser?: boolean;
  loading?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isFollowing,
  onFollow,
  onUnfollow,
  isCurrentUser = false,
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
    <div className="user-profile wireframe-card">
      {/* Cover/Header Section */}
      <div className="user-profile__header">
        <div className="user-profile__cover">
          <div className="user-profile__cover-pattern"></div>
        </div>
        
        {/* Avatar and Basic Info */}
        <div className="user-profile__info">
          <div className="user-profile__avatar-section">
            <div className="user-profile__avatar">
              <img src={user.avatar} alt={user.username} />
              {user.verified && (
                <div className="user-profile__verified-badge">
                  <CheckCircle size={20} />
                </div>
              )}
            </div>
            
            <div className="user-profile__main-info">
              <h1 className="user-profile__username">
                @{user.username}
                {user.verified && (
                  <CheckCircle size={24} className="user-profile__verified-icon" />
                )}
              </h1>
              {user.bio && (
                <p className="user-profile__bio">{user.bio}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="user-profile__actions">
            {!isCurrentUser && (
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
                    <span>{t('follow')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="user-profile__stats">
        <div className="user-profile__stat">
          <span className="user-profile__stat-value">
            {formatNumber(user.followers)}
          </span>
          <span className="user-profile__stat-label">
            {t('followers')}
          </span>
        </div>
        
        <div className="user-profile__stat">
          <span className="user-profile__stat-value">
            {formatNumber(user.following)}
          </span>
          <span className="user-profile__stat-label">
            {t('following')}
          </span>
        </div>
        
        <div className="user-profile__stat">
          <span className="user-profile__stat-value">
            {formatNumber(user.totalSales)}
          </span>
          <span className="user-profile__stat-label">
            {t('total_sales')}
          </span>
        </div>
        
        <div className="user-profile__stat">
          <span className="user-profile__stat-value">
            {user.totalVolume} ICP
          </span>
          <span className="user-profile__stat-label">
            {t('total_volume')}
          </span>
        </div>
      </div>

      {/* Social Links */}
      {user.socialLinks && (
        <div className="user-profile__social">
          <h3 className="user-profile__social-title">{t('social_links')}</h3>
          <div className="user-profile__social-links">
            {user.socialLinks.twitter && (
              <a
                href={user.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="user-profile__social-link"
              >
                <Globe size={20} />
                <span>Twitter</span>
              </a>
            )}
            {user.socialLinks.instagram && (
              <a
                href={user.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="user-profile__social-link"
              >
                <Globe size={20} />
                <span>Instagram</span>
              </a>
            )}
            {user.socialLinks.website && (
              <a
                href={user.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="user-profile__social-link"
              >
                <Globe size={20} />
                <span>Website</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
