import { envService } from "./envService";
import { backendService } from "./backendService";

/**
 * Credential Authentication Service
 * Handles username/password authentication using environment configuration
 */
export interface CredentialAuthConfig {
  backendCanisterId: string;
  network: string;
  isDevelopment: boolean;
}

export interface AuthResult {
  success: boolean;
  message: string;
  username?: string;
  error?: string;
}

export class CredentialAuthService {
  private static instance: CredentialAuthService;
  private readonly config: CredentialAuthConfig;

  private constructor() {
    const envConfig = envService.getConfig();
    this.config = {
      backendCanisterId: envConfig.canisters.backend,
      network: envConfig.dfx.network,
      isDevelopment: envConfig.app.isDevelopment,
    };

    this.logConfiguration();
  }

  public static getInstance(): CredentialAuthService {
    if (!CredentialAuthService.instance) {
      CredentialAuthService.instance = new CredentialAuthService();
    }
    return CredentialAuthService.instance;
  }

  private logConfiguration(): void {
    // Configuration logging removed for security
  }

  /**
   * Register a new user with username and password
   */
  public async registerUser(
    username: string,
    password: string,
  ): Promise<AuthResult> {
    try {
      if (!username || !password) {
        return {
          success: false,
          message: "Username and password are required",
          error: "MISSING_CREDENTIALS",
        };
      }

      if (!backendService.isAvailable()) {
        return {
          success: false,
          message: `Backend service not available. Canister ID: ${this.config.backendCanisterId}`,
          error: "BACKEND_UNAVAILABLE",
        };
      }

      const result = await backendService.registerUser(
        username,
        password,
      );

      return {
        success: result.success,
        message: result.message,
        username: result.username?.[0],
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
        error: "REGISTRATION_ERROR",
      };
    }
  }

  /**
   * Login user with username and password
   */
  public async loginUser(
    username: string,
    password: string,
  ): Promise<AuthResult> {
    try {
      if (!username || !password) {
        return {
          success: false,
          message: "Username and password are required",
          error: "MISSING_CREDENTIALS",
        };
      }

      if (!backendService.isAvailable()) {
        return {
          success: false,
          message: `Backend service not available. Canister ID: ${this.config.backendCanisterId}`,
          error: "BACKEND_UNAVAILABLE",
        };
      }

      const result = await backendService.login(username, password);

      return {
        success: result.success,
        message: result.message,
        username: result.username?.[0],
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
        error: "LOGIN_ERROR",
      };
    }
  }

  /**
   * Get backend configuration info
   */
  public getBackendInfo(): CredentialAuthConfig {
    return { ...this.config };
  }

  /**
   * Check if service is properly configured
   */
  public isConfigured(): boolean {
    return !!(
      this.config.backendCanisterId &&
      this.config.network &&
      backendService.isAvailable()
    );
  }

  /**
   * Validate environment configuration
   */
  public validateConfiguration(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.backendCanisterId) {
      errors.push("Backend canister ID is not configured");
    }

    if (!this.config.network) {
      errors.push("DFX network is not configured");
    }

    if (!backendService.isAvailable()) {
      errors.push("Backend service is not available");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const credentialAuthService = CredentialAuthService.getInstance();
