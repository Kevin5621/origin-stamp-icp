import React from "react";
import { useTranslation } from "react-i18next";
import ProjectCard from "./ProjectCard";
import EmptyState from "./EmptyState";
import { Plus } from "lucide-react";
import { KaryaWithLogs } from "../../types/karya";
import ErrorBoundary from "../common/ErrorBoundary";

interface ProjectsListProps {
  projects: KaryaWithLogs[];
  onNewProject: () => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onNewProject,
}) => {
  const { t } = useTranslation();

  if (projects.length === 0) {
    return (
      <EmptyState
        title={t("no_projects_title", "Belum Ada Karya")}
        description={t(
          "no_projects_description",
          "Mulai membuat karya pertama Anda untuk mendapatkan sertifikat OriginStamp",
        )}
        actionButton={
          <button onClick={onNewProject} className="btn-new-project">
            <Plus size={16} strokeWidth={2} />
            <span>{t("new_project_button", "Buat Karya Baru")}</span>
          </button>
        }
      />
    );
  }

  return (
    <div className="projects-grid">
      {projects.map((project, index) => (
        <ErrorBoundary
          key={project.karya_id}
          fallback={
            <div className="project-card project-card--error">
              <div className="project-error">
                <p>Gagal memuat karya: {project.nama_karya}</p>
              </div>
            </div>
          }
        >
          <ProjectCard project={project} index={index} />
        </ErrorBoundary>
      ))}
    </div>
  );
};

export default ProjectsList;
