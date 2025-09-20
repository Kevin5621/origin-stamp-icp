/**
 * Wallet Integration Types
 * Defines interfaces and types for multi-wallet support in OriginStamp
 */

import { Principal } from "@dfinity/principal";
import { Identity } from "@dfinity/agent";

/**
 * Supported wallet types in the OriginStamp ecosystem
 */
export enum WalletType {
  INTERNET_IDENTITY = "internet_identity",
  PLUG = "plug",
  STOIC = "stoic",
  NFID = "nfid",
}

/**
 * Wallet connection states for UI feedback
 */
export enum WalletConnectionState {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error",
  SIGNING = "signing",
}

/**
 * UI-friendly wallet information
 */
export interface WalletInfo {
  type: WalletType;
  name: string;
  isConnected: boolean;
  principal?: string;
  description?: string;
  icon?: string;
  isExtensionBased?: boolean;
  supportsSignTransaction?: boolean;
  downloadUrl?: string;
}

/**
 * Wallet connection result containing essential authentication data
 */
export interface WalletConnectionResult {
  readonly principal: Principal;
  readonly identity: Identity;
  readonly accountId?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Transaction signature request for wallet operations
 */
export interface TransactionRequest {
  readonly canisterId: string;
  readonly methodName: string;
  readonly args: unknown[];
  readonly sender?: Principal;
  readonly memo?: bigint;
  readonly amount?: bigint;
}

/**
 * Transaction signature result
 */
export interface TransactionResult {
  readonly success: boolean;
  readonly transactionId?: string;
  readonly error?: string;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Wallet capabilities detection
 */
export interface WalletCapabilities {
  readonly canConnect: boolean;
  readonly canSign: boolean;
  readonly canTransfer: boolean;
  readonly hasExtension: boolean;
  readonly version?: string;
}

/**
 * Wallet session management
 */
export interface WalletSession {
  readonly walletType: WalletType;
  readonly principal: Principal;
  readonly accountId?: string;
  readonly connectedAt: Date;
  readonly lastActivity: Date;
  readonly isActive: boolean;
  readonly metadata?: Record<string, unknown>;
}

/**
 * Wallet connection configuration
 */
export interface WalletConnectionConfig {
  readonly timeout?: number;
  readonly autoReconnect?: boolean;
  readonly storeSession?: boolean;
  readonly requiredCapabilities?: string[];
}

/**
 * Error types for wallet operations
 */
export enum WalletErrorType {
  NOT_INSTALLED = "not_installed",
  CONNECTION_FAILED = "connection_failed",
  USER_REJECTED = "user_rejected",
  TRANSACTION_FAILED = "transaction_failed",
  UNSUPPORTED_METHOD = "unsupported_method",
  NETWORK_ERROR = "network_error",
  INVALID_PRINCIPAL = "invalid_principal",
  SESSION_EXPIRED = "session_expired",
}

/**
 * Wallet error with context
 */
export interface WalletError extends Error {
  readonly type: WalletErrorType;
  readonly walletType: WalletType;
  readonly context?: Record<string, unknown>;
}

/**
 * Wallet event types for monitoring
 */
export enum WalletEventType {
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  PRINCIPAL_CHANGED = "principal_changed",
  TRANSACTION_STARTED = "transaction_started",
  TRANSACTION_COMPLETED = "transaction_completed",
  ERROR = "error",
}

/**
 * Wallet event payload
 */
export interface WalletEvent {
  readonly type: WalletEventType;
  readonly walletType: WalletType;
  readonly principal?: Principal;
  readonly data?: Record<string, unknown>;
  readonly timestamp: Date;
}

/**
 * Base wallet connector interface that all wallet implementations must follow
 */
export interface WalletConnector {
  /**
   * Wallet identification and metadata
   */
  readonly info: WalletInfo;

  /**
   * Current connection state
   */
  readonly connectionState: WalletConnectionState;

  /**
   * Current principal if connected
   */
  readonly principal: Principal | null;

  /**
   * Current identity if connected
   */
  readonly identity: Identity | null;

  /**
   * Check if wallet is available in current environment
   */
  isAvailable(): Promise<boolean>;

  /**
   * Get wallet capabilities in current environment
   */
  getCapabilities(): Promise<WalletCapabilities>;

  /**
   * Connect to wallet and authenticate user
   */
  connect(config?: WalletConnectionConfig): Promise<WalletConnectionResult>;

  /**
   * Disconnect from wallet and clean up session
   */
  disconnect(): Promise<void>;

  /**
   * Check if currently connected to wallet
   */
  isConnected(): boolean;

  /**
   * Request transaction signature from wallet
   */
  signTransaction(request: TransactionRequest): Promise<TransactionResult>;

  /**
   * Get current account balance (if supported)
   */
  getBalance?(): Promise<bigint>;

  /**
   * Get account identifier (if supported)
   */
  getAccountId?(): Promise<string>;

  /**
   * Subscribe to wallet events
   */
  on(event: WalletEventType, callback: (event: WalletEvent) => void): void;

  /**
   * Unsubscribe from wallet events
   */
  off(event: WalletEventType, callback: (event: WalletEvent) => void): void;
}

/**
 * Wallet manager interface for coordinating multiple wallets
 */
export interface WalletManager {
  /**
   * Get all available wallet connectors
   */
  getAvailableWallets(): Promise<WalletConnector[]>;

  /**
   * Get wallet connector by type
   */
  getWallet(type: WalletType): WalletConnector | null;

  /**
   * Connect to specific wallet
   */
  connect(type: WalletType, config?: WalletConnectionConfig): Promise<WalletConnectionResult>;

  /**
   * Disconnect from current wallet
   */
  disconnect(): Promise<void>;

  /**
   * Get current active wallet
   */
  getCurrentWallet(): WalletConnector | null;

  /**
   * Get current wallet session
   */
  getCurrentSession(): WalletSession | null;

  /**
   * Check if any wallet is connected
   */
  isConnected(): boolean;

  /**
   * Subscribe to wallet manager events
   */
  on(event: WalletEventType, callback: (event: WalletEvent) => void): void;

  /**
   * Unsubscribe from wallet manager events
   */
  off(event: WalletEventType, callback: (event: WalletEvent) => void): void;
}

/**
 * Wallet storage interface for session persistence
 */
export interface WalletStorage {
  /**
   * Store wallet session data
   */
  storeSession(session: WalletSession): Promise<void>;

  /**
   * Retrieve wallet session data
   */
  getSession(): Promise<WalletSession | null>;

  /**
   * Clear wallet session data
   */
  clearSession(): Promise<void>;

  /**
   * Store wallet preferences
   */
  storePreferences(type: WalletType, preferences: Record<string, unknown>): Promise<void>;

  /**
   * Get wallet preferences
   */
  getPreferences(type: WalletType): Promise<Record<string, unknown> | null>;
}