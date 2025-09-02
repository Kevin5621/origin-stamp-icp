// Route Types untuk sistem routing modular
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  layout?: React.ComponentType;
  isProtected?: boolean;
  title?: string;
  meta?: {
    requiresAuth?: boolean;
    roles?: string[];
    permissions?: string[];
  };
}

export interface RouteGroup {
  name: string;
  routes: RouteConfig[];
  layout?: React.ComponentType;
}

// Route Names untuk type safety
export type RouteName =
  | "landing"
  | "login"
  | "dashboard"
  | "session"
  | "finalization"
  | "verification";

// Route Parameters
export interface RouteParams {
  [key: string]: string | number;
}

// Navigation State
export interface NavigationState {
  from?: string;
  to?: string;
  replace?: boolean;
}
