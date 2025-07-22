import React from "react";
import SearchFilter from "./SearchFilter";
import QuickActions from "./QuickActions";
import FilterTabs from "./FilterTabs";
import ProjectsList from "./ProjectsList";
import { KaryaWithLogs } from "../../types/karya";

interface DashboardMainProps {
  projects: KaryaWithLogs[];
  selectedFilter: "all" | "active" | "completed";
  viewMode: "list" | "grid";
  onNewProject: () => void;
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
  onSearch,
  onSort,
  onViewChange,
  onFilterChange,
}) => {
  const handleSearch = (query: string) => {
    onSearch(query);
  };

  return (
    <>
      {/* Quick Actions Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
          <p className="section-subtitle">Quick access to main features</p>
        </div>
        <QuickActions onNewProject={onNewProject} />
      </div>

      {/* Projects Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Recent Projects</h2>
        </div>

        {/* Search and Filter */}
        <div className="projects-header">
          <SearchFilter
            onSearch={handleSearch}
            onSort={onSort}
            onViewChange={onViewChange}
            currentView={viewMode}
          />
        </div>

        {/* Filter Tabs */}
        <FilterTabs
          selectedFilter={selectedFilter}
          onFilterChange={onFilterChange}
        />

        {/* Projects List */}
        <ProjectsList projects={projects} onNewProject={onNewProject} />
      </div>
    </>
  );
};

export default DashboardMain;
