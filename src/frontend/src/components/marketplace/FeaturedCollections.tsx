import React from "react";
import { useTranslation } from "react-i18next";
import { Check, TrendingUp, TrendingDown } from "lucide-react";

interface Collection {
  id: string;
  name: string;
  image: string;
  floorPrice: string;
  currency: string;
  change: number;
  verified: boolean;
}

interface FeaturedCollectionsProps {
  collections: Collection[];
  title: string;
  subtitle: string;
}

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({
  collections,
  title,
  subtitle,
}) => {
  const { t } = useTranslation("marketplace");

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    const icon = isPositive ? (
      <TrendingUp size={12} />
    ) : (
      <TrendingDown size={12} />
    );
    const color = isPositive ? "positive" : "negative";

    return (
      <span className={`change-indicator ${color}`}>
        {icon}
        {Math.abs(change)}%
      </span>
    );
  };

  return (
    <section className="featured-collections">
      <div className="featured-collections__header">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>

      <div className="featured-collections__grid">
        {collections.map((collection) => (
          <div key={collection.id} className="collection-card">
            <div className="collection-card__image">
              <img src={collection.image} alt={collection.name} />
            </div>

            <div className="collection-card__info">
              <h3 className="collection-name">
                {collection.name}
                {collection.verified && (
                  <Check className="verified-icon" size={14} />
                )}
              </h3>

              <div className="collection-price">
                <span className="price-label">{t("floorPrice")}:</span>
                <span className="price-value">
                  {collection.floorPrice} {collection.currency}
                </span>
                {formatChange(collection.change)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
