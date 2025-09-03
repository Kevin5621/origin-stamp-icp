// Export all services with environment configuration
export { backendService } from "./backendService";
export { googleAuthService } from "./googleAuth";
export { PhysicalArtService } from "./physicalArtService";
export { dashboardService } from "./dashboardService";
export { credentialAuthService } from "./credentialAuthService";
export { envService, env } from "./envService";

// Export default auth service
export { default as AuthService } from "./authService";

// Re-export types
export type { EnvironmentConfig } from "./envService";
export type { AuthResult, CredentialAuthConfig } from "./credentialAuthService";
