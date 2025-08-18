import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  photoCount: number;
}

/**
 * Session Page - Simplified untuk menampilkan session yang bisa dilanjutkan
 */
const SessionPage: React.FC = () => {
  const { t } = useTranslation("session");
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionData[]>([]);

  // Load active sessions from backend
  useEffect(() => {
    const loadSessions = async () => {
      try {
        // TODO: Implement real session loading from backend
        // For now, set empty array to remove mock data
        setSessions([]);
      } catch (error) {
        console.error("Failed to load sessions:", error);
        setSessions([]);
      }
    };

    loadSessions();
  }, []);

  const handleContinueSession = (sessionId: string) => {
    navigate(`/sessions/${sessionId}`);
  };

  const handleViewCertificate = (sessionId: string) => {
    navigate(`/certificate/${sessionId}`);
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

  return (
    <div className="session">
      <div className="session-layout">
        {/* Modern Welcome Section */}
        <div className="session__welcome">
          <div className="session__welcome-content">
            <div className="session__welcome-icon">
              <Camera size={22} />
            </div>
            <div className="session__welcome-text">
              <h1>{t("session.active_sessions")}</h1>
              <p>{t("session.continue_sessions_description")}</p>
            </div>
          </div>
          <div className="session__welcome-actions">
            <button
              className="btn-new-session"
              onClick={handleCreateNewSession}
            >
              <Plus size={16} />
              {t("session.new_session")}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="session__main-content">
          {/* Sessions Grid */}
          <div className="session__sessions">
            <div className="session__sessions-header">
              <h2>{t("session.your_sessions")}</h2>
            </div>

            {sessions.length === 0 ? (
              <div className="session__empty-state">
                <div className="session__empty-icon">
                  <FolderOpen size={30} />
                </div>
                <h3>{t("session.no_active_sessions")}</h3>
                <p>{t("session.no_sessions_description")}</p>
                <div className="session__empty-actions">
                  <button
                    className="btn-primary"
                    onClick={handleCreateNewSession}
                  >
                    <Plus size={16} />
                    {t("session.create_first_session")}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => navigate("/dashboard")}
                  >
                    <FileText size={16} />
                    {t("session.go_to_dashboard")}
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
                            ? t("session.physical")
                            : t("session.digital")}
                        </span>
                      </div>
                      {getStatusBadge(session.status)}
                    </div>

                    <div className="session__session-content">
                      <h3 className="session__session-title">
                        {session.title}
                      </h3>
                      <p className="session__session-description">
                        {session.description}
                      </p>

                      <div className="session__session-meta">
                        <div className="session__meta-item">
                          <Clock size={14} />
                          <span>
                            {t("session.updated")}{" "}
                            {formatDate(session.updatedAt)}
                          </span>
                        </div>
                        <div className="session__meta-item">
                          <Camera size={14} />
                          <span>
                            {session.photoCount} {t("session.photos")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="session__session-actions">
                      {session.status === "active" && (
                        <button
                          className="btn-continue"
                          onClick={() => handleContinueSession(session.id)}
                        >
                          <Play size={16} />
                          {t("session.continue_session")}
                        </button>
                      )}

                      {session.status === "completed" && (
                        <button
                          className="btn-view"
                          onClick={() => handleViewCertificate(session.id)}
                        >
                          <CheckCircle size={16} />
                          {t("session.view_certificate")}
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
    </div>
  );
};

export default SessionPage;
