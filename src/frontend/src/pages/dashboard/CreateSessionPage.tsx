// src/frontend/src/pages/dashboard/CreateSessionPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Camera, Palette } from "lucide-react";

/**
 * Create Session Page - Halaman untuk membuat sesi baru
 */
const CreateSessionPage: React.FC = () => {
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
      newErrors.title = "Session title is required";
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
      <div className="create-session__container">
        {/* Header */}
        <div className="create-session__header">
          <button
            className="btn btn--secondary"
            onClick={() => navigate("/session")}
          >
            <ArrowLeft size={20} />
            Back to Sessions
          </button>
          <div className="create-session__title">
            <h1>Create New Session</h1>
            <p>Start documenting your creative process with a new session</p>
          </div>
        </div>

        {/* Session Creation Form */}
        <div className="create-session__content">
          <div className="create-session__form">
            {/* Art Type Selection */}
            <div className="form-group">
              <label>Art Type</label>
              <div className="art-type-selector">
                <button
                  type="button"
                  className={`art-type-option ${artType === "physical" ? "art-type-option--active" : ""}`}
                  onClick={() => setArtType("physical")}
                >
                  <Camera size={24} />
                  <div className="art-type-content">
                    <h4>Physical Art</h4>
                    <p>Traditional media like painting, sculpture, drawing</p>
                  </div>
                </button>
                <button
                  type="button"
                  className={`art-type-option ${artType === "digital" ? "art-type-option--active" : ""}`}
                  onClick={() => setArtType("digital")}
                >
                  <Palette size={24} />
                  <div className="art-type-content">
                    <h4>Digital Art</h4>
                    <p>Digital tools like Photoshop, Procreate, 3D software</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Session Title */}
            <div className="form-group">
              <label htmlFor="session-title">
                Session Title
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
                placeholder="Enter session title..."
                className={`form-input ${errors.title ? "form-input--error" : ""}`}
              />
              {errors.title && (
                <div className="error-message">{errors.title}</div>
              )}
            </div>

            {/* Session Description */}
            <div className="form-group">
              <label htmlFor="session-description">
                Description (Optional)
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
                className="btn btn--secondary"
                onClick={() => navigate("/session")}
              >
                Cancel
              </button>
              <button
                className="btn btn--primary"
                onClick={handleCreateSession}
              >
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
