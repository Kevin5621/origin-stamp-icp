/**
 * Core backend actor creation and management
 * Centralizes actor creation logic for all modules
 */

import { backend } from "../../../../declarations/backend";
import { idlFactory } from "../../../../declarations/backend/backend.did.js";
import { Actor } from "@dfinity/agent";
import { envService } from "./environment";
import { icpAgentService } from "./agent";
import type { BackendActor } from "./types";

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
      return backend as unknown as BackendActor;
    }

    return null;
  }
}

/**
 * Initialize ICP agent and ensure backend connection
 */
export async function initializeBackend(): Promise<void> {
  // Initialize ICP agent for proper connection (only on client-side)
  if (typeof window !== "undefined") {
    await icpAgentService.initialize().catch((error) => {
      console.error("❌ ICP Agent initialization failed:", error);
    });
  }
}

/**
 * Check if backend service is available
 */
export function isBackendAvailable(): boolean {
  // Check if we can get the backend canister ID from environment
  const canisterId = envService.getBackendCanisterId();
  return !!canisterId;
}

/**
 * Get backend canister ID
 */
export function getBackendCanisterId(): string | undefined {
  return envService.getBackendCanisterId();
}
