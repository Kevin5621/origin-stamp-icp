import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";
import { CertificateService } from "../../src/services/certificateService";

// Mock the backend
vi.mock("../../../declarations/backend", () => ({
  backend: {
    generate_certificate: vi.fn(),
    get_certificate_by_id: vi.fn(),
    get_user_certificates: vi.fn(),
    verify_certificate: vi.fn(),
    mint_certificate_nft: vi.fn(),
    get_certificate_nft_metadata: vi.fn(),
  },
}));

// Mock AuthService
vi.mock("../../src/services/authService", () => ({
  AuthService: {
    getCurrentUserPrincipal: vi.fn().mockResolvedValue({
      toString: () => "2vxsx-fae",
    }),
  },
}));

// Mock @dfinity/principal
vi.mock("@dfinity/principal", () => ({
  Principal: {
    fromText: vi.fn((text: string) => ({
      toString: () => text,
    })),
  },
}));

describe("CertificateService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("generateCertificate", () => {
    it("should generate certificate successfully", async () => {
      const mockCertificate = {
        certificate_id: "CERT-123",
        session_id: "session-123",
        username: "testuser",
        art_title: "Test Art",
        description: "Test Description",
        issue_date: BigInt(Date.now() * 1000000),
        expiry_date: BigInt((Date.now() + 365 * 24 * 60 * 60 * 1000) * 1000000),
        verification_hash: "0x123",
        blockchain_tx: "0xabc",
        qr_code_data: "https://verify.example.com/CERT-123",
        verification_url: "https://verify.example.com/CERT-123",
        certificate_type: "standard",
        verification_score: 85,
        authenticity_rating: 90,
        provenance_score: 88,
        community_trust: 82,
        certificate_status: "active",
        issuer: "IC-Vibe",
        blockchain: "Internet Computer",
        token_standard: "ICP-721",
        metadata: {
          creation_duration: "2 hours 30 minutes",
          total_actions: 5,
          file_size: "20 MB",
          file_format: "JPG",
          creation_tools: ["Photoshop", "Camera"],
        },
      };

      const { backend } = await import("../../../declarations/backend");
      (backend.generate_certificate as any).mockResolvedValue({
        Ok: mockCertificate,
      });

      const request = {
        session_id: "session-123",
        username: "testuser",
        art_title: "Test Art",
        description: "Test Description",
        photo_count: 5,
        creation_duration: 150,
        file_format: "JPG",
        creation_tools: ["Photoshop", "Camera"],
        file_sizes: [
          BigInt(1024 * 1024),
          BigInt(2048 * 1024),
          BigInt(1536 * 1024),
          BigInt(3072 * 1024),
          BigInt(1024 * 1024),
        ], // 1MB, 2MB, 1.5MB, 3MB, 1MB
      };

      const result = await CertificateService.generateCertificate(request);

      expect(backend.generate_certificate).toHaveBeenCalledWith(request);
      expect(result.certificate_id).toBe("CERT-123");
      expect(result.username).toBe("testuser");
      expect(result.art_title).toBe("Test Art");
    });

    it("should handle certificate generation errors", async () => {
      const { backend } = await import("../../../declarations/backend");
      (backend.generate_certificate as any).mockResolvedValue({
        Err: "Failed to generate certificate",
      });

      const request = {
        session_id: "session-123",
        username: "testuser",
        art_title: "Test Art",
        description: "Test Description",
        photo_count: 5,
        creation_duration: 150,
        file_format: "JPG",
        creation_tools: ["Photoshop", "Camera"],
        file_sizes: [
          BigInt(1024 * 1024),
          BigInt(2048 * 1024),
          BigInt(1536 * 1024),
          BigInt(3072 * 1024),
          BigInt(1024 * 1024),
        ], // 1MB, 2MB, 1.5MB, 3MB, 1MB
      };

      await expect(
        CertificateService.generateCertificate(request),
      ).rejects.toThrow("Failed to generate certificate");
    });
  });

  describe("getCertificateById", () => {
    it("should get certificate by ID", async () => {
      const mockCertificate = {
        certificate_id: "CERT-123",
        session_id: "session-123",
        username: "testuser",
        art_title: "Test Art",
        description: "Test Description",
        issue_date: BigInt(Date.now() * 1000000),
        expiry_date: BigInt((Date.now() + 365 * 24 * 60 * 60 * 1000) * 1000000),
        verification_hash: "0x123",
        blockchain_tx: "0xabc",
        qr_code_data: "https://verify.example.com/CERT-123",
        verification_url: "https://verify.example.com/CERT-123",
        certificate_type: "standard",
        verification_score: 85,
        authenticity_rating: 90,
        provenance_score: 88,
        community_trust: 82,
        certificate_status: "active",
        issuer: "IC-Vibe",
        blockchain: "Internet Computer",
        token_standard: "ICP-721",
        metadata: {
          creation_duration: "2 hours 30 minutes",
          total_actions: 5,
          file_size: "20 MB",
          file_format: "JPG",
          creation_tools: ["Photoshop", "Camera"],
        },
      };

      const { backend } = await import("../../../declarations/backend");
      (backend.get_certificate_by_id as any).mockResolvedValue(mockCertificate);

      const result = await CertificateService.getCertificateById("CERT-123");

      expect(backend.get_certificate_by_id).toHaveBeenCalledWith("CERT-123");
      expect(result?.certificate_id).toBe("CERT-123");
    });

    it("should return null for non-existent certificate", async () => {
      const { backend } = await import("../../../declarations/backend");
      (backend.get_certificate_by_id as any).mockResolvedValue(null);

      const result = await CertificateService.getCertificateById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("getUserCertificates", () => {
    it("should get user certificates", async () => {
      const mockCertificates = [
        {
          certificate_id: "CERT-123",
          session_id: "session-123",
          username: "testuser",
          art_title: "Test Art 1",
          description: "Test Description 1",
          issue_date: BigInt(Date.now() * 1000000),
          expiry_date: BigInt(
            (Date.now() + 365 * 24 * 60 * 60 * 1000) * 1000000,
          ),
          verification_hash: "0x123",
          blockchain_tx: "0xabc",
          qr_code_data: "https://verify.example.com/CERT-123",
          verification_url: "https://verify.example.com/CERT-123",
          certificate_type: "standard",
          verification_score: 85,
          authenticity_rating: 90,
          provenance_score: 88,
          community_trust: 82,
          certificate_status: "active",
          issuer: "IC-Vibe",
          blockchain: "Internet Computer",
          token_standard: "ICP-721",
          metadata: {
            creation_duration: "2 hours 30 minutes",
            total_actions: 5,
            file_size: "20 MB",
            file_format: "JPG",
            creation_tools: ["Photoshop", "Camera"],
          },
        },
      ];

      const { backend } = await import("../../../declarations/backend");
      (backend.get_user_certificates as any).mockResolvedValue(
        mockCertificates,
      );

      const result = await CertificateService.getUserCertificates("testuser");

      expect(backend.get_user_certificates).toHaveBeenCalledWith("testuser");
      expect(result).toHaveLength(1);
      expect(result[0].certificate_id).toBe("CERT-123");
    });
  });

  describe("verifyCertificate", () => {
    it("should verify certificate successfully", async () => {
      const mockVerification = {
        valid: true,
        score: 85,
        details: '{"verified": true, "timestamp": 1234567890}',
      };

      const { backend } = await import("../../../declarations/backend");
      (backend.verify_certificate as any).mockResolvedValue({
        Ok: mockVerification,
      });

      const result = await CertificateService.verifyCertificate("CERT-123");

      expect(backend.verify_certificate).toHaveBeenCalledWith("CERT-123");
      expect(result.valid).toBe(true);
      expect(result.score).toBe(85);
      expect(result.details.verified).toBe(true);
    });

    it("should handle invalid certificate", async () => {
      const { backend } = await import("../../../declarations/backend");
      (backend.verify_certificate as any).mockResolvedValue({
        Err: "Certificate not found",
      });

      const result = await CertificateService.verifyCertificate("invalid");

      expect(result.valid).toBe(false);
      expect(result.score).toBe(0);
      expect(result.details.error).toBe("Certificate not found");
    });
  });

  describe("generateNFT", () => {
    beforeEach(() => {
      // Mock localStorage
      const localStorageMock = {
        getItem: vi.fn((key: string) => {
          if (key === "originstamp_user_principal") {
            return "2vxsx-fae"; // Mock principal
          }
          return null;
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      };

      // Attach to global for Node test environments
      Object.defineProperty(global, "localStorage", {
        value: localStorageMock,
        writable: true,
      });

      // Some workers or environments may not provide `window`.
      // Only define on `window` when it exists to avoid ReferenceError.
      if (typeof window !== "undefined") {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
          writable: true,
        });
      }
    });

    it("should generate NFT for certificate", async () => {
      const mockNFTResult = "NFT-CERT-123-456"; // Token ID as string

      const { backend } = await import("../../../declarations/backend");
      (backend.mint_certificate_nft as any).mockResolvedValue({
        Ok: mockNFTResult,
      });

      const result = await CertificateService.generateNFT("CERT-123");

      expect(backend.mint_certificate_nft).toHaveBeenCalledWith(
        "CERT-123",
        expect.objectContaining({
          owner: expect.any(Object),
          subaccount: [],
        }),
      );
      expect(result.nft_id).toBe("NFT-CERT-123-456");
      expect(result.token_uri).toBe(
        "https://originstamp.ic0.app/nft/NFT-CERT-123-456/metadata",
      );
    });

    it("should handle NFT generation errors", async () => {
      const { backend } = await import("../../../declarations/backend");
      (backend.mint_certificate_nft as any).mockResolvedValue({
        Err: "Failed to generate NFT",
      });

      await expect(CertificateService.generateNFT("CERT-123")).rejects.toThrow(
        "Failed to generate NFT",
      );
    });
  });
});
