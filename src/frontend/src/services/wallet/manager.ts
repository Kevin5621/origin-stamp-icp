/**
 * Wallet Manager
 * Central coordination service for all wallet operations in OriginStamp
 */

import { InternetIdentityConnector } from "./connectors/internetIdentity";
import {
  WalletType,
  WalletConnector,
  WalletManager,
  WalletConnectionConfig,
  WalletConnectionResult,
  WalletSession,
  WalletEventType,
  WalletEvent,
  WalletStorage,
  WalletErrorType,
  WalletError,
  WalletInfo,
} from "./types";

/**
 * Local storage implementation for wallet persistence
 */
class LocalWalletStorage implements WalletStorage {
  private readonly sessionKey = "originstamp_wallet_session";
  private readonly preferencesKey = "originstamp_wallet_preferences";

  async storeSession(session: WalletSession): Promise<void> {
    try {
      localStorage.setItem(
        this.sessionKey,
        JSON.stringify({
          ...session,
          connectedAt: session.connectedAt.toISOString(),
          lastActivity: session.lastActivity.toISOString(),
        }),
      );
    } catch (error) {
      console.error("Failed to store wallet session:", error);
    }
  }

  async getSession(): Promise<WalletSession | null> {
    try {
      const sessionData = localStorage.getItem(this.sessionKey);
      if (!sessionData) return null;

      const parsed = JSON.parse(sessionData);
      return {
        ...parsed,
        connectedAt: new Date(parsed.connectedAt),
        lastActivity: new Date(parsed.lastActivity),
      };
    } catch (error) {
      console.error("Failed to get wallet session:", error);
      return null;
    }
  }

  async clearSession(): Promise<void> {
    try {
      localStorage.removeItem(this.sessionKey);
    } catch (error) {
      console.error("Failed to clear wallet session:", error);
    }
  }

  async storePreferences(
    type: WalletType,
    preferences: Record<string, unknown>,
  ): Promise<void> {
    try {
      const allPrefs = this.getAllPreferences();
      allPrefs[type] = preferences;
      localStorage.setItem(this.preferencesKey, JSON.stringify(allPrefs));
    } catch (error) {
      console.error("Failed to store wallet preferences:", error);
    }
  }

  async getPreferences(
    type: WalletType,
  ): Promise<Record<string, unknown> | null> {
    try {
      const allPrefs = this.getAllPreferences();
      return allPrefs[type] || null;
    } catch (error) {
      console.error("Failed to get wallet preferences:", error);
      return null;
    }
  }

  private getAllPreferences(): Record<string, Record<string, unknown>> {
    try {
      const prefsData = localStorage.getItem(this.preferencesKey);
      return prefsData ? JSON.parse(prefsData) : {};
    } catch {
      return {};
    }
  }
}

/**
 * Main wallet manager implementation
 * Coordinates all wallet operations and maintains state
 */
export class OriginStampWalletManager implements WalletManager {
  private readonly wallets = new Map<WalletType, WalletConnector>();
  private readonly eventListeners = new Map<
    WalletEventType,
    Array<(event: WalletEvent) => void>
  >();
  private readonly storage: WalletStorage;
  private currentWallet: WalletConnector | null = null;
  private currentSession: WalletSession | null = null;

  constructor(storage?: WalletStorage) {
    this.storage = storage || new LocalWalletStorage();
    this.initializeWallets();
    this.setupEventHandling();
  }

  /**
   * Initialize all supported wallet connectors
   * Production: Only Internet Identity for security and reliability
   */
  private initializeWallets(): void {
    // Internet Identity - DFINITY's official solution (production-ready)
    this.wallets.set(
      WalletType.INTERNET_IDENTITY,
      new InternetIdentityConnector(),
    );
  }

  /**
   * Setup event handling for all wallets
   */
  private setupEventHandling(): void {
    this.wallets.forEach((wallet) => {
      // Forward all wallet events through the manager
      Object.values(WalletEventType).forEach((eventType) => {
        wallet.on(eventType, (event: WalletEvent) => {
          this.emitEvent(event);
          this.handleWalletEvent(event);
        });
      });
    });
  }

  /**
   * Handle wallet events for session management
   */
  private handleWalletEvent(event: WalletEvent): void {
    switch (event.type) {
      case WalletEventType.CONNECTED:
        this.handleWalletConnected(event);
        break;
      case WalletEventType.DISCONNECTED:
        this.handleWalletDisconnected();
        break;
      case WalletEventType.PRINCIPAL_CHANGED:
        this.handlePrincipalChanged(event);
        break;
      default:
        // Update last activity for any event
        this.updateLastActivity();
    }
  }

  /**
   * Handle wallet connection
   */
  private async handleWalletConnected(event: WalletEvent): Promise<void> {
    if (!event.principal) return;

    const wallet = this.wallets.get(event.walletType);
    if (!wallet) return;

    this.currentWallet = wallet;
    this.currentSession = {
      walletType: event.walletType,
      principal: event.principal,
      accountId: await this.getAccountId(wallet),
      connectedAt: new Date(),
      lastActivity: new Date(),
      isActive: true,
      metadata: event.data,
    };

    await this.storage.storeSession(this.currentSession);
  }

  /**
   * Handle wallet disconnection
   */
  private async handleWalletDisconnected(): Promise<void> {
    this.currentWallet = null;
    this.currentSession = null;
    await this.storage.clearSession();
  }

  /**
   * Handle principal change
   */
  private async handlePrincipalChanged(event: WalletEvent): Promise<void> {
    if (this.currentSession && event.principal) {
      this.currentSession = {
        ...this.currentSession,
        principal: event.principal,
        lastActivity: new Date(),
      };
      await this.storage.storeSession(this.currentSession);
    }
  }

  /**
   * Update last activity timestamp
   */
  private async updateLastActivity(): Promise<void> {
    if (this.currentSession) {
      this.currentSession = {
        ...this.currentSession,
        lastActivity: new Date(),
      };
      await this.storage.storeSession(this.currentSession);
    }
  }

  /**
   * Get account ID from wallet if supported
   */
  private async getAccountId(
    wallet: WalletConnector,
  ): Promise<string | undefined> {
    try {
      return await wallet.getAccountId?.();
    } catch {
      return undefined;
    }
  }

  /**
   * Get all available wallet connectors
   */
  public async getAvailableWallets(): Promise<WalletConnector[]> {
    const availableWallets: WalletConnector[] = [];

    for (const wallet of this.wallets.values()) {
      try {
        const isAvailable = await wallet.isAvailable();
        if (isAvailable) {
          availableWallets.push(wallet);
        }
      } catch (error) {
        console.warn(
          `Error checking wallet availability for ${wallet.info.name}:`,
          error,
        );
      }
    }

    return availableWallets;
  }

  /**
   * Get wallet connector by type
   */
  public getWallet(type: WalletType): WalletConnector | null {
    return this.wallets.get(type) || null;
  }

  /**
   * Connect to specific wallet
   */
  public async connect(
    type: WalletType,
    config?: WalletConnectionConfig,
  ): Promise<WalletConnectionResult> {
    const wallet = this.wallets.get(type);

    if (!wallet) {
      throw this.createWalletError(
        WalletErrorType.NOT_INSTALLED,
        `Wallet type ${type} is not supported`,
      );
    }

    // Disconnect current wallet if different
    if (this.currentWallet && this.currentWallet.info.type !== type) {
      await this.disconnect();
    }

    try {
      const result = await wallet.connect(config);

      // Store wallet preference
      await this.storage.storePreferences(type, {
        lastConnected: new Date().toISOString(),
        autoReconnect: config?.autoReconnect ?? true,
      });

      return result;
    } catch (error) {
      console.error(`Failed to connect to ${wallet.info.name}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect from current wallet
   */
  public async disconnect(): Promise<void> {
    if (this.currentWallet) {
      try {
        await this.currentWallet.disconnect();
      } catch (error) {
        console.error("Error during wallet disconnection:", error);
      }
    }
  }

  /**
   * Get current active wallet
   */
  public getCurrentWallet(): WalletConnector | null {
    return this.currentWallet;
  }

  /**
   * Get current wallet info for UI display
   */
  public getCurrentWalletInfo(): WalletInfo | null {
    if (!this.currentWallet) return null;

    return {
      type: this.currentWallet.info.type,
      name: this.currentWallet.info.name,
      isConnected: this.currentWallet.isConnected(),
      principal: this.currentWallet.principal?.toString(),
    };
  }

  /**
   * Check if a wallet type is available for connection
   */
  public async isWalletAvailable(walletType: WalletType): Promise<boolean> {
    try {
      // For Internet Identity, always available
      if (walletType === WalletType.INTERNET_IDENTITY) {
        return true;
      }

      // Only Internet Identity is supported in production
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current wallet session
   */
  public getCurrentSession(): WalletSession | null {
    return this.currentSession;
  }

  /**
   * Check if any wallet is connected
   */
  public isConnected(): boolean {
    return this.currentWallet?.isConnected() ?? false;
  }

  /**
   * Subscribe to wallet manager events
   */
  public on(
    event: WalletEventType,
    callback: (event: WalletEvent) => void,
  ): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  /**
   * Unsubscribe from wallet manager events
   */
  public off(
    event: WalletEventType,
    callback: (event: WalletEvent) => void,
  ): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to all subscribers
   */
  private emitEvent(event: WalletEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(event);
        } catch (error) {
          console.error("Error in wallet manager event callback:", error);
        }
      });
    }
  }

  /**
   * Restore previous session if available
   */
  public async restoreSession(): Promise<boolean> {
    try {
      const session = await this.storage.getSession();
      if (!session?.isActive) {
        return false;
      }

      // Check if session is too old (24 hours)
      const sessionAge = Date.now() - session.lastActivity.getTime();
      if (sessionAge > 24 * 60 * 60 * 1000) {
        await this.storage.clearSession();
        return false;
      }

      const wallet = this.wallets.get(session.walletType);
      if (!wallet) {
        return false;
      }

      // Try to reconnect to wallet
      const isAvailable = await wallet.isAvailable();
      if (!isAvailable) {
        return false;
      }

      // For Internet Identity, try to restore connection
      if (session.walletType === WalletType.INTERNET_IDENTITY) {
        const iiConnector = wallet as InternetIdentityConnector;
        const isAuthenticated = await iiConnector.getAuthenticationStatus();
        if (isAuthenticated) {
          await iiConnector.refreshAuthentication();
          this.currentWallet = wallet;
          this.currentSession = session;
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Failed to restore wallet session:", error);
      return false;
    }
  }

  /**
   * Get wallet preferences
   */
  public async getWalletPreferences(
    type: WalletType,
  ): Promise<Record<string, unknown> | null> {
    return await this.storage.getPreferences(type);
  }

  /**
   * Get preferred wallet type based on user history
   */
  public async getPreferredWallet(): Promise<WalletType | null> {
    try {
      const session = await this.storage.getSession();
      if (session?.isActive) {
        return session.walletType;
      }

      // Check for most recently used wallet
      const walletTypes = Array.from(this.wallets.keys());
      let mostRecentWallet: WalletType | null = null;
      let mostRecentTime = 0;

      for (const type of walletTypes) {
        const prefs = await this.storage.getPreferences(type);
        if (prefs?.lastConnected && prefs.autoReconnect) {
          const time = new Date(prefs.lastConnected as string).getTime();
          if (time > mostRecentTime) {
            mostRecentTime = time;
            mostRecentWallet = type;
          }
        }
      }

      return mostRecentWallet;
    } catch {
      return null;
    }
  }

  /**
   * Create wallet error with context
   */
  private createWalletError(
    type: WalletErrorType,
    message: string,
  ): WalletError {
    const error = new Error(message) as WalletError;
    Object.assign(error, {
      type,
      walletType: this.currentWallet?.info.type || WalletType.INTERNET_IDENTITY,
      context: { currentSession: this.currentSession },
    });
    return error;
  }
}

// Export singleton instance
export const walletManager = new OriginStampWalletManager();
