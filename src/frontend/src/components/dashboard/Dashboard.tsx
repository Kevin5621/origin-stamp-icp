import React from "react";
import DashboardMain from "./DashboardMain";
import DashboardStats from "./DashboardStats";
import LoadingSkeleton from "./LoadingSkeleton";
import ToastContainer from "../common/ToastContainer";
import { useToast } from "../../hooks/useToast";
import { KaryaService } from "../../services/artService";
import { useEffect, useState } from "react";

interface ProjectStats {
  completedProjects: number;
  certificatesIssued: number;
  activeSessions: number;
  totalValue: number;
}

interface DashboardProps {
  isLoading?: boolean;
  onNewProject: () => void;
  onProjectClick: (karyaId: string) => void;
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onViewChange: (view: "list" | "grid") => void;
  onFilterChange: (filter: "all" | "active" | "completed") => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  isLoading: externalLoading,
  onNewProject,
  onProjectClick,
  onSearch,
  onSort,
  onViewChange,
  onFilterChange,
}) => {
  const { toasts, removeToast } = useToast();
  const [stats, setStats] = useState<ProjectStats>({
    completedProjects: 0,
    certificatesIssued: 0,
    activeSessions: 0,
    totalValue: 0,
  });
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "active" | "completed"
  >("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoadingStats(true);
        const userId = "user-001"; // TODO: Get from auth context
        const karyaStats = await KaryaService.getKaryaStats(userId);

        setStats({
          completedProjects: karyaStats.completed,
          certificatesIssued: karyaStats.completed, // Assuming completed projects have certificates
          activeSessions: karyaStats.active,
          totalValue: karyaStats.totalLogs * 100, // Mock value calculation
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  const handleFilterChange = (filter: "all" | "active" | "completed") => {
    setSelectedFilter(filter);
    onFilterChange(filter);
  };

  const handleViewChange = (view: "list" | "grid") => {
    setViewMode(view);
    onViewChange(view);
  };

  if (externalLoading || isLoadingStats) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-title-section">
            <h1 className="dashboard-title">Creator Dashboard</h1>
            <p className="dashboard-subtitle">
              Manage and monitor all your verification projects
            </p>
          </div>
        </div>
        <div className="dashboard-header-actions">
          <button
            onClick={onNewProject}
            className="btn-new-project"
            aria-label="Create new project"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="btn-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>New Project</span>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <DashboardStats stats={stats} />
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <DashboardMain
          selectedFilter={selectedFilter}
          viewMode={viewMode}
          onNewProject={onNewProject}
          onProjectClick={onProjectClick}
          onSearch={onSearch}
          onSort={onSort}
          onViewChange={handleViewChange}
          onFilterChange={handleFilterChange}
        />
      </main>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default Dashboard;
