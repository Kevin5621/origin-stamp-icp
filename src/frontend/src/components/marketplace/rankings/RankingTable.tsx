import React from "react";
import { useTranslation } from "react-i18next";
import { RankingCollection, SortOption, SortDirection } from "./Rankings";
import RankingRow from "./RankingRow";

interface RankingTableProps {
  collections: RankingCollection[];
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortChange: (option: SortOption) => void;
}

const RankingTable: React.FC<RankingTableProps> = ({
  collections,
  sortBy,
  sortDirection,
  onSortChange,
}) => {
  const { t } = useTranslation("marketplace");

  const renderSortArrow = (column: SortOption) => {
    if (sortBy !== column) return null;

    return (
      <span className="ranking-table__sort-arrow">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <div className="ranking-table-container">
      <table className="ranking-table">
        <thead>
          <tr>
            <th>{t("rankings.table.rank", "#")}</th>
            <th>{t("rankings.table.collection", "Collection")}</th>
            <th
              className="ranking-table__sortable"
              onClick={() => onSortChange("volume")}
            >
              {t("rankings.table.volume", "Volume (ETH)")}
              {renderSortArrow("volume")}
            </th>
            <th
              className="ranking-table__sortable"
              onClick={() => onSortChange("floorPrice")}
            >
              {t("rankings.table.floor_price", "Floor Price (ETH)")}
              {renderSortArrow("floorPrice")}
            </th>
            <th
              className="ranking-table__sortable"
              onClick={() => onSortChange("owners")}
            >
              {t("rankings.table.owners", "Owners")}
              {renderSortArrow("owners")}
            </th>
            <th
              className="ranking-table__sortable"
              onClick={() => onSortChange("items")}
            >
              {t("rankings.table.items", "Items")}
              {renderSortArrow("items")}
            </th>
            <th
              className="ranking-table__sortable"
              onClick={() => onSortChange("percentChange")}
            >
              {t("rankings.table.percent_change", "% Change")}
              {renderSortArrow("percentChange")}
            </th>
          </tr>
        </thead>
        <tbody>
          {collections.length > 0 ? (
            collections.map((collection) => (
              <RankingRow key={collection.id} collection={collection} />
            ))
          ) : (
            <tr>
              <td colSpan={7} className="ranking-table__empty">
                {t("rankings.no_results", "No collections found")}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Mobile view cards */}
      <div className="ranking-cards">
        {collections.length > 0 ? (
          collections.map((collection) => (
            <div key={collection.id} className="ranking-card">
              <div className="ranking-card__rank">#{collection.rank}</div>
              <div className="ranking-card__main">
                <div className="ranking-card__collection">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="ranking-card__image"
                  />
                  <div className="ranking-card__info">
                    <div className="ranking-card__name">{collection.name}</div>
                    <div className="ranking-card__creator">
                      {collection.creator}
                    </div>
                  </div>
                </div>
                <div className="ranking-card__stats">
                  <div className="ranking-card__stat">
                    <span className="ranking-card__label">
                      {t("rankings.table.volume", "Volume")}
                    </span>
                    <span className="ranking-card__value">
                      {collection.volume.toFixed(2)} ETH
                    </span>
                  </div>
                  <div className="ranking-card__stat">
                    <span className="ranking-card__label">
                      {t("rankings.table.floor_price", "Floor")}
                    </span>
                    <span className="ranking-card__value">
                      {collection.floorPrice.toFixed(2)} ETH
                    </span>
                  </div>
                  <div className="ranking-card__stat">
                    <span className="ranking-card__label">
                      {t("rankings.table.percent_change", "Change")}
                    </span>
                    <span
                      className={`ranking-card__change ${
                        collection.percentChange >= 0
                          ? "ranking-card__change--positive"
                          : "ranking-card__change--negative"
                      }`}
                    >
                      {collection.percentChange >= 0 ? "+" : ""}
                      {collection.percentChange.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="ranking-cards__empty">
            {t("rankings.no_results", "No collections found")}
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingTable;
