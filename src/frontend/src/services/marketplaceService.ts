import type {
  NFT,
  User,
  Collection,
  FilterOptions,
  SearchResult,
  CreateNFTData,
} from "../types/marketplace";
import { backend } from "../../../declarations/backend";
import type { Token } from "../../../declarations/backend/backend.did";

/**
 * Marketplace Service - Handles all marketplace operations
 */
export class MarketplaceService {
  /**
   * Get all NFTs with optional filtering
   */
  static async getNFTs(_filters: Partial<FilterOptions> = {}): Promise<NFT[]> {
    try {
      // Get all token IDs first
      const tokenIds = await backend.icrc7_tokens([], []);

      if (tokenIds.length === 0) {
        return [];
      }

      // Get details for each token
      const nftPromises = Array.from(tokenIds).map(async (tokenId: bigint) => {
        const tokenDetails = await backend.get_token_details(tokenId);
        if (tokenDetails && tokenDetails.length > 0) {
          const token = tokenDetails[0];
          if (token) {
            return this.convertTokenToNFT(token);
          }
        }
        return null;
      });

      const nfts = await Promise.all(nftPromises);
      return nfts.filter((nft): nft is NFT => nft !== null);
    } catch (error) {
      console.error("Failed to load NFTs:", error);
      return [];
    }
  }

  /**
   * Helper function to convert backend Token to frontend NFT type
   */
  private static convertTokenToNFT(token: Token): NFT {
    return {
      id: token.id.toString(),
      title: token.metadata.name,
      description:
        (Array.isArray(token.metadata.description)
          ? token.metadata.description.length > 0
            ? token.metadata.description[0]
            : ""
          : token.metadata.description || "") || "",
      imageUrl:
        (Array.isArray(token.metadata.image)
          ? token.metadata.image.length > 0
            ? token.metadata.image[0]
            : ""
          : token.metadata.image || "") || "",
      creator: {
        username: token.owner.owner.toString().slice(0, 10) + "...", // Truncate principal ID
        avatar: "", // Would need to be fetched separately
        verified: false, // Would need to be tracked separately
      },
      price: {
        amount: "0", // Price would need to be set separately
        currency: "ICP" as const,
      },
      status: "for_sale" as const, // Would need to be tracked separately
      originStamp: {
        certificateId:
          (token.session_id && token.session_id.length > 0
            ? token.session_id[0]
            : "") || "",
        creationProcess: true, // All tokens from sessions have creation process
        verified: true, // All tokens from backend are verified
      },
      likes: 0, // Would need to be tracked separately
      views: 0, // Would need to be tracked separately
      createdAt: new Date(Number(token.created_at) / 1000000).toISOString(), // Convert nanoseconds to milliseconds
      tags: this.getTagsFromAttributes(token.metadata.attributes),
      collection: "Origin Stamp Collection", // Default collection name
    };
  }

  /**
   * Helper function to extract tags from token attributes
   */
  private static getTagsFromAttributes(
    attributes: Array<{ trait_type: string; value: string }>,
  ): string[] {
    return attributes.map((attr) => `${attr.trait_type}:${attr.value}`);
  }

  /**
   * Get NFT by ID
   */
  static async getNFTById(_id: string): Promise<NFT | null> {
    // TODO: Implement real NFT loading from backend
    return null;
  }

  /**
   * Search NFTs, collections, and users
   */
  static async searchNFTs(_query: string): Promise<SearchResult> {
    // TODO: Implement real search from backend
    return {
      nfts: [],
      collections: [],
      users: [],
      total: 0,
      hasMore: false,
    };
  }

  /**
   * Buy NFT
   */
  static async buyNFT(
    _nftId: string,
    _buyerId: string,
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    // TODO: Implement real NFT purchase from backend
    return { success: false, error: "Not implemented yet" };
  }

  /**
   * Create new NFT
   */
  static async createNFT(_nftData: CreateNFTData): Promise<NFT> {
    // TODO: Implement real NFT creation from backend
    throw new Error("Not implemented yet");
  }

  /**
   * Get user NFTs
   */
  static async getUserNFTs(_userId: string): Promise<NFT[]> {
    // TODO: Implement real user NFT loading from backend
    return [];
  }

  /**
   * Get collections
   */
  static async getCollections(): Promise<Collection[]> {
    try {
      // Get all NFTs first
      const nfts = await this.getNFTs();

      if (nfts.length === 0) {
        return [];
      }

      // Group NFTs by their session IDs to create collections
      const sessionGroups = new Map<string, NFT[]>();
      const sessionIds = new Set<string>();

      // Group NFTs by session
      nfts.forEach((nft) => {
        if (nft.originStamp.certificateId) {
          const sessionId = nft.originStamp.certificateId;
          sessionIds.add(sessionId);

          if (!sessionGroups.has(sessionId)) {
            sessionGroups.set(sessionId, []);
          }
          sessionGroups.get(sessionId)!.push(nft);
        }
      });

      // Get session details for each unique session
      const collections: Collection[] = [];

      for (const sessionId of sessionIds) {
        try {
          const sessionDetails = await backend.get_session_details(sessionId);
          const sessionNfts = sessionGroups.get(sessionId) || [];

          if (
            sessionDetails &&
            sessionDetails.length > 0 &&
            sessionNfts.length > 0
          ) {
            const session = sessionDetails[0];

            if (session) {
              // Create a collection for this session
              const collection: Collection = {
                id: sessionId,
                name: session.art_title,
                description: session.description,
                coverImage:
                  sessionNfts.length > 0 && sessionNfts[0].imageUrl
                    ? sessionNfts[0].imageUrl
                    : "https://via.placeholder.com/600x400/4A5568/ffffff?text=" +
                      encodeURIComponent(session.art_title),
                creator: {
                  username: session.username,
                  avatar: "",
                  bio: `Physical art session by ${session.username}`,
                  verified: true, // Sessions are verified through the platform
                  followers: 0,
                  following: 0,
                  totalSales: 0,
                  totalVolume: "0",
                },
                nfts: sessionNfts,
                stats: {
                  totalItems: sessionNfts.length,
                  floorPrice: "0", // Would need to be calculated from actual prices
                  totalVolume: "0", // Would need to be calculated from sales
                  owners: new Set(
                    sessionNfts.map((nft) => nft.creator.username),
                  ).size,
                },
              };

              collections.push(collection);
            }
          }
        } catch (error) {
          console.error(
            `Failed to load session details for ${sessionId}:`,
            error,
          );
          // Continue with other sessions even if one fails
        }
      }

      // If we have collections from sessions, return them
      if (collections.length > 0) {
        return collections;
      }

      // Fallback: Create a single collection with all NFTs if no session data
      const collectionMetadata = await backend.icrc7_collection_metadata();

      const fallbackCollection: Collection = {
        id: "1",
        name: collectionMetadata.name,
        description:
          (Array.isArray(collectionMetadata.description)
            ? collectionMetadata.description.length > 0
              ? collectionMetadata.description[0]
              : "NFT collection from Origin Stamp"
            : collectionMetadata.description ||
              "NFT collection from Origin Stamp") ||
          "NFT collection from Origin Stamp",
        coverImage:
          (Array.isArray(collectionMetadata.image)
            ? collectionMetadata.image.length > 0
              ? collectionMetadata.image[0]
              : ""
            : collectionMetadata.image || "") ||
          "https://via.placeholder.com/600x400/4A5568/ffffff?text=" +
            encodeURIComponent(collectionMetadata.name),
        creator: {
          username: "Origin Stamp",
          avatar: "",
          bio: "Authenticated physical art collection platform",
          verified: true,
          followers: 0,
          following: 0,
          totalSales: 0,
          totalVolume: "0",
        },
        nfts: nfts,
        stats: {
          totalItems: Number(collectionMetadata.total_supply),
          floorPrice: "0",
          totalVolume: "0",
          owners: new Set(nfts.map((nft) => nft.creator.username)).size,
        },
      };

      return [fallbackCollection];
    } catch (error) {
      console.error("Failed to load collections:", error);
      return [];
    }
  }

  /**
   * Get collections for a specific user
   */
  static async getUserCollections(username: string): Promise<Collection[]> {
    try {
      // Get user sessions first
      const userSessions = await backend.get_user_sessions(username);

      if (userSessions.length === 0) {
        return [];
      }

      const collections: Collection[] = [];

      // Create a collection for each session
      for (const session of userSessions) {
        try {
          // Get NFTs for this session
          const sessionNfts = await backend.get_session_nfts(
            session.session_id,
          );

          if (sessionNfts.length > 0) {
            // Convert backend tokens to frontend NFTs
            const nfts = sessionNfts.map((token) =>
              this.convertTokenToNFT(token),
            );

            const collection: Collection = {
              id: session.session_id,
              name: session.art_title,
              description: session.description,
              coverImage:
                nfts.length > 0 && nfts[0].imageUrl
                  ? nfts[0].imageUrl
                  : "https://via.placeholder.com/600x400/4A5568/ffffff?text=" +
                    encodeURIComponent(session.art_title),
              creator: {
                username: session.username,
                avatar: "",
                bio: `Physical art session by ${session.username}`,
                verified: true,
                followers: 0,
                following: 0,
                totalSales: 0,
                totalVolume: "0",
              },
              nfts: nfts,
              stats: {
                totalItems: nfts.length,
                floorPrice: "0",
                totalVolume: "0",
                owners: new Set(nfts.map((nft) => nft.creator.username)).size,
              },
            };

            collections.push(collection);
          }
        } catch (error) {
          console.error(
            `Failed to load NFTs for session ${session.session_id}:`,
            error,
          );
          // Continue with other sessions
        }
      }

      return collections;
    } catch (error) {
      console.error(`Failed to load collections for user ${username}:`, error);
      return [];
    }
  }

  /**
   * Get collection by ID
   */
  static async getCollectionById(_id: string): Promise<Collection | null> {
    // TODO: Implement real collection loading from backend
    return null;
  }

  /**
   * Get user by username
   */
  static async getUserByUsername(_username: string): Promise<User | null> {
    // TODO: Implement real user loading from backend
    return null;
  }

  /**
   * Get categories
   */
  static async getCategories(): Promise<string[]> {
    // TODO: Implement real categories loading from backend
    return [];
  }

  /**
   * Get marketplace statistics
   */
  static async getMarketplaceStats() {
    // TODO: Implement real marketplace stats loading from backend
    return {
      totalNFTs: 0,
      totalVolume: "0 ICP",
      activeUsers: 0,
      totalSales: 0,
      averagePrice: "0 ICP",
      trendingCollections: [],
    };
  }

  /**
   * Like NFT
   */
  static async likeNFT(_nftId: string): Promise<boolean> {
    // TODO: Implement real NFT liking from backend
    return false;
  }

  /**
   * Unlike NFT
   */
  static async unlikeNFT(_nftId: string): Promise<boolean> {
    // TODO: Implement real NFT unliking from backend
    return false;
  }

  /**
   * Follow user
   */
  static async followUser(_username: string): Promise<boolean> {
    // TODO: Implement real user following from backend
    return false;
  }

  /**
   * Unfollow user
   */
  static async unfollowUser(_username: string): Promise<boolean> {
    // TODO: Implement real user unfollowing from backend
    return false;
  }

  /**
   * Validate uploaded files
   */
  static validateFiles(files: FileList): {
    valid: File[];
    invalid: { file: File; reason: string }[];
  } {
    const valid: File[] = [];
    const invalid: { file: File; reason: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file type
      if (!file.type.startsWith("image/")) {
        invalid.push({ file, reason: "File must be an image" });
        continue;
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        invalid.push({ file, reason: "File size must be less than 10MB" });
        continue;
      }

      // Check file extension
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));
      if (!allowedExtensions.includes(fileExtension)) {
        invalid.push({
          file,
          reason: "File type not supported. Use JPG, PNG, GIF, or WebP",
        });
        continue;
      }

      valid.push(file);
    }

    return { valid, invalid };
  }
}
