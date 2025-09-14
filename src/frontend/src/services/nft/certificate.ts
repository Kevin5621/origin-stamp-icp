/**
 * NFT Service Module
 * Handles NFT minting, certificate generation, and token operations
 */

import { getBackendActor, initializeBackend } from "../core/backend";

/**
 * NFT Certificate Service
 */
export const nftCertificateService = {
  /**
   * Generate certificate for session
   * @param request Certificate creation request
   * @returns Promise with certificate data or null
   */
  async generateCertificate(request: {
    session_id: string;
    username: string;
    art_title: string;
    description: string;
    photo_count: number;
    creation_duration: number;
    file_format: string;
    creation_tools: string[];
    file_sizes: bigint[];
  }): Promise<{
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
  } | null> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      const result = await backendActor.generate_certificate(request);

      if ("Ok" in result) {
        const cert = result.Ok;
        return {
          certificate_id: cert.certificate_id,
          session_id: cert.session_id,
          username: cert.username,
          art_title: cert.art_title,
          description: cert.description,
          issue_date: cert.issue_date,
          expiry_date: cert.expiry_date,
          verification_hash: cert.verification_hash,
          blockchain_tx: cert.blockchain_tx,
          qr_code_data: cert.qr_code_data,
          verification_url: cert.verification_url,
          certificate_type: cert.certificate_type,
          verification_score: Number(cert.verification_score),
          authenticity_rating: Number(cert.authenticity_rating),
          provenance_score: Number(cert.provenance_score),
          community_trust: Number(cert.community_trust),
          certificate_status: cert.certificate_status,
          issuer: cert.issuer,
          blockchain: cert.blockchain,
          token_standard: cert.token_standard,
          metadata: {
            creation_duration: cert.metadata.creation_duration,
            total_actions: Number(cert.metadata.total_actions),
            file_size: cert.metadata.file_size,
            file_format: cert.metadata.file_format,
            creation_tools: cert.metadata.creation_tools,
          },
          nft_generated: cert.nft_generated,
          nft_id: cert.nft_id?.[0],
          token_uri: cert.token_uri?.[0],
        };
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to generate certificate:", error);
      throw error;
    }
  },

  /**
   * Mint NFT from certificate
   * @param certificateId Certificate ID
   * @param userPrincipal User principal for NFT ownership
   * @returns Promise with NFT token ID
   */
  async mintCertificateNFT(
    certificateId: string,
    userPrincipal: string,
  ): Promise<string> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      // Convert string principal to Principal object
      const { Principal } = await import("@dfinity/principal");
      const principal = Principal.fromText(userPrincipal);

      const recipient = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        owner: principal as any,
        subaccount: [] as [] | [number[]],
      };

      const result = await backendActor.mint_certificate_nft(
        certificateId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recipient as any,
      );

      if ("Ok" in result) {
        return result.Ok.toString();
      } else {
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to mint certificate NFT:", error);
      throw error;
    }
  },

  /**
   * Mint NFT directly from session
   * @param sessionId Session ID
   * @param userPrincipal User principal for NFT ownership
   * @param metadata Additional metadata for NFT
   * @returns Promise with NFT token ID
   */
  async mintNFTFromSession(
    sessionId: string,
    userPrincipal: string,
    metadata: Array<[string, string]> = [],
  ): Promise<string> {
    try {
      await initializeBackend();
      const backendActor = await getBackendActor();

      if (!backendActor) {
        throw new Error("Backend canister not initialized");
      }

      // 🚨 CRITICAL FIX: Get actual caller identity for consistent ownership
      const actualCallerIdentity = await backendActor.debug_caller_identity();
      console.log(
        `[NFTCertificateService] 🔍 Actual caller identity: ${actualCallerIdentity}`,
      );
      console.log(
        `[NFTCertificateService] 📋 Requested user principal: ${userPrincipal}`,
      );

      // Use actual caller identity instead of userPrincipal for consistent ownership
      const { Principal } = await import("@dfinity/principal");
      let principal;

      try {
        principal = Principal.fromText(actualCallerIdentity);
        console.log(
          `[NFTCertificateService] ✅ Using actual caller principal: ${principal.toText()}`,
        );
      } catch (error) {
        console.error("Failed to parse actual caller identity:", error);
        throw new Error("Invalid caller identity from backend");
      }

      // 🚨 CRITICAL FIX: Use empty array [] instead of null for subaccount
      const recipient = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        owner: principal as any, // Type assertion needed for Candid compatibility
        subaccount: [] as [] | [number[]], // Empty array for no subaccount
      };

      console.log(`[NFTCertificateService] 🎯 Minting NFT with recipient:`, {
        owner: principal.toText(),
        subaccount: "empty array []",
      });

      const result = await backendActor.mint_nft_from_session(
        sessionId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recipient as any, // Type assertion needed for Candid compatibility
        metadata,
      );

      if ("Ok" in result) {
        const tokenId = result.Ok.toString();
        console.log(
          `[NFTCertificateService] 🎉 NFT minted successfully! Token ID: ${tokenId}`,
        );
        return tokenId;
      } else {
        console.error(
          `[NFTCertificateService] ❌ NFT minting failed:`,
          result.Err,
        );
        throw new Error(result.Err);
      }
    } catch (error) {
      console.error("Failed to mint NFT from session:", error);
      throw error;
    }
  },
};
