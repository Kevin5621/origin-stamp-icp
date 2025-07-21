import React from "react";
import { useTranslation } from "react-i18next";
import {
  Clock,
  CheckCircle,
  Edit3,
  Home,
  BarChart3,
  FileText,
} from "lucide-react";

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
          icon: <Clock size={12} strokeWidth={2} />,
          label: t("status_active"),
          className: "project-status--active",
        };
      case "completed":
        return {
          icon: <CheckCircle size={12} strokeWidth={2} />,
          label: t("status_completed"),
          className: "project-status--completed",
        };
      case "draft":
        return {
          icon: <Edit3 size={12} strokeWidth={2} />,
          label: t("status_draft"),
          className: "project-status--draft",
        };
      default:
        return {
          icon: null,
          label: status,
          className: "",
        };
    }
  };

  const statusConfig = getStatusConfig(project.status);

  return (
    <div className="project-card">
      <div className="project-header">
        <h3 className="project-title">{project.title}</h3>
        <div className={`project-status ${statusConfig.className}`}>
          {statusConfig.icon}
          <span>{statusConfig.label}</span>
        </div>
      </div>

      <div className="project-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
        <div className="progress-text">{project.progress}%</div>
      </div>

      <div className="project-meta">
        <Clock size={12} strokeWidth={2} />
        <span>Last modified: {project.lastModified.toLocaleDateString()}</span>
      </div>

      <div className="project-actions">
        <button
          className="project-action-btn"
          onClick={() => onClick(project.id)}
        >
          <BarChart3 size={12} strokeWidth={2} />
          <span>Dashboard</span>
        </button>
        <button
          className="project-action-btn"
          onClick={() => onClick(project.id)}
        >
          <FileText size={12} strokeWidth={2} />
          <span>View Certificates</span>
        </button>
        <button
          className="project-action-btn"
          onClick={() => onClick(project.id)}
        >
          <BarChart3 size={12} strokeWidth={2} />
          <span>Analytics</span>
        </button>
        <button
          className="project-action-btn"
          onClick={() => onClick(project.id)}
        >
          <Home size={12} strokeWidth={2} />
          <span>Home</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
