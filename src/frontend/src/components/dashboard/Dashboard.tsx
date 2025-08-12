// src/frontend/src/components/dashboard/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Plus,
  BarChart3,
  Eye,
  Camera,
  TrendingUp,
  CheckCircle,
  Shield,
  Activity,
  Clock,
  Palette,
  ArrowRight,
  Sparkles,
  Zap,
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

  const [stats, setStats] = useState<OriginStampStats | null>(null);
  const [artworks, setArtworks] = useState<ArtworkOverview[]>([]);
  const [loading, setLoading] = useState(true);

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

  const quickActions = [
    {
      id: "start-session",
      icon: Camera,
      title: t("start_session") || "Start Session",
      description: t("start_session_desc") || "Begin physical art session",
      onClick: () => navigate("/sessions/new"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "view-collection",
      icon: Eye,
      title: t("view_collection") || "View Collection",
      description: t("view_collection_desc") || "Browse verified artworks",
      onClick: () => navigate("/marketplace"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "analytics",
      icon: BarChart3,
      title: t("analytics") || "Analytics",
      description: t("analytics_desc") || "View verification metrics",
      onClick: () => navigate("/analytics"),
      gradient: "from-orange-500 to-red-500",
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
      <div className="dashboard-layout">
        {/* Hero Section - Layout konsisten dengan certificates */}
        <div className="dashboard__hero">
          <div className="hero__content">
            <div className="hero__greeting">
              <h1 className="hero__title">
                Hi, <span className="hero__name">Artist</span>! 👋
              </h1>
              <p className="hero__subtitle">
                Ready to create something amazing today?
              </p>
            </div>
            <div className="hero__stats">
              <div className="hero-stat">
                <div className="hero-stat__number">
                  {stats?.totalArtworks || 0}
                </div>
                <div className="hero-stat__label">Artworks</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat__number">
                  {stats?.verifiedArtworks || 0}
                </div>
                <div className="hero-stat__label">Verified</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat__number">
                  {stats?.activeSessions || 0}
                </div>
                <div className="hero-stat__label">Active</div>
              </div>
            </div>
          </div>
          <div className="hero__action">
            <button
              className="hero__create-btn"
              onClick={() => navigate("/create-session")}
            >
              <Plus size={16} />
              <span>Create New</span>
              <Sparkles size={14} />
            </button>
          </div>
        </div>

        {/* Quick Actions - Ikon lebih kecil */}
        <div className="dashboard__quick-actions-modern">
          <div className="quick-actions-modern__grid">
            {quickActions.map((action) => (
              <div
                key={action.id}
                className="quick-action-modern"
                onClick={action.onClick}
              >
                <div className="quick-action-modern__icon">
                  <action.icon size={16} /> {/* Ikon lebih kecil */}
                </div>
                <div className="quick-action-modern__content">
                  <h3 className="quick-action-modern__title">{action.title}</h3>
                  <p className="quick-action-modern__description">
                    {action.description}
                  </p>
                </div>
                <div className="quick-action-modern__arrow">
                  <ArrowRight size={12} /> {/* Ikon arrow lebih kecil */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Artworks - Layout konsisten */}
        <div className="dashboard__recent-artworks">
          <div className="recent-artworks__header">
            <h3 className="recent-artworks__title">
              {t("recent_artworks") || "Recent Artworks"}
            </h3>
            <button
              className="recent-artworks__view-all"
              onClick={() => navigate("/marketplace")}
            >
              View All <ArrowRight size={12} /> {/* Ikon arrow lebih kecil */}
            </button>
          </div>
          <div className="recent-artworks__grid">
            {artworks.slice(0, 3).map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
