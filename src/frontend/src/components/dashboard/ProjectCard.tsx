import React from "react";
import { useTranslation } from "react-i18next";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    status: "active" | "completed" | "draft";
    lastModified: Date;
    progress: number;
  };
  onClick: (projectId: string) => void;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const { t } = useTranslation();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path
                d="M12 6v6l4 2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          label: t("status_active"),
          color: "var(--color-info)",
        };
      case "completed":
        return {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M20 6L9 17l-5-5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          label: t("status_completed"),
          color: "var(--color-success)",
        };
      case "draft":
        return {
          icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                strokeWidth="2"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                strokeWidth="2"
              />
            </svg>
          ),
          label: t("status_draft"),
          color: "var(--color-warning)",
        };
      default:
        return {
          icon: null,
          label: status,
          color: "var(--color-text-secondary)",
        };
    }
  };

  const statusConfig = getStatusConfig(project.status);

  return (
    <article
      className="project-card wireframe-card"
      onClick={() => onClick(project.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(project.id);
        }
      }}
    >
      <div className="project-header">
        <div className="project-title-section">
          <h3 className="project-title">{project.title}</h3>
          <div className="project-status" style={{ color: statusConfig.color }}>
            {statusConfig.icon}
            <span className="status-label">{statusConfig.label}</span>
          </div>
        </div>
      </div>

      <div className="project-progress-section">
        <div className="progress-header">
          <span className="progress-label">Progress</span>
          <span className="progress-percentage">{project.progress}%</span>
        </div>
        <div className="progress-bar wireframe-progress">
          <div
            className="progress-fill"
            style={{
              width: `${project.progress}%`,
              backgroundColor: statusConfig.color,
            }}
          ></div>
        </div>
      </div>

      <div className="project-meta">
        <div className="meta-item">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="meta-icon"
          >
            <path
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeWidth="2"
            />
          </svg>
          <span className="meta-text">
            {t("last_modified")}: {project.lastModified.toLocaleDateString()}
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
