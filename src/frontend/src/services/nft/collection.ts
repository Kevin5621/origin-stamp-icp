/**
 * Collection Service Module
 * Handles NFT collection operations and management
 */

import { backendService } from "../backendService";

export interface NFTCollectionItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  creator: {
    username: string;
    avatar?: string;
    verified: boolean;
  };
  metadata: {
    certificateId: string;
    sessionId: string;
    verificationScore: number;
    authenticityRating: number;
    provenanceScore: number;
    communityTrust: number;
    issueDate: string;
    expiryDate: string;
    blockchain: string;
    tokenStandard: string;
  };
  stats: {
    views: number;
    likes: number;
    createdAt: string;
  };
  ownership: {
    isOwner: boolean;
    isCreator: boolean;
    purchasePrice?: string;
    purchaseDate?: string;
    currentValue?: string;
  };
  listing?: {
    price: string;
    currency: "ICP" | "USDT";
    isListed: boolean;
    listingDate?: string;
  };
}

export interface CollectionStats {
  totalItems: number;
  portfolioValue: string;
  createdByMe: number;
  favorites: number;
  totalGain: number;
  gainPercentage: number;
}

export interface FavoriteItem {
  id: string;
  nftId: string;
  title: string;
  artist: string;
  price: string;
  imageUrl: string;
  addedDate: string;
}

export class CollectionService {
  /**
   * Get user's NFT collection (owned NFTs)
   */
  static async getUserCollection(
    userPrincipal: string,
  ): Promise<NFTCollectionItem[]> {
    try {
      // Use the provided userPrincipal directly for consistent ownership
      const userNFTs = await backendService.getUserNFTs(userPrincipal);

      const collection: NFTCollectionItem[] = [];

      for (const token of userNFTs) {
        try {
          // Get session details for additional metadata
          const sessionDetails =
            Array.isArray(token.session_id) && token.session_id.length > 0
              ? await backendService.getSessionDetails(
                  token.session_id[0] || "",
                )
              : null;

          const nftItem: NFTCollectionItem = {
            id: token.id.toString(),
            title: token.metadata.name,
            description: Array.isArray(token.metadata.description)
              ? token.metadata.description[0] || ""
              : token.metadata.description || "",
            imageUrl: Array.isArray(token.metadata.image)
              ? token.metadata.image[0] || ""
              : token.metadata.image || "",
            creator: {
              username: sessionDetails?.username || "Unknown Artist",
              avatar: "",
              verified: true,
            },
            metadata: {
              certificateId: "",
              sessionId: Array.isArray(token.session_id)
                ? token.session_id[0] || ""
                : "",
              verificationScore: 0, // Will be populated from actual verification data
              authenticityRating: 0, // Will be populated from actual verification data
              provenanceScore: 0, // Will be populated from actual verification data
              communityTrust: 0, // Will be populated from actual verification data
              issueDate: new Date(
                Number(token.created_at) / 1000000,
              ).toISOString(),
              expiryDate: new Date(
                Date.now() + 365 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              blockchain: "Internet Computer",
              tokenStandard: "ICRC-7",
            },
            stats: {
              views: 0, // Will be populated from actual analytics
              likes: 0, // Will be populated from actual analytics
              createdAt: new Date(
                Number(token.created_at) / 1000000,
              ).toISOString(),
            },
            ownership: {
              isOwner: true,
              isCreator: false, // Will be determined by checking if creator matches current user
              purchasePrice: "0 ICP", // Default for created NFTs
              purchaseDate: new Date(
                Number(token.created_at) / 1000000,
              ).toISOString(),
              currentValue: "0 ICP", // Will be updated with market data
            },
            listing:
              token.listing && token.listing.length > 0 && token.listing[0]
                ? {
                    price: `${token.listing[0].price} ${Object.keys(token.listing[0].currency)[0]}`,
                    currency: Object.keys(token.listing[0].currency)[0] as
                      | "ICP"
                      | "USDT",
                    isListed: token.listing[0].is_active,
                    listingDate: new Date(
                      Number(token.listing[0].listed_at) / 1000000,
                    ).toISOString(),
                  }
                : undefined,
          };

          collection.push(nftItem);
        } catch (error) {
          console.error(
            `[CollectionService] Error processing NFT ${token.id}:`,
            error,
          );
        }
      }

      return collection;
    } catch (error) {
      console.error(
        "[CollectionService] Failed to load user collection:",
        error,
      );
      throw error;
    }
  }

  /**
   * Get NFTs created by user (filter from owned NFTs where isCreator = true)
   */
  static async getUserCreatedNFTs(
    username: string,
  ): Promise<NFTCollectionItem[]> {
    try {
      // Get user's principal from auth service to ensure proper ownership
      const { AuthService } = await import("../auth");
      const userPrincipal = await AuthService.getCurrentUserPrincipal();

      if (!userPrincipal) {
        throw new Error("User not authenticated");
      }

      const userNFTs = await backendService.getUserNFTs(userPrincipal.toText());

      const createdNFTs: NFTCollectionItem[] = [];

      for (const token of userNFTs) {
        try {
          // Check if this NFT was created by this user
          // For now, we'll consider all owned NFTs as created by user
          // Later this should check session data or creator metadata
          const nftItem: NFTCollectionItem = {
            id: token.id.toString(),
            title: token.metadata.name,
            description: Array.isArray(token.metadata.description)
              ? token.metadata.description[0] || "Your artwork"
              : token.metadata.description || "Your artwork",
            imageUrl: Array.isArray(token.metadata.image)
              ? token.metadata.image[0] || ""
              : token.metadata.image || "",
            creator: {
              username: username,
              avatar: "",
              verified: true,
            },
            metadata: {
              certificateId: Array.isArray(token.session_id)
                ? token.session_id[0] || ""
                : token.session_id || "",
              sessionId: Array.isArray(token.session_id)
                ? token.session_id[0] || ""
                : token.session_id || "",
              verificationScore: 95,
              authenticityRating: 100,
              provenanceScore: 100,
              communityTrust: 95,
              issueDate: new Date(
                Number(token.created_at) / 1000000,
              ).toISOString(),
              expiryDate: new Date(
                Date.now() + 365 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              blockchain: "Internet Computer",
              tokenStandard: "ICRC-7",
            },
            stats: {
              views: 0,
              likes: 0,
              createdAt: new Date(
                Number(token.created_at) / 1000000,
              ).toISOString(),
            },
            ownership: {
              isOwner: true,
              isCreator: true, // All owned NFTs considered as created by user
              purchasePrice: "0 ICP",
              purchaseDate: new Date(
                Number(token.created_at) / 1000000,
              ).toISOString(),
              currentValue: "0 ICP",
            },
            listing:
              token.listing && token.listing.length > 0 && token.listing[0]
                ? {
                    price: `${token.listing[0].price} ${Object.keys(token.listing[0].currency)[0]}`,
                    currency: Object.keys(token.listing[0].currency)[0] as
                      | "ICP"
                      | "USDT",
                    isListed: token.listing[0].is_active,
                    listingDate: new Date(
                      Number(token.listing[0].listed_at) / 1000000,
                    ).toISOString(),
                  }
                : undefined,
          };

          createdNFTs.push(nftItem);
        } catch (error) {
          console.error(`Error processing created NFT ${token.id}:`, error);
        }
      }

      return createdNFTs;
    } catch (error) {
      console.error("[CollectionService] Failed to load created NFTs:", error);
      throw error;
    }
  }

  /**
   * Get user's favorite NFTs
   */
  static async getUserFavorites(username: string): Promise<FavoriteItem[]> {
    try {
      console.log(`[CollectionService] Loading favorites for: ${username}`);

      // TODO: needs to be implemented in backend - using empty array for now
      const favorites: FavoriteItem[] = [];

      console.log(`[CollectionService] Loaded ${favorites.length} favorites`);
      return favorites;
    } catch (error) {
      console.error("[CollectionService] Failed to load favorites:", error);
      throw error;
    }
  }

  /**
   * Calculate collection statistics
   */
  static async getCollectionStats(
    userPrincipal: string,
    username: string,
  ): Promise<CollectionStats> {
    try {
      const [ownedNFTs, createdNFTs, favorites] = await Promise.all([
        this.getUserCollection(userPrincipal), // Use provided user principal
        this.getUserCreatedNFTs(username),
        this.getUserFavorites(username),
      ]);

      // Calculate portfolio value (simplified)
      const portfolioValue = ownedNFTs.reduce((total, nft) => {
        const value = parseFloat(
          nft.ownership.currentValue?.replace(" ICP", "") || "0",
        );
        return total + value;
      }, 0);

      // Calculate total gain (simplified)
      const totalGain = ownedNFTs.reduce((total, nft) => {
        const purchase = parseFloat(
          nft.ownership.purchasePrice?.replace(" ICP", "") || "0",
        );
        const current = parseFloat(
          nft.ownership.currentValue?.replace(" ICP", "") || "0",
        );
        return total + (current - purchase);
      }, 0);

      const gainPercentage =
        portfolioValue > 0 ? (totalGain / portfolioValue) * 100 : 0;

      return {
        totalItems: ownedNFTs.length,
        portfolioValue: `${portfolioValue.toFixed(2)} ICP`,
        createdByMe: createdNFTs.length,
        favorites: favorites.length,
        totalGain,
        gainPercentage,
      };
    } catch (error) {
      console.error(
        "[CollectionService] Failed to calculate collection stats:",
        error,
      );
      throw error;
    }
  }

  /**
   * Set NFT price for listing
   */
  static async setNFTPrice(
    nftId: string,
    price: string,
    currency: "ICP" | "USDT",
  ): Promise<boolean> {
    try {
      // Get backend actor
      const backendActor = await backendService.getBackendActor();
      if (!backendActor) {
        throw new Error("Backend service not available");
      }

      // Convert currency string to backend enum format
      const backendCurrency =
        currency === "ICP" ? { ICP: null } : { USDT: null };

      // Call backend to list the NFT
      const result = await backendActor.list_nft(
        BigInt(nftId),
        price,
        backendCurrency,
      );

      if (result.success) {
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("[CollectionService] Failed to set NFT price:", error);
      throw error;
    }
  }

  /**
   * Remove NFT from sale (delist)
   */
  static async delistNFT(nftId: string): Promise<boolean> {
    try {
      // Get backend actor
      const backendActor = await backendService.getBackendActor();
      if (!backendActor) {
        throw new Error("Backend service not available");
      }

      // Call backend to delist the NFT
      const result = await backendActor.delist_nft(BigInt(nftId));

      if (result.success) {
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("[CollectionService] Failed to delist NFT:", error);
      throw error;
    }
  }

  /**
   * Add NFT to favorites
   */
  static async addToFavorites(
    nftId: string,
    username: string,
  ): Promise<boolean> {
    try {
      // would call backend to add to favorites
      // For now, just return success as favorites aren't implemented yet
      return true;
    } catch (error) {
      console.error("[CollectionService] Failed to add to favorites:", error);
      throw error;
    }
  }

  /**
   * Remove NFT from favorites
   */
  static async removeFromFavorites(
    nftId: string,
    username: string,
  ): Promise<boolean> {
    try {
      // would call backend to remove from favorites
      // For now, just return success as favorites aren't implemented yet
      return true;
    } catch (error) {
      console.error(
        "[CollectionService] Failed to remove from favorites:",
        error,
      );
      throw error;
    }
  }
}
