import React from "react";
import Dashboard from "../../components/dashboard/Dashboard";
import { useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

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
  };

  const handleFilterChange = (filter: "all" | "active" | "completed") => {
    console.log("Changing filter to:", filter);
  };

  return (
    <Dashboard
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
