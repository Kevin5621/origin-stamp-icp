import { describe, it, expect, vi, beforeEach } from "vitest";
import { PhysicalArtService } from "../../src/services/physicalArtService";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Mock AWS S3 client
vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: vi.fn(),
  PutObjectCommand: vi.fn(),
}));

// Mock backend
vi.mock("../../../declarations/backend", () => ({
  backend: {
    create_physical_art_session: vi.fn(),
    upload_photo_to_session: vi.fn(),
    get_s3_config: vi.fn(),
  },
}));

describe("PhysicalArtService - AWS S3 Integration", () => {
  const mockS3Client = {
    send: vi.fn(),
  };

  const mockS3Config = {
    bucket_name: "test-bucket",
    region: "us-east-1",
    access_key_id: "test-key",
    secret_access_key: "test-secret",
    endpoint: ["https://test-endpoint.com"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (S3Client as any).mockImplementation(() => mockS3Client);
  });

  describe("uploadPhoto", () => {
    it("should use AWS S3 API for file upload", async () => {
      // Mock backend responses
      const { backend } = await import("../../../declarations/backend");
      (backend.get_s3_config as any).mockResolvedValue([mockS3Config]);
      (backend.upload_photo_to_session as any).mockResolvedValue({ Ok: true });

      // Mock S3 client send method
      mockS3Client.send.mockResolvedValue({});

      // Create a test file with arrayBuffer mock
      const testFile = new File(["test content"], "test-image.jpg", {
        type: "image/jpeg",
      });

      // Mock arrayBuffer method for the test file
      Object.defineProperty(testFile, "arrayBuffer", {
        value: vi.fn().mockResolvedValue(new ArrayBuffer(12)),
      });

      const result = await PhysicalArtService.uploadPhoto(
        "test-session",
        testFile,
      );

      // Verify S3Client was initialized with correct config
      expect(S3Client).toHaveBeenCalledWith({
        region: mockS3Config.region,
        credentials: {
          accessKeyId: mockS3Config.access_key_id,
          secretAccessKey: mockS3Config.secret_access_key,
        },
        endpoint: mockS3Config.endpoint[0],
      });

      // Verify PutObjectCommand was created
      expect(PutObjectCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          Bucket: mockS3Config.bucket_name,
          ContentType: "image/jpeg",
          ContentLength: testFile.size,
        }),
      );

      // Verify S3 client send was called
      expect(mockS3Client.send).toHaveBeenCalled();

      // Verify result
      expect(result.success).toBe(true);
      expect(result.message).toBe("Photo uploaded successfully");
      expect(result.file_url).toContain(mockS3Config.bucket_name);
    });

    it("should handle S3 configuration not found", async () => {
      // Mock backend response with no config
      const { backend } = await import("../../../declarations/backend");
      (backend.get_s3_config as any).mockResolvedValue([]);

      const testFile = new File(["test content"], "test-image.jpg", {
        type: "image/jpeg",
      });

      const result = await PhysicalArtService.uploadPhoto(
        "test-session",
        testFile,
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("S3 configuration not found");
    });

    it("should handle S3 upload errors", async () => {
      // Mock backend responses
      const { backend } = await import("../../../declarations/backend");
      (backend.get_s3_config as any).mockResolvedValue([mockS3Config]);

      // Mock S3 client to throw error
      mockS3Client.send.mockRejectedValue(new Error("S3 upload failed"));

      const testFile = new File(["test content"], "test-image.jpg", {
        type: "image/jpeg",
      });

      // Mock arrayBuffer method for the test file
      Object.defineProperty(testFile, "arrayBuffer", {
        value: vi.fn().mockResolvedValue(new ArrayBuffer(12)),
      });

      const result = await PhysicalArtService.uploadPhoto(
        "test-session",
        testFile,
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("S3 upload failed");
    });
  });

  describe("File validation", () => {
    it("should validate file types correctly", () => {
      const validFile = new File(["content"], "test.jpg", {
        type: "image/jpeg",
      });
      const invalidFile = new File(["content"], "test.txt", {
        type: "text/plain",
      });

      expect(PhysicalArtService.validateFileType(validFile)).toBe(true);
      expect(PhysicalArtService.validateFileType(invalidFile)).toBe(false);
    });

    it("should validate file sizes correctly", () => {
      const smallFile = new File(["small"], "test.jpg", { type: "image/jpeg" });
      const largeFile = new File(
        [new ArrayBuffer(11 * 1024 * 1024)],
        "large.jpg",
        {
          type: "image/jpeg",
        },
      );

      expect(PhysicalArtService.validateFileSize(smallFile)).toBe(true);
      expect(PhysicalArtService.validateFileSize(largeFile)).toBe(false);
    });
  });
});
