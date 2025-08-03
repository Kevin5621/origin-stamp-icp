// src/frontend/src/components/dashboard/index.ts
export { default as Dashboard } from "./Dashboard";

// Types
export interface DashboardStats {
  completedProjects: number;
  certificatesIssued: number;
  activeSessions: number;
  totalValue: number;
}
