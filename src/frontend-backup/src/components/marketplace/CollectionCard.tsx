import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";

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

interface CollectionCardProps {
  collection: Collection;
  onClick?: (collection: Collection) => void;
  className?: string;
  "aria-label"?: string;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onClick,
  className = "",
  "aria-label": ariaLabel,
}) => {
  const { t } = useTranslation("marketplace");
  const [imageLoading, setImageLoading] = useState(true);

  const handleClick = () => {
    onClick?.(collection);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoading(false);
    const target = e.target as HTMLImageElement;
    target.src = `https://via.placeholder.com/300x400/4A5568/ffffff?text=${encodeURIComponent(collection.title)}`;
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div
      className={`collection-card ${className}`}
      onClick={handleClick}
      role="gridcell"
      tabIndex={0}
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div
        className={`collection-card__image ${imageLoading ? "loading" : ""}`}
      >
        <img
          src={collection.image}
          alt={collection.title}
          loading="lazy"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{
            opacity: imageLoading ? 0 : 1,
            transition: "opacity 0.3s ease",
          }}
        />
        <div className="collection-card__overlay">
          <button
            className="collection-card__like-btn"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement like functionality
            }}
            aria-label={t("collection_card.like_collection", {
              title: collection.title,
            })}
            title={t("collection_card.like_collection", {
              title: collection.title,
            })}
          >
            <Heart
              size={16}
              fill="none"
              color="currentColor"
              style={{
                width: "16px",
                height: "16px",
              }}
            />
            <span>{collection.likes}</span>
          </button>
        </div>
      </div>
      <div className="collection-card__content">
        <h3 className="collection-card__title">{collection.title}</h3>
        <p className="collection-card__artist">{collection.artist}</p>
        <p className="collection-card__description">{collection.description}</p>
        <div className="collection-card__footer">
          <span className="collection-card__category">
            {collection.category === "physical-art"
              ? t("collection_card.physical_art")
              : collection.category}
          </span>
          <span className="collection-card__price">
            {collection.price > 0
              ? t("price_format", { price: collection.price })
              : t("collection_card.free")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
