import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Camera, Palette, Download, Clock, CheckCircle } from "lucide-react";
import PhysicalArtSetup from "../../components/session/PhysicalArtSetup";

/**
 * Session Page - Halaman session recording dengan pemilihan art type
 * Memerlukan autentikasi
 */
const SessionPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [artType, setArtType] = useState<"physical" | "digital" | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  const handleSessionCreated = (sessionId: string) => {
    console.log("Session created:", sessionId);
  };

  const handlePhotosUploaded = (photoUrls: string[]) => {
    console.log("Photos uploaded:", photoUrls);
  };

  const handleArtTypeSelect = (type: "physical" | "digital") => {
    setArtType(type);
  };

  const handleStartSession = () => {
    setSessionStarted(true);
  };

  const handleFinalize = () => {
    navigate("/finalization");
  };

  return (
    <section className="session-section" aria-labelledby="session-title">
      <div className="session-layout">
        {/* Header */}
        <header className="session-header">
          <div className="header-content">
            <h1 id="session-title" className="session-title">
              {artType
                ? t("active_recording_session_title")
                : t("select_art_type_title")}
            </h1>
            <p className="session-subtitle">
              {artType
                ? t("session_description")
                : t("select_art_type_subtitle")}
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="session-main">
          {!artType ? (
            /* Art Type Selection */
            <div className="art-type-selection">
              <div className="selection-grid">
                <div
                  className="art-type-card wireframe-card"
                  onClick={() => handleArtTypeSelect("physical")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleArtTypeSelect("physical");
                    }
                  }}
                >
                  <div className="art-type-icon-wrapper">
                    <Camera size={32} strokeWidth={2} />
                  </div>
                  <h3 className="art-type-title">{t("physical_art_title")}</h3>
                  <p className="art-type-description">
                    {t("physical_art_description")}
                  </p>
                  <div className="art-type-features">
                    <span className="feature-tag">
                      {t("step_by_step_photos")}
                    </span>
                    <span className="feature-tag">{t("manual_process")}</span>
                  </div>
                </div>

                <div
                  className="art-type-card wireframe-card"
                  onClick={() => handleArtTypeSelect("digital")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleArtTypeSelect("digital");
                    }
                  }}
                >
                  <div className="art-type-icon-wrapper">
                    <Palette size={32} strokeWidth={2} />
                  </div>
                  <h3 className="art-type-title">{t("digital_art_title")}</h3>
                  <p className="art-type-description">
                    {t("digital_art_description")}
                  </p>
                  <div className="art-type-features">
                    <span className="feature-tag">{t("automatic_plugin")}</span>
                    <span className="feature-tag">{t("real_time_log")}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : !sessionStarted ? (
            /* Art Type Setup */
            <div className="art-setup">
              <div className="setup-card wireframe-card">
                <div className="setup-header">
                  <div className="setup-icon">
                    {artType === "physical" ? (
                      <Camera size={24} strokeWidth={2} />
                    ) : (
                      <Palette size={24} strokeWidth={2} />
                    )}
                  </div>
                  <h3 className="setup-title">
                    {artType === "physical"
                      ? t("setup_physical_art")
                      : t("setup_digital_art")}
                  </h3>
                </div>

                {artType === "physical" ? (
                  <PhysicalArtSetup
                    onSessionCreated={handleSessionCreated}
                    onPhotosUploaded={handlePhotosUploaded}
                  />
                ) : (
                  <div className="setup-content">
                    <p className="setup-description">
                      {t("digital_art_setup_description")}
                    </p>
                    <div className="plugin-section">
                      <div className="plugin-list">
                        <div className="plugin-item wireframe-card">
                          <div className="plugin-info">
                            <h4>{t("photoshop_plugin")}</h4>
                            <p>{t("photoshop_description")}</p>
                          </div>
                          <a
                            href="#"
                            className="plugin-download-btn wireframe-button"
                            onClick={(e) => {
                              e.preventDefault();
                              alert("Link download akan tersedia segera!");
                            }}
                          >
                            <Download size={16} strokeWidth={2} />
                            {t("download")}
                          </a>
                        </div>
                        <div className="plugin-item wireframe-card">
                          <div className="plugin-info">
                            <h4>{t("vscode_extension")}</h4>
                            <p>{t("vscode_description")}</p>
                          </div>
                          <a
                            href="#"
                            className="plugin-download-btn wireframe-button"
                            onClick={(e) => {
                              e.preventDefault();
                              alert("Link download akan tersedia segera!");
                            }}
                          >
                            <Download size={16} strokeWidth={2} />
                            {t("download")}
                          </a>
                        </div>
                        <div className="plugin-item wireframe-card">
                          <div className="plugin-info">
                            <h4>{t("ableton_plugin")}</h4>
                            <p>{t("ableton_description")}</p>
                          </div>
                          <a
                            href="#"
                            className="plugin-download-btn wireframe-button"
                            onClick={(e) => {
                              e.preventDefault();
                              alert("Link download akan tersedia segera!");
                            }}
                          >
                            <Download size={16} strokeWidth={2} />
                            {t("download")}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="setup-actions">
                  <button
                    onClick={() => setArtType(null)}
                    className="btn-back wireframe-button"
                  >
                    {t("back")}
                  </button>
                  {artType === "digital" && (
                    <button
                      onClick={handleStartSession}
                      className="btn-start-session wireframe-button primary"
                    >
                      <CheckCircle size={16} strokeWidth={2} />
                      {t("start_session")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Active Session */
            <div className="active-session">
              <div className="session-status-card wireframe-card">
                <div className="status-header">
                  <div className="recording-indicator">
                    <div className="recording-dot"></div>
                    <span className="status-text">
                      {t("recording_status_text")}
                    </span>
                  </div>
                  <div className="session-timer">
                    <Clock size={20} strokeWidth={2} />
                    <span>00:00:00</span>
                  </div>
                </div>

                <div className="session-progress">
                  <div className="progress-info">
                    <span className="progress-label">
                      {t("session_progress")}
                    </span>
                    <span className="progress-value">0%</span>
                  </div>
                  <div className="progress-bar wireframe-progress">
                    <div
                      className="progress-fill"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>

                <div className="session-actions">
                  <button
                    onClick={handleFinalize}
                    className="btn-finalize wireframe-button primary"
                  >
                    <CheckCircle size={16} strokeWidth={2} />
                    {t("finalize_session")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default SessionPage;
