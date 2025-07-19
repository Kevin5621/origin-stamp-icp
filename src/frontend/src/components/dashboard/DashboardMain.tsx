import React from "react";
import SearchFilter from "./SearchFilter";
import QuickActions from "./QuickActions";
import FilterTabs from "./FilterTabs";
import ProjectsList from "./ProjectsList";

interface RecentProject {
  id: string;
  title: string;
  status: "active" | "completed" | "draft";
  lastModified: Date;
  progress: number;
}

interface DashboardMainProps {
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

const DashboardMain: React.FC<DashboardMainProps> = ({
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
  return (
    <>
      {/* Quick Actions Section */}
      <section className="content-section">
        <QuickActions onNewProject={onNewProject} />
      </section>

      {/* Projects Section */}
      <section className="content-section">
        <div className="section-header">
          <h3 className="section-title">Recent Projects</h3>
        </div>

        {/* Search and Filter */}
        <SearchFilter
          onSearch={onSearch}
          onSort={onSort}
          onViewChange={onViewChange}
          currentView={viewMode}
        />

        {/* Filter Tabs */}
        <FilterTabs
          selectedFilter={selectedFilter}
          onFilterChange={onFilterChange}
        />

        {/* Projects List */}
        <ProjectsList
          projects={projects}
          viewMode={viewMode}
          onProjectClick={onProjectClick}
          onNewProject={onNewProject}
        />
      </section>
    </>
  );
};

export default DashboardMain;
