import React from "react";
import { useTranslation } from "react-i18next";

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
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onClick,
  className = "",
}) => {
  const { t } = useTranslation("marketplace");

  const handleClick = () => {
    onClick?.(collection);
  };

  return (
    <div className={`collection-card ${className}`} onClick={handleClick}>
      <div className="collection-card__image">
        <img src={collection.image} alt={collection.title} />
        <div className="collection-card__overlay">
          <button className="collection-card__like-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {collection.likes}
          </button>
        </div>
      </div>
      <div className="collection-card__content">
        <h3 className="collection-card__title">{collection.title}</h3>
        <p className="collection-card__artist">{collection.artist}</p>
        <p className="collection-card__description">{collection.description}</p>
        <div className="collection-card__footer">
          <span className="collection-card__category">
            {collection.category}
          </span>
          <span className="collection-card__price">
            {t("price_format", { price: collection.price })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
