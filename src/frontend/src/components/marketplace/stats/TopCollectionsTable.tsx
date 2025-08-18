import React from "react";
import { useTranslation } from "react-i18next";
import { CollectionStat } from "./types";

interface TopCollectionsTableProps {
  collections: CollectionStat[];
  className?: string;
}

export const TopCollectionsTable: React.FC<TopCollectionsTableProps> = ({
  collections,
  className = "",
}) => {
  const { t } = useTranslation("marketplace");

  return (
    <div className={`stats-table ${className}`}>
      <h3 className="stats-table__title">{t("stats.top_collections")}</h3>
      <div className="stats-table__container">
        <table className="stats-table__table">
          <thead>
            <tr>
              <th className="stats-table__header">{t("rankings.table.rank")}</th>
              <th className="stats-table__header">{t("rankings.table.collection")}</th>
              <th className="stats-table__header">{t("rankings.table.volume")}</th>
              <th className="stats-table__header">{t("rankings.table.floor_price")}</th>
              <th className="stats-table__header">{t("rankings.table.owners")}</th>
              <th className="stats-table__header">{t("rankings.table.items")}</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr key={collection.id} className="stats-table__row">
                <td className="stats-table__cell stats-table__rank">
                  {collection.rank <= 3 ? (
                    <div className={`stats-table__rank-badge stats-table__rank-badge--${collection.rank}`}>
                      #{collection.rank}
                    </div>
                  ) : (
                    collection.rank
                  )}
                </td>
                <td className="stats-table__cell stats-table__collection">
                  <div className="stats-table__collection-info">
                    <img
                      src={collection.thumbnail}
                      alt={collection.name}
                      className="stats-table__collection-image"
                    />
                    <span className="stats-table__collection-name">{collection.name}</span>
                  </div>
                </td>
                <td className="stats-table__cell stats-table__volume">
                  <div className="stats-table__volume-container">
                    <span>{collection.volume.toFixed(2)} ETH</span>
                    <span
                      className={`stats-table__change ${
                        collection.change >= 0
                          ? "stats-table__change--positive"
                          : "stats-table__change--negative"
                      }`}
                    >
                      {collection.change >= 0 ? "+" : ""}
                      {collection.change}%
                    </span>
                  </div>
                </td>
                <td className="stats-table__cell">{collection.floorPrice.toFixed(2)} ETH</td>
                <td className="stats-table__cell">{collection.owners.toLocaleString()}</td>
                <td className="stats-table__cell">{collection.items.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopCollectionsTable;
