import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";
import { CertificateService } from "../../src/services/certificateService";

// Mock the backend
vi.mock("../../../declarations/backend", () => ({
  backend: {
    generate_certificate: vi.fn(),
    get_certificate_by_id: vi.fn(),
    get_user_certificates: vi.fn(),
    verify_certificate: vi.fn(),
    generate_nft_for_certificate: vi.fn(),
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
    it("should generate NFT for certificate", async () => {
      const mockNFTResult = {
        nft_id: "NFT-CERT-123-456",
        token_uri: "https://ic-vibe.ic0.app/nft/CERT-123",
      };

      const { backend } = await import("../../../declarations/backend");
      (backend.generate_nft_for_certificate as any).mockResolvedValue({
        Ok: mockNFTResult,
      });

      const result = await CertificateService.generateNFT("CERT-123");

      expect(backend.generate_nft_for_certificate).toHaveBeenCalledWith(
        "CERT-123",
      );
      expect(result.nft_id).toBe("NFT-CERT-123-456");
      expect(result.token_uri).toBe("https://ic-vibe.ic0.app/nft/CERT-123");
    });

    it("should handle NFT generation errors", async () => {
      const { backend } = await import("../../../declarations/backend");
      (backend.generate_nft_for_certificate as any).mockResolvedValue({
        Err: "Failed to generate NFT",
      });

      await expect(CertificateService.generateNFT("CERT-123")).rejects.toThrow(
        "Failed to generate NFT",
      );
    });
  });
});
