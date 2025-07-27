import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  image: string;
  floorPrice: string;
  currency: string;
  change: number;
  verified: boolean;
}

interface CollectionListProps {
  collections: Collection[];
  title: string;
}

export const CollectionList: React.FC<CollectionListProps> = ({
  collections,
  title
}) => {
  const { t } = useTranslation('marketplace');

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    const color = isPositive ? 'positive' : 'negative';
    
    return (
      <span className={`change-percentage ${color}`}>
        {isPositive ? '+' : ''}{change}%
      </span>
    );
  };

  return (
    <aside className="collection-list">
      <div className="collection-list__header">
        <h3 className="list-title">{title}</h3>
      </div>

      <div className="collection-list__content">
        <div className="list-header">
          <span className="header-collection">{t('collection')}</span>
          <span className="header-floor">{t('floor')}</span>
        </div>

        <div className="list-items">
          {collections.map((collection) => (
            <div key={collection.id} className="list-item">
              <div className="item-collection">
                <div className="collection-avatar">
                  <img src={collection.image} alt={collection.name} />
                </div>
                <div className="collection-info">
                  <span className="collection-name">
                    {collection.name}
                    {collection.verified && <Check className="verified-icon" size={12} />}
                  </span>
                </div>
              </div>
              
              <div className="item-floor">
                <span className="floor-price">
                  {collection.floorPrice} {collection.currency}
                </span>
                {formatChange(collection.change)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}; 