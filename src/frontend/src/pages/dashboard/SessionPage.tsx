import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Palette,
  Play,
  FileText,
  Clock,
  CheckCircle,
  Plus,
  FolderOpen,
} from "lucide-react";

// Types for session management
interface SessionData {
  id: string;
  title: string;
  description: string;
  artType: "physical" | "digital";
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "completed";
  progress: number;
  photoCount: number;
}

/**
 * Session Page - Simplified untuk menampilkan session yang bisa dilanjutkan
 */
const SessionPage: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load active sessions (dummy data)
  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      // Mock data - bisa diubah untuk testing empty state
      // Set ke [] untuk testing empty state
      const mockSessions: SessionData[] = [
        {
          id: "1",
          title: "Landscape Painting Study",
          description:
            "Watercolor painting of mountain landscape with step-by-step documentation",
          artType: "physical",
          createdAt: new Date(2024, 7, 1),
          updatedAt: new Date(2024, 7, 2),
          status: "active",
          progress: 35,
          photoCount: 12,
        },
        {
          id: "2",
          title: "Digital Portrait Series",
          description:
            "Character design exploration using Photoshop with automated logging",
          artType: "digital",
          createdAt: new Date(2024, 7, 3),
          updatedAt: new Date(2024, 7, 3),
          status: "active",
          progress: 15,
          photoCount: 8,
        },
        {
          id: "3",
          title: "Sculpture Progress",
          description:
            "Clay sculpture documentation from initial sketches to final form",
          artType: "physical",
          createdAt: new Date(2024, 6, 28),
          updatedAt: new Date(2024, 7, 1),
          status: "completed",
          progress: 100,
          photoCount: 25,
        },
      ];

      // Untuk testing empty state, ganti dengan: setSessions([]);
      setSessions(mockSessions);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleContinueSession = (sessionId: string) => {
    navigate(`/sessions/${sessionId}`);
  };

  const handleViewCertificate = (sessionId: string) => {
    navigate(`/certificates/${sessionId}`);
  };

  const handleCreateNewSession = () => {
    navigate("/create-session");
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: SessionData["status"]) => {
    const statusClasses = {
      active: "session__status--active",
      completed: "session__status--completed",
    };

    return (
      <span className={`session__status ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="session">
        <div className="session__loading">
          <div className="loading-spinner" />
          <p>Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="session">
      {/* Welcome Section */}
      <div className="session__welcome">
        <div className="session__welcome-content">
          <div className="session__welcome-icon">
            <Camera size={32} />
          </div>
          <div className="session__welcome-text">
            <h1>Active Sessions</h1>
            <p>Continue your ongoing creative sessions and track progress</p>
          </div>
        </div>
        <div className="session__welcome-actions">
          <button className="btn btn--primary" onClick={handleCreateNewSession}>
            <Plus size={16} />
            New Session
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="session__main-content">
        {/* Sessions Grid */}
        <div className="session__sessions">
          <div className="session__sessions-header">
            <h2>Your Sessions</h2>
          </div>

          {sessions.length === 0 ? (
            <div className="session__empty-state">
              <div className="session__empty-icon">
                <FolderOpen size={64} />
              </div>
              <h3>No Active Sessions</h3>
              <p>
                You don't have any active sessions yet. Start documenting your
                creative process by creating a new session.
              </p>
              <div className="session__empty-actions">
                <button
                  className="btn btn--primary"
                  onClick={handleCreateNewSession}
                >
                  <Plus size={16} />
                  Create Your First Session
                </button>
                <button
                  className="btn btn--secondary"
                  onClick={() => navigate("/dashboard")}
                >
                  <FileText size={16} />
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div className="session__sessions-grid">
              {sessions.map((session) => (
                <div key={session.id} className="session__session-card">
                  <div className="session__session-header">
                    <div className="session__session-type">
                      {session.artType === "physical" ? (
                        <Camera size={20} />
                      ) : (
                        <Palette size={20} />
                      )}
                      <span>
                        {session.artType === "physical"
                          ? "Physical"
                          : "Digital"}
                      </span>
                    </div>
                    {getStatusBadge(session.status)}
                  </div>

                  <div className="session__session-content">
                    <h3 className="session__session-title">{session.title}</h3>
                    <p className="session__session-description">
                      {session.description}
                    </p>

                    <div className="session__session-meta">
                      <div className="session__meta-item">
                        <Clock size={14} />
                        <span>Updated {formatDate(session.updatedAt)}</span>
                      </div>
                      <div className="session__meta-item">
                        <Camera size={14} />
                        <span>{session.photoCount} photos</span>
                      </div>
                    </div>

                    {session.progress > 0 && (
                      <div className="session__session-progress">
                        <div className="session__progress-info">
                          <span>Progress</span>
                          <span>{session.progress}%</span>
                        </div>
                        <div className="session__progress-bar">
                          <div
                            className="session__progress-fill"
                            style={{ width: `${session.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="session__session-actions">
                    {session.status === "active" && (
                      <button
                        className="btn btn--primary"
                        onClick={() => handleContinueSession(session.id)}
                      >
                        <Play size={16} />
                        Continue Session
                      </button>
                    )}

                    {session.status === "completed" && (
                      <button
                        className="btn btn--secondary"
                        onClick={() => handleViewCertificate(session.id)}
                      >
                        <CheckCircle size={16} />
                        View Certificate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionPage;
