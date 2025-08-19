import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  BarChart3,
  Clock,
  Eye,
  Download,
  Share2,
  Heart,
  MoreHorizontal,
  Activity,
  Users,
  Target,
  Award,
} from "lucide-react";
import { KaryaService } from "../../services/artService";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { usePreloadData } from "../../hooks/usePreloadData";
import DashboardLoader from "../../components/dashboard/DashboardLoader";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";

interface PerformanceMetric {
  metric: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
}

interface AnalyticsData {
  views: number;
  engagement: number;
  completion_rate: number;
  avg_session_duration: number;
  price_history: Array<{ value: number; date: string; volume?: number }>;
  performance_metrics: PerformanceMetric[];
  audience_demographics: any;
  verification_score: number;
}

const AnalyticsDetailPage: React.FC = () => {
  const { karyaId } = useParams<{ karyaId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  useErrorHandler({
    context: "AnalyticsDetailPage",
  });

  const [activeTab, setActiveTab] = useState<
    "overview" | "performance" | "audience" | "verification"
  >("overview");

  // Preload data dengan caching dan background fetch
  const { data: karya, loading: karyaLoading } = usePreloadData(
    `karya-${karyaId}`,
    () => KaryaService.getKaryaById(karyaId!),
    { immediate: !!karyaId, background: true },
  );

  const { data: analyticsData, loading: analyticsLoading } =
    usePreloadData<AnalyticsData | null>(
      `analytics-${karyaId}`,
      async (): Promise<AnalyticsData | null> => {
        const rawData = await KaryaService.getKaryaAnalytics(karyaId!);
        if (!rawData) return null;

        return {
          views: rawData.views || 0,
          engagement: rawData.engagement || 0,
          completion_rate: rawData.completion_rate || 0,
          avg_session_duration: rawData.avg_session_duration || 0,
          price_history: rawData.price_history || [],
          performance_metrics: (rawData.performance_metrics ||
            []) as PerformanceMetric[],
          audience_demographics: rawData.audience_demographics || {},
          verification_score: rawData.verification_score || 0,
        };
      },
      { immediate: !!karyaId && !!karya, background: true },
    );

  const loading = karyaLoading || analyticsLoading;

  const handleBack = () => {
    navigate(-1);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp size={16} className="text-green-500" />;
      case "down":
        return <TrendingUp size={16} className="rotate-180 text-red-500" />;
      default:
        return <TrendingUp size={16} className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="analytics-detail-page">
        <DashboardLoader message={t("loading_analytics")} variant="skeleton" />
      </div>
    );
  }

  if (!karya || !analyticsData) {
    return (
      <div className="analytics-detail-page">
        <div className="analytics-detail-page__error">
          <p>{t("analytics_not_found")}</p>
          <Button onClick={handleBack} variant="primary">
            {t("back")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header with Dashboard Consistency */}
      <div className="dashboard__bento-header">
        <div className="dashboard__welcome-card">
          <div className="welcome-card__content">
            <div className="analytics-detail-page__header-left">
              <Button
                onClick={handleBack}
                variant="secondary"
                className="analytics-detail-page__back-btn"
              >
                <ArrowLeft size={20} />
                <span>{t("back")}</span>
              </Button>
            </div>
            <h1 className="welcome-card__title">{karya.nama_karya}</h1>
            <p className="welcome-card__subtitle">
              {t("analytics_detail_subtitle")}
            </p>
          </div>
          <div className="welcome-card__actions">
            <div className="analytics-detail-page__header-actions">
              <Button variant="secondary" size="small" onClick={() => {}}>
                <Share2 size={16} />
              </Button>
              <Button variant="secondary" size="small" onClick={() => {}}>
                <Download size={16} />
              </Button>
              <Button variant="secondary" size="small" onClick={() => {}}>
                <Heart size={16} />
              </Button>
              <Button variant="secondary" size="small" onClick={() => {}}>
                <MoreHorizontal size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Dashboard Layout */}
      <div className="dashboard__main-content">
        <div className="analytics-detail-page__content">
          {/* Left Panel - Main Chart */}
          <div className="analytics-detail-page__main-panel">
            <Card className="analytics-detail-page__chart-card">
              <div className="analytics-detail-page__chart-header">
                <h3>{t("verification_value_history")}</h3>
                <div className="analytics-detail-page__chart-controls">
                  <Button variant="secondary" size="small" onClick={() => {}}>
                    1D
                  </Button>
                  <Button variant="secondary" size="small" onClick={() => {}}>
                    1W
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => {}}
                    className="active"
                  >
                    1M
                  </Button>
                  <Button variant="secondary" size="small" onClick={() => {}}>
                    3M
                  </Button>
                  <Button variant="secondary" size="small" onClick={() => {}}>
                    1Y
                  </Button>
                </div>
              </div>
              <div className="analytics-detail-page__chart">
                {/* Mock Chart - akan diganti dengan chart library */}
                <div className="analytics-detail-page__mock-chart">
                  <div className="analytics-detail-page__chart-line">
                    {analyticsData.price_history.map((point, index) => (
                      <div
                        key={`price-point-${index}-${point.date}`}
                        className="analytics-detail-page__chart-point"
                        style={{
                          left: `${(index / (analyticsData.price_history.length - 1)) * 100}%`,
                          bottom: `${(point.value / Math.max(...analyticsData.price_history.map((p) => p.value))) * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="analytics-detail-page__chart-labels">
                    <span>
                      {formatCurrency(
                        Math.min(
                          ...analyticsData.price_history.map((p) => p.value),
                        ),
                      )}
                    </span>
                    <span>
                      {formatCurrency(
                        Math.max(
                          ...analyticsData.price_history.map((p) => p.value),
                        ),
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="analytics-detail-page__chart-stats">
                <div className="analytics-detail-page__stat">
                  <span className="analytics-detail-page__stat-label">
                    {t("current_value")}
                  </span>
                  <span className="analytics-detail-page__stat-value">
                    {formatCurrency(
                      analyticsData.price_history[
                        analyticsData.price_history.length - 1
                      ].value,
                    )}
                  </span>
                </div>
                <div className="analytics-detail-page__stat">
                  <span className="analytics-detail-page__stat-label">
                    {t("change_24h")}
                  </span>
                  <span className="analytics-detail-page__stat-value positive">
                    +
                    {formatCurrency(
                      analyticsData.price_history[
                        analyticsData.price_history.length - 1
                      ].value -
                        analyticsData.price_history[
                          analyticsData.price_history.length - 2
                        ].value,
                    )}
                  </span>
                </div>
                <div className="analytics-detail-page__stat">
                  <span className="analytics-detail-page__stat-label">
                    {t("volume")}
                  </span>
                  <span className="analytics-detail-page__stat-value">
                    {
                      analyticsData.price_history[
                        analyticsData.price_history.length - 1
                      ].volume
                    }
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Panel - Details */}
          <div className="analytics-detail-page__side-panel">
            {/* Tabs */}
            <div className="analytics-detail-page__tabs">
              <button
                className={`analytics-detail-page__tab ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <BarChart3 size={16} />
                <span>{t("overview")}</span>
              </button>
              <button
                className={`analytics-detail-page__tab ${activeTab === "performance" ? "active" : ""}`}
                onClick={() => setActiveTab("performance")}
              >
                <TrendingUp size={16} />
                <span>{t("performance")}</span>
              </button>
              <button
                className={`analytics-detail-page__tab ${activeTab === "audience" ? "active" : ""}`}
                onClick={() => setActiveTab("audience")}
              >
                <Users size={16} />
                <span>{t("audience")}</span>
              </button>
              <button
                className={`analytics-detail-page__tab ${activeTab === "verification" ? "active" : ""}`}
                onClick={() => setActiveTab("verification")}
              >
                <Award size={16} />
                <span>{t("verification")}</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="analytics-detail-page__tab-content">
              {activeTab === "overview" && (
                <div className="analytics-detail-page__overview">
                  <Card className="analytics-detail-page__overview-card">
                    <h4>{t("key_metrics")}</h4>
                    <div className="analytics-detail-page__metrics-grid">
                      <div className="analytics-detail-page__metric">
                        <div className="analytics-detail-page__metric-icon">
                          <Eye size={20} />
                        </div>
                        <div className="analytics-detail-page__metric-content">
                          <span className="analytics-detail-page__metric-value">
                            {analyticsData.views.toLocaleString()}
                          </span>
                          <span className="analytics-detail-page__metric-label">
                            {t("total_views")}
                          </span>
                        </div>
                      </div>
                      <div className="analytics-detail-page__metric">
                        <div className="analytics-detail-page__metric-icon">
                          <Activity size={20} />
                        </div>
                        <div className="analytics-detail-page__metric-content">
                          <span className="analytics-detail-page__metric-value">
                            {formatPercentage(analyticsData.engagement)}
                          </span>
                          <span className="analytics-detail-page__metric-label">
                            {t("engagement_rate")}
                          </span>
                        </div>
                      </div>
                      <div className="analytics-detail-page__metric">
                        <div className="analytics-detail-page__metric-icon">
                          <Target size={20} />
                        </div>
                        <div className="analytics-detail-page__metric-content">
                          <span className="analytics-detail-page__metric-value">
                            {formatPercentage(analyticsData.completion_rate)}
                          </span>
                          <span className="analytics-detail-page__metric-label">
                            {t("completion_rate")}
                          </span>
                        </div>
                      </div>
                      <div className="analytics-detail-page__metric">
                        <div className="analytics-detail-page__metric-icon">
                          <Clock size={20} />
                        </div>
                        <div className="analytics-detail-page__metric-content">
                          <span className="analytics-detail-page__metric-value">
                            {Math.floor(
                              analyticsData.avg_session_duration / 60,
                            )}
                            m {analyticsData.avg_session_duration % 60}s
                          </span>
                          <span className="analytics-detail-page__metric-label">
                            {t("avg_session")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="analytics-detail-page__overview-card">
                    <h4>{t("verification_score")}</h4>
                    <div className="analytics-detail-page__score">
                      <div className="analytics-detail-page__score-circle">
                        <span className="analytics-detail-page__score-value">
                          {analyticsData.verification_score}
                        </span>
                        <span className="analytics-detail-page__score-label">
                          /100
                        </span>
                      </div>
                      <div className="analytics-detail-page__score-details">
                        <p>{t("verification_score_description")}</p>
                        <div className="analytics-detail-page__score-breakdown">
                          <div className="analytics-detail-page__score-item">
                            <span>{t("authenticity")}</span>
                            <span>95%</span>
                          </div>
                          <div className="analytics-detail-page__score-item">
                            <span>{t("provenance")}</span>
                            <span>88%</span>
                          </div>
                          <div className="analytics-detail-page__score-item">
                            <span>{t("community_trust")}</span>
                            <span>82%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "performance" && (
                <div className="analytics-detail-page__performance">
                  <Card className="analytics-detail-page__performance-card">
                    <h4>{t("performance_metrics")}</h4>
                    <div className="analytics-detail-page__performance-list">
                      {analyticsData.performance_metrics.map(
                        (metric, index) => (
                          <div
                            key={`performance-${index}-${metric.metric}`}
                            className="analytics-detail-page__performance-item"
                          >
                            <div className="analytics-detail-page__performance-info">
                              <span className="analytics-detail-page__performance-label">
                                {metric.metric}
                              </span>
                              <span className="analytics-detail-page__performance-value">
                                {metric.value}
                              </span>
                            </div>
                            <div className="analytics-detail-page__performance-change">
                              {getTrendIcon(metric.trend)}
                              <span
                                className={`analytics-detail-page__performance-change-value ${metric.change >= 0 ? "positive" : "negative"}`}
                              >
                                {metric.change >= 0 ? "+" : ""}
                                {metric.change}%
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "audience" && (
                <div className="analytics-detail-page__audience">
                  <Card className="analytics-detail-page__audience-card">
                    <h4>{t("age_distribution")}</h4>
                    <div className="analytics-detail-page__audience-chart">
                      {analyticsData.audience_demographics.age_groups.map(
                        (group: any, index: number) => (
                          <div
                            key={`age-group-${index}-${group.age}`}
                            className="analytics-detail-page__audience-bar"
                          >
                            <div className="analytics-detail-page__audience-bar-label">
                              <span>{group.age}</span>
                              <span>{formatPercentage(group.percentage)}</span>
                            </div>
                            <div className="analytics-detail-page__audience-bar-track">
                              <div
                                className="analytics-detail-page__audience-bar-fill"
                                style={{ width: `${group.percentage}%` }}
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </Card>

                  <Card className="analytics-detail-page__audience-card">
                    <h4>{t("top_locations")}</h4>
                    <div className="analytics-detail-page__audience-list">
                      {analyticsData.audience_demographics.locations.map(
                        (location: any, index: number) => (
                          <div
                            key={`location-${index}-${location.location}`}
                            className="analytics-detail-page__audience-item"
                          >
                            <span>{location.location}</span>
                            <span>{formatPercentage(location.percentage)}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === "verification" && (
                <div className="analytics-detail-page__verification">
                  <Card className="analytics-detail-page__verification-card">
                    <h4>{t("verification_details")}</h4>
                    <div className="analytics-detail-page__verification-list">
                      <div className="analytics-detail-page__verification-item">
                        <div className="analytics-detail-page__verification-icon">
                          <Award size={20} />
                        </div>
                        <div className="analytics-detail-page__verification-content">
                          <span className="analytics-detail-page__verification-label">
                            {t("verification_status")}
                          </span>
                          <span className="analytics-detail-page__verification-value verified">
                            {t("verified")}
                          </span>
                        </div>
                      </div>
                      <div className="analytics-detail-page__verification-item">
                        <div className="analytics-detail-page__verification-icon">
                          <Calendar size={20} />
                        </div>
                        <div className="analytics-detail-page__verification-content">
                          <span className="analytics-detail-page__verification-label">
                            {t("verification_date")}
                          </span>
                          <span className="analytics-detail-page__verification-value">
                            {karya.waktu_selesai
                              ? karya.waktu_selesai.toLocaleDateString("id-ID")
                              : t("pending")}
                          </span>
                        </div>
                      </div>
                      <div className="analytics-detail-page__verification-item">
                        <div className="analytics-detail-page__verification-icon">
                          <BarChart3 size={20} />
                        </div>
                        <div className="analytics-detail-page__verification-content">
                          <span className="analytics-detail-page__verification-label">
                            {t("verification_score")}
                          </span>
                          <span className="analytics-detail-page__verification-value">
                            {analyticsData.verification_score}/100
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDetailPage;
