// Dashboard Components
export { default as Dashboard } from "./Dashboard";
export { default as DashboardContainer } from "./DashboardContainer";
export { default as DashboardHeader } from "./DashboardHeader";
export { default as DashboardMain } from "./DashboardMain";
export { default as DashboardStats } from "./DashboardStats";
export { default as LoadingSkeleton } from "./LoadingSkeleton";

// Dashboard Sub-components
export { default as SearchFilter } from "./SearchFilter";
export { default as FilterTabs } from "./FilterTabs";
export { default as QuickActions } from "./QuickActions";
export { default as QuickActionCard } from "./QuickActionCard";
export { default as ProjectsList } from "./ProjectsList";
export { default as ProjectCard } from "./ProjectCard";
export { default as StatCard } from "./StatCard";
export { default as EmptyState } from "./EmptyState";

// Types
export interface ProjectStats {
  completedProjects: number;
  certificatesIssued: number;
  activeSessions: number;
  totalValue: number;
}

export interface RecentProject {
  id: string;
  title: string;
  status: "active" | "completed" | "draft";
  lastModified: Date;
  progress: number;
}
