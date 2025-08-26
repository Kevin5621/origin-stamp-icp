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
      value: 125000,
      change: 15.2,
      rank: 1,
      description: "Contemporary digital art specialist",
      followers: 12500,
    },
    {
      id: "2",
      name: "Abstract Master",
      value: 98500,
      change: 8.7,
      rank: 2,
      description: "Abstract and modern art creator",
      followers: 9800,
    },
    {
      id: "3",
      name: "Modern Creator",
      value: 87200,
      change: -2.1,
      rank: 3,
      description: "Innovative digital compositions",
      followers: 8100,
    },
    {
      id: "4",
      name: "Pixel Virtuoso",
      value: 76500,
      change: 12.8,
      rank: 4,
      description: "Pixel art and retro designs",
      followers: 7200,
    },
    {
      id: "5",
      name: "Color Symphony",
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
      value: 250000,
      change: 22.4,
      rank: 1,
      description: "Surreal digital landscapes",
      items: 150,
    },
    {
      id: "2",
      name: "Abstract Visions",
      value: 180000,
      change: 12.8,
      rank: 2,
      description: "Contemporary abstract art",
      items: 89,
    },
    {
      id: "3",
      name: "Future Art Series",
      value: 165000,
      change: 5.3,
      rank: 3,
      description: "Futuristic digital concepts",
      items: 72,
    },
    {
      id: "4",
      name: "Minimalist Masterpieces",
      value: 142000,
      change: -1.8,
      rank: 4,
      description: "Clean and simple designs",
      items: 56,
    },
    {
      id: "5",
      name: "Nature's Digital Echo",
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
      value: 45,
      change: 8,
      rank: 1,
      description: "Premium art curator",
    },
    {
      id: "2",
      name: "NFT Enthusiast",
      value: 32,
      change: 5,
      rank: 2,
      description: "Digital art investor",
    },
    {
      id: "3",
      name: "Digital Patron",
      value: 28,
      change: 3,
      rank: 3,
      description: "Supporting emerging artists",
    },
    {
      id: "4",
      name: "Modern Collector",
      value: 24,
      change: -2,
      rank: 4,
      description: "Contemporary art focus",
    },
    {
      id: "5",
      name: "Art Investment Pro",
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
    const iconProps = { size: 24 };

    switch (rank) {
      case 1:
        return <Crown {...iconProps} className="text-yellow-500" />;
      case 2:
        return <Medal {...iconProps} className="text-gray-400" />;
      case 3:
        return <Award {...iconProps} className="text-amber-600" />;
      default:
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              {rank}
            </span>
          </div>
        );
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
    const iconProps = { size: 20, className: "text-current" };

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="mb-4 h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="mb-8 h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="mb-4 h-6 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="flex items-center space-x-4">
                          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          <div className="flex-1">
                            <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                            <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-3">
                <div className="rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 p-2.5 shadow-lg">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl dark:text-white">
                    {t("rankings_title", "Marketplace Rankings")}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600 sm:text-base lg:text-lg dark:text-gray-300">
                    {t(
                      "rankings_subtitle",
                      "Top performers in the marketplace ecosystem",
                    )}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-center dark:border-gray-700 dark:bg-gray-800">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {filteredData.length}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">Listed</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-center dark:border-gray-700 dark:bg-gray-800">
                  <div className="font-semibold text-indigo-600 dark:text-indigo-400">
                    Live
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Rankings
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-col space-y-4 xl:flex-row xl:space-y-0 xl:space-x-6">
              {/* Category Tabs */}
              <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                {(
                  ["artists", "collections", "buyers"] as RankingCategory[]
                ).map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      activeCategory === category
                        ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    }`}
                  >
                    {getCategoryIcon(category)}
                    <span>{getCategoryTitle(category)}</span>
                  </button>
                ))}
              </div>

              {/* Time Frame */}
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <select
                  value={timeFrame}
                  onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="24h">
                    {t("timeframe_24h", "Last 24 Hours")}
                  </option>
                  <option value="7d">{t("timeframe_7d", "Last 7 Days")}</option>
                  <option value="30d">
                    {t("timeframe_30d", "Last 30 Days")}
                  </option>
                  <option value="all">{t("timeframe_all", "All Time")}</option>
                </select>
              </div>

              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    placeholder={t("search_rankings", "Search rankings...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rankings List */}
          {filteredData.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  {getCategoryIcon(activeCategory)}
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {getCategoryTitle(activeCategory)}
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({timeFrame})
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getRankIcon(item.rank)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            {activeCategory === "artists" && item.followers && (
                              <span>
                                {item.followers.toLocaleString()} followers
                              </span>
                            )}
                            {activeCategory === "collections" && item.items && (
                              <span>{item.items} items</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatValue(
                              item.value,
                              getValueType(activeCategory),
                            )}
                          </div>
                          <div
                            className={`flex items-center space-x-1 text-sm ${
                              item.change >= 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {item.change >= 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
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
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {t("rankings_empty_title", "No Rankings Found")}
              </h3>
              <p className="mx-auto max-w-md text-gray-600 dark:text-gray-300">
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
                  className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
                >
                  {t("clear_search", "Clear Search")}
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
