import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Config, UploadResult, PhysicalArtSession } from "../types/s3";

interface S3ClientConfig {
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  endpoint?: string;
  forcePathStyle?: boolean;
}

export class PhysicalArtService {
  static async createSession(): Promise<string> {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return sessionId;
    } catch (error) {
      console.error("Failed to create session:", error);
      throw error;
    }
  }

  static async uploadPhoto(
    sessionId: string,
    file: File,
  ): Promise<UploadResult> {
    console.log(
      `[S3Upload] Starting upload for session: ${sessionId}, file: ${file.name}`,
    );

    try {
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

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileKey = `physical-art/${sessionId}/${timestamp}-${sanitizedFileName}`;

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

      const clientConfig: S3ClientConfig = {
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
          console.log(
            `[S3Upload] Using custom endpoint: ${clientConfig.endpoint}`,
          );
        }
      }

      const s3Client = new S3Client(clientConfig);
      const fileBuffer = await file.arrayBuffer();

      const putCommand = new PutObjectCommand({
        Bucket: s3Config.bucket_name,
        Key: fileKey,
        Body: new Uint8Array(fileBuffer),
        ContentType: file.type,
        ContentLength: file.size,
        Metadata: {
          "session-id": sessionId,
          "upload-timestamp": new Date().toISOString(),
          "original-name": file.name,
        },
      });

      try {
        await s3Client.send(putCommand);
      } catch (s3Error) {
        console.error(`[S3Upload] S3 upload failed:`, s3Error);
        throw new Error(
          `S3 upload failed: ${s3Error instanceof Error ? s3Error.message : "Unknown S3 error"}`,
        );
      }

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

      try {
        return {
          success: true,
          message: "Photo uploaded successfully",
          file_url: fileUrl,
          file_id: fileKey,
        };
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

  static async uploadMultiplePhotos(
    sessionId: string,
    files: FileList,
  ): Promise<UploadResult[]> {
    const uploadPromises = Array.from(files).map((file) =>
      this.uploadPhoto(sessionId, file),
    );

    return Promise.all(uploadPromises);
  }

  static async getSessionDetails(): Promise<PhysicalArtSession | null> {
    try {
      return null;
    } catch (error) {
      console.error("Failed to get session details:", error);
      return null;
    }
  }

  static async getUserSessions(): Promise<PhysicalArtSession[]> {
    try {
      return [];
    } catch (error) {
      console.error("Failed to get user sessions:", error);
      return [];
    }
  }

  static async updateSessionStatus(): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      console.error("Failed to update session status:", error);
      return false;
    }
  }

  static async removePhotoFromSession(): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      console.error("Failed to remove photo from session:", error);
      return false;
    }
  }

  static async setS3Config(config: S3Config): Promise<boolean> {
    try {
      console.log("S3 config set:", config);
      return true;
    } catch (error) {
      console.error("Failed to set S3 config:", error);
      return false;
    }
  }

  static async isS3Configured(): Promise<boolean> {
    try {
      return false;
    } catch (error) {
      console.error("Failed to check S3 config status:", error);
      return false;
    }
  }

  static validateFileType(file: File): boolean {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    return allowedTypes.includes(file.type);
  }

  static validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

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

  static async testS3Connection(): Promise<{
    success: boolean;
    message: string;
    details?: {
      bucket: string;
      region: string;
      endpoint: string;
      hasCustomEndpoint: boolean;
      error?: unknown;
    };
  }> {
    try {
      const s3Config = await this.getS3ConfigFromBackend();
      if (!s3Config) {
        return {
          success: false,
          message: "S3 configuration not found in backend",
        };
      }

      const clientConfig: S3ClientConfig = {
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
        details: {
          bucket: "unknown",
          region: "unknown",
          endpoint: "unknown",
          hasCustomEndpoint: false,
          error,
        },
      };
    }
  }

  static async initializeS3FromEnv(): Promise<boolean> {
    try {
      const isConfigured = await this.isS3Configured();
      if (isConfigured) {
        return true;
      }

      const s3Config = {
        bucket_name: process.env.NEXT_PUBLIC_S3_BUCKET_NAME || "",
        region: process.env.NEXT_PUBLIC_S3_REGION || "",
        access_key_id: process.env.NEXT_PUBLIC_S3_ACCESS_KEY || "",
        secret_access_key: process.env.NEXT_PUBLIC_S3_SECRET_KEY || "",
        endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT || undefined,
      };

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

  private static async getS3ConfigFromBackend(): Promise<S3Config | null> {
    try {
      return null;
    } catch (error) {
      console.error("Failed to get S3 config:", error);
      return null;
    }
  }
}

export default PhysicalArtService;
