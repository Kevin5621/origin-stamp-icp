import React from "react";
import { useTranslation } from "react-i18next";
import ActivityFilter from "./activity/ActivityFilter";
import ActivityList from "./activity/ActivityList";
import { ActivityItem } from "./activity/ActivityItem";

interface ActivityProps {
  className?: string;
}

export const Activity: React.FC<ActivityProps> = ({ className = "" }) => {
  const { t } = useTranslation("marketplace");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedActivityTypes, setSelectedActivityTypes] = React.useState<string[]>([
    "all",
  ]);
  const [dateRange, setDateRange] = React.useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [activities, setActivities] = React.useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    // Simulate API call to fetch activities
    loadActivityData();
  }, [currentPage, selectedActivityTypes, dateRange, searchQuery]);

  const loadActivityData = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, these would be API calls to fetch data from backend
      // For now, we'll use dummy data
      const mockActivities: ActivityItem[] = [
        {
          id: "act-1",
          type: "listing",
          nft: {
            id: "nft-1",
            title: "Cosmic Perspective #03",
            image: "https://images.unsplash.com/photo-1541661538396-53ba2d051eed?q=80&w=100",
          },
          user: {
            id: "user-1",
            name: "ArtistOne",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100",
          },
          price: 0.85,
          currency: "ETH",
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        },
        {
          id: "act-2",
          type: "sale",
          nft: {
            id: "nft-2",
            title: "Abstract Emotions #12",
            image: "https://images.unsplash.com/photo-1573221566340-81bdde00e00b?q=80&w=100",
          },
          user: {
            id: "user-2",
            name: "CollectorX",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
          },
          fromUser: {
            id: "user-3",
            name: "GalleryB",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100",
          },
          price: 2.5,
          currency: "ETH",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        },
        {
          id: "act-3",
          type: "bid",
          nft: {
            id: "nft-3",
            title: "Digital Renaissance #07",
            image: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?q=80&w=100",
          },
          user: {
            id: "user-4",
            name: "CryptoWhale",
            avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=100",
          },
          price: 1.2,
          currency: "ETH",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        },
        {
          id: "act-4",
          type: "transfer",
          nft: {
            id: "nft-4",
            title: "Neon Dreams #15",
            image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=100",
          },
          user: {
            id: "user-5",
            name: "ArtFoundation",
            avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=100",
          },
          fromUser: {
            id: "user-6",
            name: "PrivateCollector",
            avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=100",
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
        {
          id: "act-5",
          type: "like",
          nft: {
            id: "nft-5",
            title: "Cyberpunk City #23",
            image: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=100",
          },
          user: {
            id: "user-7",
            name: "ArtEnthusiast",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100",
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30), // 30 hours ago
        },
        {
          id: "act-6",
          type: "listing",
          nft: {
            id: "nft-6",
            title: "Future Memories #09",
            image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=100",
          },
          user: {
            id: "user-8",
            name: "DigitalCreator",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100",
          },
          price: 3.2,
          currency: "ETH",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        },
        {
          id: "act-7",
          type: "sale",
          nft: {
            id: "nft-7",
            title: "Quantum Realities #31",
            image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=100",
          },
          user: {
            id: "user-9",
            name: "NFTTrader",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
          },
          fromUser: {
            id: "user-10",
            name: "ArtistTwo",
            avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=100",
          },
          price: 4.5,
          currency: "ETH",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
        }
      ];
      
      // Filter activities based on search query, selected types, and date range
      const filteredActivities = mockActivities.filter(activity => {
        // Filter by search query
        if (searchQuery && 
            !activity.nft.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !activity.user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !activity.id.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        // Filter by activity type
        if (selectedActivityTypes.includes('all')) {
          // Keep all activities if 'all' is selected
        } else if (!selectedActivityTypes.includes(activity.type)) {
          return false;
        }
        
        // Filter by date range
        if (dateRange.startDate && activity.timestamp < dateRange.startDate) {
          return false;
        }
        if (dateRange.endDate) {
          const endOfDay = new Date(dateRange.endDate);
          endOfDay.setHours(23, 59, 59, 999);
          if (activity.timestamp > endOfDay) {
            return false;
          }
        }
        
        return true;
      });

      setActivities(filteredActivities);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Failed to load activity data:", error);
      setIsLoading(false);
    }
  };

  const handleActivityTypeChange = (types: string[]) => {
    setSelectedActivityTypes(types);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: { startDate: Date | null; endDate: Date | null }) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={`activity ${className}`}>
      <header className="activity__header">
        <div className="activity__header-content">
          <h1 className="activity__title">{t("activity_title", "Activity")}</h1>
          <p className="activity__subtitle">
            {t("activity_subtitle", "Track recent marketplace actions and transactions.")}
          </p>
        </div>
        <div className="activity__search">
          <div className="activity__search-container">
            <svg 
              className="activity__search-icon" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            <input
              type="text"
              className="activity__search-input"
              placeholder={t("activity_search_placeholder", "Search by NFT, user or transaction ID")}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>
      </header>
      
      <ActivityFilter 
        selectedActivityTypes={selectedActivityTypes}
        onActivityTypeChange={handleActivityTypeChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />

      <ActivityList 
        activities={activities}
        isLoading={isLoading}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Activity;
