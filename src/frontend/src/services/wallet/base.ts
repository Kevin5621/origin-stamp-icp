/**
 * Base Wallet Connector Implementation
 * Provides common functionality for all wallet connector implementations
 */

import { Principal } from "@dfinity/principal";
import { Identity } from "@dfinity/agent";
import {
  WalletConnector,
  WalletConnectionState,
  WalletConnectionResult,
  WalletInfo,
  WalletCapabilities,
  WalletConnectionConfig,
  TransactionRequest,
  TransactionResult,
  WalletEventType,
  WalletEvent,
  WalletError,
  WalletErrorType,
} from "./types";

/**
 * Event emitter for wallet operations
 */
class WalletEventEmitter {
  private readonly listeners = new Map<WalletEventType, Array<(event: WalletEvent) => void>>();

  /**
   * Subscribe to wallet events
   */
  public on(event: WalletEventType, callback: (event: WalletEvent) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Unsubscribe from wallet events
   */
  public off(event: WalletEventType, callback: (event: WalletEvent) => void): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit wallet event to all subscribers
   */
  protected emit(event: WalletEvent): void {
    const eventListeners = this.listeners.get(event.type);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(event);
        } catch (error) {
          console.error("Error in wallet event callback:", error);
        }
      });
    }
  }
}

/**
 * Abstract base class for wallet connector implementations
 * Provides common functionality and enforces interface compliance
 */
export abstract class BaseWalletConnector extends WalletEventEmitter implements WalletConnector {
  protected _connectionState: WalletConnectionState = WalletConnectionState.DISCONNECTED;
  protected _principal: Principal | null = null;
  protected _identity: Identity | null = null;
  protected _isInitialized = false;

  /**
   * Wallet information - must be implemented by subclasses
   */
  public abstract readonly info: WalletInfo;

  /**
   * Current connection state
   */
  public get connectionState(): WalletConnectionState {
    return this._connectionState;
  }

  /**
   * Current principal if connected
   */
  public get principal(): Principal | null {
    return this._principal;
  }

  /**
   * Current identity if connected
   */
  public get identity(): Identity | null {
    return this._identity;
  }

  /**
   * Check if wallet is available - must be implemented by subclasses
   */
  public abstract isAvailable(): Promise<boolean>;

  /**
   * Get wallet capabilities - must be implemented by subclasses
   */
  public abstract getCapabilities(): Promise<WalletCapabilities>;

  /**
   * Connect to wallet with error handling and state management
   */
  public async connect(config?: WalletConnectionConfig): Promise<WalletConnectionResult> {
    try {
      this.setConnectionState(WalletConnectionState.CONNECTING);

      // Check if wallet is available
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        throw this.createWalletError(
          WalletErrorType.NOT_INSTALLED,
          `${this.info.name} is not installed or available`,
        );
      }

      // Perform wallet-specific connection
      const result = await this.performConnect(config);

      // Update internal state
      this._principal = result.principal;
      this._identity = result.identity;
      this.setConnectionState(WalletConnectionState.CONNECTED);

      // Emit connection event
      this.emitEvent(WalletEventType.CONNECTED, {
        principal: result.principal,
        data: result.metadata,
      });

      return result;
    } catch (error) {
      this.setConnectionState(WalletConnectionState.ERROR);
      this.emitEvent(WalletEventType.ERROR, { data: { error } });
      throw error;
    }
  }

  /**
   * Disconnect from wallet with cleanup
   */
  public async disconnect(): Promise<void> {
    try {
      if (this.isConnected()) {
        await this.performDisconnect();
      }

      // Clean up internal state
      this._principal = null;
      this._identity = null;
      this.setConnectionState(WalletConnectionState.DISCONNECTED);

      // Emit disconnection event
      this.emitEvent(WalletEventType.DISCONNECTED);
    } catch (error) {
      console.error("Error during wallet disconnection:", error);
      throw error;
    }
  }

  /**
   * Check if currently connected
   */
  public isConnected(): boolean {
    return this._connectionState === WalletConnectionState.CONNECTED && this._principal !== null;
  }

  /**
   * Sign transaction with state management
   */
  public async signTransaction(request: TransactionRequest): Promise<TransactionResult> {
    if (!this.isConnected()) {
      throw this.createWalletError(
        WalletErrorType.CONNECTION_FAILED,
        "Wallet is not connected",
      );
    }

    try {
      this.setConnectionState(WalletConnectionState.SIGNING);

      // Emit transaction started event
      this.emitEvent(WalletEventType.TRANSACTION_STARTED, {
        data: { request },
      });

      const result = await this.performSignTransaction(request);

      // Emit transaction completed event
      this.emitEvent(WalletEventType.TRANSACTION_COMPLETED, {
        data: { request, result },
      });

      return result;
    } catch (error) {
      this.emitEvent(WalletEventType.ERROR, { data: { error } });
      throw error;
    } finally {
      this.setConnectionState(WalletConnectionState.CONNECTED);
    }
  }

  /**
   * Wallet-specific connection implementation - must be implemented by subclasses
   */
  protected abstract performConnect(config?: WalletConnectionConfig): Promise<WalletConnectionResult>;

  /**
   * Wallet-specific disconnection implementation - must be implemented by subclasses
   */
  protected abstract performDisconnect(): Promise<void>;

  /**
   * Wallet-specific transaction signing - must be implemented by subclasses
   */
  protected abstract performSignTransaction(request: TransactionRequest): Promise<TransactionResult>;

  /**
   * Set connection state and handle transitions
   */
  protected setConnectionState(state: WalletConnectionState): void {
    const previousState = this._connectionState;
    this._connectionState = state;

    // Log state transitions for debugging
    if (previousState !== state) {
      console.debug(`Wallet ${this.info.name} state: ${previousState} -> ${state}`);
    }
  }

  /**
   * Create standardized wallet error
   */
  protected createWalletError(type: WalletErrorType, message: string, context?: Record<string, unknown>): WalletError {
    const error = new Error(message) as WalletError;
    Object.assign(error, {
      type,
      walletType: this.info.type,
      context,
    });
    return error;
  }

  /**
   * Emit wallet event with standard metadata
   */
  protected emitEvent(type: WalletEventType, data?: { principal?: Principal; data?: Record<string, unknown> }): void {
    const event: WalletEvent = {
      type,
      walletType: this.info.type,
      principal: data?.principal || this._principal || undefined,
      data: data?.data,
      timestamp: new Date(),
    };
    this.emit(event);
  }

  /**
   * Validate principal format and authenticity
   */
  protected validatePrincipal(principal: Principal): boolean {
    try {
      // Check if principal is valid format
      if (!principal || principal.isAnonymous()) {
        return false;
      }

      // Verify principal string format
      const principalText = principal.toString();
      if (principalText.length < 10 || principalText === "2vxsx-fae") {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Initialize wallet connector if needed
   */
  protected async initializeIfNeeded(): Promise<void> {
    if (this._isInitialized) {
      return;
    }

    try {
      await this.performInitialization();
      this._isInitialized = true;
    } catch (error) {
      console.error(`Failed to initialize ${this.info.name} wallet:`, error);
      throw error;
    }
  }

  /**
   * Wallet-specific initialization - can be overridden by subclasses
   */
  protected async performInitialization(): Promise<void> {
    // Default implementation does nothing
    // Subclasses can override for specific initialization logic
  }

  /**
   * Create timeout promise for connection operations
   */
  protected createTimeoutPromise<T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        setTimeout(() => {
          reject(this.createWalletError(
            WalletErrorType.CONNECTION_FAILED,
            `Operation timed out after ${timeoutMs}ms`,
          ));
        }, timeoutMs);
      }),
    ]);
  }

  /**
   * Validate transaction request
   */
  protected validateTransactionRequest(request: TransactionRequest): void {
    if (!request.canisterId) {
      throw this.createWalletError(
        WalletErrorType.TRANSACTION_FAILED,
        "Canister ID is required for transaction",
      );
    }

    if (!request.methodName) {
      throw this.createWalletError(
        WalletErrorType.TRANSACTION_FAILED,
        "Method name is required for transaction",
      );
    }
  }
}