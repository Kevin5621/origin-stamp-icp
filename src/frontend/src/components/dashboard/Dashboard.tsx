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

const Dashboard: React.FC<DashboardProps> = ({ stats, projects, isLoading = false }) => {
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

  const filteredProjects = projects.filter(project =>
    project.nama_karya.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface p-6 pt-24 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-96 gap-4">
          <div className="w-10 h-10 border-3 border-border border-t-accent rounded-full animate-spin"></div>
          <p className="text-text-secondary">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-6 pt-24 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 p-8 bg-gradient-to-br from-accent to-accent-hover rounded-3xl text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 text-center md:text-left">
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Sparkles size={32} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 leading-tight">{t("creator_dashboard")}</h1>
            <p className="text-base md:text-lg opacity-90 leading-normal">{t("manage_monitor_projects")}</p>
          </div>
        </div>
        <button 
          className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/20 border border-white/30 rounded-xl font-semibold backdrop-blur-sm relative z-10 transition-all duration-300 hover:bg-white/30 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0" 
          onClick={handleNewProject}
        >
          <Plus size={20} />
          <span>{t("new_project")}</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
        <div className="bg-gradient-to-br from-accent to-accent-hover text-white border border-accent rounded-2xl p-8 flex items-center gap-6 transition-all duration-300 hover:border-accent hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center justify-center w-14 h-14 bg-white/20 text-white rounded-xl flex-shrink-0">
            <Target size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-1 leading-tight">{stats.completedProjects}</h3>
            <p className="text-sm text-white/80 mb-1 font-medium">{t("completed_projects")}</p>
            <div className="flex items-center gap-1 text-xs text-white/90 font-semibold">
              <TrendingUp size={14} />
              <span>+12%</span>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 flex items-center gap-6 transition-all duration-300 hover:border-accent hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center justify-center w-14 h-14 bg-accent text-white rounded-xl flex-shrink-0">
            <FileText size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-text-primary mb-1 leading-tight">{stats.certificatesIssued}</h3>
            <p className="text-sm text-text-secondary mb-1 font-medium">{t("certificates_issued")}</p>
            <div className="flex items-center gap-1 text-xs text-success font-semibold">
              <TrendingUp size={14} />
              <span>+8%</span>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 flex items-center gap-6 transition-all duration-300 hover:border-accent hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center justify-center w-14 h-14 bg-accent text-white rounded-xl flex-shrink-0">
            <Clock size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-text-primary mb-1 leading-tight">{stats.activeSessions}</h3>
            <p className="text-sm text-text-secondary mb-1 font-medium">{t("active_sessions")}</p>
            <div className="flex items-center gap-1 text-xs text-success font-semibold">
              <Activity size={14} />
              <span>Active</span>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 flex items-center gap-6 transition-all duration-300 hover:border-accent hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex items-center justify-center w-14 h-14 bg-accent text-white rounded-xl flex-shrink-0">
            <DollarSign size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-text-primary mb-1 leading-tight">{formatCurrency(stats.totalValue)}</h3>
            <p className="text-sm text-text-secondary mb-1 font-medium">{t("total_value")}</p>
            <div className="flex items-center gap-1 text-xs text-success font-semibold">
              <TrendingUp size={14} />
              <span>+15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
        {/* Quick Actions Panel */}
        <div className="bg-surface border border-border rounded-3xl p-8 h-fit xl:order-1 order-2">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-1">{t("quick_actions")}</h2>
            <div className="text-sm text-text-secondary">Akses cepat ke fitur utama</div>
          </div>
          
          <div className="flex flex-col gap-4">
            <button 
              className="flex items-center gap-4 p-6 bg-gradient-to-br from-accent to-accent-hover text-white border border-accent rounded-xl cursor-pointer transition-all duration-300 text-left w-full relative overflow-hidden group hover:translate-x-2"
              onClick={handleNewProject}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent-hover opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 text-white rounded-lg flex-shrink-0 relative z-10">
                <Plus size={24} />
              </div>
              <div className="flex-1 relative z-10">
                <h3 className="font-semibold mb-1">{t("new_project")}</h3>
                <p className="text-sm opacity-80">{t("create_verification_project")}</p>
              </div>
              <ArrowRight size={20} className="text-white transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
            </button>

            <button 
              className="flex items-center gap-4 p-6 bg-surface border border-border rounded-xl cursor-pointer transition-all duration-300 text-left w-full relative overflow-hidden group hover:border-accent hover:translate-x-2"
              onClick={handleViewCertificates}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent-hover opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center w-12 h-12 bg-accent text-white rounded-lg flex-shrink-0 relative z-10">
                <FileText size={24} />
              </div>
              <div className="flex-1 relative z-10">
                <h3 className="font-semibold text-text-primary mb-1">{t("view_certificates")}</h3>
                <p className="text-sm text-text-secondary">{t("manage_issued_certificates")}</p>
              </div>
              <ArrowRight size={20} className="text-text-secondary transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
            </button>

            <button 
              className="flex items-center gap-4 p-6 bg-surface border border-border rounded-xl cursor-pointer transition-all duration-300 text-left w-full relative overflow-hidden group hover:border-accent hover:translate-x-2"
              onClick={handleViewAnalytics}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent-hover opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              <div className="flex items-center justify-center w-12 h-12 bg-accent text-white rounded-lg flex-shrink-0 relative z-10">
                <BarChart3 size={24} />
              </div>
              <div className="flex-1 relative z-10">
                <h3 className="font-semibold text-text-primary mb-1">{t("analytics")}</h3>
                <p className="text-sm text-text-secondary">{t("view_statistics_reports")}</p>
              </div>
              <ArrowRight size={20} className="text-text-secondary transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
            </button>
          </div>
        </div>

        {/* Projects Panel */}
        <div className="bg-surface border border-border rounded-3xl p-8 xl:col-span-2 xl:order-2 order-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-text-primary">{t("recent_projects")}</h2>
              <span className="text-sm text-text-secondary bg-surface px-3 py-1 rounded-lg border border-border">
                {filteredProjects.length} projects
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg flex-1 sm:min-w-60 sm:flex-none">
                <Search size={16} className="text-text-secondary" />
                <input
                  type="text"
                  placeholder={t("search_projects")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 bg-transparent outline-none text-sm text-text-primary w-full placeholder:text-text-secondary"
                />
              </div>
              <div className="flex gap-1 self-end sm:self-auto">
                <button
                  className={`flex items-center justify-center w-9 h-9 border border-border rounded-lg cursor-pointer transition-all duration-300 ${
                    viewMode === "grid" 
                      ? "bg-accent border-accent text-white" 
                      : "bg-surface text-text-secondary hover:border-accent hover:text-accent"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid size={16} />
                </button>
                <button
                  className={`flex items-center justify-center w-9 h-9 border border-border rounded-lg cursor-pointer transition-all duration-300 ${
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

          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {filteredProjects.length > 0 ? (
              filteredProjects.slice(0, 6).map((project) => (
                <button 
                  key={project.karya_id} 
                  className="bg-surface border border-border rounded-xl p-6 cursor-pointer transition-all duration-300 relative overflow-hidden group hover:border-accent hover:-translate-y-1 hover:shadow-2xl text-left w-full"
                  onClick={() => handleProjectClick(project.karya_id)}
                  type="button"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-surface border border-border rounded-lg text-text-secondary">
                      {getProjectTypeIcon(project.tipe_karya)}
                    </div>
                    <div 
                      className="px-2 py-1 rounded text-xs font-semibold text-white uppercase tracking-wide"
                      style={{ backgroundColor: getStatusColor(project.status_karya) }}
                    >
                      {project.status_karya.toUpperCase()}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-text-primary mb-2 leading-tight">{project.nama_karya}</h3>
                    <p className="text-sm text-text-secondary mb-4 leading-normal line-clamp-2">{project.deskripsi}</p>
                    
                    <div className="flex justify-between items-center mb-2 text-xs text-text-secondary">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(project.waktu_mulai)}</span>
                      </div>
                      <div>
                        {project.format_file}
                      </div>
                    </div>

                    {project.log_count && (
                      <div className="flex items-center gap-1 text-xs text-accent font-medium">
                        <Activity size={14} />
                        <span>{project.log_count} {t("process_logs")}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center col-span-full">
                <div className="text-text-secondary mb-6">
                  <Target size={48} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{t("no_projects_yet")}</h3>
                <p className="text-base text-text-secondary mb-6 leading-normal">{t("start_creating_projects")}</p>
                <button 
                  className="px-6 py-3 bg-accent text-white border-0 rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:bg-accent-hover hover:-translate-y-0.5"
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