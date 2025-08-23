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
        console.error("❌ Backend returned Err:", result.Err);
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("❌ generateCertificate error:", error);
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
      console.error("Failed to get certificate:", error);
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
      console.error("Failed to get user certificates:", error);
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
      console.error("Failed to verify certificate:", error);
      return {
        valid: false,
        score: 0,
        details: { error: "Verification failed" },
      };
    }
  }

  /**
   * Generate NFT for certificate
   */
  static async generateNFT(certificateId: string): Promise<{
    success: boolean;
    nft_id?: string;
    token_uri?: string;
    error?: string;
  }> {
    try {
      const result = await backend.generate_nft_for_certificate(certificateId);

      if ("Ok" in result) {
        return {
          success: true,
          nft_id: result.Ok.nft_id,
          token_uri: result.Ok.token_uri,
        };
      } else {
        return {
          success: false,
          error: result.Err,
        };
      }
    } catch (error) {
      console.error("Failed to generate NFT:", error);
      return {
        success: false,
        error: "Failed to generate NFT",
      };
    }
  }

  /**
   * Get NFT metadata for certificate
   */
  static async getNFTMetadata(certificateId: string): Promise<string | null> {
    try {
      const result = await backend.get_nft_metadata(certificateId);
      // Ensure result is either a string or null
      return typeof result === "string" ? result : null;
    } catch (error) {
      console.error("Failed to get NFT metadata:", error);
      return null;
    }
  }

  /**
   * Complete certificate generation flow
   */
  static async completeCertificateGeneration(
    sessionId: string,
    username: string,
    artTitle: string,
    description: string,
    photoCount: number,
    creationDuration: number,
    fileFormat: string = "JPEG/PNG",
    creationTools: string[] = ["Digital Camera", "IC-Vibe Platform"],
  ): Promise<{
    success: boolean;
    certificate?: CertificateData;
    nft?: { nft_id: string; token_uri: string };
    error?: string;
  }> {
    try {
      // Step 1: Generate certificate
      const certificate = await this.generateCertificate({
        session_id: sessionId,
        username,
        art_title: artTitle,
        description,
        photo_count: photoCount,
        creation_duration: creationDuration,
        file_format: fileFormat,
        creation_tools: creationTools,
      });

      // Step 2: Generate NFT for the certificate
      const nftResult = await this.generateNFT(certificate.certificate_id);

      if (!nftResult.success) {
        return {
          success: false,
          error: `Certificate generated but NFT generation failed: ${nftResult.error}`,
        };
      }

      return {
        success: true,
        certificate,
        nft: {
          nft_id: nftResult.nft_id!,
          token_uri: nftResult.token_uri!,
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
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
    };
  }
}

export default CertificateService;
