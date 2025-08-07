import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Clock,
  FileText,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import TradingViewChart from "../../components/common/TradingViewChart";

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

    projects: [
      {
        id: 1,
        title: "Abstract Composition",
        type: "digital_art",
        status: "completed",
        progress: 100,
        sessions: 3,
        lastSession: "2 hours ago",
        thumbnail:
          "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=150&h=150&fit=crop&crop=center",
      },
      {
        id: 2,
        title: "Landscape Painting",
        type: "traditional_art",
        status: "in_progress",
        progress: 75,
        sessions: 2,
        lastSession: "4 hours ago",
        thumbnail:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop&crop=center",
      },
      {
        id: 3,
        title: "Web Application",
        type: "digital_art",
        status: "completed",
        progress: 100,
        sessions: 5,
        lastSession: "1 day ago",
        thumbnail:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=150&fit=crop&crop=center",
      },
      {
        id: 4,
        title: "Digital Artwork",
        type: "digital_art",
        status: "completed",
        progress: 100,
        sessions: 4,
        lastSession: "2 days ago",
        thumbnail:
          "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=150&h=150&fit=crop&crop=center",
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

  return (
    <div className="analytics">
      <div className="analytics__container">
        {/* Modern Header Section */}
        <div className="analytics__header">
          <div className="analytics__header-content">
            <h1 className="analytics__title">{t("analytics_title")}</h1>
            <p className="analytics__subtitle">{t("analytics_description")}</p>
          </div>
          <div className="analytics__header-actions">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-range-select"
            >
              <option value="7d">{t("last_7_days")}</option>
              <option value="30d">{t("last_30_days")}</option>
              <option value="90d">{t("last_90_days")}</option>
              <option value="1y">{t("last_year")}</option>
            </select>
          </div>
        </div>

        {/* Modern Stats Section */}
        <div className="analytics__stats">
          <div className="analytics__stats-grid">
            <div className="analytics__stat-card analytics__stat-card--primary">
              <div className="analytics__stat-icon">
                <Target size={24} strokeWidth={2} />
              </div>
              <div className="analytics__stat-content">
                <div className="analytics__stat-value">
                  {analyticsData.overview.totalProjects}
                </div>
                <div className="analytics__stat-label">
                  {t("total_projects")}
                </div>
                <div className="analytics__stat-trend">
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
            </div>

            <div className="analytics__stat-card analytics__stat-card--success">
              <div className="analytics__stat-icon">
                <FileText size={24} strokeWidth={2} />
              </div>
              <div className="analytics__stat-content">
                <div className="analytics__stat-value">
                  {analyticsData.overview.totalCertificates}
                </div>
                <div className="analytics__stat-label">
                  {t("certificates_issued")}
                </div>
                <div className="analytics__stat-trend">
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
            </div>

            <div className="analytics__stat-card analytics__stat-card--accent">
              <div className="analytics__stat-icon">
                <Clock size={24} strokeWidth={2} />
              </div>
              <div className="analytics__stat-content">
                <div className="analytics__stat-value">
                  {analyticsData.overview.totalHours}h
                </div>
                <div className="analytics__stat-label">{t("total_hours")}</div>
                <div className="analytics__stat-trend">
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
            </div>

            <div className="analytics__stat-card analytics__stat-card--info">
              <div className="analytics__stat-icon">
                <Activity size={24} strokeWidth={2} />
              </div>
              <div className="analytics__stat-content">
                <div className="analytics__stat-value">
                  {analyticsData.overview.totalActions}
                </div>
                <div className="analytics__stat-label">
                  {t("total_actions")}
                </div>
                <div className="analytics__stat-trend">
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
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="analytics__main-content">
          {/* Charts and Insights */}
          <div className="analytics__charts">
            <div className="analytics__charts-grid">
              {/* Monthly Trends */}
              <div className="analytics__chart-card">
                <div className="analytics__chart-header">
                  <h3>{t("monthly_trends")}</h3>
                  <div className="analytics__chart-controls">
                    <button
                      className={`analytics__metric-btn ${selectedMetric === "projects" ? "active" : ""}`}
                      onClick={() => setSelectedMetric("projects")}
                    >
                      {t("projects")}
                    </button>
                    <button
                      className={`analytics__metric-btn ${selectedMetric === "certificates" ? "active" : ""}`}
                      onClick={() => setSelectedMetric("certificates")}
                    >
                      {t("certificates")}
                    </button>
                    <button
                      className={`analytics__metric-btn ${selectedMetric === "hours" ? "active" : ""}`}
                      onClick={() => setSelectedMetric("hours")}
                    >
                      {t("hours")}
                    </button>
                  </div>
                </div>

                <div className="analytics__chart-content">
                  <TradingViewChart className="analytics__trading-chart" />
                </div>
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="analytics__projects">
            <div className="analytics__projects-header">
              <h3>{t("recent_projects")}</h3>
              <button className="analytics__btn-view-all">
                {t("view_all")}
              </button>
            </div>
            <div className="analytics__projects-card">
              <div className="analytics__projects-grid">
                {analyticsData.projects.map((project) => (
                  <div key={project.id} className="analytics__project-item">
                    <div className="analytics__project-thumbnail">
                      <img src={project.thumbnail} alt={project.title} />
                      <div
                        className={`analytics__project-status analytics__project-status--${project.status}`}
                      >
                        {project.status === "completed" ? "✓" : "●"}
                      </div>
                    </div>
                    <div className="analytics__project-content">
                      <h4 className="analytics__project-title">
                        {project.title}
                      </h4>
                      <div className="analytics__project-meta">
                        <span className="analytics__project-type">
                          {project.type.replace("_", " ")}
                        </span>
                        <span className="analytics__project-sessions">
                          {project.sessions} sessions
                        </span>
                      </div>
                      <div className="analytics__project-progress">
                        <div className="analytics__progress-bar">
                          <div
                            className="analytics__progress-fill"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="analytics__progress-text">
                          {project.progress}%
                        </span>
                      </div>
                      <p className="analytics__project-time">
                        Last session: {project.lastSession}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
