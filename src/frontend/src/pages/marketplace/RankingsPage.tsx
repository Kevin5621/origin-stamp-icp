import React from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "../../components/layout/AppLayout";
import { Trophy, TrendingUp, Star, Users } from "lucide-react";

interface RankingItem {
  id: string;
  name: string;
  avatar?: string;
  value: number;
  change: number;
  rank: number;
}

export const RankingsPage: React.FC = () => {
  const { t } = useTranslation("marketplace");

  // Mock data - nanti akan diganti dengan data dari backend
  const topArtists: RankingItem[] = [
    {
      id: "1",
      name: "Digital Artist Pro",
      value: 125000,
      change: 15.2,
      rank: 1,
    },
    {
      id: "2",
      name: "Abstract Master",
      value: 98500,
      change: 8.7,
      rank: 2,
    },
    {
      id: "3",
      name: "Modern Creator",
      value: 87200,
      change: -2.1,
      rank: 3,
    },
  ];

  const topCollections: RankingItem[] = [
    {
      id: "1",
      name: "Digital Dreams Collection",
      value: 250000,
      change: 22.4,
      rank: 1,
    },
    {
      id: "2",
      name: "Abstract Visions",
      value: 180000,
      change: 12.8,
      rank: 2,
    },
    {
      id: "3",
      name: "Future Art Series",
      value: 165000,
      change: 5.3,
      rank: 3,
    },
  ];

  const topBuyers: RankingItem[] = [
    {
      id: "1",
      name: "Art Collector 001",
      value: 45,
      change: 8,
      rank: 1,
    },
    {
      id: "2",
      name: "NFT Enthusiast",
      value: 32,
      change: 5,
      rank: 2,
    },
    {
      id: "3",
      name: "Digital Patron",
      value: 28,
      change: 3,
      rank: 3,
    },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="ranking-item__rank-icon text-yellow-500" />;
      case 2:
        return <Trophy className="ranking-item__rank-icon text-gray-400" />;
      case 3:
        return <Trophy className="ranking-item__rank-icon text-amber-600" />;
      default:
        return <span className="ranking-item__rank-number">#{rank}</span>;
    }
  };

  const formatValue = (value: number, type: "currency" | "count") => {
    if (type === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(value);
    }
    return value.toString();
  };

  const RankingCard = ({
    title,
    items,
    icon,
    valueType,
  }: {
    title: string;
    items: RankingItem[];
    icon: React.ReactNode;
    valueType: "currency" | "count";
  }) => (
    <div className="ranking-card">
      <div className="ranking-card__header">
        {icon}
        <h3 className="ranking-card__title">{title}</h3>
      </div>

      <div className="ranking-card__items">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="ranking-item">
              <div className="ranking-item__left">
                <div className="ranking-item__rank">
                  {getRankIcon(item.rank)}
                </div>
                <div className="ranking-item__info">
                  <p className="ranking-item__name">{item.name}</p>
                  <div className="ranking-item__details">
                    <span className="ranking-item__value">
                      {formatValue(item.value, valueType)}
                    </span>
                    <span
                      className={`ranking-item__change ${
                        item.change >= 0
                          ? "ranking-item__change--positive"
                          : "ranking-item__change--negative"
                      }`}
                    >
                      <TrendingUp
                        className={`icon ${
                          item.change < 0 ? "rotate-180" : ""
                        }`}
                      />
                      {Math.abs(item.change)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="ranking-card__empty">
            <p>{t("rankings_empty_description")}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AppLayout variant="marketplace">
      <div className="marketplace-rankings">
        <div className="marketplace-rankings__content">
          {/* Header */}
          <div className="marketplace-rankings__header">
            <h1 className="marketplace-rankings__title">
              {t("rankings_title")}
            </h1>
            <p className="marketplace-rankings__subtitle">
              {t("rankings_subtitle")}
            </p>
          </div>

          {/* Rankings Grid */}
          <div className="marketplace-rankings__grid">
            <RankingCard
              title={t("top_artists")}
              items={topArtists}
              icon={<Star className="ranking-card__icon text-purple-500" />}
              valueType="currency"
            />

            <RankingCard
              title={t("top_collections")}
              items={topCollections}
              icon={<TrendingUp className="ranking-card__icon text-blue-500" />}
              valueType="currency"
            />

            <RankingCard
              title={t("top_buyers")}
              items={topBuyers}
              icon={<Users className="ranking-card__icon text-green-500" />}
              valueType="count"
            />
          </div>

          {/* Empty State (ketika tidak ada data) */}
          {topArtists.length === 0 &&
            topCollections.length === 0 &&
            topBuyers.length === 0 && (
              <div className="marketplace-rankings__empty">
                <Trophy className="icon" />
                <h3>{t("rankings_empty_title")}</h3>
                <p>{t("rankings_empty_description")}</p>
              </div>
            )}
        </div>
      </div>
    </AppLayout>
  );
};

export default RankingsPage;
