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
  file_sizes: bigint[]; // Actual file sizes in bytes (bigint for Candid compatibility)
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
        file_sizes: request.file_sizes,
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

      // Handle array response from backend
      let certificateData = null;
      if (Array.isArray(result) && result.length > 0) {
        certificateData = result[0];
      } else if (result && !Array.isArray(result)) {
        certificateData = result;
      }

      if (certificateData) {
        return this.transformCertificateData(certificateData);
      } else {
        return null;
      }
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
   * Get certificate by session ID
   */
  static async getCertificateBySessionId(
    sessionId: string,
  ): Promise<CertificateData | null> {
    try {
      // Get all user certificates and find the one matching session ID
      const userCertificates = await this.getUserCertificates(""); // We'll need to get username from context
      const certificate = userCertificates.find(
        (cert) => cert.session_id === sessionId,
      );
      return certificate || null;
    } catch (error) {
      console.error("Failed to get certificate by session ID:", error);
      return null;
    }
  }

  /**
   * Get certificate by session ID for specific user
   */
  static async getCertificateBySessionIdForUser(
    sessionId: string,
    username: string,
  ): Promise<CertificateData | null> {
    try {
      const userCertificates = await this.getUserCertificates(username);
      const certificate = userCertificates.find(
        (cert) => cert.session_id === sessionId,
      );
      return certificate || null;
    } catch (error) {
      console.error("Failed to get certificate by session ID:", error);
      return null;
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
      // Get user principal from authentication service
      const { AuthService } = await import("./authService");
      let userPrincipal = await AuthService.getCurrentUserPrincipal();

      if (!userPrincipal) {
        // Try to get from localStorage as fallback
        const cachedPrincipal = localStorage.getItem(
          "originstamp_user_principal",
        );

        if (cachedPrincipal) {
          try {
            const { Principal } = await import("@dfinity/principal");
            userPrincipal = Principal.fromText(cachedPrincipal);
          } catch (error) {
            // If Principal.fromText fails, try to create a valid Principal from hash
            // This handles our custom hash-based principals
            try {
              // Convert hash to valid Principal format
              const validPrincipalText =
                await this.convertHashToValidPrincipal(cachedPrincipal);
              const { Principal } = await import("@dfinity/principal");
              userPrincipal = Principal.fromText(validPrincipalText);
            } catch (fallbackError) {
              console.error(
                "Failed to create valid principal from hash:",
                fallbackError,
              );
            }
          }
        }

        // If still no principal, throw error
        if (!userPrincipal) {
          const authError = new Error(
            "Authentication required - no valid principal found. Please login again.",
          );
          authError.name = "AuthenticationError";
          throw authError;
        }
      }

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
        const tokenUri = `https://originstamp.ic0.app/nft/${tokenId}/metadata`;

        const nftData = {
          nft_id: tokenId.toString(),
          token_uri: tokenUri,
        };

        return nftData;
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
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
        file_sizes: session.photos.map((photo: { fileSize: number }) =>
          BigInt(photo.fileSize),
        ), // Convert to bigint for Candid
      });

      if (!certificate) {
        throw new Error("Failed to generate certificate");
      }

      // 2. Generate NFT (only if subscription allows)
      try {
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
      } catch (error: any) {
        // If NFT generation fails due to subscription, still return certificate
        if (
          error?.message?.includes("subscription") ||
          error?.message?.includes("tier")
        ) {
          console.warn(
            "NFT generation failed due to subscription limits:",
            error.message,
          );

          // 3. Mark session as completed to prevent duplicates
          session.certificateGenerated = true;

          return {
            certificate,
            nft: null, // NFT not generated due to subscription
          };
        }
        throw error;
      }
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
   * Convert hash to valid IC Principal format
   */
  private static async convertHashToValidPrincipal(
    hash: string,
  ): Promise<string> {
    try {
      // IC Principal must start with valid characters and be base32 encoded
      // We'll create a deterministic but valid Principal from our hash

      // Take first 8 characters of hash and pad with zeros
      const shortHash = hash.slice(0, 8).padEnd(8, "0");

      // Convert to bytes and create valid Principal
      const bytes = new Uint8Array(8);
      for (let i = 0; i < 8; i++) {
        bytes[i] = parseInt(shortHash[i], 16) || 0;
      }

      // Create Principal from bytes
      const { Principal } = await import("@dfinity/principal");
      return Principal.fromUint8Array(bytes).toText();
    } catch (error) {
      // Fallback: create a simple valid Principal
      console.warn(
        "Failed to create Principal from bytes, using fallback:",
        error,
      );
      return "2vxsx-fae"; // Anonymous principal as fallback
    }
  }

  /**
   * Transform backend certificate data to frontend format
   */
  private static transformCertificateData(backendCert: any): CertificateData {
    // Handle undefined metadata with defaults
    const metadata = backendCert.metadata || {};

    // Ensure creation_tools is always a string array
    const creationTools = Array.isArray(metadata.creation_tools)
      ? metadata.creation_tools.filter((tool: any) => typeof tool === "string")
      : [];

    // Handle NFT fields - they might be arrays or single values
    let nftId = backendCert.nft_id;
    let tokenUri = backendCert.token_uri;

    if (Array.isArray(nftId) && nftId.length > 0) {
      nftId = nftId[0];
    }

    if (Array.isArray(tokenUri) && tokenUri.length > 0) {
      tokenUri = tokenUri[0];
    }

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
        creation_duration: metadata.creation_duration || "0 hours 0 minutes",
        total_actions: Number(metadata.total_actions) || 0,
        file_size: metadata.file_size || "0.00 MB",
        file_format: metadata.file_format || "Unknown",
        creation_tools: creationTools,
      },
      // NFT fields
      nft_generated: backendCert.nft_generated || false,
      nft_id: nftId,
      token_uri: tokenUri,
    };
  }
}

export default CertificateService;
