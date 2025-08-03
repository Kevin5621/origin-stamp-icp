import React, { useState, useEffect } from "react";
import { Dashboard } from "../../components/dashboard";
import { KaryaService } from "../../services/artService";
import { KaryaWithLogs } from "../../types/karya";

const DashboardPage: React.FC = () => {
  // State untuk data
  const [stats, setStats] = useState({
    completedProjects: 0,
    certificatesIssued: 0,
    activeSessions: 0,
    totalValue: 0,
  });
  const [projects, setProjects] = useState<KaryaWithLogs[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data dari KaryaService
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const userId = "user-001"; // TODO: Get from auth context when implemented

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

  return (
    <Dashboard
      isLoading={isLoading}
      stats={stats}
      projects={projects}
    />
  );
};

export default DashboardPage;
