import React from "react";
import { useTranslation } from "react-i18next";
import { Heart, User } from "lucide-react";

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
            <Heart
              size={16}
              fill="none"
              color="currentColor"
              style={{
                width: "16px",
                height: "16px",
              }}
            />
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
