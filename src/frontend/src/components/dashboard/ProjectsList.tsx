import React from "react";
import { useTranslation } from "react-i18next";
import ProjectCard from "./ProjectCard";
import EmptyState from "./EmptyState";
import { Plus } from "lucide-react";

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
  onProjectClick,
  onNewProject,
}) => {
  const { t } = useTranslation();

  if (projects.length === 0) {
    return (
      <EmptyState
        title={t("no_projects_title")}
        description={t("no_projects_description")}
        actionButton={
          <button onClick={onNewProject} className="btn-new-project">
            <Plus size={16} strokeWidth={2} />
            <span>{t("new_project_button")}</span>
          </button>
        }
      />
    );
  }

  return (
    <div className="projects-grid">
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
