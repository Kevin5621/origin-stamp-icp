// src/frontend/src/components/dashboard/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  BarChart3,
  Upload,
  Eye,
  TrendingUp,
  CheckCircle,
  Activity,
  Shield,
  Award,
  Camera,
  FileText,
} from "lucide-react";
import {
  type OriginStampStats,
  type ArtworkOverview,
  type RecentActivity,
  OriginStampDashboardService,
} from "../../services/dashboardService";

interface DashboardProps {
  isLoading?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isLoading = false }) => {
  const navigate = useNavigate();

  // State management
  const [stats, setStats] = useState<OriginStampStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [artworks, setArtworks] = useState<ArtworkOverview[]>([]);
  const [loading, setLoading] = useState(true);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, activityData, artworksData] = await Promise.all([
          OriginStampDashboardService.getDashboardStats(),
          OriginStampDashboardService.getRecentActivity(),
          OriginStampDashboardService.getArtworkOverviews(),
        ]);

        setStats(statsData);
        setRecentActivity(activityData);
        setArtworks(artworksData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Icon mapping for activity types
  const iconMap = {
    artwork_verified: CheckCircle,
    certificate_issued: Award,
    session_started: Camera,
    process_logged: FileText,
    nft_minted: Shield,
  };

  // Quick actions for OriginStamp
  const quickActions = [
    {
      id: "upload-artwork",
      icon: Upload,
      title: "Upload Artwork",
      description: "Start artwork verification process",
      onClick: () => navigate("/upload"),
    },
    {
      id: "start-session",
      icon: Camera,
      title: "Start Session",
      description: "Begin physical art session",
      onClick: () => navigate("/sessions/new"),
    },
    {
      id: "view-collection",
      icon: Eye,
      title: "View Collection",
      description: "Browse verified artworks",
      onClick: () => navigate("/collection"),
    },
    {
      id: "analytics",
      icon: BarChart3,
      title: "Analytics",
      description: "View verification metrics",
      onClick: () => navigate("/analytics"),
    },
  ];

  if (loading || isLoading) {
    return (
      <div className="dashboard">
        <div className="dashboard__loading">
          <div className="loading-spinner" />
          <p>Loading OriginStamp Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Enhanced Header */}
      <div className="dashboard__header">
        <div className="dashboard__header-main">
          <div className="dashboard__header-content">
            <h1 className="dashboard__header-title">OriginStamp Dashboard</h1>
            <p className="dashboard__header-subtitle">
              NFT RWA Art Verification Platform
            </p>
          </div>
          <div className="dashboard__header-actions">
            <button
              className="btn btn--primary"
              onClick={() => navigate("/upload")}
            >
              <Plus size={16} />
              Upload Artwork
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid with Gradients */}
      <div className="dashboard__stats-grid">
        <div className="dashboard__stat-card dashboard__stat-card--featured">
          <div className="dashboard__stat-header">
            <div className="dashboard__stat-icon">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="dashboard__stat-value">
            {stats?.totalArtworks || 0}
          </div>
          <div className="dashboard__stat-label">Total Artworks</div>
          <div className="dashboard__stat-trend">
            <TrendingUp size={12} />+{stats?.monthlyGrowth || 0}% this month
          </div>
        </div>

        <div className="dashboard__stat-card">
          <div className="dashboard__stat-header">
            <div className="dashboard__stat-icon">
              <Shield size={20} />
            </div>
          </div>
          <div className="dashboard__stat-value">
            {stats?.verifiedArtworks || 0}
          </div>
          <div className="dashboard__stat-label">Verified Artworks</div>
          <div className="dashboard__stat-trend">
            <TrendingUp size={12} />+
            {Math.round((stats?.verificationScore || 0) / 10)}% score
          </div>
        </div>

        <div className="dashboard__stat-card">
          <div className="dashboard__stat-header">
            <div className="dashboard__stat-icon">
              <Award size={20} />
            </div>
          </div>
          <div className="dashboard__stat-value">
            {stats?.certificatesIssued || 0}
          </div>
          <div className="dashboard__stat-label">NFTs Minted</div>
          <div className="dashboard__stat-trend">
            <TrendingUp size={12} />+
            {Math.round((stats?.monthlyGrowth || 0) / 2)}% this month
          </div>
        </div>

        <div className="dashboard__stat-card">
          <div className="dashboard__stat-header">
            <div className="dashboard__stat-icon">
              <Camera size={20} />
            </div>
          </div>
          <div className="dashboard__stat-value">
            {stats?.activeSessions || 0}
          </div>
          <div className="dashboard__stat-label">Active Sessions</div>
          <div className="dashboard__stat-trend">
            <Activity size={12} />
            Live tracking
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="dashboard__quick-actions">
        {quickActions.map((action) => (
          <button
            key={action.id}
            className="dashboard__action-card"
            onClick={action.onClick}
          >
            <action.icon className="action-icon" size={24} />
            <div className="action-title">{action.title}</div>
            <div className="action-description">{action.description}</div>
          </button>
        ))}
      </div>

      {/* Artwork Overview Grid */}
      <div className="dashboard__overview">
        <h3>Recent Artworks</h3>
        <div className="dashboard__overview-grid">
          {artworks.slice(0, 6).map((artwork) => (
            <button
              key={artwork.id}
              className="dashboard__overview-card"
              onClick={() => navigate(`/artwork/${artwork.id}`)}
            >
              <div className="artwork-card">
                <div className="artwork-card__header">
                  <div className="artwork-card__status">
                    <span
                      className={`status-badge status-badge--${artwork.status}`}
                    >
                      {artwork.status.replace("_", " ")}
                    </span>
                    <span className="artwork-card__type">{artwork.type}</span>
                  </div>
                </div>
                <div className="artwork-card__content">
                  <div className="artwork-card__title">{artwork.name}</div>
                  <div className="artwork-card__metadata">
                    <div className="artwork-card__info">
                      <div>Type: {artwork.type}</div>
                      <div>
                        Last Activity:{" "}
                        {new Date(artwork.lastActivity).toLocaleDateString()}
                      </div>
                      <div>Progress: {artwork.progress}%</div>
                    </div>
                    <div className="artwork-card__stats">
                      {artwork.verificationEntries > 0 && (
                        <div className="stat-item">
                          <FileText size={14} />
                          <span>{artwork.verificationEntries} entries</span>
                        </div>
                      )}
                      {artwork.progress > 0 && (
                        <div className="stat-item">
                          <Shield size={14} />
                          <span>{artwork.progress}% complete</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard__activity">
        <h3>Recent Activity</h3>
        <div className="dashboard__activity-list">
          {recentActivity.slice(0, 8).map((activity) => {
            const Icon = iconMap[activity.type] || Activity;
            return (
              <div key={activity.id} className="dashboard__activity-item">
                <Icon className="activity-icon" size={16} />
                <div className="activity-content">
                  <div className="activity-text">{activity.description}</div>
                  <div className="activity-time">
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
