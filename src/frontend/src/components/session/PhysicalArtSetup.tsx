import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { X, CheckCircle, AlertCircle, Camera } from "lucide-react";
import PhysicalArtService from "../../services/physicalArtService";
import { useAuth } from "../../contexts/AuthContext";

interface PhysicalArtSetupProps {
  onSessionCreated?: (sessionId: string) => void;
  onPhotosUploaded?: (photoUrls: string[]) => void;
}

interface UploadProgress {
  file: File;
  status: "uploading" | "completed" | "failed";
  progress: number;
  url?: string;
  error?: string;
}

const PhysicalArtSetup: React.FC<PhysicalArtSetupProps> = ({
  onSessionCreated,
  onPhotosUploaded,
}) => {
  const { t } = useTranslation("session");
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sessionId, setSessionId] = useState<string>("");
  const [artTitle, setArtTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<
    Map<string, UploadProgress>
  >(new Map());
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [sessionCreated, setSessionCreated] = useState(false);
  const [s3Configured, setS3Configured] = useState<boolean | null>(null);

  // Check S3 configuration on mount
  React.useEffect(() => {
    const checkS3Config = async () => {
      const configured = await PhysicalArtService.isS3Configured();
      setS3Configured(configured);
    };
    checkS3Config();
  }, []);

  const handleCreateSession = async () => {
    if (!user?.username || !artTitle.trim()) {
      return;
    }

    setIsCreatingSession(true);
    try {
      const sessionId = await PhysicalArtService.createSession(
        user.username,
        artTitle.trim(),
        description.trim() || t("physical_art_setup.description_default"),
      );

      setSessionId(sessionId);
      setSessionCreated(true);
      onSessionCreated?.(sessionId);
    } catch (error) {
      console.error("Failed to create session:", error);
      alert(t("failed_to_create_session"));
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    handleFileUpload(files);
  };

  const handleFileUpload = async (files: FileList) => {
    if (!sessionId) {
      alert(t("please_create_session_first"));
      return;
    }

    // Validate files
    const validation = PhysicalArtService.validateFiles(files);

    // Show validation errors
    if (validation.invalid.length > 0) {
      const errors = validation.invalid
        .map((v) => `${v.file.name}: ${v.reason}`)
        .join("\n");
      alert(`${t("invalid_files")}:\n${errors}`);
    }

    if (validation.valid.length === 0) {
      return;
    }

    // Initialize progress tracking
    const newProgress = new Map(uploadProgress);
    validation.valid.forEach((file) => {
      newProgress.set(file.name, {
        file,
        status: "uploading",
        progress: 0,
      });
    });
    setUploadProgress(newProgress);

    // Upload files sequentially (you could do parallel uploads too)
    const uploadResults = [];
    for (const file of validation.valid) {
      try {
        // Update progress
        newProgress.set(file.name, {
          ...newProgress.get(file.name)!,
          progress: 50,
        });
        setUploadProgress(new Map(newProgress));

        const result = await PhysicalArtService.uploadPhoto(sessionId, file);

        if (result.success) {
          newProgress.set(file.name, {
            ...newProgress.get(file.name)!,
            status: "completed",
            progress: 100,
            url: result.file_url,
          });
          uploadResults.push(result.file_url!);
        } else {
          newProgress.set(file.name, {
            ...newProgress.get(file.name)!,
            status: "failed",
            progress: 0,
            error: result.message,
          });
        }
      } catch (error) {
        newProgress.set(file.name, {
          ...newProgress.get(file.name)!,
          status: "failed",
          progress: 0,
          error: error instanceof Error ? error.message : t("upload_failed"),
        });
      }

      setUploadProgress(new Map(newProgress));
    }

    // Notify parent component
    if (uploadResults.length > 0) {
      onPhotosUploaded?.(uploadResults);
    }

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const removeUploadedFile = (filename: string) => {
    const newProgress = new Map(uploadProgress);
    newProgress.delete(filename);
    setUploadProgress(newProgress);
  };

  const getUploadedPhotos = () => {
    return Array.from(uploadProgress.values())
      .filter((p) => p.status === "completed")
      .map((p) => p.url!)
      .filter(Boolean);
  };

  if (s3Configured === null) {
    return (
      <div className="setup-content">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>{t("checking_configuration")}</p>
        </div>
      </div>
    );
  }

  if (s3Configured === false) {
    return (
      <div className="setup-content">
        <div className="error-state">
          <AlertCircle size={48} className="error-icon" />
          <h3>{t("s3_not_configured")}</h3>
          <p>{t("s3_configuration_required")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="setup-content">
      {!sessionCreated ? (
        <div className="session-creation">
          <h3 className="setup-section-title">{t("create_art_session")}</h3>
          <p className="setup-description">
            {t("physical_art_setup_description")}
          </p>

          <div className="form-group">
            <label htmlFor="artTitle" className="form-label">
              {t("artwork_title")} *
            </label>
            <input
              id="artTitle"
              type="text"
              value={artTitle}
              onChange={(e) => setArtTitle(e.target.value)}
              placeholder={t("enter_artwork_title")}
              className="form-input"
              disabled={isCreatingSession}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              {t("description")} ({t("optional")})
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("describe_your_artwork")}
              className="form-textarea"
              rows={3}
              disabled={isCreatingSession}
            />
          </div>

          <button
            onClick={handleCreateSession}
            disabled={isCreatingSession || !artTitle.trim()}
            className="btn btn--primary"
          >
            {isCreatingSession ? t("creating_session") : t("create_session")}
          </button>
        </div>
      ) : (
        <div className="upload-section">
          <div className="session-info">
            <h3 className="session-title">{artTitle}</h3>
            <p className="session-id">
              {t("session_id")}: {sessionId}
            </p>
            {description && (
              <p className="session-description">{description}</p>
            )}
          </div>

          <div className="upload-area-container">
            <div
              className="upload-area"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={48} strokeWidth={1} />
              <h4>{t("upload_process_photos")}</h4>
              <p>{t("drag_and_drop_or_click")}</p>
              <p className="upload-info">
                {t("supported_formats")}: JPEG, PNG, WebP, GIF (max 10MB)
              </p>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
                style={{ display: "none" }}
              />
            </div>
          </div>

          {uploadProgress.size > 0 && (
            <div className="upload-progress-section">
              <h4>{t("upload_progress")}</h4>
              <div className="progress-list">
                {Array.from(uploadProgress.entries()).map(
                  ([filename, progress]) => (
                    <div key={filename} className="progress-item">
                      <div className="progress-info">
                        <span className="filename">{filename}</span>
                        <div className="progress-status">
                          {progress.status === "uploading" && (
                            <span className="status uploading">
                              {t("uploading")} ({progress.progress}%)
                            </span>
                          )}
                          {progress.status === "completed" && (
                            <span className="status completed">
                              <CheckCircle size={16} />
                              {t("completed")}
                            </span>
                          )}
                          {progress.status === "failed" && (
                            <span className="status failed">
                              <AlertCircle size={16} />
                              {progress.error || t("failed")}
                            </span>
                          )}
                        </div>
                      </div>

                      {progress.status === "uploading" && (
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${progress.progress}%` }}
                          />
                        </div>
                      )}

                      {progress.status === "completed" && (
                        <button
                          onClick={() => removeUploadedFile(filename)}
                          className="remove-button"
                          title={t("remove")}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {getUploadedPhotos().length > 0 && (
            <div className="uploaded-photos-summary">
              <h4>
                {t("uploaded_photos_count", {
                  count: getUploadedPhotos().length,
                })}
              </h4>
              <p>{t("photos_saved_securely")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhysicalArtSetup;
