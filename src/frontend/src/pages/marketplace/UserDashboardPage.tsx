import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  Settings,
  Plus,
  ArrowUpRight,
  BarChart3,
  Activity as ActivityIcon
} from 'lucide-react';
import { UserService } from '../../services/userService';
import DashboardStats from '../../components/marketplace/DashboardStats';
import ActivityFeed from '../../components/marketplace/ActivityFeed';
import type { NFT } from '../../types/marketplace';

interface DashboardStatsData {
  totalNFTs: number;
  totalCollections: number;
  totalSales: number;
  totalVolume: string;
  activeListings: number;
  totalViews: number;
  totalLikes: number;
  averagePrice: string;
}

interface Activity {
  id: string;
  type: 'nft_created' | 'nft_sold' | 'collection_created' | 'nft_liked' | 'follow_user' | 'listing_created' | 'listing_updated' | 'offer_received' | 'offer_accepted' | 'profile_updated';
  timestamp: string;
  nftTitle?: string;
  nftId?: string;
  nftImage?: string;
  price?: string;
  buyer?: string;
  seller?: string;
  collectionName?: string;
  collectionId?: string;
  username?: string;
  description?: string;
  liker?: string;
}

interface PortfolioData {
  date: string;
  value: string;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'mint' | 'transfer';
  nftTitle: string;
  nftId: string;
  amount: string;
  buyer?: string;
  seller?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

const UserDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [portfolioData, setPortfolioData] = useState<PortfolioData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeListings, setActiveListings] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'transactions' | 'listings' | 'settings'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const currentUsername = 'current-user'; // In real app, get from auth context
      
      const [
        dashboardStats,
        userActivity,
        userNFTs
      ] = await Promise.all([
        UserService.getUserDashboardStats(currentUsername),
        UserService.getUserActivity(currentUsername),
        UserService.getUserCreatedNFTs(currentUsername)
      ]);

      setStats(dashboardStats);
      setActivities(userActivity);
      setPortfolioData([
        { date: '2024-01-01', value: '100' },
        { date: '2024-01-02', value: '120' },
        { date: '2024-01-03', value: '110' }
      ]);
      setTransactions([]);
      setActiveListings(userNFTs.filter(nft => nft.status === 'for_sale'));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNFT = () => {
    navigate('/marketplace/create');
  };

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  const handleManageListings = () => {
    setActiveTab('listings');
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="user-dashboard__header">
          <div className="user-dashboard__header-content">
            <h1 className="user-dashboard__title">{t('creator_dashboard')}</h1>
            <p className="user-dashboard__subtitle">{t('manage_your_nft_portfolio')}</p>
          </div>
        </div>
        
        <div className="user-dashboard__content">
          <div className="user-dashboard__stats-loading">
            <DashboardStats 
              stats={{
                totalNFTs: 0,
                totalCollections: 0,
                totalSales: 0,
                totalVolume: '0',
                activeListings: 0,
                totalViews: 0,
                totalLikes: 0,
                averagePrice: '0'
              }}
              loading={true}
            />
          </div>
          
          <div className="user-dashboard__activity-loading">
            <ActivityFeed 
              activities={[]}
              loading={true}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* Header */}
      <div className="user-dashboard__header">
        <div className="user-dashboard__header-content">
          <h1 className="user-dashboard__title">{t('creator_dashboard')}</h1>
          <p className="user-dashboard__subtitle">{t('manage_your_nft_portfolio')}</p>
        </div>
        
        <div className="user-dashboard__header-actions">
          <button
            onClick={handleCreateNFT}
            className="btn-wireframe btn-wireframe--primary"
          >
            <Plus size={20} />
            <span>{t('create_nft')}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className="btn-wireframe btn-wireframe--secondary"
          >
            <Settings size={20} />
            <span>{t('settings')}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="user-dashboard__tabs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`user-dashboard__tab ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <BarChart3 size={20} />
          <span>{t('overview')}</span>
        </button>
        
        <button
          onClick={() => setActiveTab('activity')}
          className={`user-dashboard__tab ${activeTab === 'activity' ? 'active' : ''}`}
        >
          <ActivityIcon size={20} />
          <span>{t('activity')}</span>
        </button>
        
        <button
          onClick={() => setActiveTab('transactions')}
          className={`user-dashboard__tab ${activeTab === 'transactions' ? 'active' : ''}`}
        >
          <TrendingUp size={20} />
          <span>{t('transactions')}</span>
        </button>
        
        <button
          onClick={() => setActiveTab('listings')}
          className={`user-dashboard__tab ${activeTab === 'listings' ? 'active' : ''}`}
        >
          <Plus size={20} />
          <span>{t('active_listings')}</span>
        </button>
      </div>

      {/* Content */}
      <div className="user-dashboard__content">
        {activeTab === 'overview' && (
          <div className="user-dashboard__overview">
            {/* Stats Component */}
            {stats && (
              <DashboardStats 
                stats={stats}
                loading={false}
              />
            )}
            
            {/* Quick Actions */}
            <div className="user-dashboard__quick-actions wireframe-card">
              <h3 className="user-dashboard__section-title">{t('quick_actions')}</h3>
              <div className="user-dashboard__actions-grid">
                <button
                  onClick={handleCreateNFT}
                  className="user-dashboard__action-card"
                >
                  <Plus size={32} />
                  <span>{t('create_new_nft')}</span>
                </button>
                
                <button
                  onClick={handleViewAnalytics}
                  className="user-dashboard__action-card"
                >
                  <BarChart3 size={32} />
                  <span>{t('view_analytics')}</span>
                </button>
                
                <button
                  onClick={handleManageListings}
                  className="user-dashboard__action-card"
                >
                  <TrendingUp size={32} />
                  <span>{t('manage_listings')}</span>
                </button>
              </div>
            </div>
            
            {/* Portfolio Value Chart */}
            <div className="user-dashboard__portfolio wireframe-card">
              <div className="user-dashboard__portfolio-header">
                <h3 className="user-dashboard__section-title">{t('portfolio_value')}</h3>
                <div className="user-dashboard__portfolio-value">
                  <span className="user-dashboard__current-value">
                    {portfolioData.length > 0 ? portfolioData[portfolioData.length - 1].value : '0'} ICP
                  </span>
                  <div className="user-dashboard__value-change">
                    <ArrowUpRight size={16} />
                    <span>+12.5%</span>
                  </div>
                </div>
              </div>
              
              <div className="user-dashboard__chart-placeholder">
                <p>{t('portfolio_chart_placeholder')}</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'activity' && (
          <div className="user-dashboard__activity">
            <ActivityFeed 
              activities={activities}
              loading={false}
              hasMore={false}
            />
          </div>
        )}
        
        {activeTab === 'transactions' && (
          <div className="user-dashboard__transactions wireframe-card">
            <h3 className="user-dashboard__section-title">{t('transaction_history')}</h3>
            
            {transactions.length === 0 ? (
              <div className="user-dashboard__empty">
                <TrendingUp size={48} />
                <h4>{t('no_transactions_yet')}</h4>
                <p>{t('transactions_will_appear_here')}</p>
              </div>
            ) : (
              <div className="user-dashboard__transactions-list">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="user-dashboard__transaction">
                    <div className="user-dashboard__transaction-info">
                      <h4>{transaction.nftTitle}</h4>
                      <p>{transaction.type} • {transaction.amount}</p>
                    </div>
                    <div className="user-dashboard__transaction-status">
                      <span className={`status status--${transaction.status}`}>
                        {t(transaction.status)}
                      </span>
                      <span className="user-dashboard__transaction-date">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'listings' && (
          <div className="user-dashboard__listings wireframe-card">
            <h3 className="user-dashboard__section-title">{t('active_listings')}</h3>
            
            {activeListings.length === 0 ? (
              <div className="user-dashboard__empty">
                <Plus size={48} />
                <h4>{t('no_active_listings')}</h4>
                <p>{t('create_nft_to_start_selling')}</p>
                <button
                  onClick={handleCreateNFT}
                  className="btn-wireframe btn-wireframe--primary"
                >
                  <Plus size={20} />
                  <span>{t('create_first_nft')}</span>
                </button>
              </div>
            ) : (
              <div className="user-dashboard__listings-grid">
                {activeListings.map((nft) => (
                  <div key={nft.id} className="user-dashboard__listing-card">
                    <img src={nft.imageUrl} alt={nft.title} />
                    <div className="user-dashboard__listing-info">
                      <h4>{nft.title}</h4>
                      <p>{nft.price.amount} {nft.price.currency}</p>
                    </div>
                    <div className="user-dashboard__listing-actions">
                      <button className="btn-wireframe btn-wireframe--small">
                        {t('edit')}
                      </button>
                      <button className="btn-wireframe btn-wireframe--small btn-wireframe--secondary">
                        {t('remove')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="user-dashboard__settings wireframe-card">
            <h3 className="user-dashboard__section-title">{t('dashboard_settings')}</h3>
            <p>{t('settings_coming_soon')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
