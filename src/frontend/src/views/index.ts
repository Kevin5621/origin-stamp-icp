// Export all views from a single entry point
export { default as LandingView } from "./LandingView";
export { default as DashboardView } from "./DashboardView";
export { default as SessionView } from "./SessionView";
export { default as FinalizationView } from "./FinalizationView";
export { default as VerificationView } from "./VerificationView";

// Export types for views
export type ViewType =
  | "landing"
  | "dashboard"
  | "session"
  | "finalization"
  | "verification";

// Export common view props interface
export interface ViewProps {
  onNavigate: (view: ViewType) => void;
}
