/**
 * NFT Token Management Service Module
 * Handles token operations like getting token details and user NFTs
 */

import { getBackendActor, initializeBackend } from "../core/backend";

/**
 * NFT Token Service
 */
export const nftTokenService = {
  /**
   * Get token details by ID
   * @param tokenId Token ID
   * @returns Promise with token data or null
   */
  async getTokenDetails(tokenId: bigint): Promise<{
    id: bigint;
    owner: {
      owner: string;
      subaccount: [] | [number[]];
    };
    metadata: {
      name: string;
      description: [] | [string];
      attributes: Array<{ trait_type: string; value: string }>;
      image: [] | [string];
    };
    session_id: [] | [string];
    created_at: bigint;
  } | null> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.get_token_details(tokenId);

      if (result.length > 0) {
        const token = result[0]!;
        return {
          id: token.id,
          owner: {
            owner: token.owner.owner.toString(),
            subaccount: token.owner.subaccount as [] | [number[]],
          },
          metadata: {
            name: token.metadata.name,
            description: token.metadata.description,
            attributes: token.metadata.attributes,
            image: token.metadata.image,
          },
          session_id: token.session_id,
          created_at: token.created_at,
        };
      }

      return null;
    } catch (error) {
      console.error("Failed to get token details:", error);
      throw error;
    }
  },

  /**
   * Get user's NFTs
   * @param userPrincipal User principal
   * @returns Promise with array of user's NFTs
   */
  async getUserNFTs(
    userPrincipal: string,
  ): Promise<import("../../../../declarations/backend/backend.did").Token[]> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      // Convert string principal to Principal object
      const { Principal } = await import("@dfinity/principal");
      let principal;

      try {
        principal = Principal.fromText(userPrincipal);
      } catch (error) {
        console.error(`Invalid principal format: ${userPrincipal}`, error);
        throw new Error(`Invalid principal format: ${userPrincipal}`);
      }

      const result = await backendActor.get_user_nfts(principal);
      return result;
    } catch (error) {
      console.error("Failed to get user NFTs:", error);
      throw error;
    }
  },
};
