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
      console.log(
        `[CollectionService] Loading user collection for: ${userPrincipal}`,
      );

      // Get user's NFTs from backend
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
              verificationScore: 95,
              authenticityRating: 98,
              provenanceScore: 92,
              communityTrust: 88,
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
              views: Math.floor(Math.random() * 1000) + 100,
              likes: Math.floor(Math.random() * 100) + 10,
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
          };

          collection.push(nftItem);
        } catch (error) {
          console.error(
            `[CollectionService] Error processing NFT ${token.id}:`,
            error,
          );
        }
      }

      console.log(
        `[CollectionService] Loaded ${collection.length} NFTs for user`,
      );
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
   * Get NFTs created by user
   */
  static async getUserCreatedNFTs(
    username: string,
  ): Promise<NFTCollectionItem[]> {
    try {
      console.log(`[CollectionService] Loading created NFTs for: ${username}`);

      // Get user's sessions
      const userSessions = await backendService.getUserSessions(username);

      const createdNFTs: NFTCollectionItem[] = [];

      for (const session of userSessions) {
        if (session.status === "completed") {
          try {
            // Try to find NFT for this session
            // TODO need to track NFT-session relationships
            const mockNFT: NFTCollectionItem = {
              id: `created_${session.session_id}`,
              title: session.art_title,
              description: session.description,
              imageUrl: session.uploaded_photos[0] || "",
              creator: {
                username: session.username,
                avatar: "",
                verified: true,
              },
              metadata: {
                certificateId: "",
                sessionId: session.session_id,
                verificationScore: 95,
                authenticityRating: 98,
                provenanceScore: 92,
                communityTrust: 88,
                issueDate: new Date(
                  Number(session.created_at) / 1000000,
                ).toISOString(),
                expiryDate: new Date(
                  Date.now() + 365 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                blockchain: "Internet Computer",
                tokenStandard: "ICRC-7",
              },
              stats: {
                views: Math.floor(Math.random() * 1000) + 100,
                likes: Math.floor(Math.random() * 100) + 10,
                createdAt: new Date(
                  Number(session.created_at) / 1000000,
                ).toISOString(),
              },
              ownership: {
                isOwner: false, // Creator is not automatically owner
                isCreator: true,
                purchasePrice: "0 ICP",
                purchaseDate: new Date(
                  Number(session.created_at) / 1000000,
                ).toISOString(),
                currentValue: "0 ICP",
              },
            };

            createdNFTs.push(mockNFT);
          } catch (error) {
            console.error(
              `[CollectionService] Error processing created NFT for session ${session.session_id}:`,
              error,
            );
          }
        }
      }

      console.log(
        `[CollectionService] Loaded ${createdNFTs.length} created NFTs`,
      );
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

      // TODO needs to be implemented in backend
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
        this.getUserCollection(userPrincipal),
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
      console.log(
        `[CollectionService] Setting price for NFT ${nftId}: ${price} ${currency}`,
      );

      // would call backend to update NFT listing price
      // TODO
      return true;
    } catch (error) {
      console.error("[CollectionService] Failed to set NFT price:", error);
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
      console.log(
        `[CollectionService] Adding NFT ${nftId} to favorites for ${username}`,
      );

      // would call backend to add to favorites
      // TODO
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
      console.log(
        `[CollectionService] Removing NFT ${nftId} from favorites for ${username}`,
      );

      // would call backend to remove from favorites
      // TODO
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
