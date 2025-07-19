import React from "react";
import { useTranslation } from "react-i18next";
import ProjectCard from "./ProjectCard";
import EmptyState from "./EmptyState";

interface RecentProject {
  id: string;
  title: string;
  status: "active" | "completed" | "draft";
  lastModified: Date;
  progress: number;
}

interface ProjectsListProps {
  projects: RecentProject[];
  viewMode: "list" | "grid";
  onProjectClick: (projectId: string) => void;
  onNewProject: () => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  viewMode,
  onProjectClick,
  onNewProject,
}) => {
  const { t } = useTranslation();

  if (projects.length === 0) {
    return (
      <EmptyState
        title={t("no_projects_title")}
        description={t("no_projects_description")}
        hint={t("start_verification_journey_hint")}
        actionButton={
          <button onClick={onNewProject} className="btn-new-project">
            <svg
              className="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>{t("new_project_button")}</span>
          </button>
        }
      />
    );
  }

  return (
    <div
      className={`projects-list ${viewMode === "grid" ? "projects-grid-view" : ""}`}
    >
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={onProjectClick}
          index={index}
        />
      ))}
    </div>
  );
};

export default ProjectsList;
