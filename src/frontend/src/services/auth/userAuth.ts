/**
 * User Authentication Service Module
 * Handles user registration, login, and user info operations
 */

import type { LoginResult } from "../../../../declarations/backend/backend.did";
import { getBackendActor, initializeBackend } from "../core/backend";

/**
 * User Authentication Service
 */
export const userAuthService = {
  /**
   * Registers a new user
   * @param username Username for the new user
   * @param password Password for the new user
   * @returns Promise with the registration result
   */
  async registerUser(username: string, password: string): Promise<LoginResult> {
    // Ensure ICP agent is initialized before making calls
    await initializeBackend();

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
    await initializeBackend();

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
};
