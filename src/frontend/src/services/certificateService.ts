import { backend } from "../../../declarations/backend";

// Types for certificate management
export interface CertificateData {
  certificate_id: string;
  session_id: string;
  username: string;
  art_title: string;
  description: string;
  issue_date: Date;
  expiry_date: Date;
  verification_hash: string;
  blockchain_tx: string;
  qr_code_data: string;
  verification_url: string;
  certificate_type: "standard" | "premium";
  verification_score: number;
  authenticity_rating: number;
  provenance_score: number;
  community_trust: number;
  certificate_status: "active" | "expired" | "revoked";
  issuer: string;
  blockchain: string;
  token_standard: string;
  metadata: {
    creation_duration: string;
    total_actions: number;
    file_size: string;
    file_format: string;
    creation_tools: string[];
  };
  // NFT fields
  nft_generated: boolean;
  nft_id?: string;
  token_uri?: string;
}

export interface CreateCertificateRequest {
  session_id: string;
  username: string;
  art_title: string;
  description: string;
  photo_count: number;
  creation_duration: number; // in minutes
  file_format: string;
  creation_tools: string[];
}

/**
 * Certificate Service - Handles certificate generation and management
 */
export class CertificateService {
  /**
   * Generate certificate for completed session
   */
  static async generateCertificate(
    request: CreateCertificateRequest,
  ): Promise<CertificateData> {
    try {
      const result = await backend.generate_certificate({
        session_id: request.session_id,
        username: request.username,
        art_title: request.art_title,
        description: request.description,
        photo_count: request.photo_count,
        creation_duration: request.creation_duration,
        file_format: request.file_format,
        creation_tools: request.creation_tools,
      });

      if ("Ok" in result) {
        const transformedData = this.transformCertificateData(result.Ok);
        return transformedData;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get certificate by ID
   */
  static async getCertificateById(
    certificateId: string,
  ): Promise<CertificateData | null> {
    try {
      const result = await backend.get_certificate_by_id(certificateId);
      return result ? this.transformCertificateData(result) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get certificates for user
   */
  static async getUserCertificates(
    username: string,
  ): Promise<CertificateData[]> {
    try {
      const result = await backend.get_user_certificates(username);
      return result.map((cert) => this.transformCertificateData(cert));
    } catch (error) {
      return [];
    }
  }

  /**
   * Verify certificate
   */
  static async verifyCertificate(certificateId: string): Promise<{
    valid: boolean;
    score: number;
    details: any;
  }> {
    try {
      const result = await backend.verify_certificate(certificateId);
      if ("Ok" in result) {
        return {
          valid: result.Ok.valid,
          score: result.Ok.score,
          details: JSON.parse(result.Ok.details),
        };
      } else {
        return {
          valid: false,
          score: 0,
          details: { error: result.Err },
        };
      }
    } catch (error) {
      return {
        valid: false,
        score: 0,
        details: { error: "Verification failed" },
      };
    }
  }

  // Generate NFT for certificate using NFT Module
  static async generateNFT(
    certificateId: string,
  ): Promise<{ nft_id: string; token_uri: string }> {
    try {
      // Get authenticated user principal for production
      const { Principal } = await import("@dfinity/principal");

      // TODO: Get actual user principal from authentication context
      // For now, use anonymous principal as fallback
      const userPrincipal = Principal.fromText("2vxsx-fae");

      // Create recipient account for NFT
      const recipient = {
        owner: userPrincipal,
        subaccount: [] as [] | [number[]],
      };

      // Call NFT Module to mint NFT
      const result = await backend.mint_certificate_nft(
        certificateId,
        recipient,
      );

      if ("Ok" in result) {
        const tokenId = result.Ok;

        // Generate token URI
        const tokenUri = `https://ic-vibe.ic0.app/nft/${tokenId}/metadata`;

        const nftData = {
          nft_id: tokenId.toString(),
          token_uri: tokenUri,
        };

        console.log("✅ NFT generated successfully:", nftData);
        return nftData;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("❌ generateNFT error:", error);
      throw error;
    }
  }

  // Get NFT metadata from NFT Module
  static async getNFTMetadata(certificateId: string): Promise<string | null> {
    try {
      // Call NFT Module to get certificate metadata
      const result = await backend.get_certificate_nft_metadata(certificateId);

      // Handle Candid optional type: [] | [string]
      if (result && result.length > 0 && result[0]) {
        return result[0]; // Extract string from [string]
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  // Complete certificate generation and NFT minting
  static async completeCertificateGeneration(
    session: any, // TODO: Use proper SessionData type
    _photos: string[], // TODO: Use photos when needed
  ): Promise<{
    certificate: CertificateData | null;
    nft: { nft_id: string; token_uri: string } | null;
  }> {
    try {
      // Check if session already has a certificate to prevent duplicates
      if (session.certificateGenerated) {
        throw new Error("Certificate already generated for this session");
      }

      // Ensure session has required fields
      if (!session.username) {
        throw new Error("Session username is required");
      }

      // 1. Generate certificate
      const certificate = await this.generateCertificate({
        session_id: session.id,
        username: session.username,
        art_title: session.title,
        description: session.description,
        photo_count: session.photos.length,
        creation_duration: this.calculateCreationDuration(session.createdAt),
        file_format: "JPEG/PNG",
        creation_tools: ["Digital Camera", "IC-Vibe Platform"],
      });

      if (!certificate) {
        throw new Error("Failed to generate certificate");
      }

      // 2. Generate NFT
      const nftData = await this.generateNFT(certificate.certificate_id);
      if (!nftData) {
        throw new Error("Failed to generate NFT");
      }

      // 3. Mark session as completed to prevent duplicates
      session.certificateGenerated = true;

      return {
        certificate,
        nft: nftData,
      };
    } catch (error) {
      throw error;
    }
  }

  // Helper function to calculate creation duration
  private static calculateCreationDuration(createdAt: Date): number {
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return Math.max(1, diffMinutes); // Minimum 1 minute
  }

  /**
   * Transform backend certificate data to frontend format
   */
  private static transformCertificateData(backendCert: any): CertificateData {
    // Ensure creation_tools is always a string array
    const creationTools = Array.isArray(backendCert.metadata?.creation_tools)
      ? backendCert.metadata.creation_tools.filter(
          (tool: any) => typeof tool === "string",
        )
      : [];

    return {
      certificate_id: backendCert.certificate_id,
      session_id: backendCert.session_id,
      username: backendCert.username,
      art_title: backendCert.art_title,
      description: backendCert.description,
      issue_date: new Date(Number(backendCert.issue_date)),
      expiry_date: new Date(Number(backendCert.expiry_date)),
      verification_hash: backendCert.verification_hash,
      blockchain_tx: backendCert.blockchain_tx,
      qr_code_data: backendCert.qr_code_data,
      verification_url: backendCert.verification_url,
      certificate_type: backendCert.certificate_type,
      verification_score: Number(backendCert.verification_score),
      authenticity_rating: Number(backendCert.authenticity_rating),
      provenance_score: Number(backendCert.provenance_score),
      community_trust: Number(backendCert.community_trust),
      certificate_status: backendCert.certificate_status,
      issuer: backendCert.issuer,
      blockchain: backendCert.blockchain,
      token_standard: backendCert.token_standard,
      metadata: {
        creation_duration: backendCert.metadata.creation_duration,
        total_actions: Number(backendCert.metadata.total_actions),
        file_size: backendCert.metadata.file_size,
        file_format: backendCert.metadata.file_format,
        creation_tools: creationTools,
      },
      // NFT fields
      nft_generated: backendCert.nft_generated,
      nft_id: backendCert.nft_id,
      token_uri: backendCert.token_uri,
    };
  }
}

export default CertificateService;
