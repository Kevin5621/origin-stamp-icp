import { backend } from "../../../declarations/backend";
import { idlFactory } from "../../../declarations/backend/backend.did.js";
import type { LoginResult } from "../../../declarations/backend/backend.did";
import { Actor } from "@dfinity/agent";
import { envService } from "./envService";
import { icpAgentService } from "./icpAgentService";

// Type for backend actor with common methods
interface BackendActor {
  register_user: (username: string, password: string) => Promise<LoginResult>;
  login: (username: string, password: string) => Promise<LoginResult>;
  get_certificate_count: () => Promise<bigint>;
  get_user_count: () => Promise<bigint>;
  get_user_avatar: (username: string) => Promise<[] | [string]>;
  get_session_count: () => Promise<bigint>;
  get_s3_config: () => Promise<
    [] | [import("../../../declarations/backend/backend.did").S3Config]
  >;
  get_s3_config_status: () => Promise<boolean>;
  update_user_avatar: (
    username: string,
    avatar_url: string,
  ) => Promise<import("../../../declarations/backend/backend.did").Result>;
  create_physical_art_session: (
    username: string,
    art_title: string,
    description: string,
  ) => Promise<import("../../../declarations/backend/backend.did").Result_1>;
  upload_photo_to_session: (
    session_id: string,
    photo_url: string,
  ) => Promise<import("../../../declarations/backend/backend.did").Result_1>;
  get_session_details: (
    session_id: string,
  ) => Promise<
    | []
    | [import("../../../declarations/backend/backend.did").PhysicalArtSession]
  >;
  get_user_sessions: (
    username: string,
  ) => Promise<
    import("../../../declarations/backend/backend.did").PhysicalArtSession[]
  >;
  update_session_status: (
    session_id: string,
    status: string,
  ) => Promise<import("../../../declarations/backend/backend.did").Result_1>;
  remove_photo_from_session: (
    session_id: string,
    photo_url: string,
  ) => Promise<import("../../../declarations/backend/backend.did").Result_1>;
}

// Initialize ICP agent for proper connection (only on client-side)
if (typeof window !== "undefined") {
  icpAgentService.initialize().catch((error) => {
    console.error("❌ ICP Agent initialization failed:", error);
  });
}

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
 * Get a properly configured backend actor using the ICP agent service
 */
export async function getBackendActor(): Promise<BackendActor | null> {
  try {
    // Always use ICP agent service to create actor with proper environment
    const canisterId = envService.getBackendCanisterId();
    if (!canisterId) {
      throw new Error("Backend canister ID not found in environment");
    }

    const agent = await icpAgentService.getAgent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const backendActor = Actor.createActor(idlFactory as any, {
      agent,
      canisterId,
    });

    return backendActor as unknown as BackendActor;
  } catch (error) {
    console.error("❌ Failed to create backend actor:", error);

    // Only fallback to imported backend if it exists
    if (backend) {
      return backend as BackendActor;
    }

    return null;
  }
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
    // Ensure ICP agent is initialized before making calls
    await icpAgentService.initialize();

    // Get a properly configured backend actor
    const backendActor = await getBackendActor();

    if (!backendActor) {
      throw new Error(
        "Backend canister not initialized. Please check your environment configuration.",
      );
    }

    try {
      const result = await backendActor.register_user(username, password);
      return result;
    } catch (error) {
      console.error("💥 Error calling backend.register_user:", error);
      throw error;
    }
  },

  /**
   * Logs in a user
   * @param username User's username
   * @param password User's password
   * @returns Promise with the login result
   */
  async login(username: string, password: string): Promise<LoginResult> {
    // Ensure ICP agent is initialized before making calls
    await icpAgentService.initialize();

    // Get a properly configured backend actor
    const backendActor = await getBackendActor();

    if (!backendActor) {
      throw new Error(
        "Backend canister not initialized. Please check your environment configuration.",
      );
    }

    try {
      const result = await backendActor.login(username, password);
      return result;
    } catch (error) {
      console.error("💥 Error calling backend.login:", error);
      throw error;
    }
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
   * Gets user avatar URL
   * @param username Username to lookup
   * @returns Promise with avatar URL or null
   */
  async getUserAvatar(username: string): Promise<string | null> {
    try {
      await icpAgentService.initialize();
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
      await icpAgentService.initialize();
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

  /**
   * Checks if backend is available
   * @returns boolean indicating if backend is initialized
   */
  isAvailable(): boolean {
    // Check if we can get the backend canister ID from environment
    const canisterId = envService.getBackendCanisterId();
    return !!canisterId;
  },

  /**
   * Gets backend canister ID
   * @returns canister ID string or undefined
   */
  getCanisterId(): string | undefined {
    return envService.getBackendCanisterId();
  },

  /**
   * Gets marketplace statistics
   * @returns Promise with marketplace stats
   */
  async getMarketplaceStats(): Promise<NFTMarketplaceStats> {
    try {
      // Ensure ICP agent is initialized before making calls
      await icpAgentService.initialize();

      // Get a properly configured backend actor
      const backendActor = await getBackendActor();

      if (!backendActor) {
        return {
          totalArtworks: "0+",
          totalCreators: "0+",
          totalSessions: "0+",
        };
      }

      const [certificateCount, userCount, sessionCount] = await Promise.all([
        backendActor.get_certificate_count(),
        backendActor.get_user_count(),
        backendActor.get_session_count(),
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

  /**
   * Gets S3 configuration from backend
   * @returns Promise with S3 config or null
   */
  async getS3Config(): Promise<
    import("../../../declarations/backend/backend.did").S3Config | null
  > {
    try {
      // Ensure ICP agent is initialized before making calls
      await icpAgentService.initialize();

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
          console.log("✅ S3 config retrieved from backend via backendService");
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
      await icpAgentService.initialize();

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

  /**
   * Get a properly configured backend actor
   * @returns Promise with backend actor or null
   */
  async getBackendActor(): Promise<BackendActor | null> {
    return await getBackendActor();
  },

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
      await icpAgentService.initialize();
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
      await icpAgentService.initialize();
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
    | import("../../../declarations/backend/backend.did").PhysicalArtSession
    | null
  > {
    try {
      await icpAgentService.initialize();
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
    import("../../../declarations/backend/backend.did").PhysicalArtSession[]
  > {
    try {
      await icpAgentService.initialize();
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
      await icpAgentService.initialize();
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
      await icpAgentService.initialize();
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
