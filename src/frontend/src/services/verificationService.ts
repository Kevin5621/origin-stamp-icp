import { backendService } from "./backendService";
import type {
  AIVerificationResult as BackendVerificationResult,
  VerificationStatus as BackendVerificationStatus,
  AIVerificationAsset as BackendVerificationAsset,
} from "../../../declarations/backend/backend.did.d.ts";

// Re-export types from centralized location
export type {
  VerificationResult,
  VerificationAsset,
  VerificationStatus,
  VerificationStats,
  VerificationType,
} from "../types/verification";

/**
 * AI Verification Service - Handles verification requests and results
 */
export class VerificationService {
  /**
   * Create verification request for a session
   */
  static async createVerificationRequest(
    sessionId: string,
    assetUrls: string[],
  ): Promise<string> {
    try {
      const result = await backendService.createVerificationRequest(
        sessionId,
        assetUrls,
      );

      if ("Ok" in result) {
        return result.Ok;
      } else {
        throw new Error(`Failed to create verification request: ${result.Err}`);
      }
    } catch (error) {
      console.error("Failed to create verification request:", error);
      throw error;
    }
  }

  /**
   * Get verification result by session ID
   */
  static async getVerificationResult(
    sessionId: string,
  ): Promise<VerificationResult | null> {
    try {
      const result = await backendService.getVerificationResult(sessionId);

      if (result) {
        return this.convertBackendResultToFrontend(result);
      }

      return null;
    } catch (error) {
      console.error("Failed to get verification result:", error);
      return null;
    }
  }

  /**
   * Get all pending verification results
   */
  static async getPendingVerifications(): Promise<VerificationResult[]> {
    try {
      const results = await backendService.getPendingVerifications();

      return results.map((result) =>
        this.convertBackendResultToFrontend(result),
      );
    } catch (error) {
      console.error("Failed to get pending verifications:", error);
      return [];
    }
  }

  /**
   * Perform manual verification override (admin/reviewer)
   */
  static async manualVerificationOverride(
    verificationId: string,
    newStatus: VerificationStatus,
    reviewerNotes: string,
  ): Promise<boolean> {
    try {
      // Convert frontend status to simple string for backend
      const backendStatus = newStatus === "Verified" ? "approved" : "rejected";

      const result = await backendService.manualVerificationOverride(
        verificationId,
        backendStatus,
        reviewerNotes,
      );

      return "Ok" in result;
    } catch (error) {
      console.error("Failed to perform manual verification override:", error);
      return false;
    }
  }

  // Note: deleteVerificationAsset and getVerificationStats
  // are not yet implemented in backend

  /**
   * Check if verification is in progress
   */
  static isVerificationPending(status: VerificationStatus): boolean {
    return status === "Pending";
  }

  /**
   * Check if verification needs manual review
   */
  static needsManualReview(status: VerificationStatus): boolean {
    return status === "ReviewNeeded";
  }

  /**
   * Get score badge class for UI styling
   */
  static getScoreBadgeClass(score: number): string {
    if (score >= 80) return "badge-success";
    if (score >= 60) return "badge-warning";
    if (score >= 40) return "badge-info";
    return "badge-danger";
  }

  /**
   * Get status badge class for UI styling
   */
  static getStatusBadgeClass(status: VerificationStatus): string {
    switch (status) {
      case "Verified":
        return "badge-success";
      case "Pending":
        return "badge-warning";
      case "ReviewNeeded":
        return "badge-info";
      case "Rejected":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  }

  /**
   * Format score for display
   */
  static formatScore(score: number): string {
    return `${Math.round(score)}%`;
  }

  /**
   * Get human-readable status text
   */
  static getStatusText(status: VerificationStatus): string {
    switch (status) {
      case "Verified":
        return "Verified";
      case "Pending":
        return "Processing...";
      case "ReviewNeeded":
        return "Needs Review";
      case "Rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  }

  /**
   * Convert backend VerificationResult to frontend format
   */
  private static convertBackendResultToFrontend(
    backendResult: BackendVerificationResult,
  ): VerificationResult {
    // Convert breakdown from Map to Record
    const breakdown: Record<string, number> = {};
    if (backendResult.breakdown && Array.isArray(backendResult.breakdown)) {
      backendResult.breakdown.forEach(([key, value]) => {
        breakdown[key] = value;
      });
    }

    return {
      verification_id: backendResult.verification_id,
      session_id: backendResult.session_id,
      assets: backendResult.assets.map((asset) => ({
        asset_id: asset.asset_id,
        s3_url: asset.s3_url,
        step_index: Number(asset.step_index),
        sha256: asset.sha256,
        content_type: asset.content_type,
      })),
      status: this.convertBackendStatusToFrontend(backendResult.status),
      final_score: backendResult.final_score,
      base_similarity: backendResult.base_similarity,
      anomaly_count: backendResult.anomaly_count,
      breakdown,
      model_version: backendResult.model_version,
      evidence_urls: backendResult.evidence_urls,
      checked_at: Number(backendResult.checked_at),
      created_at: Number(backendResult.created_at),
      notes: backendResult.notes,
      // New fields for NFT integration
      verification_type: "preview" as const, // Default to preview, can be overridden
      nft_id: undefined,
      is_final_verification: false,
    };
  }

  /**
   * Convert backend VerificationStatus to frontend format
   */
  private static convertBackendStatusToFrontend(
    backendStatus: BackendVerificationStatus,
  ): VerificationStatus {
    if ("Pending" in backendStatus) return "Pending";
    if ("Verified" in backendStatus) return "Verified";
    if ("ReviewNeeded" in backendStatus) return "ReviewNeeded";
    if ("Rejected" in backendStatus) return "Rejected";
    return "Pending"; // fallback
  }

  /**
   * Convert frontend VerificationStatus to backend format
   */
  private static convertFrontendStatusToBackend(
    frontendStatus: VerificationStatus,
  ): BackendVerificationStatus {
    switch (frontendStatus) {
      case "Pending":
        return { Pending: null };
      case "Verified":
        return { Verified: null };
      case "ReviewNeeded":
        return { ReviewNeeded: null };
      case "Rejected":
        return { Rejected: null };
      default:
        return { Pending: null };
    }
  }
}
