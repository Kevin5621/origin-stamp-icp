/**
 * NFT services exports
 */

export * from "./certificate";
export * from "./token";
export * from "./collection";

// Export types
export interface NFTMintingResult {
  success: boolean;
  token_id?: bigint;
  error?: string;
  transaction_hash?: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface TokenDetails {
  token_id: bigint;
  owner: string;
  metadata: NFTMetadata;
  created_at: number;
  certificate_id?: string;
  session_id?: string;
}

export interface CertificateData {
  certificate_id: string;
  session_id: string;
  username: string;
  art_title: string;
  verification_score: number;
  created_at: number;
  metadata: Record<string, string>;
}

// Create service aliases for backward compatibility
export { nftCertificateService as certificateService } from "./certificate";
export { nftTokenService as tokenService } from "./token";
export { nftCertificateService as NFTService } from "./certificate";
export { CollectionService } from "./collection";
