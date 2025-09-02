// Note: Backend import will be available after dfx generates declarations
// import { backend } from "../../declarations/backend";

export interface NFTMarketplaceStats {
  totalArtworks: string;
  totalCreators: string;
  totalSessions: string;
}

export interface CreatorStats {
  username: string;
  certificateCount: number;
  sessionCount: number;
  hasSubscription: boolean;
  subscriptionType?: string;
}

export class BackendService {
  static async getMarketplaceStats(): Promise<NFTMarketplaceStats> {
    // Uncomment when backend declarations are available
    // try {
    //   const [certificateCount, userCount, sessionCount] = await Promise.all([
    //     backend.get_certificate_count(),
    //     backend.get_user_count(),
    //     backend.get_session_count()
    //   ]);
    //   return {
    //     totalArtworks: `${certificateCount}+`,
    //     totalCreators: `${userCount}+`,
    //     totalSessions: `${sessionCount}+`
    //   };
    // } catch (error) {
    //   console.error("Failed to fetch marketplace stats:", error);
    //   return {
    //     totalArtworks: "0+",
    //     totalCreators: "0+",
    //     totalSessions: "0+"
    //   };
    // }

    // Mock data for now until backend is connected
    return {
      totalArtworks: "235k+",
      totalCreators: "87k+",
      totalSessions: "74k+",
    };
  }

  static async getTopCreators(): Promise<CreatorStats[]> {
    try {
      // Uncomment when backend declarations are available
      // const users = await backend.get_all_users();

      // Mock data for now
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
        {
          username: "Qwertifly",
          certificateCount: 25,
          sessionCount: 12,
          hasSubscription: true,
          subscriptionType: "Enterprise",
        },
        {
          username: "HappyAle",
          certificateCount: 22,
          sessionCount: 14,
          hasSubscription: true,
          subscriptionType: "Premium",
        },
        {
          username: "Zinxaio",
          certificateCount: 18,
          sessionCount: 9,
          hasSubscription: false,
        },
        {
          username: "ArtMaster",
          certificateCount: 16,
          sessionCount: 8,
          hasSubscription: true,
          subscriptionType: "Basic",
        },
        {
          username: "DigitalPro",
          certificateCount: 14,
          sessionCount: 7,
          hasSubscription: false,
        },
      ];

      // Sort by certificate count descending using toSorted
      const sortedCreators = mockCreators.toSorted(
        (a, b) => b.certificateCount - a.certificateCount,
      );
      return sortedCreators.slice(0, 8);
    } catch (error) {
      console.error("Failed to fetch top creators:", error);
      return [];
    }
  }

  static async getDashboardMetrics() {
    try {
      // Uncomment when backend declarations are available
      // return await backend.get_dashboard_metrics();

      // Mock data for now
      return {
        total_certificates: BigInt(2350),
        total_users: BigInt(870),
        total_sessions: BigInt(740),
      };
    } catch (error) {
      console.error("Failed to fetch dashboard metrics:", error);
      return {
        total_certificates: BigInt(0),
        total_users: BigInt(0),
        total_sessions: BigInt(0),
      };
    }
  }

  static async getUserInfo(username: string) {
    try {
      // Uncomment when backend declarations are available
      // return await backend.get_user_info(username);

      // Mock data for now
      return [username, BigInt(Date.now())];
    } catch (error) {
      console.error(`Failed to get user info for ${username}:`, error);
      return null;
    }
  }

  static async getRecentSessions() {
    // Uncomment when backend declarations are available
    // try {
    //   return await backend.get_recent_sessions(BigInt(10));
    // } catch (error) {
    //   console.error("Failed to fetch recent sessions:", error);
    //   return [];
    // }

    // Mock data for now
    return [];
  }
}
