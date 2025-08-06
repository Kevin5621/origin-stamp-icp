// src/frontend/src/components/common/ArtworkCard.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Star, Clock, FileText, Eye } from "lucide-react";

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
      <div className="artwork-card-modern__header">
        <div className="artwork-badge">
          <span
            className={`status-indicator status-indicator--${artwork.status}`}
          ></span>
          <span className="artwork-type">{artwork.type}</span>
        </div>
        <div className="artwork-rating">
          <Star size={14} className="star-icon" />
          <span>{artwork.rating || 4.8}</span>
        </div>
      </div>

      <div className="artwork-card-modern__content">
        <h4 className="artwork-title">{artwork.name}</h4>
        <p className="artwork-description">
          {artwork.description ||
            t("artwork_description_placeholder") ||
            "Beautiful artwork created with precision"}
        </p>

        <div className="artwork-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${artwork.progress}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {artwork.progress}% {t("complete") || "complete"}
          </span>
        </div>
      </div>

      <div className="artwork-card-modern__footer">
        <div className="artwork-stats">
          <div className="stat-mini">
            <FileText size={12} />
            <span>{artwork.verificationEntries}</span>
          </div>
          <div className="stat-mini">
            <Clock size={12} />
            <span>{artwork.lastActivity.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="artwork-actions">
          <button className="btn-icon-mini">
            <Eye size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
