import type { User, NFT, Collection } from "../types/marketplace";
import { mockUsers, mockNFTs, mockCollections } from "../utils/mockData";

/**
 * User Service - Handles user-related operations for marketplace
 */
export class UserService {
  /**
   * Get user profile by username
   */
  static async getUserProfile(username: string): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockUsers.find((user) => user.username === username) || null;
  }

  /**
   * Get user's created NFTs
   */
  static async getUserCreatedNFTs(_username: string): Promise<NFT[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockNFTs.filter((nft) => nft.creator.username === _username);
  }

  /**
   * Get user's owned NFTs (different from created)
   */
  static async getUserOwnedNFTs(_username: string): Promise<NFT[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    // In a real app, this would track ownership transfers
    // For now, return a subset of all NFTs as "owned"
    return mockNFTs.filter((_nft, index) => index % 3 === 0);
  }

  /**
   * Get user's collections
   */
  static async getUserCollections(_username: string): Promise<Collection[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockCollections.filter(
      (collection) => collection.creator.username === _username,
    );
  }

  /**
   * Get user dashboard stats
   */
  static async getUserDashboardStats(_username: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const userNFTs = mockNFTs.filter(
      (nft) => nft.creator.username === _username,
    );
    const userCollections = mockCollections.filter(
      (collection) => collection.creator.username === _username,
    );

    const totalSales = userNFTs.filter((nft) => nft.status === "sold").length;
    const totalVolume = userNFTs.reduce((sum, nft) => {
      if (nft.status === "sold") {
        return sum + parseFloat(nft.price.amount);
      }
      return sum;
    }, 0);

    return {
      totalNFTs: userNFTs.length,
      totalCollections: userCollections.length,
      totalSales,
      totalVolume: totalVolume.toFixed(2),
      activeListings: userNFTs.filter((nft) => nft.status === "for_sale")
        .length,
      totalViews: userNFTs.reduce((sum, nft) => sum + nft.views, 0),
      totalLikes: userNFTs.reduce((sum, nft) => sum + nft.likes, 0),
      averagePrice:
        userNFTs.length > 0
          ? (
              userNFTs.reduce(
                (sum, nft) => sum + parseFloat(nft.price.amount),
                0,
              ) / userNFTs.length
            ).toFixed(2)
          : "0",
    };
  }

  /**
   * Get user activity feed
   */
  static async getUserActivity(_username: string) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Mock activity data
    const activities = [
      {
        id: "1",
        type: "nft_created" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        nftTitle: "Digital Sunset #42",
        nftId: "nft_1",
        price: "15.5 ICP",
      },
      {
        id: "2",
        type: "nft_sold" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        nftTitle: "Abstract Vision",
        nftId: "nft_2",
        price: "22.0 ICP",
        buyer: "collector_jane",
      },
      {
        id: "3",
        type: "collection_created" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        collectionName: "Urban Dreams",
        collectionId: "coll_1",
      },
      {
        id: "4",
        type: "nft_liked" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        nftTitle: "Cosmic Dance",
        nftId: "nft_3",
        liker: "art_enthusiast",
      },
      {
        id: "5",
        type: "profile_updated" as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      },
    ];

    return activities;
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    _username: string,
    profileData: Partial<User>,
  ): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = mockUsers.find((u) => u.username === _username);
    if (!user) {
      throw new Error("User not found");
    }

    // In a real app, this would update the user in the database
    const updatedUser: User = { ...user, ...profileData };
    return updatedUser;
  }

  /**
   * Get portfolio value chart data
   */
  static async getPortfolioValue(_username: string) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Mock chart data for the last 30 days
    const chartData = Array.from({ length: 30 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - index));

      // Generate realistic-looking portfolio values
      const baseValue = 1000;
      const variation = Math.sin(index * 0.2) * 200 + Math.random() * 100;
      const value = baseValue + variation;

      return {
        date: date.toISOString().split("T")[0],
        value: Math.max(0, value).toFixed(2),
      };
    });

    return chartData;
  }

  /**
   * Get user transactions history
   */
  static async getUserTransactions(_username: string) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock transaction history
    const transactions = [
      {
        id: "tx_001",
        type: "sale" as const,
        nftTitle: "Digital Sunset #42",
        nftId: "nft_1",
        amount: "15.5 ICP",
        buyer: "collector_alice",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        status: "completed" as const,
      },
      {
        id: "tx_002",
        type: "purchase" as const,
        nftTitle: "Geometric Dreams",
        nftId: "nft_4",
        amount: "8.2 ICP",
        seller: "artist_bob",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        status: "completed" as const,
      },
      {
        id: "tx_003",
        type: "sale" as const,
        nftTitle: "Pixel Art Collection #1",
        nftId: "nft_5",
        amount: "12.0 ICP",
        buyer: "pixel_lover",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        status: "completed" as const,
      },
    ];

    return transactions;
  }

  /**
   * Check if user is following another user
   */
  static async isFollowing(
    _follower: string,
    _following: string,
  ): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    // Mock follow status
    return Math.random() > 0.5;
  }

  /**
   * Follow a user
   */
  static async followUser(_username: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return true;
  }

  /**
   * Unfollow a user
   */
  static async unfollowUser(_username: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return true;
  }
}
