import { backendService } from "./backendService";

// Types for NFT minting
export interface NFTMintingResult {
  success: boolean;
  nftId?: string;
  tokenUri?: string;
  certificateId?: string;
  error?: string;
}

export interface CertificateData {
  certificate_id: string;
  session_id: string;
  username: string;
  art_title: string;
  description: string;
  issue_date: bigint;
  expiry_date: bigint;
  verification_hash: string;
  blockchain_tx: string;
  qr_code_data: string;
  verification_url: string;
  certificate_type: string;
  verification_score: number;
  authenticity_rating: number;
  provenance_score: number;
  community_trust: number;
  certificate_status: string;
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
  nft_generated: boolean;
  nft_id?: string;
  token_uri?: string;
}

/**
 * NFT Service - Handles NFT minting and certificate generation
 */
export class NFTService {
  /**
   * Complete session by generating certificate and minting NFT
   */
  static async completeSession(
    session: {
      session_id: string;
      username: string;
      art_title: string;
      description: string;
      uploaded_photos: string[];
      created_at: number | bigint;
    },
    userPrincipal: string,
  ): Promise<NFTMintingResult> {
    try {
      console.log(
        `[NFTMinting] Starting session completion for: ${session.session_id}`,
      );

      // Step 0: Update session status to "active" for certificate generation
      console.log(`[NFTMinting] Updating session status to active...`);
      await backendService.updateSessionStatus(session.session_id, "active");

      // Step 1: Generate certificate
      console.log(`[NFTMinting] Generating certificate...`);
      const certificate = await backendService.generateCertificate({
        session_id: session.session_id,
        username: session.username,
        art_title: session.art_title,
        description: session.description,
        photo_count: session.uploaded_photos.length,
        creation_duration: this.calculateCreationDuration(session.created_at),
        file_format: "JPEG/PNG",
        creation_tools: ["Digital Camera", "Origin Stamp Platform"],
        file_sizes: session.uploaded_photos.map(() => BigInt(1024 * 1024)), // Mock file size
      });

      if (!certificate) {
        throw new Error("Failed to generate certificate");
      }

      console.log(
        `[NFTMinting] Certificate generated: ${certificate.certificate_id}`,
      );

      // Step 2: Mint NFT from certificate
      console.log(`[NFTMinting] Minting NFT from certificate...`);
      const nftId = await backendService.mintCertificateNFT(
        certificate.certificate_id,
        userPrincipal,
      );

      console.log(`[NFTMinting] NFT minted successfully: ${nftId}`);

      // Step 3: Update session status to completed
      console.log(`[NFTMinting] Updating session status to completed...`);
      await backendService.updateSessionStatus(session.session_id, "completed");

      // Generate token URI
      const tokenUri = `https://originstamp.ic0.app/nft/${nftId}/metadata`;

      return {
        success: true,
        nftId,
        tokenUri,
        certificateId: certificate.certificate_id,
      };
    } catch (error) {
      console.error("[NFTMinting] Session completion failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Mint NFT directly from session (alternative method)
   */
  static async mintNFTFromSession(
    sessionId: string,
    userPrincipal: string,
    metadata: Array<[string, string]> = [],
  ): Promise<NFTMintingResult> {
    try {
      console.log(
        `[NFTMinting] Minting NFT directly from session: ${sessionId}`,
      );

      // Update session status to "active" for NFT generation
      await backendService.updateSessionStatus(sessionId, "active");

      const nftId = await backendService.mintNFTFromSession(
        sessionId,
        userPrincipal,
        metadata,
      );

      console.log(`[NFTMinting] NFT minted successfully: ${nftId}`);

      // Update session status to completed
      await backendService.updateSessionStatus(sessionId, "completed");

      const tokenUri = `https://originstamp.ic0.app/nft/${nftId}/metadata`;

      return {
        success: true,
        nftId,
        tokenUri,
      };
    } catch (error) {
      console.error("[NFTMinting] Direct NFT minting failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Calculate creation duration from session creation time
   */
  private static calculateCreationDuration(createdAt: number | bigint): number {
    const now = Date.now();
    const createdTime =
      typeof createdAt === "bigint"
        ? Number(createdAt) / 1000000 // Convert nanoseconds to milliseconds
        : createdAt; // Already in milliseconds
    const diffMs = now - createdTime;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return Math.max(1, diffMinutes); // Minimum 1 minute
  }

  /**
   * Get NFT metadata URL
   */
  static getNFTMetadataUrl(nftId: string): string {
    return `https://originstamp.ic0.app/nft/${nftId}/metadata`;
  }

  /**
   * Get NFT image URL (placeholder for now)
   */
  static getNFTImageUrl(nftId: string): string {
    return `https://originstamp.ic0.app/nft/${nftId}/image`;
  }
}

export default NFTService;
