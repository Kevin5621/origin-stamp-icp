/**
 * Dashboard Service Module
 * Handles dashboard data and statistics operations
 */

import { backend } from "../../../../declarations/backend";
import { getBackendActor, initializeBackend } from "../core/backend";
import type { NFTMarketplaceStats, CreatorStats } from "../core/types";

/**
 * Dashboard Statistics Service
 */
export const dashboardStatsService = {
  /**
   * Gets marketplace statistics
   * @returns Promise with marketplace stats
   */
  async getMarketplaceStats(): Promise<NFTMarketplaceStats> {
    try {
      // Ensure ICP agent is initialized before making calls
      await initializeBackend();

      // Get a properly configured backend actor
      const backendActor = await getBackendActor();

      if (!backendActor) {
        return {
          totalArtworks: "0+",
          totalCreators: "0+",
          totalSessions: "0+",
        };
      }

      const [certificateCount, userCount, sessionCount] = await Promise.all([
        backendActor.get_certificate_count(),
        backendActor.get_user_count(),
        backendActor.get_session_count(),
      ]);

      return {
        totalArtworks: `${certificateCount}+`,
        totalCreators: `${userCount}+`,
        totalSessions: `${sessionCount}+`,
      };
    } catch (error) {
      console.error("Failed to fetch marketplace stats:", error);
      return {
        totalArtworks: "0+",
        totalCreators: "0+",
        totalSessions: "0+",
      };
    }
  },

  /**
   * Gets top creators
   * @returns Promise with creator stats array
   */
  async getTopCreators(): Promise<CreatorStats[]> {
    try {
      if (!backend) {
        return [];
      }

      // Mock data for now until we have more backend methods
      const mockCreators: CreatorStats[] = [
        {
          username: "Kerafuru",
          certificateCount: 47,
          sessionCount: 23,
          hasSubscription: true,
          subscriptionType: "Premium",
        },
        {
          username: "Darmau",
          certificateCount: 32,
          sessionCount: 18,
          hasSubscription: true,
          subscriptionType: "Basic",
        },
        {
          username: "Arziki",
          certificateCount: 28,
          sessionCount: 15,
          hasSubscription: false,
        },
      ];

      return mockCreators.slice(0, 8);
    } catch (error) {
      console.error("Failed to fetch top creators:", error);
      return [];
    }
  },
};
