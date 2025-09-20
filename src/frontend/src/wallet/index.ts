// Wallet Services
export { OriginStampWalletManager } from '../services/wallet/manager';
export * from '../services/wallet/types';

// Wallet Connectors
export { InternetIdentityConnector } from '../services/wallet/connectors/internetIdentity';
export { PlugWalletConnector } from '../services/wallet/connectors/plug';
export { StoicWalletConnector } from '../services/wallet/connectors/stoic';
export { NFIDWalletConnector } from '../services/wallet/connectors/nfid';