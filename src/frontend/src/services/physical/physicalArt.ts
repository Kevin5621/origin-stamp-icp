/**
 * Physical Art Service - Handles S3 uploads and session management
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { backendService } from "../backendService";
import type { PhysicalArtSession as BackendPhysicalArtSession } from "../../../../declarations/backend/backend.did.d.ts";

// Types
export interface PhysicalArtSession {
  session_id: string;
  username: string;
  art_title: string;
  description: string;
  uploaded_photos: string[];
  status: string;
  created_at: number;
  updated_at: number;
}

export interface S3Config {
  bucket_name: string;
  region: string;
  access_key_id: string;
  secret_access_key: string;
  endpoint?: string | string[];
}

export interface UploadResult {
  success: boolean;
  message: string;
  url?: string;
  error?: string;
}

export interface UploadProgress {
  progress: number;
  status: "uploading" | "completed" | "error";
  url?: string;
  error?: string;
}

/**
 * Physical Art Service - Handles S3 uploads and session management
 */
export class PhysicalArtService {
  /**
   * Create a new physical art session
   */
  static async createSession(
    username: string,
    artTitle: string,
    description: string,
  ): Promise<string> {
    try {
      return await backendService.createPhysicalArtSession(
        username,
        artTitle,
        description,
      );
    } catch (error) {
      console.error("Failed to create session:", error);
      throw error;
    }
  }

  /**
   * Upload file to S3 and record in session using AWS S3 API
   */
  static async uploadPhoto(
    sessionId: string,
    file: File,
  ): Promise<UploadResult> {
    console.log(
      `[S3Upload] Starting upload for session: ${sessionId}, file: ${file.name}`,
    );

    try {
      // Get S3 configuration
      const s3Config = await this.getS3ConfigFromBackend();

      if (!s3Config) {
        console.error("[S3Upload] S3 configuration not found");
        return {
          success: false,
          message: "S3 configuration not found",
        };
      }

      console.log(
        `[S3Upload] S3 config loaded: bucket=${s3Config.bucket_name}, region=${s3Config.region}`,
      );

      // Validate S3 config
      if (
        !s3Config.bucket_name ||
        !s3Config.region ||
        !s3Config.access_key_id ||
        !s3Config.secret_access_key
      ) {
        console.error(`[S3Upload] Invalid S3 config:`, {
          bucket_name: !!s3Config.bucket_name,
          region: !!s3Config.region,
          access_key_id: !!s3Config.access_key_id,
          secret_access_key: !!s3Config.secret_access_key,
        });
        return {
          success: false,
          message: "Invalid S3 configuration",
        };
      }

      // Validate file type and size
      if (!this.validateFileType(file)) {
        console.error(`[S3Upload] Invalid file type: ${file.type}`);
        return {
          success: false,
          message:
            "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
        };
      }

      if (!this.validateFileSize(file)) {
        console.error(`[S3Upload] File too large: ${file.size} bytes`);
        return {
          success: false,
          message: "File size too large. Maximum size is 10MB.",
        };
      }

      // Generate unique key for the file
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileKey = `physical-art/${sessionId}/${timestamp}-${sanitizedFileName}`;

      console.log(`[S3Upload] Generated file key: ${fileKey}`);

      // Validate S3 configuration
      if (
        !s3Config.region ||
        !s3Config.bucket_name ||
        !s3Config.access_key_id ||
        !s3Config.secret_access_key
      ) {
        console.error("[S3Upload] Invalid S3 configuration:", {
          region: s3Config.region,
          bucket: s3Config.bucket_name,
          hasAccessKey: !!s3Config.access_key_id,
          hasSecretKey: !!s3Config.secret_access_key,
        });
        throw new Error("Invalid S3 configuration: missing required fields");
      }

      // Create S3 client with proper endpoint configuration
      const clientConfig: Record<string, unknown> = {
        region: s3Config.region,
        credentials: {
          accessKeyId: s3Config.access_key_id,
          secretAccessKey: s3Config.secret_access_key,
        },
      };

      // Handle endpoint configuration properly
      if (s3Config.endpoint) {
        const endpoint =
          Array.isArray(s3Config.endpoint) && s3Config.endpoint.length > 0
            ? s3Config.endpoint[0]
            : typeof s3Config.endpoint === "string"
              ? s3Config.endpoint
              : null;

        if (endpoint) {
          clientConfig.endpoint = endpoint.startsWith("http")
            ? endpoint
            : `https://${endpoint}`;
          clientConfig.forcePathStyle = true; // Required for S3-compatible services
          console.log(
            `[S3Upload] Using custom endpoint: ${clientConfig.endpoint}`,
          );
        }
      }

      const s3Client = new S3Client(clientConfig);

      // Test S3 connection by trying to list objects (this is a lightweight operation)
      try {
        console.log(`[S3Upload] Testing S3 connection...`);
        // We'll skip the connection test for now to avoid additional API calls
        // In production, you might want to add a simple HeadBucket or ListObjectsV2 call here
      } catch (connectionError) {
        console.error(`[S3Upload] S3 connection test failed:`, connectionError);
        throw new Error(
          `S3 connection failed: ${connectionError instanceof Error ? connectionError.message : "Unknown error"}`,
        );
      }

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: s3Config.bucket_name,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
        Metadata: {
          "original-name": file.name,
          "session-id": sessionId,
          "upload-timestamp": timestamp,
        },
      });

      console.log(`[S3Upload] Uploading to S3: ${fileKey}`);
      console.log(`[S3Upload] S3 Client config:`, {
        region: clientConfig.region,
        endpoint: clientConfig.endpoint,
        forcePathStyle: clientConfig.forcePathStyle,
        bucket: s3Config.bucket_name,
        key: fileKey,
        contentType: file.type,
        bodySize: buffer.length,
      });

      // Step 1: Upload to S3 first (following frontend-backup pattern)
      try {
        await s3Client.send(uploadCommand);
        console.log(`[S3Upload] S3 upload successful`);
      } catch (s3Error) {
        console.error(`[S3Upload] S3 upload failed:`, s3Error);
        throw new Error(
          `S3 upload failed: ${s3Error instanceof Error ? s3Error.message : "Unknown S3 error"}`,
        );
      }

      // Step 2: Construct the file URL properly (following frontend-backup pattern)
      let photoUrl: string;
      if (s3Config.endpoint) {
        const endpoint =
          Array.isArray(s3Config.endpoint) && s3Config.endpoint.length > 0
            ? s3Config.endpoint[0]
            : typeof s3Config.endpoint === "string"
              ? s3Config.endpoint
              : null;

        if (endpoint) {
          const baseUrl = endpoint.startsWith("http")
            ? endpoint
            : `https://${endpoint}`;
          photoUrl = `${baseUrl.replace(/\/$/, "")}/${s3Config.bucket_name}/${fileKey}`;
        } else {
          photoUrl = `https://${s3Config.bucket_name}.s3.${s3Config.region}.amazonaws.com/${fileKey}`;
        }
      } else {
        photoUrl = `https://${s3Config.bucket_name}.s3.${s3Config.region}.amazonaws.com/${fileKey}`;
      }

      console.log(`[S3Upload] Generated file URL: ${photoUrl}`);

      // Step 3: Record the uploaded file in the session (only after S3 upload success)
      try {
        const recordResult = await backendService.uploadPhotoToSession(
          sessionId,
          photoUrl,
        );

        if (recordResult) {
          console.log(`[S3Upload] Photo recorded in session: ${sessionId}`);
          return {
            success: true,
            message: "Photo uploaded successfully",
            url: photoUrl,
          };
        } else {
          const errorMessage = "Failed to record uploaded photo";
          console.error(`[S3Upload] Backend record failed: ${errorMessage}`);
          throw new Error(`Backend record failed: ${errorMessage}`);
        }
      } catch (recordError) {
        console.error(`[S3Upload] Backend record error:`, recordError);
        throw new Error(
          `Backend record failed: ${recordError instanceof Error ? recordError.message : "Unknown backend error"}`,
        );
      }
    } catch (error) {
      console.error("[S3Upload] Upload failed:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Upload failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get S3 configuration from backend
   */
  static async getS3ConfigFromBackend(): Promise<S3Config | null> {
    try {
      const backendConfig = await backendService.getS3Config();

      if (backendConfig) {
        return {
          bucket_name: backendConfig.bucket_name,
          region: backendConfig.region,
          access_key_id: backendConfig.access_key_id,
          secret_access_key: backendConfig.secret_access_key,
          endpoint:
            backendConfig.endpoint.length > 0
              ? backendConfig.endpoint[0]
              : undefined,
        };
      }

      console.error("Failed to get S3 config: No configuration found");
      return null;
    } catch (error) {
      console.error("Error getting S3 config:", error);
      return null;
    }
  }

  /**
   * Check if S3 is configured
   */
  static async isS3Configured(): Promise<boolean> {
    try {
      return await backendService.isS3Configured();
    } catch (error) {
      console.error("Error checking S3 configuration:", error);
      return false;
    }
  }

  /**
   * Get session details
   */
  static async getSessionDetails(
    sessionId: string,
  ): Promise<PhysicalArtSession | null> {
    try {
      const result = await backendService.getSessionDetails(sessionId);

      if (result) {
        return this.convertBackendSessionToFrontend(result);
      }

      return null;
    } catch (error) {
      console.error("Failed to get session details:", error);
      return null;
    }
  }

  /**
   * Get user sessions
   */
  static async getUserSessions(
    username: string,
  ): Promise<PhysicalArtSession[]> {
    try {
      const result = await backendService.getUserSessions(username);

      if (Array.isArray(result)) {
        return result.map((session) =>
          this.convertBackendSessionToFrontend(session),
        );
      }

      return [];
    } catch (error) {
      console.error("Failed to get user sessions:", error);
      return [];
    }
  }

  /**
   * Update session status
   */
  static async updateSessionStatus(
    sessionId: string,
    status: string,
  ): Promise<boolean> {
    try {
      return await backendService.updateSessionStatus(sessionId, status);
    } catch (error) {
      console.error("Failed to update session status:", error);
      return false;
    }
  }

  /**
   * Remove photo from session
   */
  static async removePhotoFromSession(
    sessionId: string,
    photoUrl: string,
  ): Promise<boolean> {
    try {
      return await backendService.removePhotoFromSession(sessionId, photoUrl);
    } catch (error) {
      console.error("Failed to remove photo from session:", error);
      return false;
    }
  }

  /**
   * Validate file type
   */
  static validateFileType(file: File): boolean {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    return allowedTypes.includes(file.type.toLowerCase());
  }

  /**
   * Validate file size (10MB limit)
   */
  static validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    return file.size <= maxSize;
  }

  /**
   * Convert backend PhysicalArtSession to frontend format
   */
  private static convertBackendSessionToFrontend(
    backendSession: BackendPhysicalArtSession,
  ): PhysicalArtSession {
    return {
      session_id: backendSession.session_id,
      username: backendSession.username,
      art_title: backendSession.art_title,
      description: backendSession.description,
      uploaded_photos: backendSession.uploaded_photos,
      status: backendSession.status,
      created_at: Number(backendSession.created_at),
      updated_at: Number(backendSession.updated_at),
    };
  }
}

export const physicalArtService = PhysicalArtService;
