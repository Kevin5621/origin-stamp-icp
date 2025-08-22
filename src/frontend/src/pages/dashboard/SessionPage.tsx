import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Play,
  FileText,
  Clock,
  CheckCircle,
  Plus,
  FolderOpen,
  Loader,
  Search,
  Camera,
} from "lucide-react";
import PhysicalArtService from "../../services/physicalArtService";
import { useToastContext } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

interface SessionData {
  id: string;
  title: string;
  description: string;
  artType: "physical" | "digital";
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "completed";
  photoCount: number;
  lastPhotoUrl?: string;
}

const SessionPage: React.FC = () => {
  const { t } = useTranslation("session");
  const navigate = useNavigate();
  const { addToast } = useToastContext();
  const { user, isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "completed"
  >("all");

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);

        if (!isAuthenticated || !user) {
          addToast("error", t("please_login_first"));
          navigate("/login");
          return;
        }

        const username = user.username;
        const userSessions = await PhysicalArtService.getUserSessions(username);

        const transformedSessions: SessionData[] = userSessions.map(
          (session) => ({
            id: session.session_id,
            title: session.art_title,
            description: session.description,
            artType: "physical",
            createdAt: new Date(Number(session.created_at)),
            updatedAt: new Date(Number(session.updated_at)),
            status:
              session.status === "draft"
                ? "active"
                : (session.status as "active" | "completed"),
            photoCount: session.uploaded_photos.length,
            lastPhotoUrl:
              session.uploaded_photos.length > 0
                ? session.uploaded_photos[session.uploaded_photos.length - 1]
                : undefined,
          }),
        );

        setSessions(transformedSessions);
      } catch (error) {
        console.error("Failed to load sessions:", error);
        addToast("error", t("failed_to_load_sessions"));
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [addToast, t, isAuthenticated, user, navigate]);

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

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || session.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const activeSessions = sessions.filter((s) => s.status === "active").length;
  const completedSessions = sessions.filter(
    (s) => s.status === "completed",
  ).length;

  const renderSessionCard = (session: SessionData) => {
    const isActive = session.status === "active";
    const isCompleted = session.status === "completed";

    return (
      <div
        key={session.id}
        className="session-card"
        role="button"
        tabIndex={0}
        onClick={() => handleContinueSession(session.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleContinueSession(session.id);
          }
        }}
      >
        <div className="session-card__image">
          {session.lastPhotoUrl ? (
            <img
              src={session.lastPhotoUrl}
              alt={session.title}
              className="session-card__image img"
            />
          ) : (
            <div className="session-card__image-placeholder">
              <Camera size={16} />
              <span>{t("session.no_photos")}</span>
            </div>
          )}
          <div
            className={`session-card__status session-card__status--${session.status}`}
          >
            {getStatusBadge(session.status)}
          </div>
        </div>

        <div className="session-card__content">
          <div className="session-card__header">
            <h3 className="session-card__title">{session.title}</h3>
            <p className="session-card__type">
              {session.artType === "physical"
                ? t("session.physical")
                : t("session.digital")}
            </p>
            <span className="session-card__id">ID: {session.id}</span>
          </div>

          <div className="session-card__details">
            <div className="session-card__detail-item">
              <Clock size={16} />
              <span>
                {t("session.updated")} {formatDate(session.updatedAt)}
              </span>
            </div>
            <div className="session-card__detail-item">
              <Camera size={16} />
              <span>
                {session.photoCount} {t("session.photos")}
              </span>
            </div>
          </div>

          <div className="session-card__actions">
            {isActive && (
              <button
                className="btn btn--primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleContinueSession(session.id);
                }}
              >
                <Play size={16} />
                {t("session.continue_session")}
              </button>
            )}

            {isCompleted && (
              <button
                className="btn btn--primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewCertificate(session.id);
                }}
              >
                <CheckCircle size={16} />
                {t("session.view_certificate")}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="empty-state">
      <div className="empty-state__icon">
        <FolderOpen size={40} />
      </div>
      <h3 className="empty-state__title">{t("session.no_active_sessions")}</h3>
      <p className="empty-state__description">
        {t("session.no_sessions_description")}
      </p>
      <div className="empty-state__actions">
        <button className="btn btn--primary" onClick={handleCreateNewSession}>
          <Plus size={16} />
          {t("session.create_first_session")}
        </button>
        <button
          className="btn btn--secondary"
          onClick={() => navigate("/dashboard")}
        >
          <FileText size={16} />
          {t("session.go_to_dashboard")}
        </button>
      </div>
    </div>
  );

  const renderSessionsGrid = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <Loader size={24} className="loading-state__spinner" />
          <p>{t("loading_sessions")}</p>
        </div>
      );
    }

    if (filteredSessions.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className="sessions-grid">
        {filteredSessions.map(renderSessionCard)}
      </div>
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard__content">
        <div className="dashboard__main">
          {/* Header Section */}
          <div className="dashboard__section">
            <div className="dashboard__header">
              <h1 className="dashboard__title">
                {t("session.active_sessions")}
              </h1>
              <p className="dashboard__subtitle">
                {t("session.continue_sessions_description")}
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="dashboard__section">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">
                  {t("session.session_overview")}
                </h2>
              </div>
              <div className="dashboard-card__content">
                <div className="session-stats">
                  <div className="session-stat-item">
                    <div className="session-stat-value">{activeSessions}</div>
                    <div className="session-stat-label">
                      {t("session.active")}
                    </div>
                  </div>
                  <div className="session-stat-item">
                    <div className="session-stat-value">
                      {completedSessions}
                    </div>
                    <div className="session-stat-label">
                      {t("session.completed")}
                    </div>
                  </div>
                  <div className="session-stat-item">
                    <div className="session-stat-value">{sessions.length}</div>
                    <div className="session-stat-label">
                      {t("session.total")}
                    </div>
                  </div>
                </div>
                <div className="session-actions">
                  <button
                    className="btn btn--primary"
                    onClick={handleCreateNewSession}
                  >
                    <Plus size={16} />
                    {t("session.new_session")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="dashboard__section">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">
                  {t("session.search_and_filter")}
                </h2>
              </div>
              <div className="dashboard-card__content">
                <div className="search-filter-container">
                  <div className="search-container">
                    <Search className="search-icon" size={20} />
                    <input
                      type="text"
                      className="search-input"
                      placeholder={t("session.search_sessions")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="filter-tabs">
                    <button
                      className={`filter-tab ${activeFilter === "all" ? "filter-tab--active" : ""}`}
                      onClick={() => setActiveFilter("all")}
                    >
                      {t("session.all")}
                    </button>
                    <button
                      className={`filter-tab ${activeFilter === "active" ? "filter-tab--active" : ""}`}
                      onClick={() => setActiveFilter("active")}
                    >
                      {t("session.active")}
                    </button>
                    <button
                      className={`filter-tab ${activeFilter === "completed" ? "filter-tab--active" : ""}`}
                      onClick={() => setActiveFilter("completed")}
                    >
                      {t("session.completed")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sessions Grid Section */}
          <div className="dashboard__section">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">
                  {t("session.your_sessions")}
                </h2>
              </div>
              <div className="dashboard-card__content">
                {renderSessionsGrid()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPage;
