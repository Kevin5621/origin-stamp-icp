import type {
  NFT,
  User,
  Collection,
  FilterOptions,
  SearchResult,
  CreateNFTData,
} from "../types/marketplace";
import {
  mockNFTs,
  mockUsers,
  mockCollections,
  mockCategories,
  mockMarketplaceStats,
} from "../utils/mockData";

/**
 * Marketplace Service - Handles all marketplace operations
 */
export class MarketplaceService {
  /**
   * Get all NFTs with optional filtering
   */
  static async getNFTs(filters: Partial<FilterOptions> = {}): Promise<NFT[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredNFTs = [...mockNFTs];

    // Apply filters
    if (filters.status && filters.status !== "all") {
      filteredNFTs = filteredNFTs.filter(
        (nft) => nft.status === filters.status,
      );
    }

    if (filters.originStampVerified) {
      filteredNFTs = filteredNFTs.filter((nft) => nft.originStamp.verified);
    }

    if (filters.creatorVerified) {
      filteredNFTs = filteredNFTs.filter((nft) => nft.creator.verified);
    }

    if (filters.priceRange) {
      filteredNFTs = filteredNFTs.filter((nft) => {
        const price = parseFloat(nft.price.amount);
        return (
          price >= filters.priceRange!.min && price <= filters.priceRange!.max
        );
      });
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "newest":
        filteredNFTs.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        filteredNFTs.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "price_low":
        filteredNFTs.sort(
          (a, b) => parseFloat(a.price.amount) - parseFloat(b.price.amount),
        );
        break;
      case "price_high":
        filteredNFTs.sort(
          (a, b) => parseFloat(b.price.amount) - parseFloat(a.price.amount),
        );
        break;
      case "popular":
        filteredNFTs.sort((a, b) => b.likes - a.likes);
        break;
    }

    return filteredNFTs;
  }

  /**
   * Get NFT by ID
   */
  static async getNFTById(id: string): Promise<NFT | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockNFTs.find((nft) => nft.id === id) || null;
  }

  /**
   * Search NFTs, collections, and users
   */
  static async searchNFTs(query: string): Promise<SearchResult> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const searchTerm = query.toLowerCase();

    const nfts = mockNFTs.filter(
      (nft) =>
        nft.title.toLowerCase().includes(searchTerm) ||
        nft.description.toLowerCase().includes(searchTerm) ||
        nft.creator.username.toLowerCase().includes(searchTerm) ||
        nft.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    );

    const collections = mockCollections.filter(
      (collection) =>
        collection.name.toLowerCase().includes(searchTerm) ||
        collection.description.toLowerCase().includes(searchTerm),
    );

    const users = mockUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.bio.toLowerCase().includes(searchTerm),
    );

    return {
      nfts,
      collections,
      users,
      total: nfts.length + collections.length + users.length,
      hasMore: false,
    };
  }

  /**
   * Buy NFT
   */
  static async buyNFT(
    nftId: string,
    _buyerId: string,
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const nft = mockNFTs.find((n) => n.id === nftId);
    if (!nft) {
      return { success: false, error: "NFT not found" };
    }

    if (nft.status !== "for_sale") {
      return { success: false, error: "NFT is not for sale" };
    }

    // Simulate successful purchase
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      transactionId,
    };
  }

  /**
   * Create new NFT
   */
  static async createNFT(nftData: CreateNFTData): Promise<NFT> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!nftData.file) {
      throw new Error("File is required");
    }

    const newNFT: NFT = {
      id: `nft_${Date.now()}`,
      title: nftData.title,
      description: nftData.description,
      imageUrl: URL.createObjectURL(nftData.file), // In real app, this would be uploaded to S3
      creator: mockUsers[0], // Current user
      price: {
        amount: nftData.price,
        currency: nftData.currency,
      },
      status: "for_sale",
      originStamp: {
        certificateId: `cert_${Date.now()}`,
        creationProcess: true,
        verified: true,
      },
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      tags: nftData.tags,
      collection: nftData.collection,
    };

    return newNFT;
  }

  /**
   * Get user NFTs
   */
  static async getUserNFTs(userId: string): Promise<NFT[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockNFTs.filter((nft) => nft.creator.username === userId);
  }

  /**
   * Get collections
   */
  static async getCollections(): Promise<Collection[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockCollections;
  }

  /**
   * Get collection by ID
   */
  static async getCollectionById(id: string): Promise<Collection | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockCollections.find((collection) => collection.id === id) || null;
  }

  /**
   * Get user by username
   */
  static async getUserByUsername(username: string): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockUsers.find((user) => user.username === username) || null;
  }

  /**
   * Get categories
   */
  static async getCategories(): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockCategories;
  }

  /**
   * Get marketplace statistics
   */
  static async getMarketplaceStats() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockMarketplaceStats;
  }

  /**
   * Like NFT
   */
  static async likeNFT(_nftId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return true;
  }

  /**
   * Unlike NFT
   */
  static async unlikeNFT(_nftId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return true;
  }

  /**
   * Follow user
   */
  static async followUser(_username: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return true;
  }

  /**
   * Unfollow user
   */
  static async unfollowUser(_username: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return true;
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
