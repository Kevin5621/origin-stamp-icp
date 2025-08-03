// src/frontend/src/components/dashboard/Dashboard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  Plus,
  Target,
  FileText,
  Clock,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowRight,
  BarChart3,
  Search,
  Grid,
  List,
  Calendar,
  FolderOpen,
} from "lucide-react";
import { KaryaWithLogs } from "../../types/karya";

interface DashboardProps {
  stats: {
    completedProjects: number;
    certificatesIssued: number;
    activeSessions: number;
    totalValue: number;
  };
  projects: KaryaWithLogs[];
  isLoading?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  stats,
  projects,
  isLoading = false,
}) => {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleNewProject = () => {
    navigate("/session");
  };

  const handleViewCertificates = () => {
    navigate("/certificates");
  };

  const handleViewAnalytics = () => {
    navigate("/analytics");
  };

  const handleProjectClick = (karyaId: string) => {
    navigate(`/karya/${karyaId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "var(--color-success)";
      case "active":
        return "var(--color-warning)";
      default:
        return "var(--color-text-secondary)";
    }
  };

  const getProjectTypeIcon = (tipeKarya: string) => {
    switch (tipeKarya) {
      case "painting":
        return <Target size={16} />;
      case "sculpture":
        return <FolderOpen size={16} />;
      case "audio":
        return <BarChart3 size={16} />;
      case "digital":
        return <FileText size={16} />;
      default:
        return <Target size={16} />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.nama_karya.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="dashboard__loading">
          <div className="loading-spinner"></div>
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="dashboard__welcome">
        <div className="dashboard__welcome-content">
          <div className="dashboard__welcome-icon">
            <Sparkles size={32} />
          </div>
          <div className="dashboard__welcome-text">
            <h1>{t("creator_dashboard")}</h1>
            <p>{t("manage_monitor_projects")}</p>
          </div>
        </div>
        <button
          className="dashboard__welcome-action"
          onClick={handleNewProject}
        >
          <Plus size={20} />
          <span>{t("new_project")}</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="dashboard__stats-overview">
        <div className="dashboard__stat-item dashboard__stat-item--primary">
          <div className="dashboard__stat-icon">
            <Target size={24} />
          </div>
          <div className="dashboard__stat-content">
            <div className="dashboard__stat-value">
              {stats.completedProjects}
            </div>
            <div className="dashboard__stat-label">
              {t("completed_projects")}
            </div>
            <div className="dashboard__stat-trend">
              <TrendingUp size={14} />
              <span>+12%</span>
            </div>
          </div>
        </div>

        <div className="dashboard__stat-item">
          <div className="dashboard__stat-icon">
            <FileText size={24} />
          </div>
          <div className="dashboard__stat-content">
            <div className="dashboard__stat-value">
              {stats.certificatesIssued}
            </div>
            <div className="dashboard__stat-label">
              {t("certificates_issued")}
            </div>
            <div className="dashboard__stat-trend">
              <TrendingUp size={14} />
              <span>+8%</span>
            </div>
          </div>
        </div>

        <div className="dashboard__stat-item">
          <div className="dashboard__stat-icon">
            <Clock size={24} />
          </div>
          <div className="dashboard__stat-content">
            <div className="dashboard__stat-value">{stats.activeSessions}</div>
            <div className="dashboard__stat-label">{t("active_sessions")}</div>
            <div className="dashboard__stat-trend">
              <Activity size={14} />
              <span>Active</span>
            </div>
          </div>
        </div>

        <div className="dashboard__stat-item">
          <div className="dashboard__stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="dashboard__stat-content">
            <div className="dashboard__stat-value">
              {formatCurrency(stats.totalValue)}
            </div>
            <div className="dashboard__stat-label">{t("total_value")}</div>
            <div className="dashboard__stat-trend">
              <TrendingUp size={14} />
              <span>+15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard__main-content">
        {/* Quick Actions - Now as horizontal cards */}
        <div className="dashboard__quick-actions">
          <button
            className="dashboard__quick-card dashboard__quick-card--primary"
            onClick={handleNewProject}
          >
            <div className="dashboard__quick-icon">
              <Plus size={24} />
            </div>
            <div className="dashboard__quick-content">
              <h3>{t("new_project")}</h3>
              <p>{t("create_verification_project")}</p>
            </div>
            <ArrowRight size={20} className="dashboard__quick-arrow" />
          </button>

          <button
            className="dashboard__quick-card"
            onClick={handleViewCertificates}
          >
            <div className="dashboard__quick-icon">
              <FileText size={24} />
            </div>
            <div className="dashboard__quick-content">
              <h3>{t("view_certificates")}</h3>
              <p>{t("manage_issued_certificates")}</p>
            </div>
            <ArrowRight size={20} className="dashboard__quick-arrow" />
          </button>

          <button
            className="dashboard__quick-card"
            onClick={handleViewAnalytics}
          >
            <div className="dashboard__quick-icon">
              <BarChart3 size={24} />
            </div>
            <div className="dashboard__quick-content">
              <h3>{t("analytics")}</h3>
              <p>{t("view_statistics_reports")}</p>
            </div>
            <ArrowRight size={20} className="dashboard__quick-arrow" />
          </button>
        </div>

        {/* Projects Panel - Now full width */}
        <div className="dashboard__projects-panel">
          <div className="dashboard__panel-header">
            <div className="dashboard__panel-title-group">
              <h2 className="dashboard__panel-title">{t("recent_projects")}</h2>
              <span className="dashboard__panel-count">
                {filteredProjects.length} projects
              </span>
            </div>

            <div className="dashboard__panel-controls">
              <div className="dashboard__search-wrapper">
                <Search size={16} />
                <input
                  type="text"
                  placeholder={t("search_projects")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="dashboard__search-input"
                />
              </div>
              <div className="dashboard__view-toggle">
                <button
                  className={`dashboard__view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid size={16} />
                </button>
                <button
                  className={`dashboard__view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          <div
            className={`dashboard__projects-grid dashboard__projects-grid--${viewMode}`}
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.slice(0, 6).map((project) => (
                <button
                  key={project.karya_id}
                  className="dashboard__project-card"
                  onClick={() => handleProjectClick(project.karya_id)}
                  type="button"
                >
                  <div className="dashboard__project-header">
                    <div className="dashboard__project-type">
                      {getProjectTypeIcon(project.tipe_karya)}
                    </div>
                    <div
                      className="dashboard__project-status"
                      style={{
                        backgroundColor: getStatusColor(project.status_karya),
                      }}
                    >
                      {project.status_karya.toUpperCase()}
                    </div>
                  </div>

                  <div className="dashboard__project-content">
                    <h3>{project.nama_karya}</h3>
                    <p>{project.deskripsi}</p>
                  </div>

                  <div className="dashboard__project-meta">
                    <div className="dashboard__project-date">
                      <Calendar size={14} />
                      <span>{formatDate(project.waktu_mulai)}</span>
                    </div>
                    <div className="dashboard__project-format">
                      {project.format_file}
                    </div>
                  </div>

                  {project.log_count && (
                    <div className="dashboard__project-logs">
                      <Activity size={14} />
                      <span>
                        {project.log_count} {t("process_logs")}
                      </span>
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="dashboard__empty-state">
                <div className="dashboard__empty-icon">
                  <Target size={48} />
                </div>
                <h3>{t("no_projects_yet")}</h3>
                <p>{t("start_creating_projects")}</p>
                <button
                  className="dashboard__empty-action"
                  onClick={handleNewProject}
                  type="button"
                >
                  {t("create_first_project")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
