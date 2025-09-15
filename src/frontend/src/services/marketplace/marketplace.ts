/**
 * Marketplace Service Module
 * Handles marketplace data fetching and management
 */

import { backendService } from "../backendService";

export interface FeaturedCollection {
  id: string;
  creatorUsername: string;
  creatorAvatar?: string;
  totalListedArtworks: number;
  floorPrice?: string;
  priceChange24h: number;
  verified: boolean;
  sampleArtworkUrl?: string;
  name: string; // Display name for the collection
}

export interface TrendingCreator {
  username: string;
  avatarUrl?: string;
  joinedDate: number;
  totalArtworks: number;
  verified: boolean;
  displayName?: string;
}

export interface MarketplaceBanner {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
}

export class MarketplaceService {
  /**
   * Get featured collections for marketplace
   * @returns Promise with featured collections data
   */
  static async getFeaturedCollections(): Promise<FeaturedCollection[]> {
    try {
      const collections =
        await backendService.getMarketplaceFeaturedCollections();

      if (!Array.isArray(collections)) {
        return [];
      }

      return collections.map((collection, index) => ({
        id: `collection-${index}`,
        creatorUsername: collection.creator_username,
        creatorAvatar: collection.creator_avatar?.[0] || undefined,
        totalListedArtworks: Number(collection.total_listed_artworks),
        floorPrice: collection.floor_price?.[0] || undefined,
        priceChange24h: collection.price_change_24h,
        verified: collection.verified,
        sampleArtworkUrl: collection.sample_artwork_url?.[0] || undefined,
        name: `${collection.creator_username}'s Collection`,
      }));
    } catch (error) {
      console.error("Failed to fetch featured collections:", error);
      return [];
    }
  }

  /**
   * Get trending creators for marketplace
   * @param limit Number of creators to fetch
   * @returns Promise with trending creators data
   */
  static async getTrendingCreators(
    limit: number = 6,
  ): Promise<TrendingCreator[]> {
    try {
      const creators = await backendService.getTrendingCreators(BigInt(limit));

      if (!Array.isArray(creators)) {
        return [];
      }

      return creators.map((creator) => ({
        username: creator.username,
        avatarUrl: creator.avatar_url?.[0] || undefined,
        joinedDate: Number(creator.joined_date),
        totalArtworks: Number(creator.total_artworks),
        verified: creator.verified,
        displayName: creator.username, // Can be enhanced with actual display name
      }));
    } catch (error) {
      console.error("Failed to fetch trending creators:", error);
      return [];
    }
  }

  /**
   * Get marketplace banner content
   * @returns Promise with banner data
   */
  static async getMarketplaceBanner(): Promise<MarketplaceBanner | null> {
    try {
      const banner = await backendService.getMarketplaceBanner();

      if (!banner || !Array.isArray(banner) || banner.length === 0) {
        return null;
      }

      const bannerData = banner[0];
      return {
        title: bannerData.title,
        description: bannerData.description,
        ctaText: bannerData.cta_text,
        ctaLink: bannerData.cta_link,
        backgroundImage: bannerData.background_image?.[0] || undefined,
      };
    } catch (error) {
      console.error("Failed to fetch marketplace banner:", error);
      return null;
    }
  }

  /**
   * Get marketplace statistics for display
   * @returns Promise with marketplace stats
   */
  static async getMarketplaceStats() {
    try {
      const [featuredCollections, trendingCreators] = await Promise.all([
        this.getFeaturedCollections(),
        this.getTrendingCreators(10),
      ]);

      return {
        totalFeaturedCollections: featuredCollections.length,
        totalTrendingCreators: trendingCreators.length,
        totalListedArtworks: featuredCollections.reduce(
          (sum, collection) => sum + collection.totalListedArtworks,
          0,
        ),
      };
    } catch (error) {
      console.error("Failed to fetch marketplace stats:", error);
      return {
        totalFeaturedCollections: 0,
        totalTrendingCreators: 0,
        totalListedArtworks: 0,
      };
    }
  }
}
