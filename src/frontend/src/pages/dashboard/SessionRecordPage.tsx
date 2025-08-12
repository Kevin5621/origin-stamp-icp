import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  Camera,
  Upload,
  Image,
  Clock,
  FileText,
  Save,
  ArrowLeft,
  Trash2,
  Download,
  Plus,
  Sparkles,
} from "lucide-react";
import { useToastContext } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import PhysicalArtService, {
  PhysicalArtSession,
} from "../../services/physicalArtService";
import { backend } from "../../../../declarations/backend";
import { Principal } from "@dfinity/principal";

// Types for photo logs - updated to match smart contract
interface PhotoLog {
  id: string;
  filename: string;
  timestamp: Date;
  description: string;
  fileSize: number;
  url: string; // Photo URL from smart contract
  step: number;
  s3Key?: string; // S3 storage key
}

// Updated interface to match smart contract data
interface SessionData {
  id: string;
  title: string;
  description: string;
  artType: "physical" | "digital";
  status: "draft" | "active" | "completed";
  createdAt: Date;
  photos: PhotoLog[];
  currentStep: number;
  nftGenerated?: boolean;
  username: string;
  updatedAt: Date;
}

/**
 * Session Recording Page - Upload photos ke S3 dan generate NFT
 */
const SessionRecordPage: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { addToast } = useToastContext();
  const { user } = useAuth();
  const { t } = useTranslation("session");

  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [stepDescription, setStepDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingNFT, setIsGeneratingNFT] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<number>(0);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [shouldCancelUpload, setShouldCancelUpload] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const cancelRef = useRef<boolean>(false);

  // Debug effect untuk melihat perubahan location
  useEffect(() => {
    console.log("SessionRecordPage location changed to:", location.pathname);
    console.log("Raw sessionId from useParams:", sessionId);
    console.log("URL parameters:", window.location.pathname);
  }, [sessionId]);

  // Reset progress states when selectedFiles changes
  useEffect(() => {
    if (!selectedFiles) {
      setUploadProgress(0);
      setUploadedFiles(0);
      setTotalFiles(0);
      setIsUploading(false);
      setUploadInProgress(false);
      setShouldCancelUpload(false);
      setIsCancelling(false);
    }
  }, [selectedFiles]);

  // Debug shouldCancelUpload changes
  useEffect(() => {
    console.log("shouldCancelUpload changed to:", shouldCancelUpload);

    // If cancelled, reset progress immediately for visual feedback
    if (shouldCancelUpload) {
      console.log("Resetting progress due to cancellation");
      setUploadProgress(0);
      setUploadedFiles(0);
    }
  }, [shouldCancelUpload]);

  // Helper function to convert smart contract session to SessionData
  const convertSmartContractSession = (
    smartContractSession: PhysicalArtSession,
  ): SessionData => {
    // Convert uploaded photos to PhotoLog format
    const photos: PhotoLog[] = smartContractSession.uploaded_photos.map(
      (url, index) => ({
        id: `photo-${index + 1}`,
        filename: url.split("/").pop() || `photo-${index + 1}.jpg`,
        timestamp: new Date(Number(smartContractSession.updated_at) / 1000000),
        description: `Photo ${index + 1}`,
        fileSize: 0, // File size not stored in smart contract
        url: url,
        step: index + 1,
        s3Key: url.split("/").slice(-2).join("/"), // Extract S3 key from URL
      }),
    );

    return {
      id: smartContractSession.session_id,
      title: smartContractSession.art_title,
      description: smartContractSession.description,
      artType: "physical",
      status: smartContractSession.status as "draft" | "active" | "completed",
      createdAt: new Date(Number(smartContractSession.created_at) / 1000000),
      updatedAt: new Date(Number(smartContractSession.updated_at) / 1000000),
      username: smartContractSession.username,
      photos: photos,
      currentStep: photos.length,
      nftGenerated: false, // This would need to be checked against NFT records
    };
  };

  // Load session data from smart contract
  useEffect(() => {
    const loadSessionData = async () => {
      if (!sessionId) {
        setError("Session ID is required");
        setIsLoading(false);
        return;
      }

      // Parse session ID - remove 'session-' prefix if present
      const cleanSessionId = sessionId.startsWith("session-")
        ? sessionId.replace("session-", "")
        : sessionId;

      console.log("Original sessionId from URL:", sessionId);
      console.log("Cleaned sessionId for backend:", cleanSessionId);

      try {
        setError(null);
        const sessionDetails =
          await PhysicalArtService.getSessionDetails(cleanSessionId);

        console.log("Session details received:", sessionDetails);

        if (!sessionDetails) {
          console.log("Session not found with ID:", cleanSessionId);

          // Try to get available sessions for better error message
          let availableSessionsInfo = "";
          if (user?.username) {
            try {
              const userSessions = await PhysicalArtService.getUserSessions(
                user.username,
              );
              if (userSessions.length > 0) {
                const sessionIds = userSessions
                  .map((s) => s.session_id)
                  .join(", ");
                availableSessionsInfo = ` Available sessions for ${user.username}: ${sessionIds}`;
              } else {
                availableSessionsInfo = ` No sessions found for user ${user.username}. Create a new session first.`;
              }
            } catch (e) {
              console.log("Could not fetch available sessions:", e);
            }
          }

          setError(
            `Session with ID "${sessionId}" not found. This session may not exist or may have been deleted.${availableSessionsInfo}`,
          );
          setIsLoading(false);
          return;
        }

        const convertedSession = convertSmartContractSession(sessionDetails);
        console.log("Converted session:", convertedSession);
        setSession(convertedSession);
      } catch (error) {
        console.error("Failed to load session:", error);
        setError(
          `Failed to load session "${sessionId}". Please check if the session exists and try again.`,
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionData();
  }, [sessionId]);

  const handleFileSelect = (files: FileList) => {
    // Reset progress states when new files are selected
    setUploadProgress(0);
    setUploadedFiles(0);
    setTotalFiles(0);
    setIsUploading(false);
    setUploadInProgress(false);
    setShouldCancelUpload(false);
    setIsCancelling(false);

    // Check for duplicates with existing photos
    if (session) {
      const existingFilenames = session.photos.map((photo) => photo.filename);
      const newFiles = Array.from(files);
      const duplicates = newFiles.filter((file) =>
        existingFilenames.includes(file.name),
      );

      if (duplicates.length > 0) {
        addToast(
          "error",
          `File berikut sudah ada: ${duplicates.map((f) => f.name).join(", ")}`,
        );
        return;
      }
    }

    // Validate file types and sizes
    const validFiles = Array.from(files).filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

      if (!isValidType) {
        addToast(
          "error",
          t("session.invalid_file_type", { filename: file.name }),
        );
        return false;
      }

      if (!isValidSize) {
        addToast("error", t("session.file_too_large", { filename: file.name }));
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) {
      return;
    }

    // Create a new FileList-like object with valid files
    const dataTransfer = new DataTransfer();
    validFiles.forEach((file) => dataTransfer.items.add(file));

    setSelectedFiles(dataTransfer.files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    // Reset progress states when new files are dropped
    setUploadProgress(0);
    setUploadedFiles(0);
    setTotalFiles(0);
    setIsUploading(false);
    setUploadInProgress(false);
    setShouldCancelUpload(false);

    if (e.dataTransfer.files?.[0]) {
      // Check for duplicates with existing photos
      if (session) {
        const existingFilenames = session.photos.map((photo) => photo.filename);
        const newFiles = Array.from(e.dataTransfer.files);
        const duplicates = newFiles.filter((file) =>
          existingFilenames.includes(file.name),
        );

        if (duplicates.length > 0) {
          addToast(
            "error",
            t("session.duplicate_files", {
              filenames: duplicates.map((f) => f.name).join(", "),
            }),
          );
          return;
        }
      }

      // Validate file types and sizes
      const validFiles = Array.from(e.dataTransfer.files).filter((file) => {
        const isValidType = file.type.startsWith("image/");
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

        if (!isValidType) {
          addToast(
            "error",
            t("session.invalid_file_type", { filename: file.name }),
          );
          return false;
        }

        if (!isValidSize) {
          addToast(
            "error",
            t("session.file_too_large", { filename: file.name }),
          );
          return false;
        }

        return true;
      });

      if (validFiles.length === 0) {
        return;
      }

      // Create a new FileList-like object with valid files
      const dataTransfer = new DataTransfer();
      validFiles.forEach((file) => dataTransfer.items.add(file));

      handleFileSelect(dataTransfer.files);
    }
  };

  const handleUploadToS3 = async () => {
    if (!selectedFiles || !session) return;

    // Prevent multiple uploads
    if (isUploading || uploadInProgress) {
      console.log("Upload already in progress, ignoring new request");
      addToast("warning", t("session.upload_already_in_progress_wait"));
      return;
    }

    // Reset states and start upload
    setUploadProgress(0);
    setUploadedFiles(0);
    setTotalFiles(selectedFiles.length);
    setShouldCancelUpload(false);
    setIsCancelling(false);
    cancelRef.current = false;
    setIsUploading(true);
    setUploadInProgress(true);

    const filesArray = Array.from(selectedFiles);

    console.log("Starting upload process...");
    console.log("Files to upload:", filesArray.length);

    addToast(
      "info",
      t("session.starting_upload_files", { count: filesArray.length }),
    );

    const newPhotos: PhotoLog[] = [];

    try {
      // Real upload to S3 and smart contract
      for (let i = 0; i < filesArray.length; i++) {
        // Check for cancellation before processing file
        if (cancelRef.current) {
          console.log("Upload cancelled at file", i);
          addToast("warning", t("session.upload_cancelled_by_user_message"));
          return;
        }

        const file = filesArray[i];

        try {
          // Upload file using PhysicalArtService
          const uploadResult = await PhysicalArtService.uploadPhoto(
            session.id,
            file,
          );

          if (uploadResult.success && uploadResult.file_url) {
            // Create photo log entry
            const newPhoto: PhotoLog = {
              id: `photo-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
              filename: file.name,
              timestamp: new Date(),
              description:
                stepDescription ||
                `${t("session.step")} ${session.currentStep + i + 1}`,
              fileSize: file.size,
              url: uploadResult.file_url, // Real S3 URL
              step: session.currentStep + i + 1,
              s3Key:
                uploadResult.file_id ||
                `sessions/${session.id}/photos/${file.name}`,
            };

            newPhotos.push(newPhoto);

            // Update progress
            setUploadProgress(((i + 1) * 100) / filesArray.length);
            setUploadedFiles(i + 1);
          } else {
            throw new Error(uploadResult.message || "Upload failed");
          }
        } catch (uploadError) {
          console.error("Failed to upload file:", uploadError);
          addToast("error", `Failed to upload ${file.name}: ${uploadError}`);
          // Continue with other files
        }
      }

      // Update local session state if not cancelled
      if (!cancelRef.current && newPhotos.length > 0) {
        console.log(
          t("session.updating_session_with_photos", {
            count: newPhotos.length,
          }),
        );
        setSession((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            photos: [...prev.photos, ...newPhotos],
            currentStep: prev.currentStep + newPhotos.length,
          };
        });

        addToast(
          "success",
          t("session.files_uploaded", { count: newPhotos.length }),
        );
      } else {
        console.log(t("session.session_not_updated_cancelled"));
      }
    } catch (error) {
      console.log("Upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      addToast("error", t("session.upload_error", { error: errorMessage }));
    } finally {
      // Reset all states
      setSelectedFiles(null);
      setStepDescription("");
      setIsUploading(false);
      setUploadInProgress(false);
      setUploadedFiles(0);
      setTotalFiles(0);
      setShouldCancelUpload(false);
      setIsCancelling(false);
      cancelRef.current = false;
      setUploadProgress(0);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!session) return;

    const photoToDelete = session.photos.find((p) => p.id === photoId);
    if (!photoToDelete) return;

    try {
      // Remove photo from smart contract
      const success = await PhysicalArtService.removePhotoFromSession(
        session.id,
        photoToDelete.url,
      );

      if (success) {
        // Update local state
        setSession({
          ...session,
          photos: session.photos.filter((p) => p.id !== photoId),
        });

        addToast(
          "success",
          t("session.photo_deleted_success", {
            filename: photoToDelete.filename,
          }),
        );
      } else {
        addToast("error", "Failed to delete photo from smart contract");
      }
    } catch (error) {
      console.error("Failed to delete photo:", error);
      addToast("error", "Failed to delete photo");
    }
  };

  const handleCompleteSessionAndGenerateNFT = async () => {
    if (!session || !user) return;

    setIsGeneratingNFT(true);
    addToast("info", t("session.starting_nft_generation_process"));

    try {
      // First, update session status to completed
      const statusUpdated = await PhysicalArtService.updateSessionStatus(
        session.id,
        "completed",
      );

      if (!statusUpdated) {
        throw new Error("Failed to update session status");
      }

      // Create recipient account (user's principal)
      const userPrincipal = Principal.fromText(
        user.principal || Principal.anonymous().toString(),
      );
      const recipient = {
        owner: userPrincipal,
        subaccount: [] as [],
      };

      // Additional attributes for the NFT
      const additionalAttributes: [string, string][] = [
        ["creation_method", "physical_art_documentation"],
        ["total_photos", session.photos.length.toString()],
        ["completion_date", new Date().toISOString()],
      ];

      // Mint NFT from session
      const mintResult = await backend.mint_nft_from_session(
        session.id,
        recipient,
        additionalAttributes,
      );

      if ("Ok" in mintResult) {
        const tokenId = mintResult.Ok;

        // Update local session state
        setSession((prev) =>
          prev
            ? {
                ...prev,
                status: "completed",
                nftGenerated: true,
              }
            : null,
        );

        addToast("success", `NFT generated successfully! Token ID: ${tokenId}`);

        // Navigate to certificate page with token ID
        navigate(`/certificate/${session.id}?tokenId=${tokenId}`);
      } else {
        throw new Error(mintResult.Err);
      }
    } catch (error) {
      console.error("Failed to generate NFT:", error);
      addToast("error", `Failed to generate NFT: ${error}`);
    } finally {
      setIsGeneratingNFT(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = [
      t("session.file_size_bytes"),
      t("session.file_size_kb"),
      t("session.file_size_mb"),
      t("session.file_size_gb"),
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="session-record">
        <div className="session-record__loading">
          <div className="loading-spinner" />
          <p>{t("session.loading_session")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isNoSessionsError = error.includes("No sessions found for user");

    return (
      <div className="session-record">
        <div className="session-record__error">
          <h2>Session Error</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button
              className="btn-retry"
              onClick={() => window.location.reload()}
            >
              {t("session.retry")}
            </button>
            <button className="btn-back" onClick={() => navigate("/session")}>
              {t("session.back_to_sessions")}
            </button>
            {isNoSessionsError && (
              <button
                className="btn-create-session"
                onClick={() => navigate("/create-session")}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
              >
                Create New Session
              </button>
            )}
          </div>
          {sessionId && (
            <div className="session-info">
              <p>
                <strong>Session ID:</strong> {sessionId}
              </p>
              <p>
                <em>
                  Tip: Make sure you're using a valid session ID from your
                  sessions list.
                </em>
              </p>
            </div>
          )}

          {/* Development Login Button */}
          {process.env.NODE_ENV === "development" && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "#f0f0f0",
                borderRadius: "5px",
              }}
            >
              <p>
                <strong>Development Mode:</strong>
              </p>
              <button
                onClick={() => {
                  const testUser = {
                    username: "testuser",
                    loginTime: new Date().toLocaleString(),
                    loginMethod: "username" as const,
                  };
                  localStorage.setItem("auth-user", JSON.stringify(testUser));
                  window.location.reload();
                }}
                style={{
                  backgroundColor: "#2196F3",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Login as testuser (has sessions)
              </button>
              <button
                onClick={async () => {
                  if (!user?.username) {
                    alert("No user logged in");
                    return;
                  }
                  try {
                    const sessionId = await PhysicalArtService.createSession(
                      user.username,
                      "Demo Session for " + user.username,
                      "Demo session created for testing",
                    );
                    addToast(
                      "success",
                      `Demo session created with ID: ${sessionId}`,
                    );
                    navigate(`/session-record/session-${sessionId}`);
                  } catch (error) {
                    console.error("Failed to create demo session:", error);
                    addToast("error", "Failed to create demo session");
                  }
                }}
                style={{
                  backgroundColor: "#FF9800",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Create Demo Session for {user?.username || "current user"}
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("auth-user");
                  window.location.reload();
                }}
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="session-record">
        <div className="session-record__error">
          <p>{t("session.session_not_found")}</p>
          <button className="btn-back" onClick={() => navigate("/session")}>
            {t("session.back_to_sessions")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="session-record">
      <div className="session-record__container">
        {/* Modern Header */}
        <div className="session-record__header">
          <div className="session-record__title">
            <h1>{t("session.mock_data.landscape_painting_study_title")}</h1>
            <p>{t("session.mock_data.landscape_painting_study_description")}</p>
          </div>
          <div className="session-record__controls">
            <button className="btn-back" onClick={() => navigate("/session")}>
              <ArrowLeft size={20} />
              {t("session.back_to_sessions")}
            </button>
          </div>
        </div>

        {/* Session Status */}
        <div className="session-record__status">
          <div className="recording-indicator">
            <div className="recording-dot" />
            <span>{t("session.recording")}</span>
          </div>
          <div className="session-info">
            <div className="photo-count">
              {session.photos.length} {t("session.photos")}
            </div>
          </div>
        </div>

        <div className="session-record__content">
          {/* Upload Section */}
          <div className="session-record__upload">
            <div className="upload-card">
              <h2>{t("session.upload_progress_photos_to_s3")}</h2>

              {/* File Drop Zone */}
              <div
                className={`upload-zone ${dragActive ? "upload-zone--active" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={(e) =>
                    e.target.files && handleFileSelect(e.target.files)
                  }
                  className="upload-input"
                  id="photo-upload"
                />

                <div className="upload-content">
                  <Camera size={22} />
                  <h3>{t("session.drop_photos_here_or_click_to_browse")}</h3>
                  <p>{t("session.support_multiple_photos_up_to_10mb_each")}</p>

                  <label htmlFor="photo-upload" className="btn btn--primary">
                    <Upload size={16} />
                    {t("session.choose_photos")}
                  </label>
                </div>
              </div>

              {/* Selected Files */}
              {selectedFiles && (
                <div className="selected-files">
                  <h3>
                    {t("session.selected_files")} ({selectedFiles.length})
                  </h3>

                  <div className="step-description">
                    <label htmlFor="step-desc">
                      {t("session.step_description")}
                    </label>
                    <input
                      id="step-desc"
                      type="text"
                      value={stepDescription}
                      onChange={(e) => setStepDescription(e.target.value)}
                      placeholder={t("session.describe_this_step")}
                      className="form-input"
                    />
                  </div>

                  <div className="files-list">
                    {Array.from(selectedFiles).map((file) => (
                      <div
                        key={file.name + file.lastModified}
                        className="file-item"
                      >
                        <Image size={20} />
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {uploadProgress > 0 && (
                    <div
                      className="upload-progress"
                      key={`progress-${selectedFiles?.length || 0}-${uploadProgress}`}
                    >
                      <div className="progress-info">
                        <span>
                          {shouldCancelUpload
                            ? t("session.upload_cancelled")
                            : `${t("session.uploading")} ${uploadedFiles} ${t("session.of")} ${totalFiles} ${t("session.files")}`}
                        </span>
                        <span>
                          {shouldCancelUpload
                            ? "0%"
                            : `${Math.min(uploadProgress, 100).toFixed(0)}%`}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${shouldCancelUpload ? 0 : Math.min(uploadProgress, 100)}%`,
                            background: shouldCancelUpload
                              ? "var(--color-error)"
                              : "var(--color-accent)",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="upload-actions">
                    <button
                      className="btn btn--secondary"
                      onClick={() => {
                        console.log("Cancel button clicked");

                        if (isUploading || uploadInProgress) {
                          // Cancel ongoing upload immediately
                          console.log("Cancelling upload...");
                          console.log(
                            "Current state - isUploading:",
                            isUploading,
                            "uploadInProgress:",
                            uploadInProgress,
                          );
                          setShouldCancelUpload(true);
                          setIsCancelling(true);
                          cancelRef.current = true;
                          // Reset progress immediately for visual feedback
                          setUploadProgress(0);
                          setUploadedFiles(0);
                          addToast("warning", t("upload_cancelled"));
                        } else {
                          // Clear selection
                          setSelectedFiles(null);
                          setStepDescription("");
                          setUploadProgress(0);
                          setUploadedFiles(0);
                          setTotalFiles(0);
                          setIsUploading(false);
                          setUploadInProgress(false);
                          setShouldCancelUpload(false);
                          setIsCancelling(false);
                        }
                      }}
                      disabled={isCancelling}
                    >
                      {isCancelling
                        ? t("session.cancelling")
                        : isUploading || uploadInProgress
                          ? t("session.cancel_upload")
                          : t("session.cancel")}
                    </button>
                    <button
                      className="btn btn--primary"
                      onClick={handleUploadToS3}
                      disabled={false}
                    >
                      <Plus size={16} />
                      {isUploading
                        ? t("session.uploading_to_s3")
                        : t("session.upload_to_s3")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Photo Log */}
          <div className="session-record__log">
            <div className="log-header">
              <h2>{t("session.photo_log")}</h2>
              <div className="log-stats">
                <span>
                  {session.photos.length} {t("session.photos")}
                </span>
                <span>•</span>
                <span>
                  {t("session.step")} {session.currentStep}
                </span>
              </div>
            </div>

            {session.photos.length === 0 ? (
              <div className="log-empty">
                <FileText size={33} />
                <h3>{t("session.no_photos_uploaded_yet")}</h3>
                <p>
                  {t(
                    "session.upload_your_first_progress_photo_to_start_s3_log",
                  )}
                </p>
              </div>
            ) : (
              <div className="log-timeline">
                {session.photos.map((photo) => (
                  <div key={photo.id} className="log-item">
                    <div className="log-step">
                      <div className="step-number">{photo.step}</div>
                      <div className="step-line" />
                    </div>

                    <div className="log-content">
                      <div className="photo-preview">
                        <img src={photo.url} alt={photo.description} />
                        <div className="photo-overlay">
                          <button
                            className="btn-icon"
                            onClick={() => window.open(photo.url, "_blank")}
                          >
                            <Download size={16} />
                          </button>
                          <button
                            className="btn-icon btn-icon--danger"
                            onClick={() => handleDeletePhoto(photo.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="photo-details">
                        <div className="photo-header">
                          <h4>{photo.description}</h4>
                          <div className="photo-meta">
                            <Clock size={14} />
                            <span>{formatTime(photo.timestamp)}</span>
                          </div>
                        </div>

                        <div className="photo-info">
                          <span>{photo.filename}</span>
                          <span>•</span>
                          <span>{formatFileSize(photo.fileSize)}</span>
                          {photo.s3Key && (
                            <>
                              <span>•</span>
                              <span className="s3-key">
                                {t("session.s3_key")}: {photo.s3Key}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modern Footer Actions */}
        <div className="session-record__footer">
          <button className="btn-save" onClick={() => navigate("/session")}>
            <Save size={16} />
            {t("session.save_progress")}
          </button>

          <button
            className="btn-complete"
            onClick={handleCompleteSessionAndGenerateNFT}
            disabled={isGeneratingNFT || session.photos.length === 0}
          >
            <Sparkles size={16} />
            {isGeneratingNFT
              ? t("session.generating_nft")
              : t("session.complete_and_generate_nft")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionRecordPage;
