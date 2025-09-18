/**
 * User services exports
 */

export * from "./userManagement";
export { avatarService, AvatarService } from "./avatar";
export type { AvatarOptions } from "./avatar";
export { profileService } from "./profileService";
export type {
  UpdateProfileRequest,
  ProfileUpdateResult,
  UserProfile,
} from "./profileService";
export { activityService } from "./activityService";
export type {
  UserActivity,
  UserDashboardData,
  UserDashboardMetrics,
  UserChartData,
  ChartDataPoint,
  UserPerformanceStats,
} from "./activityService";
export { locationService } from "./locationService";
export type { LocationOption, LocationSearchParams } from "./locationService";
