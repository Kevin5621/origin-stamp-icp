/**
 * Stoic Wallet Connector
 * Integrates Stoic wallet with the unified wallet system
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
 * Stoic wallet identity interface
 */
interface StoicIdentity {
  getPrincipal(): import("@dfinity/principal").Principal;
  accounts: string[];
  disconnect(): Promise<void>;
}

/**
 * Stoic wallet connector implementation
 * Provides integration with the Stoic web-based wallet
 */
export class StoicWalletConnector extends BaseWalletConnector {
  private stoicIdentity: StoicIdentity | null = null;
  
  /**
   * Wallet information for Stoic
   */
  public readonly info: WalletInfo = {
    type: WalletType.STOIC,
    name: "Stoic Wallet",
    isConnected: false, // Will be updated dynamically
    description: "Web-based wallet with no installation required - simple and secure",
    icon: "/stoic-logo.svg",
    isExtensionBased: false,
    supportsSignTransaction: true,
    downloadUrl: "https://www.stoicwallet.com",
  };

  /**
   * Check if Stoic wallet is available
   */
  public async isAvailable(): Promise<boolean> {
    try {
      // Stoic is web-based and always available
      return typeof window !== "undefined";
    } catch {
      return false;
    }
  }

  /**
   * Get Stoic wallet capabilities
   */
  public async getCapabilities(): Promise<WalletCapabilities> {
    return {
      canConnect: true,
      canSign: true,
      canTransfer: true,
      hasExtension: false, // Web-based, no extension needed
      version: "1.0.0",
    };
  }

  /**
   * Connect to Stoic wallet
   * Note: This is a placeholder implementation
   * Real implementation would integrate with Stoic's authentication system
   */
  protected async performConnect(_config?: WalletConnectionConfig): Promise<WalletConnectionResult> {
    try {
      // Placeholder implementation for Stoic wallet connection
      // In a real implementation, this would:
      // 1. Open Stoic wallet connection dialog
      // 2. Handle user authentication
      // 3. Return identity and principal
      
      throw this.createWalletError(
        WalletErrorType.UNSUPPORTED_METHOD,
        "Stoic wallet integration requires additional setup - please contact support",
      );
    } catch (error) {
      throw this.createWalletError(
        WalletErrorType.CONNECTION_FAILED,
        "Stoic wallet connection not yet implemented",
        { error },
      );
    }
  }

  /**
   * Create connection result from Stoic identity
   */
  private createConnectionResult(): WalletConnectionResult {
    if (!this.stoicIdentity) {
      throw new Error("Stoic identity not available");
    }

    const principal = this.stoicIdentity.getPrincipal();

    if (!this.validatePrincipal(principal)) {
      throw this.createWalletError(
        WalletErrorType.INVALID_PRINCIPAL,
        "Invalid principal received from Stoic wallet",
      );
    }

    return {
      principal,
      identity: {
        ...this.stoicIdentity,
        transformRequest: (request: unknown) => request,
      } as import("@dfinity/agent").Identity,
      accountId: this.stoicIdentity.accounts?.[0],
      metadata: {
        provider: "Stoic Wallet",
        accounts: this.stoicIdentity.accounts,
        connectedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Disconnect from Stoic wallet
   */
  protected async performDisconnect(): Promise<void> {
    try {
      if (this.stoicIdentity?.disconnect) {
        await this.stoicIdentity.disconnect();
      }
      this.stoicIdentity = null;
    } catch (error) {
      console.error("Stoic wallet disconnect error:", error);
    }
  }

  /**
   * Sign transaction using Stoic wallet
   */
  protected async performSignTransaction(request: TransactionRequest): Promise<TransactionResult> {
    this.validateTransactionRequest(request);

    if (!this.stoicIdentity) {
      throw this.createWalletError(
        WalletErrorType.CONNECTION_FAILED,
        "Stoic wallet not connected",
      );
    }

    try {
      // Stoic wallet transaction signing placeholder
      return {
        success: true,
        transactionId: `stoic_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
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
        "Transaction signing failed in Stoic wallet",
        { error, request },
      );
    }
  }

  /**
   * Get account identifier from Stoic wallet
   */
  public async getAccountId(): Promise<string> {
    if (!this.stoicIdentity?.accounts?.[0]) {
      throw this.createWalletError(
        WalletErrorType.CONNECTION_FAILED,
        "No account ID available from Stoic wallet",
      );
    }

    return this.stoicIdentity.accounts[0];
  }

  /**
   * Get all accounts from Stoic wallet
   */
  public getAccounts(): string[] {
    return this.stoicIdentity?.accounts || [];
  }

  /**
   * Check if Stoic wallet is ready for use
   */
  public async isReady(): Promise<boolean> {
    try {
      const isAvailable = await this.isAvailable();
      if (!isAvailable) return false;

      return !!this.stoicIdentity;
    } catch {
      return false;
    }
  }
}