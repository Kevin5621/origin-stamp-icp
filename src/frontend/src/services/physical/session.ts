/**
 * Physical Art Session Service Module
 * Handles physical art session creation, photo uploads, and session management
 */

import { getBackendActor, initializeBackend } from "../core/backend";

/**
 * Physical Art Session Service
 */
export const physicalArtSessionService = {
  /**
   * Create a new physical art session
   * @param username Username of the user creating the session
   * @param artTitle Title of the art piece
   * @param description Description of the art piece
   * @returns Promise with session ID
   */
  async createPhysicalArtSession(
    username: string,
    artTitle: string,
    description: string,
  ): Promise<string> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.create_physical_art_session(
        username,
        artTitle,
        description,
      );

      if ("Ok" in result) {
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to create physical art session:", error);
      throw error;
    }
  },

  /**
   * Upload photo to session
   * @param sessionId Session ID
   * @param photoUrl Photo URL
   * @returns Promise with boolean success
   */
  async uploadPhotoToSession(
    sessionId: string,
    photoUrl: string,
  ): Promise<boolean> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.upload_photo_to_session(
        sessionId,
        photoUrl,
      );

      if ("Ok" in result) {
        return Boolean(result.Ok);
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to upload photo to session:", error);
      throw error;
    }
  },

  /**
   * Get session details
   * @param sessionId Session ID
   * @returns Promise with session details or null
   */
  async getSessionDetails(
    sessionId: string,
  ): Promise<
    | import("../../../../declarations/backend/backend.did").PhysicalArtSession
    | null
  > {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_session_details(sessionId);
      return result.length > 0 ? result[0]! : null;
    } catch (error) {
      console.error("Failed to get session details:", error);
      throw error;
    }
  },

  /**
   * Get user sessions
   * @param username Username
   * @returns Promise with array of sessions
   */
  async getUserSessions(
    username: string,
  ): Promise<
    import("../../../../declarations/backend/backend.did").PhysicalArtSession[]
  > {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      return await backendActor.get_user_sessions(username);
    } catch (error) {
      console.error("Failed to get user sessions:", error);
      throw error;
    }
  },

  /**
   * Update session status
   * @param sessionId Session ID
   * @param status New status
   * @returns Promise with boolean success
   */
  async updateSessionStatus(
    sessionId: string,
    status: string,
  ): Promise<boolean> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.update_session_status(
        sessionId,
        status,
      );

      if ("Ok" in result) {
        return Boolean(result.Ok);
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to update session status:", error);
      throw error;
    }
  },

  /**
   * Remove photo from session
   * @param sessionId Session ID
   * @param photoUrl Photo URL to remove
   * @returns Promise with boolean success
   */
  async removePhotoFromSession(
    sessionId: string,
    photoUrl: string,
  ): Promise<boolean> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.remove_photo_from_session(
        sessionId,
        photoUrl,
      );

      if ("Ok" in result) {
        return Boolean(result.Ok);
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to remove photo from session:", error);
      throw error;
    }
  },
};
