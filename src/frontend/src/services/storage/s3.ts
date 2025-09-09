/**
 * Storage Service Module
 * Handles S3 configuration and storage-related operations
 */

import { getBackendActor, initializeBackend } from "../core/backend";

/**
 * Storage Service
 */
export const storageService = {
  /**
   * Gets S3 configuration from backend
   * @returns Promise with S3 config or null
   */
  async getS3Config(): Promise<
    import("../../../../declarations/backend/backend.did").S3Config | null
  > {
    try {
      // Ensure ICP agent is initialized before making calls
      await initializeBackend();

      // Get a properly configured backend actor
      const backendActor = await getBackendActor();

      if (!backendActor) {
        console.warn("Backend actor not available for S3 config");
        return null;
      }

      const s3ConfigOpt = await backendActor.get_s3_config();

      if (s3ConfigOpt && s3ConfigOpt.length > 0) {
        const config = s3ConfigOpt[0];
        if (config) {
          console.log("✅ S3 config retrieved from backend via storageService");
          return config;
        }
      }

      console.warn("⚠️ S3 config not found in backend");
      return null;
    } catch (error) {
      console.error("❌ Failed to get S3 config from backend:", error);
      return null;
    }
  },

  /**
   * Checks if S3 is configured in backend
   * @returns Promise with boolean status
   */
  async isS3Configured(): Promise<boolean> {
    try {
      // Ensure ICP agent is initialized before making calls
      await initializeBackend();

      // Get a properly configured backend actor
      const backendActor = await getBackendActor();

      if (!backendActor) {
        console.warn("Backend actor not available for S3 status check");
        return false;
      }

      const isConfigured = await backendActor.get_s3_config_status();
      console.log("S3 configuration status from backend:", isConfigured);
      return isConfigured;
    } catch (error) {
      console.error("❌ Failed to check S3 configuration status:", error);
      return false;
    }
  },
};
