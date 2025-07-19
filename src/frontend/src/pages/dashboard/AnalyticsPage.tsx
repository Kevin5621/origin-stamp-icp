import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Clock,
  FileText,
  Users,
  Calendar,
  Activity,
  Target,
  Award,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

/**
 * AnalyticsPage - Halaman analisis dan statistik
 *
 * Fitur:
 * - Dashboard statistik overview
 * - Grafik performa
 * - Laporan aktivitas
 * - Metrics tracking
 * - Responsive design dengan neumorphic styling
 */
const AnalyticsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("projects");

  // Debug: Log when component mounts
  useEffect(() => {
    console.log("AnalyticsPage mounted");
    console.log("Current location:", window.location.pathname);
  }, []);

  // Mock data untuk analytics
  const analyticsData = {
    overview: {
      totalProjects: 24,
      totalCertificates: 18,
      totalHours: 156,
      totalActions: 2847,
      activeUsers: 3,
      completionRate: 85,
    },
    trends: {
      projectsGrowth: 12.5,
      certificatesGrowth: 8.3,
      hoursGrowth: -2.1,
      actionsGrowth: 15.7,
    },
    monthlyData: [
      { month: "Jan", projects: 4, certificates: 3, hours: 45 },
      { month: "Feb", projects: 6, certificates: 5, hours: 52 },
      { month: "Mar", projects: 8, certificates: 7, hours: 48 },
      { month: "Apr", projects: 6, certificates: 3, hours: 11 },
    ],
    projectTypes: [
      { type: "Digital Art", count: 12, percentage: 50 },
      { type: "Physical Art", count: 8, percentage: 33 },
      { type: "Code Projects", count: 4, percentage: 17 },
    ],
    recentActivity: [
      {
        id: 1,
        type: "certificate_issued",
        title: "Certificate issued for 'Abstract Composition'",
        time: "2 hours ago",
        user: "John Doe",
      },
      {
        id: 2,
        type: "project_started",
        title: "New project started: 'Landscape Painting'",
        time: "4 hours ago",
        user: "Jane Smith",
      },
      {
        id: 3,
        type: "session_completed",
        title: "Session completed: 'Web Application'",
        time: "1 day ago",
        user: "Mike Johnson",
      },
      {
        id: 4,
        type: "certificate_verified",
        title: "Certificate verified: 'Digital Artwork'",
        time: "2 days ago",
        user: "John Doe",
      },
    ],
  };

  const getGrowthIcon = (value: number) => {
    if (value > 0)
      return (
        <ArrowUpRight size={16} strokeWidth={2} className="text-success" />
      );
    if (value < 0)
      return (
        <ArrowDownRight size={16} strokeWidth={2} className="text-error" />
      );
    return <Minus size={16} strokeWidth={2} className="text-secondary" />;
  };

  const getGrowthColor = (value: number) => {
    if (value > 0) return "var(--color-success)";
    if (value < 0) return "var(--color-error)";
    return "var(--color-text-secondary)";
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "certificate_issued":
        return <FileText size={16} strokeWidth={2} />;
      case "project_started":
        return <Target size={16} strokeWidth={2} />;
      case "session_completed":
        return <Activity size={16} strokeWidth={2} />;
      case "certificate_verified":
        return <Award size={16} strokeWidth={2} />;
      default:
        return <Zap size={16} strokeWidth={2} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "certificate_issued":
        return "var(--color-success)";
      case "project_started":
        return "var(--color-info)";
      case "session_completed":
        return "var(--color-warning)";
      case "certificate_verified":
        return "var(--color-success)";
      default:
        return "var(--color-text-secondary)";
    }
  };

  return (
    <section className="analytics-section" aria-labelledby="analytics-title">
      <div className="analytics-layout">
        {/* Header */}
        <header className="analytics-header">
          <div className="header-content">
            <h1 id="analytics-title" className="analytics-title">
              {t("analytics_title")}
            </h1>
            <p className="analytics-subtitle">{t("analytics_description")}</p>
          </div>
          <div className="header-controls">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-range-select wireframe-select"
            >
              <option value="7d">{t("last_7_days")}</option>
              <option value="30d">{t("last_30_days")}</option>
              <option value="90d">{t("last_90_days")}</option>
              <option value="1y">{t("last_year")}</option>
            </select>
          </div>
        </header>

        {/* Overview Stats */}
        <section className="overview-stats">
          <div className="stats-grid">
            <div className="stat-card wireframe-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <Target size={24} strokeWidth={2} />
                </div>
                <div className="stat-trend">
                  {getGrowthIcon(analyticsData.trends.projectsGrowth)}
                  <span
                    style={{
                      color: getGrowthColor(
                        analyticsData.trends.projectsGrowth,
                      ),
                    }}
                  >
                    {analyticsData.trends.projectsGrowth}%
                  </span>
                </div>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">
                  {analyticsData.overview.totalProjects}
                </h3>
                <p className="stat-label">{t("total_projects")}</p>
              </div>
            </div>

            <div className="stat-card wireframe-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <FileText size={24} strokeWidth={2} />
                </div>
                <div className="stat-trend">
                  {getGrowthIcon(analyticsData.trends.certificatesGrowth)}
                  <span
                    style={{
                      color: getGrowthColor(
                        analyticsData.trends.certificatesGrowth,
                      ),
                    }}
                  >
                    {analyticsData.trends.certificatesGrowth}%
                  </span>
                </div>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">
                  {analyticsData.overview.totalCertificates}
                </h3>
                <p className="stat-label">{t("certificates_issued")}</p>
              </div>
            </div>

            <div className="stat-card wireframe-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <Clock size={24} strokeWidth={2} />
                </div>
                <div className="stat-trend">
                  {getGrowthIcon(analyticsData.trends.hoursGrowth)}
                  <span
                    style={{
                      color: getGrowthColor(analyticsData.trends.hoursGrowth),
                    }}
                  >
                    {analyticsData.trends.hoursGrowth}%
                  </span>
                </div>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">
                  {analyticsData.overview.totalHours}h
                </h3>
                <p className="stat-label">{t("total_hours")}</p>
              </div>
            </div>

            <div className="stat-card wireframe-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <Activity size={24} strokeWidth={2} />
                </div>
                <div className="stat-trend">
                  {getGrowthIcon(analyticsData.trends.actionsGrowth)}
                  <span
                    style={{
                      color: getGrowthColor(analyticsData.trends.actionsGrowth),
                    }}
                  >
                    {analyticsData.trends.actionsGrowth}%
                  </span>
                </div>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">
                  {analyticsData.overview.totalActions}
                </h3>
                <p className="stat-label">{t("total_actions")}</p>
              </div>
            </div>

            <div className="stat-card wireframe-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <Users size={24} strokeWidth={2} />
                </div>
                <div className="stat-trend">
                  <Minus size={16} strokeWidth={2} className="text-secondary" />
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    0%
                  </span>
                </div>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">
                  {analyticsData.overview.activeUsers}
                </h3>
                <p className="stat-label">{t("active_users")}</p>
              </div>
            </div>

            <div className="stat-card wireframe-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <Award size={24} strokeWidth={2} />
                </div>
                <div className="stat-trend">
                  <ArrowUpRight
                    size={16}
                    strokeWidth={2}
                    className="text-success"
                  />
                  <span style={{ color: "var(--color-success)" }}>+5%</span>
                </div>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">
                  {analyticsData.overview.completionRate}%
                </h3>
                <p className="stat-label">{t("completion_rate")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Charts and Insights */}
        <section className="analytics-content">
          <div className="content-grid">
            {/* Monthly Trends */}
            <div className="chart-card wireframe-card">
              <div className="chart-header">
                <h3>{t("monthly_trends")}</h3>
                <div className="chart-controls">
                  <button
                    className={`metric-btn ${selectedMetric === "projects" ? "active" : ""}`}
                    onClick={() => setSelectedMetric("projects")}
                  >
                    {t("projects")}
                  </button>
                  <button
                    className={`metric-btn ${selectedMetric === "certificates" ? "active" : ""}`}
                    onClick={() => setSelectedMetric("certificates")}
                  >
                    {t("certificates")}
                  </button>
                  <button
                    className={`metric-btn ${selectedMetric === "hours" ? "active" : ""}`}
                    onClick={() => setSelectedMetric("hours")}
                  >
                    {t("hours")}
                  </button>
                </div>
              </div>
              <div className="chart-content">
                <div className="chart-placeholder">
                  <BarChart3 size={48} strokeWidth={1} />
                  <p>Chart visualization will be implemented here</p>
                  <div className="chart-data">
                    {analyticsData.monthlyData.map((data, index) => (
                      <div key={index} className="data-point">
                        <span className="data-label">{data.month}</span>
                        <span className="data-value">
                          {selectedMetric === "projects" && data.projects}
                          {selectedMetric === "certificates" &&
                            data.certificates}
                          {selectedMetric === "hours" && data.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Types Distribution */}
            <div className="chart-card wireframe-card">
              <div className="chart-header">
                <h3>{t("project_types_distribution")}</h3>
              </div>
              <div className="chart-content">
                <div className="distribution-list">
                  {analyticsData.projectTypes.map((type, index) => (
                    <div key={index} className="distribution-item">
                      <div className="distribution-info">
                        <span className="distribution-label">
                          {type.type === "Digital Art"
                            ? t("digital_art")
                            : type.type === "Physical Art"
                              ? t("physical_art")
                              : type.type === "Code Projects"
                                ? t("code_projects")
                                : type.type}
                        </span>
                        <span className="distribution-count">
                          {type.count} projects
                        </span>
                      </div>
                      <div className="distribution-bar">
                        <div
                          className="distribution-fill"
                          style={{ width: `${type.percentage}%` }}
                        ></div>
                      </div>
                      <span className="distribution-percentage">
                        {type.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="recent-activity">
          <div className="activity-card wireframe-card">
            <div className="activity-header">
              <h3>{t("recent_activity")}</h3>
              <button className="view-all-btn wireframe-button">
                {t("view_all")}
              </button>
            </div>
            <div className="activity-list">
              {analyticsData.recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div
                    className="activity-icon"
                    style={{ color: getActivityColor(activity.type) }}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <h4 className="activity-title">{activity.title}</h4>
                    <p className="activity-meta">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AnalyticsPage;
