import { backend } from "../../../declarations/backend";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
    try {
      // Get S3 configuration
      const s3Config = await this.getS3ConfigFromBackend();

      if (!s3Config) {
        throw new Error("S3 configuration not found");
      }

      // Create S3 client
      const s3Client = new S3Client({
        region: s3Config.region,
        credentials: {
          accessKeyId: s3Config.access_key_id,
          secretAccessKey: s3Config.secret_access_key,
        },
        ...(s3Config.endpoint &&
        Array.isArray(s3Config.endpoint) &&
        s3Config.endpoint.length > 0
          ? { endpoint: s3Config.endpoint[0] }
          : s3Config.endpoint && typeof s3Config.endpoint === "string"
            ? { endpoint: s3Config.endpoint }
            : {}),
      });

      // Generate unique key for the file
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileKey = `physical-art/${sessionId}/${timestamp}-${file.name}`;

      // Convert file to ArrayBuffer for upload
      const fileBuffer = await file.arrayBuffer();

      // Create PutObject command
      const putCommand = new PutObjectCommand({
        Bucket: s3Config.bucket_name,
        Key: fileKey,
        Body: new Uint8Array(fileBuffer),
        ContentType: file.type,
        ContentLength: file.size,
      });

      // Upload to S3
      await s3Client.send(putCommand);

      // Construct the file URL
      const fileUrl =
        s3Config.endpoint &&
        Array.isArray(s3Config.endpoint) &&
        s3Config.endpoint.length > 0
          ? `${s3Config.endpoint[0]}/${s3Config.bucket_name}/${fileKey}`
          : s3Config.endpoint && typeof s3Config.endpoint === "string"
            ? `${s3Config.endpoint}/${s3Config.bucket_name}/${fileKey}`
            : `https://${s3Config.bucket_name}.s3.${s3Config.region}.amazonaws.com/${fileKey}`;

      // Record the uploaded file in the session
      const recordResult = await backend.upload_photo_to_session(
        sessionId,
        fileUrl,
      );

      if ("Ok" in recordResult && recordResult.Ok) {
        return {
          success: true,
          message: "Photo uploaded successfully",
          file_url: fileUrl,
          file_id: fileKey,
        };
      } else {
        throw new Error("Failed to record uploaded photo");
      }
    } catch (error) {
      console.error("Upload failed:", error);
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
    try {
      return await backend.get_user_sessions(username);
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
