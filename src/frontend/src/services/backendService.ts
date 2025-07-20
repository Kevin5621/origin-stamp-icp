import { backend } from "../../../declarations/backend";
import type { LoginResult } from "../../../declarations/backend/backend.did";

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
    return await backend.register_user(username, password);
  },

  /**
   * Logs in a user
   * @param username User's username
   * @param password User's password
   * @returns Promise with the login result
   */
  async login(username: string, password: string): Promise<LoginResult> {
    return await backend.login(username, password);
  },

  /**
   * Gets all registered usernames
   * @returns Promise with array of usernames
   */
  async getAllUsers(): Promise<string[]> {
    return await backend.get_all_users();
  },

  /**
   * Gets user information by username
   * @param username Username to lookup
   * @returns Promise with user info (username, created_at) or undefined if not found
   */
  async getUserInfo(username: string): Promise<[string, bigint] | undefined> {
    const result = await backend.get_user_info(username);
    return result.length > 0 ? result[0] : undefined;
  },

  /**
   * Gets total number of registered users
   * @returns Promise with user count
   */
  async getUserCount(): Promise<bigint> {
    return await backend.get_user_count();
  },
};
