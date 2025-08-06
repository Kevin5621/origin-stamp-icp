// src/frontend/src/components/dashboard/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Plus,
  BarChart3,
  Upload,
  Eye,
  Camera,
  TrendingUp,
  CheckCircle,
  Shield,
  Award,
  Activity,
  Clock,
  Calendar,
  Palette,
  ArrowRight,
} from "lucide-react";
import { ArtworkCard } from "../common/ArtworkCard";
import {
  type OriginStampStats,
  type ArtworkOverview,
  OriginStampDashboardService,
} from "../../services/dashboardService";

interface DashboardProps {
  isLoading?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isLoading = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("dashboard");

  // State management
  const [stats, setStats] = useState<OriginStampStats | null>(null);
  const [artworks, setArtworks] = useState<ArtworkOverview[]>([]);
  const [loading, setLoading] = useState(true);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, artworksData] = await Promise.all([
          OriginStampDashboardService.getDashboardStats(),
          OriginStampDashboardService.getArtworkOverviews(),
        ]);

        setStats(statsData);
        setArtworks(artworksData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Quick actions for OriginStamp
  const quickActions = [
    {
      id: "upload-artwork",
      icon: Upload,
      title: t("upload_artwork") || "Upload Artwork",
      description:
        t("upload_artwork_desc") || "Start artwork verification process",
      onClick: () => navigate("/create-session"),
    },
    {
      id: "start-session",
      icon: Camera,
      title: t("start_session") || "Start Session",
      description: t("start_session_desc") || "Begin physical art session",
      onClick: () => navigate("/sessions/new"),
    },
    {
      id: "view-collection",
      icon: Eye,
      title: t("view_collection") || "View Collection",
      description: t("view_collection_desc") || "Browse verified artworks",
      onClick: () => navigate("/marketplace"),
    },
    {
      id: "analytics",
      icon: BarChart3,
      title: t("analytics") || "Analytics",
      description: t("analytics_desc") || "View verification metrics",
      onClick: () => navigate("/analytics"),
    },
  ];

  if (loading || isLoading) {
    return (
      <div className="dashboard">
        <div className="dashboard__loading">
          <div className="loading-spinner" />
          <p>{t("loading") || "Loading OriginStamp Dashboard..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Modern Bento Header */}
      <div className="dashboard__bento-header">
        <div className="dashboard__welcome-card">
          <div className="welcome-card__content">
            <h1 className="welcome-card__title">
              {t("welcome_title") || "Welcome to OriginStamp"}
            </h1>
            <p className="welcome-card__subtitle">
              {t("welcome_subtitle") ||
                "Create, verify, and showcase your art with blockchain technology"}
            </p>
            <div className="welcome-card__stats">
              <div className="stat-chip">
                <Palette size={16} />
                <span>
                  {stats?.totalArtworks || 0} {t("artworks") || "artworks"}
                </span>
              </div>
              <div className="stat-chip">
                <Shield size={16} />
                <span>
                  {stats?.verifiedArtworks || 0} {t("verified") || "verified"}
                </span>
              </div>
            </div>
          </div>
          <div className="welcome-card__actions">
            <button
              className="btn-primary-modern"
              onClick={() => navigate("/create-session")}
            >
              <Plus size={18} />
              {t("create_artwork") || "Create Artwork"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Section */}
      <div className="dashboard__stats-section">
        <div className="stats-grid">
          <div className="stat-card stat-card--primary">
            <div className="stat-card__icon">
              <CheckCircle size={24} />
            </div>
            <div className="stat-card__content">
              <div className="stat-card__value">
                {stats?.totalArtworks || 0}
              </div>
              <div className="stat-card__label">
                {t("total_artworks") || "Total Artworks"}
              </div>
              <div className="stat-card__trend">
                <TrendingUp size={12} />
                <span>
                  +{stats?.monthlyGrowth || 0}%{" "}
                  {t("this_month") || "this month"}
                </span>
              </div>
            </div>
          </div>

          <div className="stat-card stat-card--success">
            <div className="stat-card__icon">
              <Shield size={24} />
            </div>
            <div className="stat-card__content">
              <div className="stat-card__value">
                {stats?.verifiedArtworks || 0}
              </div>
              <div className="stat-card__label">
                {t("verified_artworks") || "Verified Artworks"}
              </div>
              <div className="stat-card__trend">
                <TrendingUp size={12} />
                <span>
                  +{Math.round((stats?.verificationScore || 0) / 10)}%{" "}
                  {t("this_week") || "this week"}
                </span>
              </div>
            </div>
          </div>

          <div className="stat-card stat-card--accent">
            <div className="stat-card__icon">
              <Activity size={24} />
            </div>
            <div className="stat-card__content">
              <div className="stat-card__value">
                {stats?.activeSessions || 0}
              </div>
              <div className="stat-card__label">
                {t("active_sessions") || "Active Sessions"}
              </div>
              <div className="stat-card__trend">
                <Clock size={12} />
                <span>{t("in_progress") || "In progress"}</span>
              </div>
            </div>
          </div>

          <div className="stat-card stat-card--info">
            <div className="stat-card__icon">
              <Award size={24} />
            </div>
            <div className="stat-card__content">
              <div className="stat-card__value">
                {stats?.certificatesIssued || 0}
              </div>
              <div className="stat-card__label">
                {t("certificates_issued") || "Certificates Issued"}
              </div>
              <div className="stat-card__trend">
                <Calendar size={12} />
                <span>{t("total_issued") || "Total issued"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Compact Grid Layout */}
      <div className="dashboard__main-content">
        {/* Quick Actions Section */}
        <div className="dashboard__quick-actions">
          <h3 className="section-title">
            {t("quick_actions") || "Quick Actions"}
          </h3>
          <div className="quick-actions-compact-grid">
            {quickActions.map((action) => (
              <button
                key={action.id}
                className="quick-action-compact"
                onClick={action.onClick}
              >
                <div className="quick-action-compact__icon">
                  <action.icon size={24} />
                </div>
                <div className="quick-action-compact__content">
                  <h4 className="quick-action-compact__title">
                    {action.title}
                  </h4>
                  <p className="quick-action-compact__description">
                    {action.description}
                  </p>
                </div>
                <div className="quick-action-compact__arrow">
                  <ArrowRight size={18} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Artworks Section */}
        <div className="dashboard__artworks">
          <div className="section-header">
            <h3 className="section-title">
              {t("recent_artworks") || "Recent Artworks"}
            </h3>
            <button
              className="btn-view-all"
              onClick={() => navigate("/marketplace")}
            >
              {t("view_all") || "View All"}
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="artworks-modern-grid">
            {artworks.slice(0, 8).map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={{
                  ...artwork,
                  description:
                    (artwork as any).description ||
                    t("artwork_description_placeholder") ||
                    "Beautiful digital artwork created with precision",
                  rating: (artwork as any).rating || 4.8,
                }}
                onClick={() => navigate(`/karya/${artwork.id}`)}
                variant="modern"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
