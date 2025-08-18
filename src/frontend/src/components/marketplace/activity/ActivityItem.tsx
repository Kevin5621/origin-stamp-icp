import React, { JSX } from "react";

export interface ActivityItem {
  id: string;
  type: "listing" | "sale" | "bid" | "transfer" | "like";
  nft: {
    id: string;
    title: string;
    image: string;
  };
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  fromUser?: {
    id: string;
    name: string;
    avatar: string;
  };
  price?: number;
  currency?: string;
  timestamp: Date;
}

interface ActivityItemProps {
  activity: ActivityItem;
}

export const ActivityItemComponent: React.FC<ActivityItemProps> = ({ activity }) => {
  const { type, nft, user, fromUser, price, currency, timestamp } = activity;
  
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    // For older dates, return the full date
    return date.toLocaleDateString();
  };
  
  const getActivityTypeLabel = (type: string): string => {
    switch (type) {
      case "listing":
        return "Listed for Sale";
      case "sale":
        return "Sold";
      case "bid":
        return "Bid Placed";
      case "transfer":
        return "Transferred";
      case "like":
        return "Liked";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  const getActivityTypeIcon = (type: string): JSX.Element => {
    switch (type) {
      case "listing":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "sale":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case "bid":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21H21M3 10H21M3 7H21M4 18L8 14M8 14L12 18M8 14V3M16 3V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "transfer":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 8L21 12M21 12L17 16M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "like":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  return (
    <div className="activity-item">
      <div className="activity-item__nft-image">
        <img src={nft.image} alt={nft.title} />
      </div>
      
      <div className="activity-item__content">
        <div className="activity-item__nft-title">{nft.title}</div>
        
        <div className="activity-item__type">
          <span className="activity-item__type-icon">
            {getActivityTypeIcon(type)}
          </span>
          <span className="activity-item__type-label">
            {getActivityTypeLabel(type)}
          </span>
        </div>
      </div>
      
      <div className="activity-item__users">
        <div className="activity-item__user">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="activity-item__user-avatar" 
          />
          <span className="activity-item__user-name">{user.name}</span>
        </div>
        
        {fromUser && (
          <>
            <div className="activity-item__user-divider">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="activity-item__user">
              <img 
                src={fromUser.avatar} 
                alt={fromUser.name} 
                className="activity-item__user-avatar" 
              />
              <span className="activity-item__user-name">{fromUser.name}</span>
            </div>
          </>
        )}
      </div>
      
      {price !== undefined && currency && (
        <div className="activity-item__price">
          <span className="activity-item__price-value">{price}</span>
          <span className="activity-item__price-currency">{currency}</span>
        </div>
      )}
      
      <div className="activity-item__time">
        <span className="activity-item__time-value">{formatTimeAgo(timestamp)}</span>
      </div>
    </div>
  );
};

export default ActivityItemComponent;
