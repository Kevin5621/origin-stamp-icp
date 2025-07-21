import React from "react";
import DashboardMain from "./DashboardMain";
import DashboardStats from "./DashboardStats";
import LoadingSkeleton from "./LoadingSkeleton";
import ToastContainer from "../common/ToastContainer";
import { useToast } from "../../hooks/useToast";

interface ProjectStats {
  completedProjects: number;
  certificatesIssued: number;
  activeSessions: number;
  totalValue: number;
}

interface RecentProject {
  id: string;
  title: string;
  status: "active" | "completed" | "draft";
  lastModified: Date;
  progress: number;
}

interface DashboardProps {
  isLoading: boolean;
  stats: ProjectStats;
  projects: RecentProject[];
  selectedFilter: "all" | "active" | "completed";
  viewMode: "list" | "grid";
  onNewProject: () => void;
  onProjectClick: (projectId: string) => void;
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onViewChange: (view: "list" | "grid") => void;
  onFilterChange: (filter: "all" | "active" | "completed") => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  isLoading,
  stats,
  projects,
  selectedFilter,
  viewMode,
  onNewProject,
  onProjectClick,
  onSearch,
  onSort,
  onViewChange,
  onFilterChange,
}) => {
  const { toasts, removeToast } = useToast();

  if (isLoading) {
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
          projects={projects}
          selectedFilter={selectedFilter}
          viewMode={viewMode}
          onNewProject={onNewProject}
          onProjectClick={onProjectClick}
          onSearch={onSearch}
          onSort={onSort}
          onViewChange={onViewChange}
          onFilterChange={onFilterChange}
        />
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default Dashboard;
