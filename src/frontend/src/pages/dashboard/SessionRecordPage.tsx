import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  Clock,
  Download,
  FileText,
  Image,
  Plus,
  Save,
  Sparkles,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { useToastContext } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import PhysicalArtService from "../../services/physicalArtService";
import CertificateService from "../../services/certificateService";

// Types for photo logs
interface PhotoLog {
  id: string;
  filename: string;
  timestamp: Date;
  description: string;
  fileSize: number;
  url: string; // Preview URL
  step: number;
  s3Key?: string; // S3 storage key
}

interface SessionData {
  id: string;
  title: string;
  description: string;
  artType: "physical" | "digital";
  status: "active" | "completed";
  createdAt: Date;
  photos: PhotoLog[];
  currentStep: number;
  nftGenerated?: boolean;
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
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cancelRef = useRef<boolean>(false);
  const timelineRef = useRef<HTMLDivElement>(null);

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

  // Load session data from backend
  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId) return;

      try {
        // Try to load from localStorage first for faster loading
        const cachedSession = localStorage.getItem(`session_${sessionId}`);
        if (cachedSession) {
          const parsedSession = JSON.parse(cachedSession);
          // Convert timestamp strings back to Date objects
          parsedSession.photos = parsedSession.photos.map((photo: any) => ({
            ...photo,
            timestamp: photo.timestamp ? new Date(photo.timestamp) : new Date(),
          }));
          setSession(parsedSession);
        }

        // Always fetch fresh data from backend
        const sessionDetails =
          await PhysicalArtService.getSessionDetails(sessionId);
        if (sessionDetails) {
          // Transform backend data to frontend format
          const sessionWithPhotos: SessionData = {
            id: sessionDetails.session_id,
            title: sessionDetails.art_title,
            description: sessionDetails.description,
            artType: "physical",
            status: sessionDetails.status as "active" | "completed",
            createdAt: new Date(Number(sessionDetails.created_at)),
            currentStep: sessionDetails.uploaded_photos.length + 1,
            photos: sessionDetails.uploaded_photos.map((photoUrl, index) => ({
              id: `photo-${index}`,
              filename: `photo-${index + 1}.jpg`,
              timestamp: new Date(
                Number(sessionDetails.created_at) + index * 60000,
              ),
              description: `Step ${index + 1}`,
              fileSize: 0, // Will be updated from cache if available
              url: photoUrl,
              step: index + 1,
              s3Key: photoUrl,
            })),
          };

          // Merge with cached data to preserve fileSize and other details
          if (cachedSession) {
            const cachedData = JSON.parse(cachedSession);
            sessionWithPhotos.photos = sessionWithPhotos.photos.map(
              (photo, index) => {
                const cachedPhoto = cachedData.photos[index];
                return {
                  ...photo,
                  fileSize: cachedPhoto?.fileSize || 0,
                  timestamp: cachedPhoto?.timestamp
                    ? new Date(cachedPhoto.timestamp)
                    : photo.timestamp,
                };
              },
            );
          }

          setSession(sessionWithPhotos);

          // Cache the session data
          localStorage.setItem(
            `session_${sessionId}`,
            JSON.stringify(sessionWithPhotos),
          );
        } else {
          addToast("error", t("session.session_not_found"));
          navigate("/session");
        }
      } catch (error) {
        console.error("Failed to load session:", error);
        addToast("error", t("session.failed_to_load_session"));
        navigate("/session");
      }
    };

    loadSession();
  }, [sessionId, navigate, addToast, t]);

  // Auto-scroll to latest progress - INSTANT
  useEffect(() => {
    if (session && session.photos.length > 0 && timelineRef.current) {
      // Instant scroll to the end
      timelineRef.current.scrollLeft = timelineRef.current.scrollWidth;
    }
  }, [session?.photos.length]);

  // Save session data to localStorage whenever it changes
  useEffect(() => {
    if (session && sessionId) {
      localStorage.setItem(`session_${sessionId}`, JSON.stringify(session));
    }
  }, [session, sessionId]);

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

    // Show confirmation dialog for blockchain permanence
    const confirmed = window.confirm(
      t("session.blockchain_upload_confirmation", {
        count: selectedFiles.length,
      }),
    );

    if (!confirmed) {
      addToast("info", t("session.upload_cancelled_by_user"));
      return;
    }

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
      // Real upload using PhysicalArtService
      for (let i = 0; i < filesArray.length; i++) {
        // Check for cancellation before processing file
        if (cancelRef.current) {
          console.log("Upload cancelled at file", i);
          addToast("warning", t("session.upload_cancelled_by_user_message"));
          return; // Exit immediately and discard all files
        }

        const file = filesArray[i];

        // Update progress
        setUploadProgress((i * 100) / filesArray.length);
        setUploadedFiles(i);

        // Upload file using PhysicalArtService
        const uploadResult = await PhysicalArtService.uploadPhoto(
          session.id,
          file,
        );

        if (!uploadResult.success) {
          throw new Error(uploadResult.message);
        }

        // Add file to photos array only if not cancelled
        console.log(t("session.adding_file", { filename: file.name }));
        newPhotos.push({
          id: `photo-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          filename: file.name,
          timestamp: new Date(),
          description:
            stepDescription ||
            `${t("session.step")} ${session.currentStep + i + 1}`,
          fileSize: file.size,
          url: uploadResult.file_url || URL.createObjectURL(file),
          step: session.currentStep + i + 1,
          s3Key:
            uploadResult.file_id ||
            `sessions/${session.id}/photos/${Date.now()}-${i}-${file.name}`,
        });

        setUploadedFiles(i + 1);
      }

      // Update session with new photos only if not cancelled
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
        error instanceof Error ? error.message : "Unknown error";
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

  const handleCompleteSessionAndGenerateNFT = async () => {
    if (!session || !user) return;

    setIsGeneratingNFT(true);
    addToast("info", t("session.starting_certificate_generation"));

    try {
      // Calculate creation duration (in minutes)
      const creationDuration = Math.floor(
        (Date.now() - session.createdAt.getTime()) / (1000 * 60),
      );

      // Generate certificate
      const certificate = await CertificateService.generateCertificate({
        session_id: session.id,
        username: user.username,
        art_title: session.title,
        description: session.description,
        photo_count: session.photos.length,
        creation_duration: creationDuration,
        file_format: "JPEG/PNG",
        creation_tools: ["Digital Camera", "IC-Vibe Platform"],
      });

      // Update session status to completed
      await PhysicalArtService.updateSessionStatus(session.id, "completed");

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

      setIsGeneratingNFT(false);
      addToast("success", t("session.certificate_generated_successfully"));

      // Navigate to certificate page
      navigate(`/certificate/${certificate.certificate_id}`);
    } catch (error) {
      console.error("Failed to generate certificate:", error);
      setIsGeneratingNFT(false);
      addToast("error", t("session.certificate_generation_failed"));
    }
  };

  const formatFileSize = (bytes: number | undefined): string => {
    if (!bytes || bytes === 0) return "0 Bytes";
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

  const formatTime = (date: Date | undefined): string => {
    if (!date) return "Unknown";
    try {
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.warn("Error formatting date:", error);
      return "Unknown";
    }
  };

  const handleDownloadPhoto = (photo: PhotoLog) => {
    window.open(photo.url, "_blank");
  };

  const handleOpenPhotoModal = (photo: PhotoLog) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleClosePhotoModal = () => {
    setSelectedPhoto(null);
    setIsModalOpen(false);
    setIsZoomed(false);
    setZoomLevel(1);
    setTransformOrigin("center center");
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
    if (zoomLevel <= 1) {
      setIsZoomed(false);
    }
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setIsZoomed(false);
    setTransformOrigin("center center");
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setDragOffset({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  if (!session) {
    return (
      <div className="session-record">
        <div className="session-record__loading">
          <div className="loading-spinner" />
          <p>{t("loading_session")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="session-record">
      <div className="session-record__container">
        {/* Simplified Top Bar */}
        <div className="session-record__top-bar">
          <div className="session-title">
            <h1>{session.title || t("session.untitled_session")}</h1>
            <p>{session.description || t("session.no_description")}</p>
          </div>
          <button className="back-button" onClick={() => navigate("/session")}>
            <ArrowLeft size={16} />
            {t("session.back_to_sessions")}
          </button>
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
                  <Camera size={16} />
                  <h3>{t("session.drop_photos_here_or_click_to_browse")}</h3>
                  <p>{t("session.support_multiple_photos_up_to_10mb_each")}</p>

                  <div className="blockchain-warning">
                    <div className="warning-icon">⚠️</div>
                    <p className="warning-text">
                      {t("session.blockchain_permanence_warning")}
                    </p>
                  </div>

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
                        <Image size={14} />
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
                          setUploadProgress(0);
                          setUploadedFiles(0);
                          addToast("warning", t("upload_cancelled"));
                        } else {
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
                      <Plus size={14} />
                      {isUploading
                        ? t("session.uploading_to_s3")
                        : t("session.upload_to_s3")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Photo Log Section */}
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
                <FileText size={16} />
                <h3>{t("session.no_photos_uploaded_yet")}</h3>
                <p>
                  {t(
                    "session.upload_your_first_progress_photo_to_start_s3_log",
                  )}
                </p>
              </div>
            ) : (
              <div className="timeline-container" ref={timelineRef}>
                <div className="timeline-steps">
                  {session.photos.map((photo) => (
                    <div key={photo.id} className="timeline-step">
                      <div className="step-number">{photo.step}</div>
                      <div
                        className="step-content"
                        onClick={() => handleOpenPhotoModal(photo)}
                      >
                        <div className="step-header">
                          <h4>{photo.description}</h4>
                          <div className="step-meta">
                            <Clock size={10} />
                            <span>{formatTime(photo.timestamp)}</span>
                          </div>
                        </div>

                        <div className="step-photos">
                          <div className="main-photo">
                            <img
                              src={photo.url}
                              alt={photo.description}
                              className={zoomLevel > 1 ? "zoomed" : ""}
                              style={{
                                transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                                transition: isDragging
                                  ? "none"
                                  : "transform 0.3s ease",
                                cursor: isDragging
                                  ? "grabbing"
                                  : zoomLevel > 1
                                    ? "grab"
                                    : "zoom-in",
                                transformOrigin: transformOrigin,
                              }}
                              onMouseDown={handleMouseDown}
                              onMouseMove={handleMouseMove}
                              onMouseUp={handleMouseUp}
                              onMouseLeave={handleMouseLeave}
                            />
                            <div className="photo-overlay">
                              <button
                                className="photo-action-btn photo-action-btn--download"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadPhoto(photo);
                                }}
                                title={t("session.download_photo")}
                              >
                                <Download size={12} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="step-details">
                          <div className="step-info">
                            <span>{photo.filename || "Unknown file"}</span>
                            <span>•</span>
                            <span>{formatFileSize(photo.fileSize)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modern Footer Actions */}
        <div className="session-record__footer">
          <button className="btn-save" onClick={() => navigate("/session")}>
            <Save size={14} />
            {t("session.save_progress")}
          </button>

          <button
            className="btn-complete"
            onClick={handleCompleteSessionAndGenerateNFT}
            disabled={isGeneratingNFT || session.photos.length === 0}
          >
            <Sparkles size={14} />
            {isGeneratingNFT
              ? t("session.generating_nft")
              : t("session.complete_and_generate_nft")}
          </button>
        </div>
      </div>

      {/* Photo Detail Modal */}
      {isModalOpen && selectedPhoto && (
        <div className="photo-modal-overlay" onClick={handleClosePhotoModal}>
          <div
            className="photo-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Step {selectedPhoto.step}</h2>
              <button
                className="modal-close-btn"
                onClick={handleClosePhotoModal}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="photo-display">
                <div className="photo-container">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.description}
                    className={zoomLevel > 1 ? "zoomed" : ""}
                    style={{
                      transform: `scale(${zoomLevel}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                      transition: isDragging ? "none" : "transform 0.3s ease",
                      cursor: isDragging
                        ? "grabbing"
                        : zoomLevel > 1
                          ? "grab"
                          : "zoom-in",
                      transformOrigin: transformOrigin,
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                  />
                </div>
                <div className="zoom-controls">
                  <button
                    className="zoom-btn zoom-btn--out"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 0.5}
                    title={t("session.zoom_out")}
                  >
                    <ZoomOut size={16} />
                  </button>
                  <button
                    className="zoom-btn zoom-btn--reset"
                    onClick={handleResetZoom}
                    disabled={zoomLevel === 1}
                    title={t("session.reset_zoom")}
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    className="zoom-btn zoom-btn--in"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                    title={t("session.zoom_in")}
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>
              </div>

              <div className="photo-details">
                <div className="detail-section">
                  <h3>{selectedPhoto.description}</h3>
                  <div className="detail-meta">
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>{formatTime(selectedPhoto.timestamp)}</span>
                    </div>
                    <div className="meta-item">
                      <FileText size={14} />
                      <span>{selectedPhoto.filename || "Unknown file"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn--secondary"
                onClick={handleClosePhotoModal}
              >
                {t("session.close")}
              </button>
              <button
                className="btn btn--primary"
                onClick={() => handleDownloadPhoto(selectedPhoto)}
              >
                <Download size={14} />
                {t("session.download_photo")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionRecordPage;
