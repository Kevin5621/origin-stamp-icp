import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "../../hooks/useToast";
import Dashboard from "./Dashboard";
import type { ProjectStats, RecentProject } from "./index";

const DashboardContainer: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { success } = useToast();

  // State management
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<RecentProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "active" | "completed"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Mock data untuk stats
  const stats: ProjectStats = {
    completedProjects: 12,
    certificatesIssued: 8,
    activeSessions: 3,
    totalValue: 2500,
  };

  // Simulasi loading data
  useEffect(() => {
    const loadData = async () => {
      // Simulasi API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock data untuk projects
      const mockProjects: RecentProject[] = [
        {
          id: "1",
          title: "Digital Art Collection",
          status: "active",
          lastModified: new Date("2024-01-15"),
          progress: 75,
        },
        {
          id: "2",
          title: "Web Application",
          status: "completed",
          lastModified: new Date("2024-01-10"),
          progress: 100,
        },
        {
          id: "3",
          title: "Music Album",
          status: "draft",
          lastModified: new Date("2024-01-08"),
          progress: 25,
        },
      ];

      setRecentProjects(mockProjects);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Filter dan search projects
  useEffect(() => {
    let filtered = recentProjects.filter((project) => {
      // Filter berdasarkan status
      if (selectedFilter !== "all" && project.status !== selectedFilter) {
        return false;
      }

      // Filter berdasarkan search query
      if (
        searchQuery &&
        !project.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.lastModified.getTime() - a.lastModified.getTime();
        case "oldest":
          return a.lastModified.getTime() - b.lastModified.getTime();
        case "name":
          return a.title.localeCompare(b.title);
        case "progress":
          return b.progress - a.progress;
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  }, [recentProjects, selectedFilter, searchQuery, sortBy]);

  // Event handlers
  const handleNewProject = () => {
    success(t("new_project_created"));
    navigate("/session");
  };

  const handleProjectClick = (projectId: string) => {
    success(t("project_opened"));
    navigate(`/session/${projectId}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (sortBy: string) => {
    setSortBy(sortBy);
  };

  const handleViewChange = (view: "list" | "grid") => {
    setViewMode(view);
  };

  const handleFilterChange = (filter: "all" | "active" | "completed") => {
    setSelectedFilter(filter);
  };

  return (
    <Dashboard
      isLoading={isLoading}
      stats={stats}
      projects={filteredProjects}
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

export default DashboardContainer;
