/**
 * Verification services exports
 */

export * from "./ai";

// Export types
export interface VerificationResult {
  verification_id: string;
  session_id: string;
  asset_urls: string[];
  status: VerificationStatus;
  confidence_score: number;
  verification_notes: string[];
  created_at: number;
  updated_at: number;
  admin_notes?: string;
}

export type VerificationStatus =
  | "pending"
  | "in_progress"
  | "verified"
  | "rejected"
  | "failed";

export interface AIVerificationConfig {
  enabled: boolean;
  confidence_threshold: number;
  max_retries: number;
  timeout_seconds: number;
}

// Create verification service alias for backward compatibility
export { aiVerificationService as verificationService } from "./ai";
