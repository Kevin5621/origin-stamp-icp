import React, { useState, useEffect, useRef } from "react";
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
  const cancelRef = useRef<boolean>(false);

  // Debug effect untuk melihat perubahan location
  useEffect(() => {
    console.log("SessionPage location changed to:", location.pathname);
  }, [location.pathname]);

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

  // Load session data (dummy data)
  useEffect(() => {
    if (sessionId) {
      const mockSession: SessionData = {
        id: sessionId,
        title: "Landscape Painting Study",
        description:
          "Watercolor painting of mountain landscape with step-by-step documentation",
        artType: "physical",
        status: "active",
        createdAt: new Date(2024, 7, 1),
        currentStep: 1,
        photos: [
          {
            id: "1",
            filename: "initial-sketch.jpg",
            timestamp: new Date(2024, 7, 1, 10, 30),
            description: "Initial pencil sketch of mountain composition",
            fileSize: 2.5 * 1024 * 1024,
            url: "/api/placeholder/400/300",
            step: 1,
            s3Key: "sessions/1/photos/initial-sketch.jpg",
          },
          {
            id: "2",
            filename: "base-colors.jpg",
            timestamp: new Date(2024, 7, 1, 11, 15),
            description: "Applied base watercolor washes for sky and mountains",
            fileSize: 3.1 * 1024 * 1024,
            url: "/api/placeholder/400/300",
            step: 2,
            s3Key: "sessions/1/photos/base-colors.jpg",
          },
        ],
      };
      setSession(mockSession);
    }
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
        addToast("error", `File ${file.name} bukan file gambar yang valid`);
        return false;
      }

      if (!isValidSize) {
        addToast("error", `File ${file.name} terlalu besar (maksimal 10MB)`);
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
            `File berikut sudah ada: ${duplicates.map((f) => f.name).join(", ")}`,
          );
          return;
        }
      }

      // Validate file types and sizes
      const validFiles = Array.from(e.dataTransfer.files).filter((file) => {
        const isValidType = file.type.startsWith("image/");
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

        if (!isValidType) {
          addToast("error", `File ${file.name} bukan file gambar yang valid`);
          return false;
        }

        if (!isValidSize) {
          addToast("error", `File ${file.name} terlalu besar (maksimal 10MB)`);
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
      addToast("warning", "Upload sudah berjalan, tunggu hingga selesai");
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

    addToast("info", `Memulai upload ${filesArray.length} file...`);

    const newPhotos: PhotoLog[] = [];

    try {
      // Simple upload simulation
      for (let i = 0; i < filesArray.length; i++) {
        // Check for cancellation before processing file
        if (cancelRef.current) {
          console.log("Upload cancelled at file", i);
          addToast("warning", "Upload dibatalkan oleh user");
          return; // Exit immediately and discard all files
        }

        const file = filesArray[i];

        // Simulate file upload with progress
        for (let progress = 0; progress <= 100; progress += 10) {
          // Check for cancellation at each progress step
          if (cancelRef.current) {
            console.log("Upload cancelled during progress at", progress, "%");
            addToast("warning", "Upload dibatalkan oleh user");
            return; // Exit immediately and discard all files
          }

          setUploadProgress((i * 100 + progress) / filesArray.length);
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // Final check before adding file to array
        if (cancelRef.current) {
          console.log("Upload cancelled before adding file to array");
          addToast("warning", "Upload dibatalkan oleh user");
          return; // Exit immediately and discard all files
        }

        // Add file to photos array only if not cancelled
        console.log("Adding file:", file.name);
        newPhotos.push({
          id: `photo-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          filename: file.name,
          timestamp: new Date(),
          description: stepDescription || `Step ${session.currentStep + i + 1}`,
          fileSize: file.size,
          url: URL.createObjectURL(file),
          step: session.currentStep + i + 1,
          s3Key: `sessions/${session.id}/photos/${Date.now()}-${i}-${file.name}`,
        });

        setUploadedFiles(i + 1);
      }

      // Update session with new photos only if not cancelled
      if (!cancelRef.current && newPhotos.length > 0) {
        console.log("Updating session with", newPhotos.length, "new photos");
        setSession((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            photos: [...prev.photos, ...newPhotos],
            currentStep: prev.currentStep + newPhotos.length,
          };
        });
        addToast("success", `${newPhotos.length} file berhasil diupload!`);
      } else {
        console.log("Session not updated - cancelled or no photos");
      }
    } catch (error) {
      console.log("Upload error:", error);
      addToast("error", "Terjadi kesalahan saat upload file");
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

  const handleDeletePhoto = (photoId: string) => {
    if (session) {
      const photoToDelete = session.photos.find((p) => p.id === photoId);
      setSession({
        ...session,
        photos: session.photos.filter((p) => p.id !== photoId),
      });

      if (photoToDelete) {
        addToast(
          "success",
          `Foto "${photoToDelete.filename}" berhasil dihapus`,
        );
      }
    }
  };

  const handleCompleteSessionAndGenerateNFT = async () => {
    if (!session) return;

    setIsGeneratingNFT(true);
    addToast("info", "Memulai proses generate NFT...");

    // Simulate NFT generation process
    setTimeout(() => {
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
      addToast(
        "success",
        "NFT berhasil di-generate! Redirecting ke certificate...",
      );

      // Navigate to certificate page
      navigate(`/certificate/${session.id}`);
    }, 3000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!session) {
    return (
      <div className="session-record">
        <div className="session-record__loading">
          <div className="loading-spinner" />
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="session-record">
      <div className="session-record__container">
        {/* Header */}
        <div className="session-record__header">
          <button
            className="btn btn--secondary"
            onClick={() => navigate("/session")}
          >
            <ArrowLeft size={20} />
            Back to Sessions
          </button>
          <div className="session-record__title">
            <h1>{session.title}</h1>
            <p>{session.description}</p>
          </div>
          <div className="session-record__controls">
            <button
              className="btn btn--primary"
              onClick={handleCompleteSessionAndGenerateNFT}
              disabled={isGeneratingNFT || session.photos.length === 0}
            >
              <Sparkles size={20} />
              {isGeneratingNFT
                ? "Generating NFT..."
                : "Complete & Generate NFT"}
            </button>
          </div>
        </div>

        {/* Session Status */}
        <div className="session-record__status">
          <div className="recording-indicator">
            <div className="recording-dot" />
            <span>Recording</span>
          </div>
          <div className="session-info">
            <div className="photo-count">{session.photos.length} photos</div>
          </div>
        </div>

        <div className="session-record__content">
          {/* Upload Section */}
          <div className="session-record__upload">
            <div className="upload-card">
              <h2>Upload Progress Photos to S3</h2>

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
                  <Camera size={32} />
                  <h3>Drop photos here or click to browse</h3>
                  <p>
                    Support multiple photos (JPG, PNG, WebP) up to 10MB each
                  </p>

                  <label htmlFor="photo-upload" className="btn btn--primary">
                    <Upload size={16} />
                    Choose Photos
                  </label>
                </div>
              </div>

              {/* Selected Files */}
              {selectedFiles && (
                <div className="selected-files">
                  <h3>Selected Files ({selectedFiles.length})</h3>

                  <div className="step-description">
                    <label htmlFor="step-desc">Step Description</label>
                    <input
                      id="step-desc"
                      type="text"
                      value={stepDescription}
                      onChange={(e) => setStepDescription(e.target.value)}
                      placeholder="Describe this step..."
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
                            ? "Upload cancelled"
                            : `Uploading ${uploadedFiles} of ${totalFiles} files`}
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
                          addToast("warning", "Upload dibatalkan");
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
                        ? "Cancelling..."
                        : isUploading || uploadInProgress
                          ? "Cancel Upload"
                          : "Cancel"}
                    </button>
                    <button
                      className="btn btn--primary"
                      onClick={handleUploadToS3}
                      disabled={false}
                    >
                      <Plus size={16} />
                      {isUploading ? "Uploading to S3..." : "Upload to S3"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Photo Log */}
          <div className="session-record__log">
            <div className="log-header">
              <h2>Photo Log</h2>
              <div className="log-stats">
                <span>{session.photos.length} photos</span>
                <span>•</span>
                <span>Step {session.currentStep}</span>t
              </div>
            </div>

            {session.photos.length === 0 ? (
              <div className="log-empty">
                <FileText size={48} />
                <h3>No photos uploaded yet</h3>
                <p>Upload your first progress photo to start the S3 log</p>
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
                              <span className="s3-key">S3: {photo.s3Key}</span>
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

        {/* Footer Actions */}
        <div className="session-record__footer">
          <button
            className="btn btn--secondary"
            onClick={() => navigate("/session")}
          >
            <Save size={16} />
            Save Progress
          </button>

          <button
            className="btn btn--primary"
            onClick={handleCompleteSessionAndGenerateNFT}
            disabled={isGeneratingNFT || session.photos.length === 0}
          >
            <Sparkles size={16} />
            {isGeneratingNFT ? "Generating NFT..." : "Complete & Generate NFT"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionRecordPage;
