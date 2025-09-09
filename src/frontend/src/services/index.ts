// Export all services with environment configuration
export { backendService } from "./backendService";
export { googleAuthService } from "./googleAuth";
export { PhysicalArtService } from "./physicalArtService";
export { dashboardService } from "./dashboardService";
export { credentialAuthService } from "./credentialAuthService";
export { envService, env } from "./envService";

// Export modular backend services
export { modularBackendService, backendServiceModular } from "./modularBackendService";

// Export modular service modules for direct access
export * from "./core";
export * from "./auth";
export * from "./user";
export * from "./physical";
export * from "./storage";
export * from "./subscription";
export * from "./nft";
export * from "./verification";
export * from "./dashboard";

// Export default auth service
export { default as AuthService } from "./authService";

// Re-export types
export type { EnvironmentConfig } from "./envService";
export type { AuthResult, CredentialAuthConfig } from "./credentialAuthService";
