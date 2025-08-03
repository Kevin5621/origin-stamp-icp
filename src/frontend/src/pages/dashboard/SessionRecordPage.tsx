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
  Play,
  Pause,
  Plus,
  Check,
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
}

interface SessionData {
  id: string;
  title: string;
  description: string;
  artType: "physical" | "digital";
  status: "draft" | "active" | "completed";
  createdAt: Date;
  photos: PhotoLog[];
  currentStep: number;
}

/**
 * Session Recording Page - Upload photos dan tracking progress
 */
const SessionRecordPage: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();

  const [session, setSession] = useState<SessionData | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [stepDescription, setStepDescription] = useState("");

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
          },
          {
            id: "2",
            filename: "base-colors.jpg",
            timestamp: new Date(2024, 7, 1, 11, 15),
            description: "Applied base watercolor washes for sky and mountains",
            fileSize: 3.1 * 1024 * 1024,
            url: "/api/placeholder/400/300",
            step: 2,
          },
        ],
      };
      setSession(mockSession);
    }
  }, [sessionId]);

  const handleStartRecording = () => {
    setIsRecording(true);
    if (session) {
      setSession({ ...session, status: "active" });
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Auto-save progress
  };

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

  const handleUpload = async () => {
    if (!selectedFiles || !session) return;

    // Simulate upload process
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Add photos to session
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
            {!isRecording ? (
              <button
                className="btn btn--primary"
                onClick={handleStartRecording}
              >
                <Play size={20} />
                Start Recording
              </button>
            ) : (
              <button
                className="btn btn--outline"
                onClick={handleStopRecording}
              >
                <Pause size={20} />
                Pause Recording
              </button>
            )}
          </div>
        </div>

        {/* Recording Status */}
        {isRecording && (
          <div className="session-record__status">
            <div className="recording-indicator">
              <div className="recording-dot" />
              <span>Recording in progress</span>
            </div>
            <div className="session-info">
              <span>Step {session.currentStep + 1}</span>
              <span>•</span>
              <span>{session.photos.length} photos captured</span>
            </div>
          </div>
        )}

        <div className="session-record__content">
          {/* Upload Section */}
          <div className="session-record__upload">
            <div className="upload-card">
              <h2>Upload Progress Photos</h2>

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
                  <p>Support JPG, PNG, WebP up to 10MB each</p>

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
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn--primary"
                      onClick={handleUpload}
                      disabled={uploadProgress > 0}
                    >
                      <Plus size={16} />
                      Upload Photos
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
                <span>Step {session.currentStep}</span>
              </div>
            </div>

            {session.photos.length === 0 ? (
              <div className="log-empty">
                <FileText size={48} />
                <h3>No photos yet</h3>
                <p>Upload your first progress photo to start the log</p>
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
            onClick={() => {
              // Save as draft
              navigate("/session");
            }}
          >
            <Save size={16} />
            Save Progress
          </button>

          <button
            className="btn btn--primary"
            onClick={() => {
              // Complete session
              if (session) {
                setSession({ ...session, status: "completed" });
              }
              navigate("/session");
            }}
          >
            <Check size={16} />
            Complete Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionRecordPage;
