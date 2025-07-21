import React, { useState, useEffect } from "react";
import Dashboard from "../../components/dashboard/Dashboard";
import { useNavigate } from "react-router-dom";
import type { ProjectStats } from "../../components/dashboard/index";
import { KaryaService } from "../../services/artService";
import { KaryaWithLogs } from "../../types/karya";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // State untuk data
  const [stats, setStats] = useState<ProjectStats>({
    completedProjects: 0,
    certificatesIssued: 0,
    activeSessions: 0,
    totalValue: 0,
  });
  const [projects, setProjects] = useState<KaryaWithLogs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "active" | "completed">("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  // Load data dari KaryaService
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const userId = "user-001"; // TODO: Get from auth context

        // Load stats
        const karyaStats = await KaryaService.getKaryaStats(userId);
        setStats({
          completedProjects: karyaStats.completed,
          certificatesIssued: karyaStats.completed, // Assuming completed projects have certificates
          activeSessions: karyaStats.active,
          totalValue: karyaStats.totalLogs * 100, // Mock value calculation
        });

        // Load projects langsung dari KaryaService
        const karyaData = await KaryaService.getKaryaByUser(userId);
        setProjects(karyaData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleNewProject = () => {
    // Navigate to session page untuk membuat project baru
    navigate("/session");
  };

  const handleProjectClick = (karyaId: string) => {
    // TODO: Navigate to project detail page
    console.log("Opening project:", karyaId);
    navigate(`/dashboard/project/${karyaId}`);
  };

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const handleSort = (sortBy: string) => {
    console.log("Sorting by:", sortBy);
  };

  const handleViewChange = (view: "list" | "grid") => {
    console.log("Changing view to:", view);
    setViewMode(view);
  };

  const handleFilterChange = (filter: "all" | "active" | "completed") => {
    console.log("Changing filter to:", filter);
    setSelectedFilter(filter);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Dashboard
      isLoading={isLoading}
      stats={stats}
      projects={projects}
      selectedFilter={selectedFilter}
      viewMode={viewMode}
      onNewProject={handleNewProject}
      onProjectClick={handleProjectClick}
      onSearch={handleSearch}
      onSort={handleSort}
      onViewChange={handleViewChange}
      onFilterChange={handleFilterChange}
    />
  );
};

export default DashboardPage;
