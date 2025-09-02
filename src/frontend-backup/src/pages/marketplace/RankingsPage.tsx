import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "../../components/layout/AppLayout";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Star,
  Users,
  Award,
  Crown,
  Medal,
  Search,
  Calendar,
  BarChart3,
} from "lucide-react";

interface RankingItem {
  id: string;
  name: string;
  avatar?: string;
  value: number;
  change: number;
  rank: number;
  description?: string;
  items?: number; // for collections - number of items
  followers?: number; // for artists - number of followers
}

type TimeFrame = "24h" | "7d" | "30d" | "all";
type RankingCategory = "artists" | "collections" | "buyers";

export const RankingsPage: React.FC = () => {
  const { t } = useTranslation("marketplace");
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("7d");
  const [activeCategory, setActiveCategory] =
    useState<RankingCategory>("artists");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [timeFrame, activeCategory]);

  // Mock data - will be replaced with backend data
  const topArtists: RankingItem[] = [
    {
      id: "1",
      name: "Digital Artist Pro",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      value: 125000,
      change: 15.2,
      rank: 1,
      description: "Contemporary digital art specialist",
      followers: 12500,
    },
    {
      id: "2",
      name: "Abstract Master",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      value: 98500,
      change: 8.7,
      rank: 2,
      description: "Abstract and modern art creator",
      followers: 9800,
    },
    {
      id: "3",
      name: "Modern Creator",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      value: 87200,
      change: -2.1,
      rank: 3,
      description: "Innovative digital compositions",
      followers: 8100,
    },
    {
      id: "4",
      name: "Pixel Virtuoso",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      value: 76500,
      change: 12.8,
      rank: 4,
      description: "Pixel art and retro designs",
      followers: 7200,
    },
    {
      id: "5",
      name: "Color Symphony",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      value: 65300,
      change: 5.4,
      rank: 5,
      description: "Vibrant color compositions",
      followers: 6800,
    },
  ];

  const topCollections: RankingItem[] = [
    {
      id: "1",
      name: "Digital Dreams Collection",
      avatar:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=150&h=150&fit=crop",
      value: 250000,
      change: 22.4,
      rank: 1,
      description: "Surreal digital landscapes",
      items: 150,
    },
    {
      id: "2",
      name: "Abstract Visions",
      avatar:
        "https://images.unsplash.com/photo-1549887534-1541e9326642?w=150&h=150&fit=crop",
      value: 180000,
      change: 12.8,
      rank: 2,
      description: "Contemporary abstract art",
      items: 89,
    },
    {
      id: "3",
      name: "Future Art Series",
      avatar:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop",
      value: 165000,
      change: 5.3,
      rank: 3,
      description: "Futuristic digital concepts",
      items: 72,
    },
    {
      id: "4",
      name: "Minimalist Masterpieces",
      avatar:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop",
      value: 142000,
      change: -1.8,
      rank: 4,
      description: "Clean and simple designs",
      items: 56,
    },
    {
      id: "5",
      name: "Nature's Digital Echo",
      avatar:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop",
      value: 128000,
      change: 18.9,
      rank: 5,
      description: "Nature-inspired digital art",
      items: 94,
    },
  ];

  const topBuyers: RankingItem[] = [
    {
      id: "1",
      name: "Art Collector 001",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      value: 45,
      change: 8,
      rank: 1,
      description: "Premium art curator",
    },
    {
      id: "2",
      name: "NFT Enthusiast",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      value: 32,
      change: 5,
      rank: 2,
      description: "Digital art investor",
    },
    {
      id: "3",
      name: "Digital Patron",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      value: 28,
      change: 3,
      rank: 3,
      description: "Supporting emerging artists",
    },
    {
      id: "4",
      name: "Modern Collector",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      value: 24,
      change: -2,
      rank: 4,
      description: "Contemporary art focus",
    },
    {
      id: "5",
      name: "Art Investment Pro",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      value: 21,
      change: 12,
      rank: 5,
      description: "Strategic art investments",
    },
  ];

  const getCurrentData = (): RankingItem[] => {
    switch (activeCategory) {
      case "artists":
        return topArtists;
      case "collections":
        return topCollections;
      case "buyers":
        return topBuyers;
      default:
        return topArtists;
    }
  };

  const filteredData = getCurrentData().filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const getRankIcon = (rank: number) => {
    const iconProps = { size: 20 };

    switch (rank) {
      case 1:
        return <Crown {...iconProps} />;
      case 2:
        return <Medal {...iconProps} />;
      case 3:
        return <Award {...iconProps} />;
      default:
        return null;
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

  const getCategoryIcon = (category: RankingCategory) => {
    const iconProps = { size: 18, className: "text-current" };

    switch (category) {
      case "artists":
        return <Star {...iconProps} />;
      case "collections":
        return <TrendingUp {...iconProps} />;
      case "buyers":
        return <Users {...iconProps} />;
    }
  };

  const getCategoryTitle = (category: RankingCategory) => {
    switch (category) {
      case "artists":
        return t("top_artists", "Top Artists");
      case "collections":
        return t("top_collections", "Top Collections");
      case "buyers":
        return t("top_buyers", "Top Buyers");
    }
  };

  const getValueType = (category: RankingCategory): "currency" | "count" => {
    return category === "buyers" ? "count" : "currency";
  };

  if (loading) {
    return (
      <AppLayout variant="marketplace">
        <div className="rankings-page">
          <div className="rankings-page__container">
            <div className="rankings-page__loading">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-subtitle"></div>

              <div className="rankings-page__loading-filters">
                <div className="skeleton skeleton-search"></div>
                <div className="skeleton skeleton-timeframe"></div>
              </div>

              <div className="rankings-page__loading-list">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="skeleton skeleton-item"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout variant="marketplace">
      <div className="rankings-page">
        <div className="rankings-page__container">
          {/* Header */}
          <div className="rankings-page__header">
            <div className="rankings-page__title-section">
              <div className="rankings-page__title-icon">
                <Trophy />
              </div>
              <div className="rankings-page__title-content">
                <h1>{t("rankings_title")}</h1>
                <p>{t("rankings_subtitle")}</p>
              </div>
              <div className="rankings-page__controls">
                {/* Category Tabs */}
                <div className="rankings-page__category-tabs">
                  {(
                    ["artists", "collections", "buyers"] as RankingCategory[]
                  ).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`rankings-page__category-tab ${
                        activeCategory === category
                          ? "rankings-page__category-tab--active"
                          : ""
                      }`}
                    >
                      {getCategoryIcon(category)}
                      <span>{getCategoryTitle(category)}</span>
                    </button>
                  ))}
                </div>

                {/* Time Frame Filter */}
                <div className="rankings-page__timeframe-selector">
                  <Calendar size={16} />
                  <select
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
                  >
                    <option value="24h">{t("timeframe_24h")}</option>
                    <option value="7d">{t("timeframe_7d")}</option>
                    <option value="30d">{t("timeframe_30d")}</option>
                    <option value="all">{t("timeframe_all")}</option>
                  </select>
                </div>

                {/* Search */}
                <div className="rankings-page__search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder={t("search_rankings")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rankings List */}
          {filteredData.length > 0 ? (
            <div className="rankings-page__rankings-list">
              <div className="rankings-page__list-header">
                {getCategoryIcon(activeCategory)}
                <h2>{getCategoryTitle(activeCategory)}</h2>
                <span>({timeFrame})</span>
              </div>

              <div className="rankings-page__list-content">
                {filteredData.map((item) => (
                  <div key={item.id} className="rankings-page__ranking-item">
                    <div className="rankings-page__ranking-content">
                      <div className="rankings-page__ranking-left">
                        <div
                          className={`rankings-page__rank-badge ${
                            item.rank === 1
                              ? "rankings-page__rank-badge--gold"
                              : item.rank === 2
                                ? "rankings-page__rank-badge--silver"
                                : item.rank === 3
                                  ? "rankings-page__rank-badge--bronze"
                                  : "rankings-page__rank-badge--default"
                          }`}
                        >
                          {item.rank <= 3 ? getRankIcon(item.rank) : item.rank}
                        </div>

                        {/* Avatar with object-fit: contain */}
                        <div className="rankings-page__avatar">
                          {item.avatar ? (
                            <img src={item.avatar} alt={item.name} />
                          ) : (
                            <div className="rankings-page__avatar--fallback">
                              {item.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="rankings-page__item-info">
                          <h3>{item.name}</h3>
                          {item.description && <p>{item.description}</p>}
                          <div className="rankings-page__item-meta">
                            {activeCategory === "artists" && item.followers && (
                              <span>
                                <Users size={12} />
                                {t("rankings.followers_count", {
                                  count: item.followers,
                                })}
                              </span>
                            )}
                            {activeCategory === "collections" && item.items && (
                              <span>
                                <Star size={12} />
                                {t("rankings.items_count", {
                                  count: item.items,
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="rankings-page__ranking-right">
                        <div className="rankings-page__ranking-value">
                          <div className="rankings-page__ranking-amount">
                            {formatValue(
                              item.value,
                              getValueType(activeCategory),
                            )}
                          </div>
                          <div
                            className={`rankings-page__ranking-change ${
                              item.change >= 0
                                ? "rankings-page__ranking-change--positive"
                                : "rankings-page__ranking-change--negative"
                            }`}
                          >
                            {item.change >= 0 ? (
                              <TrendingUp size={12} />
                            ) : (
                              <TrendingDown size={12} />
                            )}
                            <span>{Math.abs(item.change)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rankings-page__empty">
              <div className="rankings-page__empty-icon">
                <BarChart3 />
              </div>
              <h3 className="rankings-page__empty-title">
                {t("rankings_empty_title")}
              </h3>
              <p className="rankings-page__empty-description">
                {searchTerm
                  ? t(
                      "rankings_no_results",
                      "No rankings match your search. Try adjusting your search term.",
                    )
                  : t(
                      "rankings_empty_description",
                      "Rankings will appear here once marketplace activity begins.",
                    )}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="rankings-page__clear-search"
                >
                  {t("clear_search")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default RankingsPage;
