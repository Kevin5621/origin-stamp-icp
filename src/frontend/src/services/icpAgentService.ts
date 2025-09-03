import { HttpAgent, Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { envService } from "./envService";

/**
 * ICP Agent Service for managing Internet Computer Protocol connections
 */
export class ICPAgentService {
  private static instance: ICPAgentService;
  private agent: HttpAgent | null = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): ICPAgentService {
    if (!ICPAgentService.instance) {
      ICPAgentService.instance = new ICPAgentService();
    }
    return ICPAgentService.instance;
  }

  /**
   * Initialize the ICP agent with proper configuration
   */
  public async initialize(): Promise<void> {
    // Skip initialization during server-side rendering
    if (typeof window === "undefined") {
      return;
    }

    if (this.isInitialized && this.agent) {
      return;
    }

    const envConfig = envService.getConfig();

    try {
      // Configure agent options based on network
      const agentOptions: Record<string, unknown> = {};

      if (envService.isLocalNetwork()) {
        // Local development configuration
        const replicaUrl = `http://${envConfig.dfx.replicaHost}:${envConfig.dfx.replicaPort}`;
        agentOptions.host = replicaUrl;
        agentOptions.verifyQuerySignatures = false;
      } else {
        // Mainnet or other network
        agentOptions.host = "https://ic0.app";
        agentOptions.verifyQuerySignatures = true;
      }

      // Create the agent
      this.agent = new HttpAgent(agentOptions);

      // Fetch root key for certificate validation during development
      if (envService.isLocalNetwork()) {
        try {
          await this.agent.fetchRootKey();
        } catch (err) {
          console.error("Failed to fetch root key:", err);
          throw new Error(
            "Failed to connect to local DFX replica. Please ensure DFX is running with 'dfx start'",
          );
        }
      }

      this.isInitialized = true;
    } catch (error) {
      console.error("❌ ICP Agent initialization failed:", error);
      throw error;
    }
  }

  /**
   * Get the initialized agent
   */
  public async getAgent(): Promise<HttpAgent> {
    // Skip during server-side rendering
    if (typeof window === "undefined") {
      throw new Error(
        "ICP Agent cannot be initialized during server-side rendering",
      );
    }

    if (!this.isInitialized || !this.agent) {
      await this.initialize();
    }

    if (!this.agent) {
      throw new Error("ICP Agent failed to initialize");
    }

    return this.agent;
  }

  /**
   * Create an actor for a specific canister
   */
  public async createActor<T>(
    canisterId: string | Principal,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    idlFactory: any,
    options: Record<string, unknown> = {},
  ): Promise<T> {
    const agent = await this.getAgent();

    const principalId =
      typeof canisterId === "string"
        ? Principal.fromText(canisterId)
        : canisterId;

    return Actor.createActor<T>(idlFactory, {
      agent,
      canisterId: principalId,
      ...options,
    });
  }

  /**
   * Get the backend canister actor
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getBackendActor<T>(idlFactory: any): Promise<T> {
    const backendCanisterId = envService.getBackendCanisterId();

    if (!backendCanisterId) {
      throw new Error("Backend canister ID not configured");
    }

    return this.createActor<T>(backendCanisterId, idlFactory);
  }

  /**
   * Check if the agent is properly initialized and connected
   */
  public async isConnected(): Promise<boolean> {
    try {
      if (!this.agent) {
        return false;
      }

      // Try to get the status to check connectivity
      await this.agent.status();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get connection status and details
   */
  public async getConnectionStatus(): Promise<{
    connected: boolean;
    network: string;
    host: string;
    backendCanisterId: string;
    error?: string;
  }> {
    const envConfig = envService.getConfig();

    try {
      const connected = await this.isConnected();

      return {
        connected,
        network: envConfig.dfx.network,
        host: envService.isLocalNetwork()
          ? `http://${envConfig.dfx.replicaHost}:${envConfig.dfx.replicaPort}`
          : "https://ic0.app",
        backendCanisterId: envConfig.canisters.backend,
      };
    } catch (error) {
      return {
        connected: false,
        network: envConfig.dfx.network,
        host: envService.isLocalNetwork()
          ? `http://${envConfig.dfx.replicaHost}:${envConfig.dfx.replicaPort}`
          : "https://ic0.app",
        backendCanisterId: envConfig.canisters.backend,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Reset the agent (useful for network changes)
   */
  public reset(): void {
    this.agent = null;
    this.isInitialized = false;
  }
}

// Export singleton instance
export const icpAgentService = ICPAgentService.getInstance();
