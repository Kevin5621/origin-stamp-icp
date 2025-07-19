import React from 'react';
import SearchFilter from './SearchFilter';
import QuickActionCard from './QuickActionCard';
import FilterTabs from './FilterTabs';
import ProjectsList from './ProjectsList';

interface RecentProject {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'draft';
  lastModified: Date;
  progress: number;
}

interface DashboardMainProps {
  projects: RecentProject[];
  selectedFilter: 'all' | 'active' | 'completed';
  viewMode: 'list' | 'grid';
  onNewProject: () => void;
  onProjectClick: (projectId: string) => void;
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onViewChange: (view: 'list' | 'grid') => void;
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
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
  onFilterChange
}) => {
  return (
    <>
      {/* Quick Actions Section */}
      <section className="content-section">
        <div className="section-header">
          <h3 className="section-title">Quick Actions</h3>
        </div>
        <div className="quick-actions">
          <QuickActionCard
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeWidth="2"/>
              </svg>
            }
            title="New Project"
            description="Create a new verification project"
            onClick={onNewProject}
          />
          
          <QuickActionCard
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4" strokeWidth="2"/>
                <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z" strokeWidth="2"/>
                <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z" strokeWidth="2"/>
              </svg>
            }
            title="Verify Work"
            description="Verify work authenticity"
            onClick={() => {}}
          />
          
          <QuickActionCard
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4" strokeWidth="2"/>
                <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z" strokeWidth="2"/>
                <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z" strokeWidth="2"/>
              </svg>
            }
            title="View Certificates"
            description="Manage issued certificates"
            onClick={() => {}}
          />
          
          <QuickActionCard
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 3v18h18" strokeWidth="2"/>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" strokeWidth="2"/>
              </svg>
            }
            title="Analytics"
            description="View statistics and reports"
            onClick={() => {}}
          />
        </div>
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