/**
 * Verification Service Module
 * Handles AI verification requests and results
 */

import { getBackendActor, initializeBackend } from "../core/backend";

/**
 * AI Verification Service
 */
export const aiVerificationService = {
  /**
   * Create a new AI verification request for a session
   * @param sessionId Session ID to verify
   * @param assetUrls Array of asset URLs to verify
   * @returns Promise with verification request result
   */
  async createVerificationRequest(
    sessionId: string,
    assetUrls: string[],
  ): Promise<import("../../../../declarations/backend/backend.did").Result_1> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.create_verification_request(
        sessionId,
        assetUrls,
      );
      console.log("Verification request created:", result);
      return result;
    } catch (error) {
      console.error("Failed to create verification request:", error);
      throw error;
    }
  },

  /**
   * Get verification result for a session
   * @param sessionId Session ID to check
   * @returns Promise with verification result or null
   */
  async getVerificationResult(
    sessionId: string,
  ): Promise<
    | import("../../../../declarations/backend/backend.did").AIVerificationResult
    | null
  > {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const results = await backendActor.get_session_verifications(sessionId);
      // Return the most recent verification result
      return results.length > 0 ? results[results.length - 1] || null : null;
    } catch (error) {
      console.error("Failed to get verification result:", error);
      throw error;
    }
  },

  /**
   * Update verification result (for AI worker callback)
   * @param verificationId Verification ID
   * @param result AI verification result
   * @returns Promise with update result
   */
  async updateVerificationResult(
    verificationId: string,
    result: import("../../../../declarations/backend/backend.did").AIVerificationResult,
  ): Promise<import("../../../../declarations/backend/backend.did").Result_2> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const updateResult = await backendActor.update_verification_result(
        verificationId,
        result,
      );
      console.log("Verification result updated:", updateResult);
      return updateResult;
    } catch (error) {
      console.error("Failed to update verification result:", error);
      throw error;
    }
  },

  /**
   * Get all pending verification requests (admin use)
   * @returns Promise with array of pending verification requests
   */
  async getPendingVerifications(): Promise<
    import("../../../../declarations/backend/backend.did").AIVerificationResult[]
  > {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_pending_verifications();
      return result;
    } catch (error) {
      console.error("Failed to get pending verifications:", error);
      throw error;
    }
  },

  /**
   * Manually override verification status (admin use)
   * @param verificationId Verification ID
   * @param status New status
   * @param adminNotes Admin notes
   * @returns Promise with override result
   */
  async manualVerificationOverride(
    verificationId: string,
    status: "approved" | "rejected",
    adminNotes: string,
  ): Promise<import("../../../../declarations/backend/backend.did").Result_2> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.manual_verification_override(
        verificationId,
        status,
        adminNotes,
      );
      console.log("Manual verification override:", result);
      return result;
    } catch (error) {
      console.error("Failed to perform manual verification override:", error);
      throw error;
    }
  },
};
