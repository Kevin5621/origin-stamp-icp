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
    icpLedger: string;
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
          this.getDefaultReplicaHost(),
        replicaPort: parseInt(
          this.getEnvVar("DFX_REPLICA_PORT", "NEXT_PUBLIC_DFX_REPLICA_PORT") ||
            "8080",
        ),
      },
      canisters: {
        backend:
          this.getEnvVar(
            "CANISTER_ID_BACKEND",
            "NEXT_PUBLIC_CANISTER_ID_BACKEND",
          ) || "uxrrr-q7777-77774-qaaaq-cai",
        frontend:
          this.getEnvVar(
            "CANISTER_ID_FRONTEND",
            "NEXT_PUBLIC_CANISTER_ID_FRONTEND",
          ) || "u6s2n-gx777-77774-qaaba-cai",
        primary: this.getEnvVar("CANISTER_ID") || "u6s2n-gx777-77774-qaaba-cai",
        icpLedger: this.getICPLedgerCanisterIdForNetwork(),
      },
      auth: {
        googleClientId:
          this.getEnvVar(
            "VITE_GOOGLE_CLIENT_ID",
            "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
          ) || this.getDefaultGoogleClientId(),
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

  /**
   * Get the default replica host based on environment
   */
  private getDefaultReplicaHost(): string {
    // Check if we're in browser environment
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;

      // If accessing from non-localhost, use current hostname for VM support
      if (hostname !== "localhost" && hostname !== "127.0.0.1") {
        console.log(`🔄 Using hostname for replica: ${hostname}`);
        return hostname;
      }
    }

    // Default to localhost
    return "127.0.0.1";
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

  /**
   * Get ICP Ledger canister ID based on network
   */
  private getICPLedgerCanisterIdForNetwork(): string {
    const network =
      this.getEnvVar("DFX_NETWORK", "NEXT_PUBLIC_DFX_NETWORK") || "local";

    // Return correct ICP Ledger canister ID based on network
    switch (network) {
      case "ic":
      case "mainnet":
        // Mainnet ICP Ledger
        return "rrkah-fqaaa-aaaaa-aaaaq-cai";
      case "local":
      case "testnet":
      default:
        // For local development, return a placeholder since we use mock balance
        // The actual ledger service will handle this gracefully
        return (
          this.getEnvVar("NEXT_PUBLIC_ICP_LEDGER_CANISTER_ID") ||
          "local-mock-ledger" // Placeholder for local development
        );
    }
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
   * Get ICP Ledger canister ID
   */
  public getICPLedgerCanisterId(): string {
    return this.config.canisters.icpLedger;
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

  /**
   * Validate Google OAuth configuration
   */
  public validateGoogleOAuthConfig(): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const clientId = this.config.auth.googleClientId;

    // Check if Google Client ID is present
    if (!clientId) {
      errors.push("Google Client ID is not configured");
    } else {
      // Validate Google Client ID format
      if (!clientId.includes(".apps.googleusercontent.com")) {
        errors.push(
          "Google Client ID format is invalid (should end with .apps.googleusercontent.com)",
        );
      }

      // Check if it's a development/example client ID (more generic check)
      if (this.isDevelopmentClientId(clientId)) {
        warnings.push(
          "Using development/example Google Client ID - please configure your own for production",
        );
      }

      // Check client ID length (Google client IDs are typically 39-40 characters before .apps.googleusercontent.com)
      const clientIdPart = clientId.split(".apps.googleusercontent.com")[0];
      if (
        clientIdPart &&
        (clientIdPart.length < 35 || clientIdPart.length > 45)
      ) {
        warnings.push(
          "Google Client ID length seems unusual - please verify it's correct",
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Check if the client ID appears to be a development/example ID
   * This is a more generic check that doesn't hardcode specific values
   */
  private isDevelopmentClientId(clientId: string): boolean {
    // Check for common development patterns
    const regexPatterns = [
      /^\d+-example/,
      /^\d+-dev/,
      /^\d+-test/,
      /^\d+-demo/,
    ];

    // Check regex patterns
    const matchesRegex = regexPatterns.some((pattern) =>
      pattern.test(clientId),
    );

    // Check if it's the same as the default fallback
    const isDefaultClientId = clientId === this.getDefaultGoogleClientId();

    return matchesRegex || isDefaultClientId;
  }

  /**
   * Get the default Google Client ID (used as fallback)
   * This is the only place where we reference the specific default value
   */
  private getDefaultGoogleClientId(): string {
    return "333774548009-b26h22g5nnemcbedv3btc4t6ddco5cv6.apps.googleusercontent.com";
  }

  /**
   * Get Google OAuth configuration status
   */
  public getGoogleOAuthStatus(): {
    configured: boolean;
    clientId: string;
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const validation = this.validateGoogleOAuthConfig();

    return {
      configured: !!this.config.auth.googleClientId,
      clientId: this.config.auth.googleClientId,
      isValid: validation.valid,
      errors: validation.errors,
      warnings: validation.warnings,
    };
  }
}

// Export singleton instance
export const envService = EnvironmentService.getInstance();

// Export configuration for direct access
export const env = envService.getConfig();
