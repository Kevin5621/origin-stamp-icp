import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Palette,
  Edit3,
  Trash2,
  Clock,
  CheckCircle,
  Save,
  Play,
  FileText,
} from "lucide-react";

// Types for session management
interface SessionDraft {
  id: string;
  title: string;
  description: string;
  artType: "physical" | "digital";
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "active" | "completed";
  progress: number;
  photoCount?: number;
}

/**
 * Session Page - Redesigned with draft management
 */
const SessionPage: React.FC = () => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<SessionDraft[]>([]);
  const [selectedArtType, setSelectedArtType] = useState<
    "physical" | "digital" | null
  >(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Load draft sessions (dummy data)
  useEffect(() => {
    const mockDrafts: SessionDraft[] = [
      {
        id: "1",
        title: "Landscape Painting Study",
        description:
          "Watercolor painting of mountain landscape with step-by-step documentation",
        artType: "physical",
        createdAt: new Date(2024, 7, 1),
        updatedAt: new Date(2024, 7, 2),
        status: "draft",
        progress: 0,
        photoCount: 0,
      },
      {
        id: "2",
        title: "Digital Portrait Series",
        description:
          "Character design exploration using Photoshop with automated logging",
        artType: "digital",
        createdAt: new Date(2024, 7, 3),
        updatedAt: new Date(2024, 7, 3),
        status: "draft",
        progress: 0,
      },
      {
        id: "3",
        title: "Sculpture Progress",
        description:
          "Clay sculpture documentation from initial sketches to final form",
        artType: "physical",
        createdAt: new Date(2024, 6, 28),
        updatedAt: new Date(2024, 7, 1),
        status: "active",
        progress: 35,
        photoCount: 12,
      },
    ];
    setDrafts(mockDrafts);
  }, []);

  const handleArtTypeSelect = (type: "physical" | "digital") => {
    setSelectedArtType(type);
  };

  const handleSaveDraft = () => {
    if (!formData.title.trim() || !selectedArtType) return;

    const newDraft: SessionDraft = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      artType: selectedArtType,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "draft",
      progress: 0,
      photoCount: selectedArtType === "physical" ? 0 : undefined,
    };

    setDrafts([newDraft, ...drafts]);
    setFormData({ title: "", description: "" });
    setSelectedArtType(null);
  };

  const handleStartSession = (draft: SessionDraft) => {
    // Update draft status to active
    setDrafts(
      drafts.map((d) =>
        d.id === draft.id
          ? { ...d, status: "active" as const, updatedAt: new Date() }
          : d,
      ),
    );
    // Navigate to session recording interface
    navigate(`/sessions/${draft.id}/record`);
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts(drafts.filter((d) => d.id !== id));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: SessionDraft["status"]) => {
    const statusClasses = {
      draft: "session__status--draft",
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
      {/* Welcome Section */}
      <div className="session__welcome">
        <div className="session__welcome-content">
          <div className="session__welcome-icon">
            <Camera size={32} />
          </div>
          <div className="session__welcome-text">
            <h1>Session Management</h1>
            <p>Create, manage, and track your verification sessions</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="session__main-content">
        {/* Create New Session */}
        <div className="session__create-form">
          <div className="session__form-header">
            <h2>Create New Session</h2>
          </div>

          {/* Art Type Selection */}
          {!selectedArtType ? (
            <div className="session__art-type-selection">
              <h3>Select Art Type</h3>
              <div className="session__art-type-grid">
                <button
                  className="session__art-type-card"
                  onClick={() => handleArtTypeSelect("physical")}
                >
                  <div className="session__art-type-icon">
                    <Camera size={32} />
                  </div>
                  <h4>Physical Art</h4>
                  <p>Upload photos of your physical artwork creation process</p>
                  <div className="session__art-type-features">
                    <span className="session__feature-tag">
                      Step-by-step Photos
                    </span>
                    <span className="session__feature-tag">Manual Process</span>
                  </div>
                </button>

                <button
                  className="session__art-type-card"
                  onClick={() => handleArtTypeSelect("digital")}
                >
                  <div className="session__art-type-icon">
                    <Palette size={32} />
                  </div>
                  <h4>Digital Art</h4>
                  <p>
                    Use plugins to automatically record your digital creation
                    process
                  </p>
                  <div className="session__art-type-features">
                    <span className="session__feature-tag">
                      Automatic Plugin
                    </span>
                    <span className="session__feature-tag">Real-time Log</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* Session Details Form */
            <div className="session__session-form">
              <div className="session__selected-type">
                <div className="session__type-badge">
                  {selectedArtType === "physical" ? (
                    <Camera size={20} />
                  ) : (
                    <Palette size={20} />
                  )}
                  <span>
                    {selectedArtType === "physical"
                      ? "Physical Art"
                      : "Digital Art"}
                  </span>
                </div>
                <button
                  className="btn btn--outline"
                  onClick={() => setSelectedArtType(null)}
                >
                  Change Type
                </button>
              </div>

              <div className="session__form-fields">
                <div className="session__form-group">
                  <label htmlFor="session-title">Session Title</label>
                  <input
                    id="session-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter session title..."
                    className="session__form-input"
                  />
                </div>

                <div className="session__form-group">
                  <label htmlFor="session-description">Description</label>
                  <textarea
                    id="session-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe your project..."
                    className="session__form-textarea"
                    rows={3}
                  />
                </div>
              </div>

              <div className="session__form-actions">
                <button
                  className="btn btn--secondary"
                  onClick={() => setSelectedArtType(null)}
                >
                  Back
                </button>
                <button
                  className="btn btn--primary"
                  onClick={handleSaveDraft}
                  disabled={!formData.title.trim()}
                >
                  <Save size={16} />
                  Save as Draft
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sessions Grid */}
        <div className="session__drafts">
          <h2>Your Sessions</h2>

          {drafts.length === 0 ? (
            <div className="session__empty-state">
              <div className="session__empty-icon">
                <FileText size={48} />
              </div>
              <h3>No Sessions Yet</h3>
              <p>
                Create your first session above to start documenting your
                creative process
              </p>
            </div>
          ) : (
            <div className="session__drafts-grid">
              {drafts.map((draft) => (
                <div key={draft.id} className="session__draft-card">
                  <div className="session__draft-header">
                    <div className="session__draft-type">
                      {draft.artType === "physical" ? (
                        <Camera size={20} />
                      ) : (
                        <Palette size={20} />
                      )}
                      <span>
                        {draft.artType === "physical" ? "Physical" : "Digital"}
                      </span>
                    </div>
                    {getStatusBadge(draft.status)}
                  </div>

                  <div className="session__draft-content">
                    <h3 className="session__draft-title">{draft.title}</h3>
                    <p className="session__draft-description">
                      {draft.description}
                    </p>

                    <div className="session__draft-meta">
                      <div className="session__meta-item">
                        <Clock size={14} />
                        <span>Updated {formatDate(draft.updatedAt)}</span>
                      </div>
                    </div>

                    {draft.progress > 0 && (
                      <div className="session__draft-progress">
                        <div className="session__progress-info">
                          <span>Progress</span>
                          <span>{draft.progress}%</span>
                        </div>
                        <div className="session__progress-bar">
                          <div
                            className="session__progress-fill"
                            style={{ width: `${draft.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="session__draft-actions">
                    {draft.status === "draft" && (
                      <>
                        <button
                          className="btn btn--primary"
                          onClick={() => handleStartSession(draft)}
                        >
                          <Play size={16} />
                          Start Session
                        </button>
                        <button
                          className="session__action-btn session__action-btn--edit"
                          onClick={() => {
                            /* Edit draft */
                          }}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="session__action-btn session__action-btn--delete"
                          onClick={() => handleDeleteDraft(draft.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}

                    {draft.status === "active" && (
                      <button
                        className="btn btn--primary"
                        onClick={() => navigate(`/sessions/${draft.id}/record`)}
                      >
                        <Play size={16} />
                        Continue Session
                      </button>
                    )}

                    {draft.status === "completed" && (
                      <button
                        className="btn btn--secondary"
                        onClick={() => navigate(`/certificates/${draft.id}`)}
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
