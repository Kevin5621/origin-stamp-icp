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
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Gets user information by username
   * @param username Username to lookup
   * @returns Promise with user info (username, created_at) or undefined if not found
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserInfo(_username: string): Promise<[string, bigint] | undefined> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      // Method not available in current backend interface
      // Return undefined as fallback
      return undefined;
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _oldUsername: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _newUsername: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _password: string,
  ): Promise<LoginResult> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      // Method not available in current backend interface
      // Throw error indicating feature not implemented
      throw new Error("Username update feature not yet implemented in backend");
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if username is available
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async checkUsernameAvailability(_username: string): Promise<boolean> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      // Method not available in current backend interface
      // For now, return true (available) as a placeholder
      return true;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user profile information
   */
  async updateUserProfile(
    username: string,
    password: string,
    profileData: {
      display_name?: string;
      email?: string;
      bio?: string;
      location?: string;
    },
  ): Promise<{ success: boolean; message: string; updated_fields: string[] }> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      // Method not available in current backend interface

      // Simulate profile update by storing in localStorage temporarily
      // This will be replaced with actual backend call when implemented
      const storageKey = `profile_${username}`;
      const existingProfile = localStorage.getItem(storageKey);

      let currentProfile;
      if (existingProfile) {
        currentProfile = JSON.parse(existingProfile);
      } else {
        // Create initial profile structure if doesn't exist
        currentProfile = {
          username: username,
          password_hash: "temp_hash",
          created_at: Date.now() * 1000000,
          updated_at: Date.now() * 1000000,
          subscription_tier: "free",
          display_name: username,
          email: "",
          bio: "Passionate digital artist exploring the intersection of technology and creativity.",
          location: "San Francisco, CA",
          avatar_url: undefined,
        };
      }

      // Update profile data
      const updatedProfile = {
        ...currentProfile,
        username: currentProfile.username || username,
        display_name: profileData.display_name,
        bio: profileData.bio,
        email: profileData.email,
        location: profileData.location,
        // Add required fields for validateUserProfile
        password_hash: currentProfile.password_hash || "temp_hash",
        created_at: currentProfile.created_at || Date.now() * 1000000,
        updated_at: Date.now() * 1000000,
        subscription_tier: currentProfile.subscription_tier || "free",
        avatar_url: currentProfile.avatar_url,
      };

      // Store updated profile
      localStorage.setItem(storageKey, JSON.stringify(updatedProfile));

      // Profile updated successfully

      return {
        success: true,
        message: "Profile updated successfully (using temporary storage)",
        updated_fields: Object.keys(profileData),
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user profile information
   */
  async getUserProfile(
    username: string,
  ): Promise<Record<string, unknown> | null> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      // Method not available in current backend interface

      // Try to get profile from localStorage (temporary solution)
      const storageKey = `profile_${username}`;
      const storedProfile = localStorage.getItem(storageKey);

      if (storedProfile) {
        const profileData = JSON.parse(storedProfile);
        return profileData;
      }

      // Return null if no stored profile found
      return null;
    } catch (error) {
      throw error;
    }
  },
};
