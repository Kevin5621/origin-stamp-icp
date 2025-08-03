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
      <div className="bg-surface mx-auto min-h-screen max-w-7xl p-6 pt-24">
        <div className="flex min-h-96 flex-col items-center justify-center gap-4">
          <div className="border-border border-t-accent h-10 w-10 animate-spin rounded-full border-3"></div>
          <p className="text-text-secondary">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface mx-auto min-h-screen max-w-7xl p-6 pt-24">
      {/* Welcome Section */}
      <div className="from-accent to-accent-hover relative mb-12 flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-br p-8 text-white md:flex-row">
        <div className="relative z-10 flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Sparkles size={32} />
          </div>
          <div>
            <h1 className="mb-1 text-2xl leading-tight font-bold md:text-3xl">
              {t("creator_dashboard")}
            </h1>
            <p className="text-base leading-normal opacity-90 md:text-lg">
              {t("manage_monitor_projects")}
            </p>
          </div>
        </div>
        <button
          className="relative z-10 flex items-center gap-2 rounded-xl border border-white/30 bg-white/20 px-6 py-3 font-semibold backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/30 hover:shadow-2xl active:translate-y-0 md:px-8 md:py-4"
          onClick={handleNewProject}
        >
          <Plus size={20} />
          <span>{t("new_project")}</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="from-accent to-accent-hover border-accent hover:border-accent group relative flex items-center gap-6 overflow-hidden rounded-2xl border bg-gradient-to-br p-8 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="absolute top-0 right-0 left-0 h-0.5 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 text-white">
            <Target size={24} />
          </div>
          <div className="flex-1">
            <h3 className="mb-1 text-2xl leading-tight font-bold">
              {stats.completedProjects}
            </h3>
            <p className="mb-1 text-sm font-medium text-white/80">
              {t("completed_projects")}
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-white/90">
              <TrendingUp size={14} />
              <span>+12%</span>
            </div>
          </div>
        </div>

        <div className="bg-surface border-border hover:border-accent group relative flex items-center gap-6 overflow-hidden rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="bg-accent absolute top-0 right-0 left-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <div className="bg-accent flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-white">
            <FileText size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-text-primary mb-1 text-2xl leading-tight font-bold">
              {stats.certificatesIssued}
            </h3>
            <p className="text-text-secondary mb-1 text-sm font-medium">
              {t("certificates_issued")}
            </p>
            <div className="text-success flex items-center gap-1 text-xs font-semibold">
              <TrendingUp size={14} />
              <span>+8%</span>
            </div>
          </div>
        </div>

        <div className="bg-surface border-border hover:border-accent group relative flex items-center gap-6 overflow-hidden rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="bg-accent absolute top-0 right-0 left-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <div className="bg-accent flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-white">
            <Clock size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-text-primary mb-1 text-2xl leading-tight font-bold">
              {stats.activeSessions}
            </h3>
            <p className="text-text-secondary mb-1 text-sm font-medium">
              {t("active_sessions")}
            </p>
            <div className="text-success flex items-center gap-1 text-xs font-semibold">
              <Activity size={14} />
              <span>Active</span>
            </div>
          </div>
        </div>

        <div className="bg-surface border-border hover:border-accent group relative flex items-center gap-6 overflow-hidden rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="bg-accent absolute top-0 right-0 left-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <div className="bg-accent flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-white">
            <DollarSign size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-text-primary mb-1 text-2xl leading-tight font-bold">
              {formatCurrency(stats.totalValue)}
            </h3>
            <p className="text-text-secondary mb-1 text-sm font-medium">
              {t("total_value")}
            </p>
            <div className="text-success flex items-center gap-1 text-xs font-semibold">
              <TrendingUp size={14} />
              <span>+15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 items-start gap-12 xl:grid-cols-3">
        {/* Quick Actions Panel */}
        <div className="bg-surface border-border order-2 h-fit rounded-3xl border p-8 xl:order-1">
          <div className="mb-8">
            <h2 className="text-text-primary mb-1 text-xl font-semibold">
              {t("quick_actions")}
            </h2>
            <div className="text-text-secondary text-sm">
              Akses cepat ke fitur utama
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              className="from-accent to-accent-hover border-accent group relative flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-xl border bg-gradient-to-br p-6 text-left text-white transition-all duration-300 hover:translate-x-2"
              onClick={handleNewProject}
            >
              <div className="from-accent to-accent-hover absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5"></div>
              <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-white/20 text-white">
                <Plus size={24} />
              </div>
              <div className="relative z-10 flex-1">
                <h3 className="mb-1 font-semibold">{t("new_project")}</h3>
                <p className="text-sm opacity-80">
                  {t("create_verification_project")}
                </p>
              </div>
              <ArrowRight
                size={20}
                className="relative z-10 text-white transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              className="bg-surface border-border group hover:border-accent relative flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-xl border p-6 text-left transition-all duration-300 hover:translate-x-2"
              onClick={handleViewCertificates}
            >
              <div className="from-accent to-accent-hover absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5"></div>
              <div className="bg-accent relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-white">
                <FileText size={24} />
              </div>
              <div className="relative z-10 flex-1">
                <h3 className="text-text-primary mb-1 font-semibold">
                  {t("view_certificates")}
                </h3>
                <p className="text-text-secondary text-sm">
                  {t("manage_issued_certificates")}
                </p>
              </div>
              <ArrowRight
                size={20}
                className="text-text-secondary relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              className="bg-surface border-border group hover:border-accent relative flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-xl border p-6 text-left transition-all duration-300 hover:translate-x-2"
              onClick={handleViewAnalytics}
            >
              <div className="from-accent to-accent-hover absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5"></div>
              <div className="bg-accent relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg text-white">
                <BarChart3 size={24} />
              </div>
              <div className="relative z-10 flex-1">
                <h3 className="text-text-primary mb-1 font-semibold">
                  {t("analytics")}
                </h3>
                <p className="text-text-secondary text-sm">
                  {t("view_statistics_reports")}
                </p>
              </div>
              <ArrowRight
                size={20}
                className="text-text-secondary relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* Projects Panel */}
        <div className="bg-surface border-border order-1 rounded-3xl border p-8 xl:order-2 xl:col-span-2">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-text-primary text-xl font-semibold">
                {t("recent_projects")}
              </h2>
              <span className="text-text-secondary bg-surface border-border rounded-lg border px-3 py-1 text-sm">
                {filteredProjects.length} projects
              </span>
            </div>

            <div className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center md:w-auto">
              <div className="bg-surface border-border flex flex-1 items-center gap-2 rounded-lg border px-4 py-2 sm:min-w-60 sm:flex-none">
                <Search size={16} className="text-text-secondary" />
                <input
                  type="text"
                  placeholder={t("search_projects")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-text-primary placeholder:text-text-secondary w-full border-0 bg-transparent text-sm outline-none"
                />
              </div>
              <div className="flex gap-1 self-end sm:self-auto">
                <button
                  className={`border-border flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-accent border-accent text-white"
                      : "bg-surface text-text-secondary hover:border-accent hover:text-accent"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid size={16} />
                </button>
                <button
                  className={`border-border flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-accent border-accent text-white"
                      : "bg-surface text-text-secondary hover:border-accent hover:text-accent"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          <div
            className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.slice(0, 6).map((project) => (
                <button
                  key={project.karya_id}
                  className="bg-surface border-border group hover:border-accent relative w-full cursor-pointer overflow-hidden rounded-xl border p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  onClick={() => handleProjectClick(project.karya_id)}
                  type="button"
                >
                  <div className="bg-accent absolute top-0 right-0 left-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                  <div className="mb-4 flex items-center justify-between">
                    <div className="bg-surface border-border text-text-secondary flex h-8 w-8 items-center justify-center rounded-lg border">
                      {getProjectTypeIcon(project.tipe_karya)}
                    </div>
                    <div
                      className="rounded px-2 py-1 text-xs font-semibold tracking-wide text-white uppercase"
                      style={{
                        backgroundColor: getStatusColor(project.status_karya),
                      }}
                    >
                      {project.status_karya.toUpperCase()}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-text-primary mb-2 text-base leading-tight font-semibold">
                      {project.nama_karya}
                    </h3>
                    <p className="text-text-secondary mb-4 line-clamp-2 text-sm leading-normal">
                      {project.deskripsi}
                    </p>

                    <div className="text-text-secondary mb-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(project.waktu_mulai)}</span>
                      </div>
                      <div>{project.format_file}</div>
                    </div>

                    {project.log_count && (
                      <div className="text-accent flex items-center gap-1 text-xs font-medium">
                        <Activity size={14} />
                        <span>
                          {project.log_count} {t("process_logs")}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                <div className="text-text-secondary mb-6">
                  <Target size={48} />
                </div>
                <h3 className="text-text-primary mb-2 text-lg font-semibold">
                  {t("no_projects_yet")}
                </h3>
                <p className="text-text-secondary mb-6 text-base leading-normal">
                  {t("start_creating_projects")}
                </p>
                <button
                  className="bg-accent hover:bg-accent-hover cursor-pointer rounded-xl border-0 px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
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
