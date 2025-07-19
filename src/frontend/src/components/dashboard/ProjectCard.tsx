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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path d="M12 6v6l4 2" strokeWidth="2" />
          </svg>
        );
      case "completed":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 6L9 17l-5-5" strokeWidth="2" />
          </svg>
        );
      case "draft":
        return (
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
        );
      default:
        return null;
    }
  };

  return (
    <article className="project-card" onClick={() => onClick(project.id)}>
      <div className="project-header">
        <h3 className="project-title">{project.title}</h3>
        <div className={`project-status ${project.status}`}>
          {getStatusIcon(project.status)}
          <span>{t(`status_${project.status}`)}</span>
        </div>
      </div>

      <div className="project-progress">
        <div className="progress-bar">
          <div
            className="progress-fill progress-animate"
            style={
              {
                width: `${project.progress}%`,
                "--progress-width": `${project.progress}%`,
              } as React.CSSProperties
            }
          ></div>
        </div>
        <span className="progress-text">{project.progress}%</span>
      </div>

      <div className="project-meta">
        <span className="last-modified">
          {t("last_modified")}: {project.lastModified.toLocaleDateString()}
        </span>
      </div>
    </article>
  );
};

export default ProjectCard;
