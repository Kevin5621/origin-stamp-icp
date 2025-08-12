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
import { useAuth } from "../../contexts/AuthContext";
import PhysicalArtService, {
  PhysicalArtSession,
} from "../../services/physicalArtService";

// Types for session management - Updated to match smart contract data
interface SessionData {
  id: string;
  title: string;
  description: string;
  artType: "physical" | "digital";
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "active" | "completed";
  photoCount: number;
  username: string;
}

/**
 * Session Page - Displays user sessions from smart contract
 */
const SessionPage: React.FC = () => {
  const { t } = useTranslation("session");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to convert smart contract session to SessionData
  const convertSmartContractSession = (
    smartContractSession: PhysicalArtSession,
  ): SessionData => {
    return {
      id: smartContractSession.session_id,
      title: smartContractSession.art_title,
      description: smartContractSession.description,
      artType: "physical", // All sessions from smart contract are physical art
      createdAt: new Date(Number(smartContractSession.created_at) / 1000000), // Convert nanoseconds to milliseconds
      updatedAt: new Date(Number(smartContractSession.updated_at) / 1000000),
      status: smartContractSession.status as "draft" | "active" | "completed",
      photoCount: smartContractSession.uploaded_photos.length,
      username: smartContractSession.username,
    };
  };

  // Load sessions from smart contract
  useEffect(() => {
    const loadUserSessions = async () => {
      console.log("SessionPage: Starting to load sessions...");
      console.log("SessionPage: Current user:", user);

      // For testing - create a test user if none exists
      if (!user?.username) {
        console.log(
          "SessionPage: No user found, creating test user for development",
        );

        // Check if there's a test user we can use
        const testUser = {
          username: "testuser",
          loginTime: new Date().toISOString(),
          loginMethod: "username" as const,
        };

        // Save to localStorage and manually set user for testing
        localStorage.setItem("auth-user", JSON.stringify(testUser));

        console.log(
          "SessionPage: Test user created, please refresh or login properly",
        );
        setError(
          "Please login or refresh the page to see sessions. For testing, user 'testuser' is available.",
        );
        setIsLoading(false);
        return;
      }

      console.log("SessionPage: Loading sessions for user:", user.username);

      try {
        setError(null);
        const userSessions = await PhysicalArtService.getUserSessions(
          user.username,
        );
        console.log("SessionPage: Raw sessions from backend:", userSessions);

        const convertedSessions = userSessions.map(convertSmartContractSession);
        console.log("SessionPage: Converted sessions:", convertedSessions);

        setSessions(convertedSessions);
      } catch (error) {
        console.error("SessionPage: Failed to load sessions:", error);
        setError("Failed to load sessions. Please try again.");
        setSessions([]);
      } finally {
        setIsLoading(false);
        console.log("SessionPage: Finished loading sessions");
      }
    };

    loadUserSessions();
  }, [user?.username]);

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
      draft: "session__status--draft",
      active: "session__status--active",
      completed: "session__status--completed",
    };

    const statusLabels = {
      draft: t("session.status.draft"),
      active: t("session.status.active"),
      completed: t("session.status.completed"),
    };

    return (
      <span className={`session__status ${statusClasses[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="session">
        <div className="session__loading">
          <p>{t("session.please_login")}</p>
          <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
            <p>Debug: No user found in AuthContext</p>
            <p>
              Current localStorage auth-user:{" "}
              {localStorage.getItem("auth-user") || "null"}
            </p>
            <button
              onClick={() => {
                const testUser = {
                  username: "testuser",
                  loginTime: new Date().toISOString(),
                  loginMethod: "username" as const,
                };
                localStorage.setItem("auth-user", JSON.stringify(testUser));
                window.location.reload();
              }}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Login as testuser (Development)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="session">
        <div className="session__loading">
          <div className="loading-spinner" />
          <p>{t("session.loading_sessions")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="session">
        <div className="session__error">
          <p>{error}</p>
          <button
            className="btn-retry"
            onClick={() => window.location.reload()}
          >
            {t("session.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="session">
      <div className="session__container">
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
                      {session.status === "draft" && (
                        <button
                          className="btn-continue"
                          onClick={() => handleContinueSession(session.id)}
                        >
                          <Play size={16} />
                          {t("session.continue_session")}
                        </button>
                      )}

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
                const adminUser = {
                  username: "admin",
                  loginTime: new Date().toLocaleString(),
                  loginMethod: "username" as const,
                };
                localStorage.setItem("auth-user", JSON.stringify(adminUser));
                window.location.reload();
              }}
              style={{
                backgroundColor: "#9C27B0",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              Login as admin (has sessions now)
            </button>
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
              Login as testuser
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
};

export default SessionPage;
