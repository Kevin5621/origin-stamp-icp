import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";
import { MarketplaceService } from "../../src/services/marketplaceService";

describe("MarketplaceService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getNFTs", () => {
    it("should return empty array for NFTs", async () => {
      const result = await MarketplaceService.getNFTs();
      expect(result).toEqual([]);
    });

    it("should handle filters parameter", async () => {
      const filters = {
        category: ["art"],
        priceRange: { min: 0, max: 100 },
        sortBy: "price_low" as const,
      };
      const result = await MarketplaceService.getNFTs(filters);
      expect(result).toEqual([]);
    });
  });

  describe("getNFTById", () => {
    it("should return null for non-existent NFT", async () => {
      const result = await MarketplaceService.getNFTById("nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("searchNFTs", () => {
    it("should return empty search results", async () => {
      const result = await MarketplaceService.searchNFTs("test query");
      expect(result).toEqual({
        nfts: [],
        collections: [],
        users: [],
        total: 0,
        hasMore: false,
      });
    });
  });

  describe("buyNFT", () => {
    it("should return not implemented error", async () => {
      const result = await MarketplaceService.buyNFT("nft-id", "buyer-id");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Not implemented yet");
    });
  });

  describe("createNFT", () => {
    it("should throw not implemented error", async () => {
      const nftData = {
        title: "Test NFT",
        description: "Test Description",
        price: "100",
        currency: "ICP" as const,
        tags: ["art", "digital"],
        collection: "test-collection",
        file: new File(["content"], "test.jpg", { type: "image/jpeg" }),
      };

      await expect(MarketplaceService.createNFT(nftData)).rejects.toThrow(
        "Not implemented yet",
      );
    });
  });

  describe("getUserNFTs", () => {
    it("should return empty array for user NFTs", async () => {
      const result = await MarketplaceService.getUserNFTs("user-id");
      expect(result).toEqual([]);
    });
  });

  describe("getCollections", () => {
    it("should return empty array for collections", async () => {
      const result = await MarketplaceService.getCollections();
      expect(result).toEqual([]);
    });
  });

  describe("getCollectionById", () => {
    it("should return null for non-existent collection", async () => {
      const result = await MarketplaceService.getCollectionById("nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("getUserByUsername", () => {
    it("should return null for non-existent user", async () => {
      const result = await MarketplaceService.getUserByUsername("nonexistent");
      expect(result).toBeNull();
    });
  });

  describe("getCategories", () => {
    it("should return empty array for categories", async () => {
      const result = await MarketplaceService.getCategories();
      expect(result).toEqual([]);
    });
  });

  describe("getMarketplaceStats", () => {
    it("should return default marketplace stats", async () => {
      const result = await MarketplaceService.getMarketplaceStats();
      expect(result).toEqual({
        totalNFTs: 0,
        totalVolume: "0 ICP",
        activeUsers: 0,
        totalSales: 0,
        averagePrice: "0 ICP",
        trendingCollections: [],
      });
    });
  });

  describe("likeNFT", () => {
    it("should return false for like NFT", async () => {
      const result = await MarketplaceService.likeNFT("nft-id");
      expect(result).toBe(false);
    });
  });

  describe("unlikeNFT", () => {
    it("should return false for unlike NFT", async () => {
      const result = await MarketplaceService.unlikeNFT("nft-id");
      expect(result).toBe(false);
    });
  });

  describe("followUser", () => {
    it("should return false for follow user", async () => {
      const result = await MarketplaceService.followUser("username");
      expect(result).toBe(false);
    });
  });

  describe("unfollowUser", () => {
    it("should return false for unfollow user", async () => {
      const result = await MarketplaceService.unfollowUser("username");
      expect(result).toBe(false);
    });
  });

  describe("validateFiles", () => {
    it("should validate image files correctly", () => {
      const validFile = new File(["content"], "test.jpg", {
        type: "image/jpeg",
      });
      const invalidTypeFile = new File(["content"], "test.txt", {
        type: "text/plain",
      });

      // Create a large file (>10MB)
      const largeContent = new Array(11 * 1024 * 1024).fill("a").join("");
      const largeFile = new File([largeContent], "large.jpg", {
        type: "image/jpeg",
      });

      const invalidExtFile = new File(["content"], "test.bmp", {
        type: "image/bmp",
      });

      const fileList = {
        0: validFile,
        1: invalidTypeFile,
        2: largeFile,
        3: invalidExtFile,
        length: 4,
      } as unknown as FileList;

      const result = MarketplaceService.validateFiles(fileList);

      expect(result.valid).toHaveLength(1);
      expect(result.valid[0]).toBe(validFile);
      expect(result.invalid).toHaveLength(3);

      // Check invalid reasons
      expect(result.invalid[0].reason).toBe("File must be an image");
      expect(result.invalid[1].reason).toBe("File size must be less than 10MB");
      expect(result.invalid[2].reason).toBe(
        "File type not supported. Use JPG, PNG, GIF, or WebP",
      );
    });

    it("should accept valid image formats", () => {
      const jpegFile = new File(["content"], "test.jpeg", {
        type: "image/jpeg",
      });
      const pngFile = new File(["content"], "test.png", { type: "image/png" });
      const gifFile = new File(["content"], "test.gif", { type: "image/gif" });
      const webpFile = new File(["content"], "test.webp", {
        type: "image/webp",
      });

      const fileList = {
        0: jpegFile,
        1: pngFile,
        2: gifFile,
        3: webpFile,
        length: 4,
      } as unknown as FileList;

      const result = MarketplaceService.validateFiles(fileList);

      expect(result.valid).toHaveLength(4);
      expect(result.invalid).toHaveLength(0);
    });

    it("should handle empty file list", () => {
      const fileList = {
        length: 0,
      } as unknown as FileList;

      const result = MarketplaceService.validateFiles(fileList);

      expect(result.valid).toHaveLength(0);
      expect(result.invalid).toHaveLength(0);
    });
  });
});
