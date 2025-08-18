import React from "react";
import { useTranslation } from "react-i18next";
import ActivityItemComponent, { ActivityItem } from "./ActivityItem";

interface ActivityListProps {
  activities: ActivityItem[];
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  isLoading,
  currentPage,
  itemsPerPage,
  onPageChange,
}) => {
  const { t } = useTranslation("marketplace");
  
  // Calculate pagination details
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = activities.slice(startIndex, endIndex);
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust when near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(4, totalPages - 1);
      }
      
      // Adjust when near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("ellipsis-start");
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end");
      }
      
      // Always include last page
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  return (
    <div className="activity-list">
      {isLoading ? (
        <div className="activity-list__loading">
          <div className="activity-list__loading-spinner"></div>
          <p>{t("activity_loading", "Loading activities...")}</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="activity-list__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>{t("activity_no_results", "No activities found")}</p>
          <p className="activity-list__empty-subtitle">
            {t("activity_try_different_filters", "Try different filters or check back later")}
          </p>
        </div>
      ) : (
        <>
          <div className="activity-list__header">
            <div className="activity-list__header-item activity-list__header-nft">
              {t("activity_header_nft", "NFT")}
            </div>
            <div className="activity-list__header-item activity-list__header-type">
              {t("activity_header_type", "Activity")}
            </div>
            <div className="activity-list__header-item activity-list__header-users">
              {t("activity_header_users", "User(s)")}
            </div>
            <div className="activity-list__header-item activity-list__header-price">
              {t("activity_header_price", "Price")}
            </div>
            <div className="activity-list__header-item activity-list__header-time">
              {t("activity_header_time", "Time")}
            </div>
          </div>

          <div className="activity-list__items">
            {currentActivities.map((activity) => (
              <ActivityItemComponent key={activity.id} activity={activity} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="activity-list__pagination">
              <button
                className="activity-list__pagination-btn activity-list__pagination-prev"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className="activity-list__pagination-pages">
                {getPageNumbers().map((page, index) => (
                  page === "ellipsis-start" || page === "ellipsis-end" ? (
                    <span key={`ellipsis-${index}`} className="activity-list__pagination-ellipsis">...</span>
                  ) : (
                    <button
                      key={`page-${page}`}
                      className={`activity-list__pagination-page ${
                        page === currentPage ? "activity-list__pagination-page--active" : ""
                      }`}
                      onClick={() => onPageChange(page as number)}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              <button
                className="activity-list__pagination-btn activity-list__pagination-next"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActivityList;
