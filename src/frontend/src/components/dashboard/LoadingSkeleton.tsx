import React from "react";

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="dashboard-layout">
      {/* Header Skeleton */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-title-section">
            <div
              className="skeleton-title"
              style={{ width: "200px", height: "28px" }}
            ></div>
            <div
              className="skeleton-subtitle"
              style={{ width: "300px", height: "16px" }}
            ></div>
          </div>
        </div>
        <div className="dashboard-header-actions">
          <div
            className="skeleton-title"
            style={{
              width: "120px",
              height: "40px",
              borderRadius: "var(--border-radius-md)",
            }}
          ></div>
        </div>
      </header>

      {/* Sidebar Skeleton */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-stats">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="loading-skeleton">
              <div className="skeleton-header">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-subtitle"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="dashboard-main">
        {/* Quick Actions Skeleton */}
        <div className="content-section">
          <div className="section-header">
            <div
              className="skeleton-title"
              style={{ width: "150px", height: "20px" }}
            ></div>
            <div
              className="skeleton-subtitle"
              style={{ width: "250px", height: "16px" }}
            ></div>
          </div>
          <div className="quick-actions">
            {[1, 2, 3].map((i) => (
              <div key={i} className="loading-skeleton">
                <div className="skeleton-header">
                  <div className="skeleton-avatar"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-subtitle"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section Skeleton */}
        <div className="content-section">
          <div className="section-header">
            <div
              className="skeleton-title"
              style={{ width: "140px", height: "20px" }}
            ></div>
          </div>

          {/* Search and Filter Skeleton */}
          <div className="projects-header">
            <div className="projects-controls">
              <div
                className="skeleton-title"
                style={{
                  width: "300px",
                  height: "40px",
                  borderRadius: "var(--border-radius-md)",
                }}
              ></div>
              <div
                className="skeleton-title"
                style={{
                  width: "120px",
                  height: "40px",
                  borderRadius: "var(--border-radius-md)",
                }}
              ></div>
              <div
                className="skeleton-title"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "var(--border-radius-md)",
                }}
              ></div>
            </div>
          </div>

          {/* Filter Tabs Skeleton */}
          <div className="filter-tabs">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="skeleton-title"
                style={{
                  width: "120px",
                  height: "40px",
                  borderRadius: "var(--border-radius-md)",
                }}
              ></div>
            ))}
          </div>

          {/* Projects Grid Skeleton */}
          <div className="projects-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="loading-skeleton">
                <div className="skeleton-header">
                  <div className="skeleton-content">
                    <div
                      className="skeleton-title"
                      style={{ width: "80%" }}
                    ></div>
                    <div
                      className="skeleton-subtitle"
                      style={{
                        width: "60px",
                        height: "24px",
                        borderRadius: "var(--border-radius-sm)",
                      }}
                    ></div>
                  </div>
                </div>
                <div
                  className="skeleton-title"
                  style={{
                    width: "100%",
                    height: "6px",
                    borderRadius: "var(--border-radius-sm)",
                    margin: "16px 0",
                  }}
                ></div>
                <div
                  className="skeleton-subtitle"
                  style={{ width: "70%" }}
                ></div>
                <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                  {[1, 2, 3, 4].map((j) => (
                    <div
                      key={j}
                      className="skeleton-subtitle"
                      style={{
                        width: "60px",
                        height: "28px",
                        borderRadius: "var(--border-radius-sm)",
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoadingSkeleton;
