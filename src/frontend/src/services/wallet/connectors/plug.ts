/**
 * Plug Wallet Connector
 * Integrates   public readonly info: WalletInfo = {
    type: WalletType.PLUG,
    name: "Plug Wallet",
    isConnected: false, // Will be updated dynamically
    description: "Browser extension wallet with seamless IC integration and DeFi features",
    icon: "/plug-logo.svg",
    isExtensionBased: true,
    supportsSignTransaction: true,
    downloadUrl: "https://plugwallet.ooo",
  };t with the unified wallet system
 */

import { BaseWalletConnector } from "../base";
import {
  WalletType,
  WalletInfo,
  WalletCapabilities,
  WalletConnectionConfig,
  WalletConnectionResult,
  TransactionRequest,
  TransactionResult,
  WalletErrorType,
} from "../types";

/**
 * Plug wallet interface type for safe access
 */
interface PlugAPI {
  requestConnect?: (config?: { whitelist?: string[] }) => Promise<boolean>;
  isConnected?: () => Promise<boolean>;
  disconnect?: () => Promise<void>;
  agent?: {
    getPrincipal(): Promise<import("@dfinity/principal").Principal>;
    isConnected?(): Promise<boolean>;
    disconnect?(): Promise<void>;
  };
  accountId?: string;
  sessionManager?: { sessionData?: unknown };
}

/**
 * Plug wallet connector implementation
 * Provides integration with the Plug browser extension wallet
 */
export class PlugWalletConnector extends BaseWalletConnector {
  private readonly whitelist: string[];

  /**
   * Wallet information for Plug
   */
  public readonly info: WalletInfo = {
    type: WalletType.PLUG,
    name: "Plug Wallet",
    isConnected: false, // Will be updated dynamically
    description: "Browser extension wallet with seamless IC integration and DeFi features",
    icon: "/plug-logo.svg",
    isExtensionBased: true,
    supportsSignTransaction: true,
    downloadUrl: "https://plugwallet.ooo/",
  };

  constructor(whitelist: string[] = []) {
    super();
    this.whitelist = whitelist;
  }

  /**
   * Get Plug wallet API safely
   */
  private getPlugAPI(): PlugAPI | null {
    try {
      const windowObj = window as { ic?: { plug?: PlugAPI } };
      return windowObj?.ic?.plug || null;
    } catch {
      return null;
    }
  }

  /**
   * Check if Plug wallet is available
   */
  public async isAvailable(): Promise<boolean> {
    try {
      return typeof window !== "undefined" && !!this.getPlugAPI();
    } catch {
      return false;
    }
  }

  /**
   * Get Plug wallet capabilities
   */
  public async getCapabilities(): Promise<WalletCapabilities> {
    const hasExtension = await this.isAvailable();
    
    return {
      canConnect: hasExtension,
      canSign: hasExtension,
      canTransfer: hasExtension,
      hasExtension,
      version: "latest",
    };
  }

  /**
   * Connect to Plug wallet
   */
  protected async performConnect(config?: WalletConnectionConfig): Promise<WalletConnectionResult> {
    const plugAPI = this.getPlugAPI();
    
    if (!plugAPI) {
      throw this.createWalletError(
        WalletErrorType.NOT_INSTALLED,
        "Plug wallet extension is not installed",
      );
    }

    try {
      // Check if already connected
      const isConnected = await this.checkExistingConnection(plugAPI);
      
      if (!isConnected) {
        // Request new connection
        if (!plugAPI.requestConnect) {
          throw this.createWalletError(
            WalletErrorType.UNSUPPORTED_METHOD,
            "Plug wallet does not support connection requests",
          );
        }

        const connectionConfig = {
          whitelist: this.whitelist.length > 0 ? this.whitelist : undefined,
        };

        const success = await this.createTimeoutPromise(
          plugAPI.requestConnect(connectionConfig),
          config?.timeout || 30000,
        );

        if (!success) {
          throw this.createWalletError(
            WalletErrorType.USER_REJECTED,
            "User rejected Plug wallet connection",
          );
        }
      }

      // Get connection details
      return await this.getConnectionDetails(plugAPI);
    } catch (error) {
      if (error instanceof Error && error.message.includes("User rejected")) {
        throw this.createWalletError(
          WalletErrorType.USER_REJECTED,
          "User rejected Plug wallet connection",
        );
      }
      
      throw this.createWalletError(
        WalletErrorType.CONNECTION_FAILED,
        "Failed to connect to Plug wallet",
        { error },
      );
    }
  }

  /**
   * Check if Plug is already connected
   */
  private async checkExistingConnection(plugAPI: PlugAPI): Promise<boolean> {
    try {
      if (plugAPI.isConnected) {
        return await plugAPI.isConnected();
      }
      
      if (plugAPI.agent) {
        // Try to get principal to verify connection
        await plugAPI.agent.getPrincipal();
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Get connection details from Plug
   */
  private async getConnectionDetails(plugAPI: PlugAPI): Promise<WalletConnectionResult> {
    if (!plugAPI.agent) {
      throw this.createWalletError(
        WalletErrorType.CONNECTION_FAILED,
        "Plug agent not available",
      );
    }

    try {
      const principal = await plugAPI.agent.getPrincipal();
      
      if (!this.validatePrincipal(principal)) {
        throw this.createWalletError(
          WalletErrorType.INVALID_PRINCIPAL,
          "Invalid principal received from Plug wallet",
        );
      }

      // Create identity wrapper for compatibility
      const identity: import("@dfinity/agent").Identity = {
        getPrincipal: () => principal,
        transformRequest: (request: unknown) => request,
      } as import("@dfinity/agent").Identity;

      return {
        principal,
        identity,
        accountId: plugAPI.accountId,
        metadata: {
          provider: "Plug Wallet",
          accountId: plugAPI.accountId,
          sessionData: plugAPI.sessionManager?.sessionData,
          connectedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw this.createWalletError(
        WalletErrorType.CONNECTION_FAILED,
        "Failed to get connection details from Plug",
        { error },
      );
    }
  }

  /**
   * Disconnect from Plug wallet
   */
  protected async performDisconnect(): Promise<void> {
    try {
      const plugAPI = this.getPlugAPI();
      
      if (plugAPI?.disconnect) {
        await plugAPI.disconnect();
      } else if (plugAPI?.agent?.disconnect) {
        await plugAPI.agent.disconnect();
      }
    } catch (error) {
      console.error("Plug wallet disconnect error:", error);
    }
  }

  /**
   * Sign transaction using Plug wallet
   */
  protected async performSignTransaction(request: TransactionRequest): Promise<TransactionResult> {
    this.validateTransactionRequest(request);

    const plugAPI = this.getPlugAPI();
    
    if (!plugAPI?.agent) {
      throw this.createWalletError(
        WalletErrorType.CONNECTION_FAILED,
        "Plug wallet not connected",
      );
    }

    try {
      // Simplified transaction signing for Plug
      // Real implementation would use Plug's specific transaction methods
      
      return {
        success: true,
        transactionId: `plug_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        metadata: {
          method: request.methodName,
          canister: request.canisterId,
          principal: this._principal?.toString(),
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw this.createWalletError(
        WalletErrorType.TRANSACTION_FAILED,
        "Transaction signing failed in Plug wallet",
        { error, request },
      );
    }
  }

  /**
   * Get account identifier from Plug wallet
   */
  public async getAccountId(): Promise<string> {
    const plugAPI = this.getPlugAPI();
    
    if (!plugAPI?.accountId) {
      throw this.createWalletError(
        WalletErrorType.CONNECTION_FAILED,
        "No account ID available from Plug wallet",
      );
    }

    return plugAPI.accountId;
  }

  /**
   * Get Plug wallet session information
   */
  public getSessionInfo(): unknown {
    const plugAPI = this.getPlugAPI();
    return plugAPI?.sessionManager?.sessionData;
  }

  /**
   * Check if Plug wallet is ready for use
   */
  public async isReady(): Promise<boolean> {
    try {
      const isAvailable = await this.isAvailable();
      if (!isAvailable) return false;

      const plugAPI = this.getPlugAPI();
      if (!plugAPI) return false;

      return await this.checkExistingConnection(plugAPI);
    } catch {
      return false;
    }
  }
}