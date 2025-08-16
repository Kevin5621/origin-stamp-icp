// src/frontend/src/components/common/ArtworkCard.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Star, Clock, FileText, Eye, Image } from "lucide-react";

interface ArtworkCardProps {
  artwork: {
    id: string;
    name: string;
    type: string;
    status: string;
    progress: number;
    lastActivity: Date;
    verificationEntries: number;
    description?: string;
    rating?: number;
    thumbnail?: string;
  };
  onClick?: () => void;
  className?: string;
  variant?: "modern" | "classic";
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  onClick,
  className = "",
  variant = "modern",
}) => {
  const { t } = useTranslation("dashboard");

  if (variant === "classic") {
    return (
      <div className={`artwork-card ${className}`} onClick={onClick}>
        <div className="artwork-card__header">
          <div className="artwork-card__status">
            <span className={`status-badge status-badge--${artwork.status}`}>
              {artwork.status.replace("_", " ")}
            </span>
            <span className="artwork-card__type">{artwork.type}</span>
          </div>
        </div>
        <div className="artwork-card__content">
          <div className="artwork-card__title">{artwork.name}</div>
          <div className="artwork-card__metadata">
            <div className="artwork-card__info">
              <div>Type: {artwork.type}</div>
              <div>
                Last Activity: {artwork.lastActivity.toLocaleDateString()}
              </div>
              <div>Progress: {artwork.progress}%</div>
            </div>
            <div className="artwork-card__stats">
              {artwork.verificationEntries > 0 && (
                <div className="stat-item">
                  <FileText size={14} />
                  <span>{artwork.verificationEntries} entries</span>
                </div>
              )}
              {artwork.progress > 0 && (
                <div className="stat-item">
                  <Eye size={14} />
                  <span>{artwork.progress}% complete</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`artwork-card-modern ${className}`} onClick={onClick}>
      {/* Enhanced Image/Photo section */}
      <div className="artwork-card-modern__image">
        {artwork.thumbnail ? (
          <>
            <img src={artwork.thumbnail} alt={artwork.name} />
            <div className="image-overlay"></div>
          </>
        ) : (
          <div className="image-placeholder">
            <Image size={22} />
            <span>{t("no_image") || "No Image"}</span>
          </div>
        )}

        {/* Redesigned badge positioned on image */}
        <div className="artwork-badge-redesigned">
          <span className={`status-dot status-dot--${artwork.status}`}></span>
          <span className="artwork-type-text">{artwork.type}</span>
        </div>

        {/* Redesigned star rating positioned on image */}
        <div className="artwork-rating-redesigned">
          <Star size={16} className="star-icon-redesigned" />
          <span className="rating-value">{artwork.rating || 4.8}</span>
        </div>
      </div>

      <div className="artwork-card-modern__content">
        <div className="artwork-header">
          <h4 className="artwork-title">{artwork.name}</h4>
          <div className="artwork-photo-indicator">
            <Image size={16} />
            <span>{artwork.verificationEntries} proses</span>
          </div>
        </div>

        <p className="artwork-description">
          {artwork.description ||
            t("artwork_description_placeholder") ||
            "Beautiful artwork created with precision and care"}
        </p>

        <div className="artwork-meta-redesigned">
          <div className="meta-item-redesigned">
            <FileText size={14} />
            <span>{artwork.verificationEntries} entries</span>
          </div>
          <div className="meta-item-redesigned">
            <Clock size={14} />
            <span>{artwork.lastActivity.toLocaleDateString()}</span>
          </div>
          <div className="verification-status">
            <span className="status-text">Verified</span>
          </div>
        </div>
      </div>

      <div className="artwork-card-modern__footer">
        <div className="artwork-stats-redesigned">
          <div className="stat-item-redesigned">
            <Eye size={14} />
            <span>{Math.floor(Math.random() * 1000) + 100} views</span>
          </div>
        </div>

        <div className="artwork-actions-redesigned">
          <button className="btn-view-redesigned">
            <Eye size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
