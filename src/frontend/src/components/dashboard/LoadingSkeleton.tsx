import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <section className="dashboard-section" aria-labelledby="dashboard-title">
      <div className="dashboard-layout">
        {/* Header Skeleton */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
          </div>
          <div className="skeleton" style={{ width: '120px', height: '40px', borderRadius: '1rem' }}></div>
        </header>

        {/* Sidebar Skeleton */}
        <aside className="dashboard-sidebar">
          <div className="dashboard-stats">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-card">
                <div className="stat-header">
                  <div className="skeleton skeleton-avatar"></div>
                </div>
                <div className="skeleton" style={{ width: '60%', height: '32px', borderRadius: '4px', margin: '0.5rem 0' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="dashboard-main">
          {/* Quick Actions Skeleton */}
          <section className="content-section">
            <div className="section-header">
              <div className="skeleton skeleton-title" style={{ width: '40%' }}></div>
            </div>
            <div className="quick-actions">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="quick-action-card">
                  <div className="skeleton skeleton-avatar"></div>
                  <div className="action-content">
                    <div className="skeleton skeleton-text"></div>
                    <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Projects Section Skeleton */}
          <section className="content-section">
            <div className="section-header">
              <div className="skeleton skeleton-title" style={{ width: '35%' }}></div>
            </div>
            
            {/* Search and Filter Skeleton */}
            <div className="search-filter-section">
              <div className="skeleton" style={{ width: '300px', height: '40px', borderRadius: '0.75rem' }}></div>
              <div className="skeleton" style={{ width: '120px', height: '40px', borderRadius: '0.75rem' }}></div>
            </div>

            {/* Filter Tabs Skeleton */}
            <div className="filter-tabs">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ width: '80px', height: '32px', borderRadius: '0.75rem' }}></div>
              ))}
            </div>

            {/* Projects List Skeleton */}
            <div className="projects-list">
              {[1, 2, 3].map((i) => (
                <div key={i} className="project-card">
                  <div className="project-header">
                    <div className="skeleton skeleton-title" style={{ width: '70%' }}></div>
                    <div className="skeleton" style={{ width: '60px', height: '20px', borderRadius: '12px' }}></div>
                  </div>
                  <div className="project-progress">
                    <div className="skeleton" style={{ flex: 1, height: '8px', borderRadius: '4px' }}></div>
                    <div className="skeleton" style={{ width: '40px', height: '16px', borderRadius: '4px' }}></div>
                  </div>
                  <div className="project-meta">
                    <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </section>
  );
};

export default LoadingSkeleton; 