import { backend } from "../../../declarations/backend";
import type { LoginResult } from "../../../declarations/backend/backend.did";

// Types for marketplace components
export interface NFTMarketplaceStats {
  totalArtworks: string;
  totalCreators: string;
  totalSessions: string;
}

export interface CreatorStats {
  username: string;
  certificateCount: number;
  sessionCount: number;
  hasSubscription: boolean;
  subscriptionType?: string;
}

/**
 * Service for handling all backend canister API calls
 */
export const backendService = {
  /**
   * Registers a new user
   * @param username Username for the new user
   * @param password Password for the new user
   * @returns Promise with the registration result
   */
  async registerUser(username: string, password: string): Promise<LoginResult> {
    if (!backend) {
      throw new Error(
        "Backend canister not initialized. Please check your environment configuration.",
      );
    }
    return await backend.register_user(username, password);
  },

  /**
   * Logs in a user
   * @param username User's username
   * @param password User's password
   * @returns Promise with the login result
   */
  async login(username: string, password: string): Promise<LoginResult> {
    if (!backend) {
      throw new Error(
        "Backend canister not initialized. Please check your environment configuration.",
      );
    }
    return await backend.login(username, password);
  },

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

  /**
   * Checks if backend is available
   * @returns boolean indicating if backend is initialized
   */
  isAvailable(): boolean {
    return !!backend;
  },

  /**
   * Gets backend canister ID
   * @returns canister ID string or undefined
   */
  getCanisterId(): string | undefined {
    return process.env.NEXT_PUBLIC_CANISTER_ID_BACKEND;
  },

  /**
   * Gets marketplace statistics
   * @returns Promise with marketplace stats
   */
  async getMarketplaceStats(): Promise<NFTMarketplaceStats> {
    try {
      if (!backend) {
        return {
          totalArtworks: "0+",
          totalCreators: "0+",
          totalSessions: "0+",
        };
      }

      const [certificateCount, userCount, sessionCount] = await Promise.all([
        backend.get_certificate_count(),
        backend.get_user_count(),
        backend.get_session_count(),
      ]);

      return {
        totalArtworks: `${certificateCount}+`,
        totalCreators: `${userCount}+`,
        totalSessions: `${sessionCount}+`,
      };
    } catch (error) {
      console.error("Failed to fetch marketplace stats:", error);
      return {
        totalArtworks: "0+",
        totalCreators: "0+",
        totalSessions: "0+",
      };
    }
  },

  /**
   * Gets top creators
   * @returns Promise with creator stats array
   */
  async getTopCreators(): Promise<CreatorStats[]> {
    try {
      if (!backend) {
        return [];
      }

      // Mock data for now until we have more backend methods
      const mockCreators: CreatorStats[] = [
        {
          username: "Kerafuru",
          certificateCount: 47,
          sessionCount: 23,
          hasSubscription: true,
          subscriptionType: "Premium",
        },
        {
          username: "Darmau",
          certificateCount: 32,
          sessionCount: 18,
          hasSubscription: true,
          subscriptionType: "Basic",
        },
        {
          username: "Arziki",
          certificateCount: 28,
          sessionCount: 15,
          hasSubscription: false,
        },
      ];

      return mockCreators.slice(0, 8);
    } catch (error) {
      console.error("Failed to fetch top creators:", error);
      return [];
    }
  },
};
