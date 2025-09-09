/**
 * Environment Configuration Module
 * Centralizes environment variable management for the OriginStamp application
 */

export interface EnvironmentConfig {
  dfx: {
    version: string;
    network: string;
    candidPathBackend: string;
    candidPath: string;
    replicaHost: string;
    replicaPort: number;
  };
  canisters: {
    backend: string;
    frontend: string;
    primary: string;
  };
  auth: {
    googleClientId: string;
    internetIdentityUrl: string;
  };
  s3: {
    accessKey: string;
    secretKey: string;
    region: string;
    bucketName: string;
  };
  app: {
    env: string;
    url: string;
    isDevelopment: boolean;
    isProduction: boolean;
  };
}

/**
 * Environment service that provides a unified interface for accessing environment variables
 */
export class EnvironmentService {
  private static instance: EnvironmentService;
  private readonly config: EnvironmentConfig;

  private constructor() {
    this.config = this.initializeConfig();
  }

  public static getInstance(): EnvironmentService {
    if (!EnvironmentService.instance) {
      EnvironmentService.instance = new EnvironmentService();
    }
    return EnvironmentService.instance;
  }

  private initializeConfig(): EnvironmentConfig {
    return {
      dfx: {
        version:
          this.getEnvVar("DFX_VERSION", "NEXT_PUBLIC_DFX_VERSION") || "0.25.0",
        network:
          this.getEnvVar("DFX_NETWORK", "NEXT_PUBLIC_DFX_NETWORK") || "local",
        candidPathBackend:
          this.getEnvVar("CANISTER_CANDID_PATH_BACKEND") ||
          "/home/kevin/Documents/origin-stamp-icp/src/backend/backend.did",
        candidPath:
          this.getEnvVar("CANISTER_CANDID_PATH") ||
          "/home/kevin/Documents/origin-stamp-icp/.dfx/local/canisters/frontend/assetstorage.did",
        replicaHost:
          this.getEnvVar("DFX_REPLICA_HOST", "NEXT_PUBLIC_DFX_REPLICA_HOST") ||
          "127.0.0.1",
        replicaPort: parseInt(
          this.getEnvVar("DFX_REPLICA_PORT", "NEXT_PUBLIC_DFX_REPLICA_PORT") ||
            "4943",
        ),
      },
      canisters: {
        backend:
          this.getEnvVar(
            "CANISTER_ID_BACKEND",
            "NEXT_PUBLIC_CANISTER_ID_BACKEND",
          ) || "bkyz2-fmaaa-aaaaa-qaaaq-cai",
        frontend:
          this.getEnvVar(
            "CANISTER_ID_FRONTEND",
            "NEXT_PUBLIC_CANISTER_ID_FRONTEND",
          ) || "bd3sg-teaaa-aaaaa-qaaba-cai",
        primary: this.getEnvVar("CANISTER_ID") || "bd3sg-teaaa-aaaaa-qaaba-cai",
      },
      auth: {
        googleClientId:
          this.getEnvVar(
            "VITE_GOOGLE_CLIENT_ID",
            "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
          ) ||
          "333774548009-b26h22g5nnemcbedv3btc4t6ddco5cv6.apps.googleusercontent.com",
        internetIdentityUrl:
          this.getEnvVar("NEXT_PUBLIC_INTERNET_IDENTITY_URL") ||
          "https://identity.ic0.app",
      },
      s3: {
        accessKey:
          this.getEnvVar("S3_ACCESS_KEY", "NEXT_PUBLIC_S3_ACCESS_KEY") || "",
        secretKey:
          this.getEnvVar("S3_SECRET_KEY", "NEXT_PUBLIC_S3_SECRET_KEY") || "",
        region:
          this.getEnvVar("S3_REGION", "NEXT_PUBLIC_S3_REGION") ||
          "ap-southeast-1",
        bucketName:
          this.getEnvVar("S3_BUCKET_NAME", "NEXT_PUBLIC_S3_BUCKET_NAME") ||
          "originstamp",
      },
      app: {
        env: this.getEnvVar("NODE_ENV", "NEXT_PUBLIC_APP_ENV") || "development",
        url: this.getEnvVar("NEXT_PUBLIC_APP_URL") || "http://localhost:3000",
        isDevelopment:
          (this.getEnvVar("NODE_ENV") || "development") === "development",
        isProduction:
          (this.getEnvVar("NODE_ENV") || "development") === "production",
      },
    };
  }

  private getEnvVar(...keys: string[]): string | undefined {
    for (const key of keys) {
      const value = process.env[key];
      if (value) {
        return value;
      }
    }
    return undefined;
  }

  private logConfiguration(): void {
    // Configuration logging removed for security
  }

  /**
   * Get the complete environment configuration
   */
  public getConfig(): EnvironmentConfig {
    return { ...this.config };
  }

  /**
   * Get DFX configuration
   */
  public getDfxConfig() {
    return { ...this.config.dfx };
  }

  /**
   * Get canister configuration
   */
  public getCanisterConfig() {
    return { ...this.config.canisters };
  }

  /**
   * Get authentication configuration
   */
  public getAuthConfig() {
    return { ...this.config.auth };
  }

  /**
   * Get S3 configuration
   */
  public getS3Config() {
    return { ...this.config.s3 };
  }

  /**
   * Get app configuration
   */
  public getAppConfig() {
    return { ...this.config.app };
  }

  /**
   * Check if running in development mode
   */
  public isDevelopment(): boolean {
    return this.config.app.isDevelopment;
  }

  /**
   * Check if running in production mode
   */
  public isProduction(): boolean {
    return this.config.app.isProduction;
  }

  /**
   * Get backend canister ID
   */
  public getBackendCanisterId(): string {
    return this.config.canisters.backend;
  }

  /**
   * Get frontend canister ID
   */
  public getFrontendCanisterId(): string {
    return this.config.canisters.frontend;
  }

  /**
   * Get Google Client ID
   */
  public getGoogleClientId(): string {
    return this.config.auth.googleClientId;
  }

  /**
   * Get DFX network
   */
  public getDfxNetwork(): string {
    return this.config.dfx.network;
  }

  /**
   * Check if running on IC mainnet
   */
  public isMainnet(): boolean {
    return this.config.dfx.network === "ic";
  }

  /**
   * Check if running on local DFX replica
   */
  public isLocalNetwork(): boolean {
    return this.config.dfx.network === "local";
  }

  /**
   * Validate configuration and throw errors for missing critical values
   */
  public validateConfiguration(): void {
    const errors: string[] = [];

    if (!this.config.canisters.backend) {
      errors.push("Backend canister ID is missing");
    }

    if (!this.config.auth.googleClientId) {
      errors.push("Google Client ID is missing");
    }

    if (!this.config.s3.bucketName) {
      errors.push("S3 bucket name is missing");
    }

    if (errors.length > 0) {
      throw new Error(`Environment configuration errors: ${errors.join(", ")}`);
    }
  }
}

// Export singleton instance
export const envService = EnvironmentService.getInstance();

// Export configuration for direct access
export const env = envService.getConfig();
