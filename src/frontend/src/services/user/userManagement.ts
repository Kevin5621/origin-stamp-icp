/**
 * User Management Service Module
 * Handles user profile operations like avatar, usernames, etc.
 */

import { backend } from "../../../../declarations/backend";
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
    if (!backend) {
      throw new Error(
        "Backend canister not initialized. Please check your environment configuration.",
      );
    }
    return await backend.get_all_users();
  },

  /**
   * Gets user information by username
   * @param username Username to lookup
   * @returns Promise with user info (username, created_at) or undefined if not found
   */
  async getUserInfo(username: string): Promise<[string, bigint] | undefined> {
    if (!backend) {
      throw new Error(
        "Backend canister not initialized. Please check your environment configuration.",
      );
    }
    const result = await backend.get_user_info(username);
    return result.length > 0 ? result[0] : undefined;
  },

  /**
   * Gets total number of registered users
   * @returns Promise with user count
   */
  async getUserCount(): Promise<bigint> {
    if (!backend) {
      throw new Error(
        "Backend canister not initialized. Please check your environment configuration.",
      );
    }
    return await backend.get_user_count();
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
    if (!backend) {
      throw new Error(
        "Backend canister not initialized. Please check your environment configuration.",
      );
    }
    return await backend.update_username(oldUsername, newUsername, password);
  },
};
