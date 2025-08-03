import React, { useState, useEffect } from "react";
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

  const [session, setSession] = useState<SessionData | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [stepDescription, setStepDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingNFT, setIsGeneratingNFT] = useState(false);

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
    setSelectedFiles(files);
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

    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleUploadToS3 = async () => {
    if (!selectedFiles || !session) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate S3 upload process
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          // Add photos to session with S3 keys
          const newPhotos: PhotoLog[] = Array.from(selectedFiles).map(
            (file, index) => ({
              id: Date.now().toString() + index,
              filename: file.name,
              timestamp: new Date(),
              description:
                stepDescription || `Step ${session.currentStep + index}`,
              fileSize: file.size,
              url: URL.createObjectURL(file),
              step: session.currentStep + index,
              s3Key: `sessions/${session.id}/photos/${Date.now()}-${file.name}`,
            }),
          );

          setSession((prev) =>
            prev
              ? {
                  ...prev,
                  photos: [...prev.photos, ...newPhotos],
                  currentStep: prev.currentStep + selectedFiles.length,
                }
              : null,
          );

          setSelectedFiles(null);
          setStepDescription("");
          setIsUploading(false);
          return 0;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleDeletePhoto = (photoId: string) => {
    if (session) {
      setSession({
        ...session,
        photos: session.photos.filter((p) => p.id !== photoId),
      });
    }
  };

  const handleCompleteSessionAndGenerateNFT = async () => {
    if (!session) return;

    setIsGeneratingNFT(true);

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

      // Navigate to certificate page
      navigate(`/certificates/${session.id}`);
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
            <span>Session in progress</span>
          </div>
          <div className="session-info">
            <span>Step {session.currentStep + 1}</span>
            <span>•</span>
            <span>{session.photos.length} photos uploaded to S3</span>
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
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && handleFileSelect(e.target.files)
                  }
                  className="upload-input"
                  id="photo-upload"
                />

                <div className="upload-content">
                  <Camera size={48} />
                  <h3>Drop photos here or click to browse</h3>
                  <p>Photos will be automatically uploaded to S3 storage</p>

                  <label htmlFor="photo-upload" className="btn btn--primary">
                    <Upload size={20} />
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
                    <div className="upload-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span>{uploadProgress}%</span>
                    </div>
                  )}

                  <div className="upload-actions">
                    <button
                      className="btn btn--secondary"
                      onClick={() => setSelectedFiles(null)}
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn--primary"
                      onClick={handleUploadToS3}
                      disabled={isUploading}
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
              <h2>S3 Photo Log</h2>
              <div className="log-stats">
                <span>{session.photos.length} photos</span>
                <span>•</span>
                <span>Step {session.currentStep}</span>
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
