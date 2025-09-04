import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Config, UploadResult } from "../types/s3";

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
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
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
    try {
      console.log("🚀 Starting photo upload process...");
      console.log("Session ID:", sessionId);
      console.log("File:", file.name, file.size, "bytes");

      const s3Config = await this.getS3ConfigFromBackend();

      if (!s3Config) {
        console.error("❌ S3 configuration not found");
        return {
          success: false,
          message: "S3 configuration not found",
        };
      }

      console.log("✅ S3 config found, validating file...");
      const validationResult = this.validateUploadFile(file);
      if (!validationResult.valid) {
        console.error("❌ File validation failed:", validationResult.message);
        return {
          success: false,
          message: validationResult.message,
        };
      }

      console.log("✅ File validation passed, uploading to S3...");
      const uploadResult = await this.performS3Upload(
        s3Config,
        sessionId,
        file,
      );
      console.log("📤 Upload result:", uploadResult);
      return uploadResult;
    } catch (error) {
      console.error("❌ Upload error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  private static validateUploadFile(file: File): {
    valid: boolean;
    message: string;
  } {
    if (!this.validateFileType(file)) {
      return {
        valid: false,
        message:
          "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
      };
    }

    if (!this.validateFileSize(file)) {
      return {
        valid: false,
        message: "File size too large. Maximum size is 10MB.",
      };
    }

    return { valid: true, message: "Valid file" };
  }

  private static async performS3Upload(
    s3Config: S3Config,
    sessionId: string,
    file: File,
  ): Promise<UploadResult> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileKey = `physical-art/${sessionId}/${timestamp}-${sanitizedFileName}`;

    this.validateS3Config(s3Config);

    const clientConfig = this.buildS3ClientConfig(s3Config);
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
      throw new Error(
        `S3 upload failed: ${s3Error instanceof Error ? s3Error.message : "Unknown S3 error"}`,
      );
    }

    const fileUrl = this.buildFileUrl(s3Config, fileKey);

    return {
      success: true,
      message: "Photo uploaded successfully",
      file_url: fileUrl,
      file_id: fileKey,
    };
  }

  private static validateS3Config(s3Config: S3Config): void {
    if (
      !s3Config.region ||
      !s3Config.bucket_name ||
      !s3Config.access_key_id ||
      !s3Config.secret_access_key
    ) {
      throw new Error("Invalid S3 configuration: missing required fields");
    }
  }

  private static buildFileUrl(s3Config: S3Config, fileKey: string): string {
    if (s3Config.endpoint) {
      const endpoint = this.extractEndpoint(s3Config.endpoint);
      if (endpoint) {
        const baseUrl = endpoint.startsWith("http")
          ? endpoint
          : `https://${endpoint}`;
        return `${baseUrl.replace(/\/$/, "")}/${s3Config.bucket_name}/${fileKey}`;
      }
    }
    return `https://${s3Config.bucket_name}.s3.${s3Config.region}.amazonaws.com/${fileKey}`;
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

  static async isS3Configured(): Promise<boolean> {
    try {
      // Use backendService for better connection handling
      const { backendService } = await import("./backendService");
      return await backendService.isS3Configured();
    } catch (error) {
      console.error("Failed to check S3 configuration status:", error);
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

      const clientConfig = this.buildS3ClientConfig(s3Config);
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

  private static buildS3ClientConfig(s3Config: S3Config): S3ClientConfig {
    const clientConfig: S3ClientConfig = {
      region: s3Config.region,
      credentials: {
        accessKeyId: s3Config.access_key_id,
        secretAccessKey: s3Config.secret_access_key,
      },
    };

    if (s3Config.endpoint) {
      const endpoint = this.extractEndpoint(s3Config.endpoint);
      if (endpoint) {
        clientConfig.endpoint = endpoint.startsWith("http")
          ? endpoint
          : `https://${endpoint}`;
        clientConfig.forcePathStyle = true;
      }
    }

    return clientConfig;
  }

  private static extractEndpoint(endpoint: string | string[]): string | null {
    if (Array.isArray(endpoint)) {
      return endpoint.length > 0 ? endpoint[0] : null;
    }
    return typeof endpoint === "string" ? endpoint : null;
  }

  static async initializeS3FromEnv(): Promise<boolean> {
    try {
      const isConfigured = await this.isS3Configured();
      if (isConfigured) {
        return true;
      }

      // For now, we rely on backend configuration via deploy script
      // Future: Implement frontend S3 config if needed
      console.log("S3 should be configured via backend deploy script");
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Debug method to check S3 connection status
   */
  static async debugS3Connection(): Promise<void> {
    console.log("🔧 Starting S3 debug check...");

    try {
      // Check backend service availability
      const { backendService } = await import("./backendService");
      console.log("Backend service available:", backendService.isAvailable());

      // Check S3 configuration status
      const isConfigured = await this.isS3Configured();
      console.log("S3 configured status:", isConfigured);

      // Try to get S3 config
      const config = await this.getS3ConfigFromBackend();
      console.log("S3 config retrieved:", !!config);

      if (config) {
        // Test S3 connection
        const connectionTest = await this.testS3Connection();
        console.log("S3 connection test:", connectionTest);
      }
    } catch (error) {
      console.error("❌ Debug check failed:", error);
    }

    console.log("🔧 S3 debug check completed");
  }

  private static async getS3ConfigFromBackend(): Promise<S3Config | null> {
    try {
      console.log("🔍 Getting S3 config from backend...");

      // Use backendService for better connection handling
      const { backendService } = await import("./backendService");

      // Check if backend is available
      if (!backendService.isAvailable()) {
        console.warn("⚠️ Backend service not available");
        return null;
      }

      console.log("✅ Backend service available, fetching S3 config...");

      // Get S3 configuration from backend via backendService
      const backendConfig = await backendService.getS3Config();

      if (backendConfig) {
        console.log("✅ Raw backend config received:", {
          bucket: backendConfig.bucket_name,
          region: backendConfig.region,
          hasAccessKey: !!backendConfig.access_key_id,
          hasSecretKey: !!backendConfig.secret_access_key,
          endpoint: backendConfig.endpoint,
        });

        // Convert backend config to frontend config type
        const config: S3Config = {
          bucket_name: backendConfig.bucket_name,
          region: backendConfig.region,
          access_key_id: backendConfig.access_key_id,
          secret_access_key: backendConfig.secret_access_key,
          endpoint:
            backendConfig.endpoint && backendConfig.endpoint.length > 0
              ? backendConfig.endpoint[0]
              : undefined,
        };

        console.log("✅ S3 config converted for frontend:", {
          bucket: config.bucket_name,
          region: config.region,
          hasEndpoint: !!config.endpoint,
          endpoint: config.endpoint,
        });
        return config;
      }

      console.warn("⚠️ S3 config not found in backend");
      return null;
    } catch (error) {
      console.error("❌ Failed to get S3 config from backend:", error);
      return null;
    }
  }
}

export default PhysicalArtService;
