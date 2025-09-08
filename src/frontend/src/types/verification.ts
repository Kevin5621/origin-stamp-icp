// Enhanced verification types for NFT integration

export interface VerificationResult {
  verification_id: string;
  session_id: string;
  assets: VerificationAsset[];
  status: VerificationStatus;
  final_score: number;
  base_similarity: number;
  anomaly_count: number;
  breakdown: Record<string, number>;
  model_version: string;
  evidence_urls: string[];
  checked_at: number;
  created_at: number;
  notes: string[];
  // New fields for NFT integration
  verification_type: VerificationType;
  nft_id?: string;
  is_final_verification?: boolean;
}

export interface VerificationAsset {
  asset_id: string;
  s3_url: string;
  step_index: number;
  sha256: string;
  content_type: string;
}

export type VerificationStatus =
  | "Pending"
  | "Verified"
  | "ReviewNeeded"
  | "Rejected";

export type VerificationType =
  | "preview" // For checking before final mint
  | "final"; // For final NFT verification

export interface VerificationStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
}

// NFT Metadata with verification data
export interface NFTMetadata {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  creator: {
    username: string;
    avatar: string;
    verified: boolean;
  };
  verification: {
    preview_verification?: VerificationResult;
    final_verification?: VerificationResult;
    overall_score: number;
    authenticity_rating: number;
    provenance_score: number;
    community_trust: number;
  };
  metadata: {
    certificateId: string;
    sessionId: string;
    issueDate: string;
    expiryDate: string;
    blockchain: string;
    tokenStandard: string;
  };
  stats: {
    views: number;
    likes: number;
    createdAt: string;
  };
}
