/**
 * Profile Service Module
 * Handles user profile operations like updating bio, email, location, etc.
 */

import { backendService } from "../backendService";
import { activityService } from "./activityService";

export interface UpdateProfileRequest {
  display_name?: string;
  email?: string;
  bio?: string;
  location?: string;
}

export interface ProfileUpdateResult {
  success: boolean;
  message: string;
  updated_fields: string[];
}

export interface UserProfile {
  username: string;
  password_hash: string;
  created_at: bigint;
  updated_at: bigint;
  avatar_url?: string;
  subscription_tier: string;
  display_name?: string;
  email?: string;
  bio?: string;
  location?: string;
}

class ProfileService {
  /**
   * Validate and convert raw backend response to UserProfile
   */
  private validateUserProfile(
    data: Record<string, unknown>,
  ): UserProfile | null {
    // Check if all required fields are present
    const requiredFields = [
      "username",
      "password_hash",
      "created_at",
      "updated_at",
      "subscription_tier",
    ];
    for (const field of requiredFields) {
      if (!(field in data)) {
        return null;
      }
    }

    return {
      username: data.username as string,
      password_hash: data.password_hash as string,
      created_at:
        typeof data.created_at === "number"
          ? BigInt(data.created_at)
          : (data.created_at as bigint),
      updated_at:
        typeof data.updated_at === "number"
          ? BigInt(data.updated_at)
          : (data.updated_at as bigint),
      subscription_tier: data.subscription_tier as string,
      avatar_url: data.avatar_url as string | undefined,
      display_name: data.display_name as string | undefined,
      email: data.email as string | undefined,
      bio: data.bio as string | undefined,
      location: data.location as string | undefined,
    };
  }

  /**
   * Check if username is available
   */
  async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const result = await backendService.checkUsernameAvailability(username);
      return result;
    } catch {
      throw new Error("Failed to check username availability");
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    username: string,
    password: string,
    profileData: UpdateProfileRequest,
  ): Promise<ProfileUpdateResult> {
    try {
      const result = await backendService.updateUserProfile(
        username,
        password,
        profileData,
      );
      return result;
    } catch {
      throw new Error("Failed to update profile");
    }
  }

  /**
   * Get user profile data
   */
  async getUserProfile(username: string): Promise<UserProfile | null> {
    try {
      const result = await backendService.getUserProfile(username);

      // Since backend method is not implemented yet, result will be null
      if (result === null) {
        return null;
      }

      // Validate and convert the backend response to UserProfile
      return this.validateUserProfile(result);
    } catch {
      throw new Error("Failed to get user profile");
    }
  }

  /**
   * Update display name only
   */
  async updateDisplayName(
    username: string,
    newDisplayName: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Use the general updateUserProfile method for display name updates
      const result = await backendService.updateUserProfile(
        username,
        password,
        {
          display_name: newDisplayName,
        },
      );
      return {
        success: result.success,
        message: result.message,
      };
    } catch {
      throw new Error("Failed to update display name");
    }
  }

  /**
   * Validate profile fields locally before sending to backend
   */
  validateProfileFields(profileData: UpdateProfileRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Display name validation - fleksibel dan optional
    this.validateDisplayName(profileData.display_name, errors);

    // Email validation - fleksibel dan optional
    this.validateEmail(profileData.email, errors);

    // Bio validation
    this.validateBio(profileData.bio, errors);

    // Location validation
    this.validateLocation(profileData.location, errors);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate display name field
   */
  private validateDisplayName(
    displayName: string | undefined,
    errors: string[],
  ): void {
    if (
      displayName !== undefined &&
      displayName !== null &&
      displayName.trim().length > 0
    ) {
      if (displayName.length > 50) {
        errors.push("Display name cannot exceed 50 characters");
      }
    }
  }

  /**
   * Validate email field
   */
  private validateEmail(email: string | undefined, errors: string[]): void {
    if (email !== undefined && email !== null && email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.push("Please enter a valid email address");
      }
      if (email.length > 100) {
        errors.push("Email cannot exceed 100 characters");
      }
    }
  }

  /**
   * Validate bio field
   */
  private validateBio(bio: string | undefined, errors: string[]): void {
    if (bio !== undefined && bio !== null && bio.length > 500) {
      errors.push("Bio cannot exceed 500 characters");
    }
  }

  /**
   * Validate location field
   */
  private validateLocation(
    location: string | undefined,
    errors: string[],
  ): void {
    if (location !== undefined && location !== null && location.length > 100) {
      errors.push("Location cannot exceed 100 characters");
    }
  }

  /**
   * Validate username format
   */
  validateUsername(username: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (username.length < 3) {
      errors.push("Username must be at least 3 characters long");
    }

    if (username.length > 30) {
      errors.push("Username cannot exceed 30 characters");
    }

    if (!/^\w+$/.test(username)) {
      errors.push(
        "Username can only contain letters, numbers, and underscores",
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // ===== ACTIVITY METHODS =====

  /**
   * Get user activity timeline
   */
  async getUserActivityTimeline(
    username: string,
    limit: number = 20,
  ): Promise<
    Array<{
      id: string;
      type: "session" | "nft" | "achievement" | "collection";
      title: string;
      description: string;
      timestamp: string;
      metadata?: {
        session_id?: string;
        nft_id?: string;
        achievement_type?: string;
      };
    }>
  > {
    try {
      return await activityService.getRecentActivities(username, limit);
    } catch (error) {
      console.error("Failed to get user activity timeline:", error);
      return [];
    }
  }

  /**
   * Get user dashboard data
   */
  async getUserDashboardData(username: string) {
    try {
      return await activityService.getUserDashboardData(username);
    } catch (error) {
      console.error("Failed to get user dashboard data:", error);
      return null;
    }
  }

  /**
   * Get user performance stats
   */
  async getUserPerformanceStats(username: string) {
    try {
      return await activityService.getUserPerformanceStats(username);
    } catch (error) {
      console.error("Failed to get user performance stats:", error);
      return null;
    }
  }
}

export const profileService = new ProfileService();
