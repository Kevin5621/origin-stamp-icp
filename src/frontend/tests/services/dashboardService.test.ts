import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";
import { dashboardService } from "../../src/services/dashboardService";

describe("dashboardService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getDashboardData", () => {
    it("should return default dashboard data", async () => {
      const result = await dashboardService.getDashboardData();

      expect(result).toEqual({
        totalSessions: 0,
        totalCertificates: 0,
        totalRevenue: 0,
        activeUsers: 0,
        recentSessions: [],
        revenueData: [],
      });
    });

    it("should return data with correct structure", async () => {
      const result = await dashboardService.getDashboardData();

      expect(result).toHaveProperty("totalSessions");
      expect(result).toHaveProperty("totalCertificates");
      expect(result).toHaveProperty("totalRevenue");
      expect(result).toHaveProperty("activeUsers");
      expect(result).toHaveProperty("recentSessions");
      expect(result).toHaveProperty("revenueData");

      expect(Array.isArray(result.recentSessions)).toBe(true);
      expect(Array.isArray(result.revenueData)).toBe(true);
    });

    it("should return numeric values for stats", async () => {
      const result = await dashboardService.getDashboardData();

      expect(typeof result.totalSessions).toBe("number");
      expect(typeof result.totalCertificates).toBe("number");
      expect(typeof result.totalRevenue).toBe("number");
      expect(typeof result.activeUsers).toBe("number");
    });
  });
});
