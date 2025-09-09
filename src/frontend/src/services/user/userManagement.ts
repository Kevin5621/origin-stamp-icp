/**
 * User Management Service Module
 * Handles user profile operations like avatar, usernames, etc.
 */

import type { LoginResult } from "../../../../declarations/backend/backend.did";
import { getBackendActor, initializeBackend } from "../core/backend";

/**
 * User Management Service
 */
export const userManagementService = {
  /**
   * Gets all registered usernames
   * @returns Promise with array of usernames
   */
  async getAllUsers(): Promise<string[]> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      // Method not available in current backend interface
      // Return empty array as fallback
      console.warn("get_all_users method not available in backend");
      return [];
    } catch (error) {
      console.error("Failed to get all users:", error);
      return [];
    }
  },

  /**
   * Gets user information by username
   * @param username Username to lookup
   * @returns Promise with user info (username, created_at) or undefined if not found
   */
  async getUserInfo(username: string): Promise<[string, bigint] | undefined> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      // Method not available in current backend interface
      // Return undefined as fallback
      console.warn(
        `get_user_info method not available in backend for user: ${username}`,
      );
      return undefined;
    } catch (error) {
      console.error("Failed to get user info:", error);
      return undefined;
    }
  },

  /**
   * Gets total number of registered users
   * @returns Promise with user count
   */
  async getUserCount(): Promise<bigint> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      return await backendActor.get_user_count();
    } catch (error) {
      console.error("Failed to get user count:", error);
      return BigInt(0);
    }
  },

  /**
   * Gets user avatar URL
   * @param username Username to lookup
   * @returns Promise with avatar URL or null
   */
  async getUserAvatar(username: string): Promise<string | null> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_user_avatar(username);
      return result.length > 0 ? result[0]! : null;
    } catch (error) {
      console.error("Failed to get user avatar:", error);
      return null;
    }
  },

  /**
   * Updates user avatar URL
   * @param username Username
   * @param avatarUrl New avatar URL
   * @returns Promise with boolean success
   */
  async updateUserAvatar(
    username: string,
    avatarUrl: string,
  ): Promise<boolean> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.update_user_avatar(username, avatarUrl);
      return "Ok" in result ? Boolean(result.Ok) : false;
    } catch (error) {
      console.error("Failed to update user avatar:", error);
      return false;
    }
  },

  /**
   * Updates user username
   * @param oldUsername Current username
   * @param newUsername New username
   * @param password User's password for verification
   * @returns Promise with the update result
   */
  async updateUsername(
    oldUsername: string,
    newUsername: string,
    password: string,
  ): Promise<LoginResult> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      // Method not available in current backend interface
      // Throw error indicating feature not implemented
      console.warn(
        `update_username method not available in backend for ${oldUsername} -> ${newUsername} with password provided: ${!!password}`,
      );
      throw new Error("Username update feature not yet implemented in backend");
    } catch (error) {
      console.error("Failed to update username:", error);
      throw error;
    }
  },
};
