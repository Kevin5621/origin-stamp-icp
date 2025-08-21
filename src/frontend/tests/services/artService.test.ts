import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";
import { KaryaService } from "../../src/services/artService";

// Mock the backend
vi.mock("../../../declarations/backend", () => ({
  backend: {
    create_physical_art_session: vi.fn(),
    get_session_details: vi.fn(),
    get_user_sessions: vi.fn(),
    update_session_status: vi.fn(),
    upload_photo_to_session: vi.fn(),
    remove_photo_from_session: vi.fn(),
  },
}));

describe("KaryaService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getKaryaByUser", () => {
    it("should return empty karya data", async () => {
      const result = await KaryaService.getKaryaByUser("testuser");

      expect(result.karya).toEqual([]);
      expect(result.totalKarya).toBe(0);
      expect(result.totalLogs).toBe(0);
    });

    it("should handle filters parameter", async () => {
      const filter = {
        status: "draft" as const,
        search: "test",
      };

      const result = await KaryaService.getKaryaByUser("testuser", filter);

      expect(result.karya).toEqual([]);
      expect(result.totalKarya).toBe(0);
      expect(result.totalLogs).toBe(0);
    });
  });

  describe("getKaryaById", () => {
    it("should return null for non-existent karya", async () => {
      const result = await KaryaService.getKaryaById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("createKarya", () => {
    it("should throw not implemented error", async () => {
      const karyaRequest = {
        nama_karya: "Test Karya",
        deskripsi: "Test Description",
        tipe_karya: "painting" as const,
        format_file: "jpg",
      };

      await expect(
        KaryaService.createKarya(karyaRequest, "testuser"),
      ).rejects.toThrow("Not implemented");
    });
  });

  describe("updateKaryaStatus", () => {
    it("should update karya status", async () => {
      const statusRequest = {
        karya_id: "karya-123",
        status_karya: "completed" as const,
      };

      // Should not throw
      await KaryaService.updateKaryaStatus(statusRequest);
      expect(true).toBe(true);
    });
  });

  describe("addLogProses", () => {
    it("should throw not implemented error", async () => {
      const logRequest = {
        karya_id: "karya-123",
        jenis_log: "milestone" as const,
        deskripsi_log: "Test progress milestone",
      };

      await expect(KaryaService.addLogProses(logRequest)).rejects.toThrow(
        "Not implemented",
      );
    });
  });

  describe("getLogProsesByKarya", () => {
    it("should return empty array for karya logs", async () => {
      const result = await KaryaService.getLogProsesByKarya("karya-123");

      expect(result).toEqual([]);
    });
  });

  describe("getDashboardStats", () => {
    it("should return default dashboard stats", async () => {
      const result = await KaryaService.getDashboardStats();

      expect(result).toEqual({
        totalKarya: 0,
        totalLogs: 0,
      });
    });

    it("should return data with correct structure", async () => {
      const result = await KaryaService.getDashboardStats();

      expect(result).toHaveProperty("totalKarya");
      expect(result).toHaveProperty("totalLogs");

      expect(typeof result.totalKarya).toBe("number");
      expect(typeof result.totalLogs).toBe("number");
    });
  });

  describe("getKaryaAnalytics", () => {
    it("should return default analytics data", async () => {
      const result = await KaryaService.getKaryaAnalytics("karya-123");

      expect(result).toEqual({
        views: 0,
        engagement: 0,
        completion_rate: 0,
        avg_session_duration: 0,
        price_history: [],
        performance_metrics: [],
        audience_demographics: {},
        verification_score: 0,
      });
    });

    it("should return analytics with correct structure", async () => {
      const result = await KaryaService.getKaryaAnalytics("karya-123");

      expect(result).toHaveProperty("views");
      expect(result).toHaveProperty("engagement");
      expect(result).toHaveProperty("completion_rate");
      expect(result).toHaveProperty("avg_session_duration");
      expect(result).toHaveProperty("price_history");
      expect(result).toHaveProperty("performance_metrics");
      expect(result).toHaveProperty("audience_demographics");
      expect(result).toHaveProperty("verification_score");

      expect(Array.isArray(result.price_history)).toBe(true);
      expect(Array.isArray(result.performance_metrics)).toBe(true);
      expect(typeof result.audience_demographics).toBe("object");
    });
  });
});
