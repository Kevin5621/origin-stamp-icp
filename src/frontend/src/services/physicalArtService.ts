import { backend } from "../../../declarations/backend";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// Types for Physical Art Session
export interface PhysicalArtSession {
  session_id: string;
  username: string;
  art_title: string;
  description: string;
  uploaded_photos: string[];
  created_at: bigint;
  updated_at: bigint;
  status: string;
}

export interface UploadResult {
  success: boolean;
  message: string;
  file_url?: string;
  file_id?: string;
}

export interface S3Config {
  bucket_name: string;
  region: string;
  access_key_id: string;
  secret_access_key: string;
  endpoint?: string;
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
      const result = await backend.create_physical_art_session(
        username,
        artTitle,
        description,
      );

      if ("Ok" in result) {
        return result.Ok;
      } else {
        throw new Error(result.Err);
      }
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

      // Create S3 client with proper endpoint configuration
      const clientConfig: any = {
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
      } else {
        console.log(`[S3Upload] Using AWS S3 default endpoint`);
      }

      const s3Client = new S3Client(clientConfig);

      // Convert file to ArrayBuffer for upload
      console.log(`[S3Upload] Converting file to buffer...`);
      const fileBuffer = await file.arrayBuffer();

      // Create PutObject command
      const putCommand = new PutObjectCommand({
        Bucket: s3Config.bucket_name,
        Key: fileKey,
        Body: new Uint8Array(fileBuffer),
        ContentType: file.type,
        ContentLength: file.size,
        // Add metadata for better file management
        Metadata: {
          "session-id": sessionId,
          "upload-timestamp": new Date().toISOString(),
          "original-name": file.name,
        },
      });

      // Step 1: Upload to S3 first
      console.log(`[S3Upload] Uploading to S3...`);
      try {
        await s3Client.send(putCommand);
        console.log(`[S3Upload] S3 upload successful`);
      } catch (s3Error) {
        console.error(`[S3Upload] S3 upload failed:`, s3Error);
        throw new Error(
          `S3 upload failed: ${s3Error instanceof Error ? s3Error.message : "Unknown S3 error"}`,
        );
      }

      // Step 2: Construct the file URL properly
      let fileUrl: string;
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
          fileUrl = `${baseUrl.replace(/\/$/, "")}/${s3Config.bucket_name}/${fileKey}`;
        } else {
          fileUrl = `https://${s3Config.bucket_name}.s3.${s3Config.region}.amazonaws.com/${fileKey}`;
        }
      } else {
        fileUrl = `https://${s3Config.bucket_name}.s3.${s3Config.region}.amazonaws.com/${fileKey}`;
      }

      console.log(`[S3Upload] Generated file URL: ${fileUrl}`);

      // Step 3: Record the uploaded file in the session (only after S3 upload success)
      console.log(`[S3Upload] Recording upload in backend...`);
      try {
        const recordResult = await backend.upload_photo_to_session(
          sessionId,
          fileUrl,
        );

        if ("Ok" in recordResult && recordResult.Ok) {
          console.log(`[S3Upload] Backend record successful`);
          return {
            success: true,
            message: "Photo uploaded successfully",
            file_url: fileUrl,
            file_id: fileKey,
          };
        } else {
          const errorMessage =
            "Err" in recordResult
              ? recordResult.Err
              : "Failed to record uploaded photo";
          console.error(`[S3Upload] Backend record failed: ${errorMessage}`);

          // Cleanup: Delete the S3 file since backend record failed
          console.log(
            `[S3Upload] Cleaning up S3 file due to backend failure...`,
          );
          try {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: s3Config.bucket_name,
              Key: fileKey,
            });
            await s3Client.send(deleteCommand);
            console.log(`[S3Upload] S3 cleanup successful`);
          } catch (cleanupError) {
            console.error(`[S3Upload] S3 cleanup failed:`, cleanupError);
            // Don't throw here, just log the cleanup failure
          }

          throw new Error(`Backend record failed: ${errorMessage}`);
        }
      } catch (backendError) {
        console.error(`[S3Upload] Backend record error:`, backendError);
        throw new Error(
          `Backend record failed: ${backendError instanceof Error ? backendError.message : "Unknown backend error"}`,
        );
      }
    } catch (error) {
      console.error("[S3Upload] Upload process failed:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  /**
   * Upload multiple photos
   */
  static async uploadMultiplePhotos(
    sessionId: string,
    files: FileList,
  ): Promise<UploadResult[]> {
    const uploadPromises = Array.from(files).map((file) =>
      this.uploadPhoto(sessionId, file),
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Get session details
   */
  static async getSessionDetails(
    sessionId: string,
  ): Promise<PhysicalArtSession | null> {
    try {
      const result = await backend.get_session_details(sessionId);
      // Result is [] | [PhysicalArtSession], so extract the session if it exists
      return result.length > 0 && result[0] ? result[0] : null;
    } catch (error) {
      console.error("Failed to get session details:", error);
      return null;
    }
  }

  /**
   * Get all sessions for a user
   */
  static async getUserSessions(
    username: string,
  ): Promise<PhysicalArtSession[]> {
    console.log("PhysicalArtService: Getting sessions for user:", username);
    try {
      const result = await backend.get_user_sessions(username);
      console.log("PhysicalArtService: Backend returned sessions:", result);
      return result;
    } catch (error) {
      console.error("PhysicalArtService: Failed to get user sessions:", error);
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
      const result = await backend.update_session_status(sessionId, status);
      return "Ok" in result ? result.Ok : false;
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
    fileUrl: string,
  ): Promise<boolean> {
    try {
      const result = await backend.remove_photo_from_session(
        sessionId,
        fileUrl,
      );
      return "Ok" in result ? result.Ok : false;
    } catch (error) {
      console.error("Failed to remove photo from session:", error);
      return false;
    }
  }

  /**
   * Set S3 configuration (admin only)
   */
  static async setS3Config(config: S3Config): Promise<boolean> {
    try {
      // Convert to backend format
      const backendConfig = {
        bucket_name: config.bucket_name,
        region: config.region,
        access_key_id: config.access_key_id,
        secret_access_key: config.secret_access_key,
        endpoint: config.endpoint ? [config.endpoint] : [],
      };
      return await backend.set_s3_config(backendConfig as any);
    } catch (error) {
      console.error("Failed to set S3 config:", error);
      return false;
    }
  }

  /**
   * Check if S3 is configured
   */
  static async isS3Configured(): Promise<boolean> {
    try {
      return await backend.get_s3_config_status();
    } catch (error) {
      console.error("Failed to check S3 config status:", error);
      return false;
    }
  }

  /**
   * Helper function to validate file types
   */
  static validateFileType(file: File): boolean {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    return allowedTypes.includes(file.type);
  }

  /**
   * Helper function to validate file size (max 10MB)
   */
  static validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * Validate files before upload
   */
  static validateFiles(files: FileList): {
    valid: File[];
    invalid: { file: File; reason: string }[];
  } {
    const valid: File[] = [];
    const invalid: { file: File; reason: string }[] = [];

    Array.from(files).forEach((file) => {
      if (!this.validateFileType(file)) {
        invalid.push({
          file,
          reason:
            "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
        });
      } else if (!this.validateFileSize(file)) {
        invalid.push({
          file,
          reason: "File size too large. Maximum size is 10MB.",
        });
      } else {
        valid.push(file);
      }
    });

    return { valid, invalid };
  }

  /**
   * Test S3 connectivity and configuration
   */
  static async testS3Connection(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      // Check if S3 is configured
      const s3Config = await this.getS3ConfigFromBackend();
      if (!s3Config) {
        return {
          success: false,
          message: "S3 configuration not found in backend",
        };
      }

      // Test S3 client initialization
      const clientConfig: any = {
        region: s3Config.region,
        credentials: {
          accessKeyId: s3Config.access_key_id,
          secretAccessKey: s3Config.secret_access_key,
        },
      };

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
          clientConfig.forcePathStyle = true;
        }
      }

      // Initialize S3 client to test configuration
      new S3Client(clientConfig);

      return {
        success: true,
        message: "S3 client initialized successfully",
        details: {
          bucket: s3Config.bucket_name,
          region: s3Config.region,
          endpoint: clientConfig.endpoint || "AWS S3",
          hasCustomEndpoint: !!clientConfig.endpoint,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `S3 connection test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: { error },
      };
    }
  }

  /**
   * Initialize S3 configuration from environment variables
   */
  static async initializeS3FromEnv(): Promise<boolean> {
    try {
      // Check if S3 is already configured
      const isConfigured = await this.isS3Configured();
      if (isConfigured) {
        console.log("S3 is already configured");
        return true;
      }

      // Get environment variables (Vite exposes env vars that start with VITE_ or are explicitly configured)
      const s3Config = {
        bucket_name: import.meta.env.S3_BUCKET_NAME || "",
        region: import.meta.env.S3_REGION || "",
        access_key_id: import.meta.env.S3_ACCESS_KEY || "",
        secret_access_key: import.meta.env.S3_SECRET_KEY || "",
        endpoint: import.meta.env.S3_ENDPOINT || undefined,
      };

      // Validate required fields
      if (
        !s3Config.bucket_name ||
        !s3Config.region ||
        !s3Config.access_key_id ||
        !s3Config.secret_access_key
      ) {
        console.warn(
          "S3 environment variables not fully configured. Missing:",
          {
            bucket_name: !s3Config.bucket_name,
            region: !s3Config.region,
            access_key_id: !s3Config.access_key_id,
            secret_access_key: !s3Config.secret_access_key,
          },
        );
        return false;
      }

      // Set S3 configuration in backend
      const success = await this.setS3Config(s3Config);
      if (success) {
        console.log(
          "S3 configuration initialized successfully from environment variables",
        );
      } else {
        console.error("Failed to initialize S3 configuration");
      }

      return success;
    } catch (error) {
      console.error("Failed to initialize S3 from environment:", error);
      return false;
    }
  }

  /**
   * Get S3 configuration from backend
   */
  private static async getS3ConfigFromBackend(): Promise<any | null> {
    try {
      const result = await backend.get_s3_config();
      return result.length > 0 && result[0] ? result[0] : null;
    } catch (error) {
      console.error("Failed to get S3 config:", error);
      return null;
    }
  }
}

export default PhysicalArtService;
