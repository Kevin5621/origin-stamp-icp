// src/frontend/src/pages/dashboard/CreateSessionPage.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Camera, Palette } from "lucide-react";

/**
 * Create Session Page - Halaman untuk membuat sesi baru
 */
const CreateSessionPage: React.FC = () => {
  const { t } = useTranslation("session");
  const navigate = useNavigate();
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [artType, setArtType] = useState<"physical" | "digital">("physical");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleCreateSession = () => {
    // Reset errors
    setErrors({});

    // Validation
    const newErrors: { [key: string]: string } = {};

    if (!sessionTitle.trim()) {
      newErrors.title = t("session_title_required");
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generate a mock session ID
    const sessionId = `session-${Date.now()}`;

    // Redirect ke halaman recording session
    navigate(`/sessions/${sessionId}`);
  };

  return (
    <div className="create-session">
      <div className="create-session-layout">
        {/* Header */}
        <div className="create-session__header">
          <button className="btn-back" onClick={() => navigate("/session")}>
            <ArrowLeft size={20} />
            {t("back_to_sessions")}
          </button>
          <div className="create-session__title">
            <h1>{t("create_new_session_title")}</h1>
            <p>{t("create_new_session_description")}</p>
          </div>
        </div>

        {/* Session Creation Form */}
        <div className="create-session__content">
          <div className="create-session__form">
            {/* Art Type Selection */}
            <div className="form-group">
              <label>{t("art_type_label")}</label>
              <div className="art-type-selector">
                <button
                  type="button"
                  className={`art-type-option ${artType === "physical" ? "art-type-option--active" : ""}`}
                  onClick={() => setArtType("physical")}
                >
                  <div className="art-type-icon">
                    <Camera size={24} />
                  </div>
                  <div className="art-type-content">
                    <h4>{t("physical_art_title")}</h4>
                    <p>Traditional media like painting, sculpture, drawing</p>
                  </div>
                </button>
                <button
                  type="button"
                  className={`art-type-option ${artType === "digital" ? "art-type-option--active" : ""}`}
                  onClick={() => setArtType("digital")}
                >
                  <div className="art-type-icon">
                    <Palette size={24} />
                  </div>
                  <div className="art-type-content">
                    <h4>{t("digital_art_title")}</h4>
                    <p>Digital tools like Photoshop, Procreate, 3D software</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Session Title */}
            <div className="form-group">
              <label htmlFor="session-title">
                {t("session_title")}
                <span className="required">*</span>
              </label>
              <input
                id="session-title"
                type="text"
                value={sessionTitle}
                onChange={(e) => {
                  setSessionTitle(e.target.value);
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: "" }));
                  }
                }}
                placeholder={t("enter_session_title")}
                className={`form-input ${errors.title ? "form-input--error" : ""}`}
              />
              {errors.title && (
                <div className="error-message">{errors.title}</div>
              )}
            </div>

            {/* Session Description */}
            <div className="form-group">
              <label htmlFor="session-description">
                {t("description")} ({t("optional")})
              </label>
              <textarea
                id="session-description"
                value={sessionDescription}
                onChange={(e) => setSessionDescription(e.target.value)}
                placeholder="Describe your creative session, goals, or inspiration..."
                className="form-textarea"
                rows={4}
              />
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                className="btn-cancel"
                onClick={() => navigate("/session")}
              >
                Cancel
              </button>
              <button className="btn-create" onClick={handleCreateSession}>
                <Plus size={16} />
                Create Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSessionPage;
