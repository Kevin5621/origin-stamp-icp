import React, { useEffect, useState } from "react";
import SearchFilter from "./SearchFilter";
import QuickActions from "./QuickActions";
import FilterTabs from "./FilterTabs";
import ProjectsList from "./ProjectsList";
import { KaryaWithLogs, KaryaFilter } from "../../types/karya";
import { KaryaService } from "../../services/artService";

interface DashboardMainProps {
  selectedFilter: "all" | "active" | "completed";
  viewMode: "list" | "grid";
  onNewProject: () => void;
  onProjectClick: (karyaId: string) => void;
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onViewChange: (view: "list" | "grid") => void;
  onFilterChange: (filter: "all" | "active" | "completed") => void;
}

const DashboardMain: React.FC<DashboardMainProps> = ({
  selectedFilter,
  viewMode,
  onNewProject,
  onProjectClick,
  onSearch,
  onSort,
  onViewChange,
  onFilterChange,
}) => {
  const [projects, setProjects] = useState<KaryaWithLogs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Load projects from KaryaService
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        const userId = "user-001"; // TODO: Get from auth context

        // Convert filter to KaryaFilter
        const filter: KaryaFilter = {};
        if (selectedFilter !== "all") {
          filter.status = selectedFilter as "draft" | "active" | "completed";
        }
        if (searchQuery) {
          filter.search = searchQuery;
        }

        const karyaData = await KaryaService.getKaryaByUser(userId, filter);
        setProjects(karyaData);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [selectedFilter, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat karya...</p>
      </div>
    );
  }

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
        <ProjectsList
          projects={projects}
          onProjectClick={onProjectClick}
          onNewProject={onNewProject}
        />
      </div>
    </>
  );
};

export default DashboardMain;
