import React from "react";
import { RankingCollection } from "./Rankings";

interface RankingRowProps {
  collection: RankingCollection;
}

const RankingRow: React.FC<RankingRowProps> = ({ collection }) => {
  return (
    <tr className="ranking-row">
      <td className="ranking-row__rank">#{collection.rank}</td>
      <td className="ranking-row__collection">
        <div className="ranking-row__collection-container">
          <img
            src={collection.image}
            alt={collection.name}
            className="ranking-row__image"
          />
          <div className="ranking-row__info">
            <div className="ranking-row__name">{collection.name}</div>
            <div className="ranking-row__creator">{collection.creator}</div>
          </div>
        </div>
      </td>
      <td className="ranking-row__volume">{collection.volume.toFixed(2)} ETH</td>
      <td className="ranking-row__floor">{collection.floorPrice.toFixed(2)} ETH</td>
      <td className="ranking-row__owners">{collection.owners.toLocaleString()}</td>
      <td className="ranking-row__items">{collection.items.toLocaleString()}</td>
      <td className={`ranking-row__change ${
        collection.percentChange >= 0 
          ? "ranking-row__change--positive" 
          : "ranking-row__change--negative"
      }`}>
        {collection.percentChange >= 0 ? "+" : ""}
        {collection.percentChange.toFixed(2)}%
      </td>
    </tr>
  );
};

export default RankingRow;
