import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  Edit3,
  BarChart3,
  FileText,
  Calendar,
  Palette,
  Music,
  Hammer,
  Eye,
} from "lucide-react";
import { KaryaWithLogs } from "../../types/karya";
import { useErrorHandler } from "../../hooks/useErrorHandler";

interface ProjectCardProps {
  project: KaryaWithLogs;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const { t } = useTranslation();
  const { t: tCommon } = useTranslation();
  const navigate = useNavigate();
  const { handleError, safeExecute } = useErrorHandler({
    context: `ProjectCard-${index}`,
  });

  // Validasi data project
  if (!project) {
    return (
      <div className="project-card project-card--error">
        <div className="project-error">
          <p>{t("project_data_unavailable")}</p>
        </div>
      </div>
    );
  }

  // Fallback values untuk mencegah error
  const safeProject = {
    karya_id: project.karya_id || `karya-${index}`,
    nama_karya: project.nama_karya || t("project_no_name"),
    deskripsi: project.deskripsi || t("project_no_description"),
    tipe_karya: project.tipe_karya || "other",
    format_file: project.format_file || t("format_label").toLowerCase(),
    status_karya: project.status_karya || "draft",
    waktu_mulai: project.waktu_mulai || new Date(),
    waktu_selesai: project.waktu_selesai,
    user_id: project.user_id || tCommon("login_method_unknown").toLowerCase(),
    log_count: project.log_count || 0,
  };

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
      default:
        return {
          icon: <Edit3 size={12} strokeWidth={2} />,
          label: t("status_draft"),
          className: "project-status--draft",
        };
    }
  };

  const getTipeKaryaIcon = (tipe: string) => {
    switch (tipe) {
      case "painting":
        return <Palette size={16} strokeWidth={2} />;
      case "sculpture":
        return <Hammer size={16} strokeWidth={2} />;
      case "audio":
        return <Music size={16} strokeWidth={2} />;
      default:
        return <FileText size={16} strokeWidth={2} />;
    }
  };

  const getTipeKaryaLabel = (tipe: string) => {
    switch (tipe) {
      case "painting":
        return t("project_type_painting");
      case "sculpture":
        return t("project_type_sculpture");
      case "audio":
        return t("project_type_audio");
      case "digital":
        return t("project_type_digital");
      case "photography":
        return t("project_type_photography");
      case "craft":
        return t("project_type_craft");
      case "other":
        return t("project_type_other");
      default:
        return tipe;
    }
  };

  const statusConfig = getStatusConfig(safeProject.status_karya);

  const formatDate = (date: Date) => {
    try {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return t("invalid_date");
      }
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      handleError(error as Error, "formatDate");
      return t("invalid_date");
    }
  };

  const getDuration = () => {
    try {
      const start = safeProject.waktu_mulai;
      const end = safeProject.waktu_selesai || new Date();

      if (!start || !(start instanceof Date) || isNaN(start.getTime())) {
        return t("duration_unavailable");
      }

      if (!end || !(end instanceof Date) || isNaN(end.getTime())) {
        return t("duration_ongoing");
      }

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return `1 ${t("duration_day")}`;
      if (diffDays < 7) return `${diffDays} ${t("duration_days")}`;
      if (diffDays < 30)
        return `${Math.floor(diffDays / 7)} ${t("duration_weeks")}`;
      return `${Math.floor(diffDays / 30)} ${t("duration_months")}`;
    } catch (error) {
      handleError(error as Error, "getDuration");
      return t("duration_unavailable");
    }
  };

  const handleAnalyticsClick = (karyaId: string) => {
    safeExecute(() => {
      navigate(`/analytics/${karyaId}`);
    }, "handleAnalyticsClick");
  };

  const handleCertificateClick = (karyaId: string) => {
    safeExecute(() => {
      navigate(`/certificate/${karyaId}`);
    }, "handleCertificateClick");
  };

  const handleDetailClick = (karyaId: string) => {
    safeExecute(() => {
      navigate(`/karya/${karyaId}`);
    }, "handleDetailClick");
  };

  return (
    <div className="project-card">
      <div className="project-header">
        <div className="project-title-section">
          <h3 className="project-title">{safeProject.nama_karya}</h3>
          <div className="project-type-badge">
            {getTipeKaryaIcon(safeProject.tipe_karya)}
            <span>{getTipeKaryaLabel(safeProject.tipe_karya)}</span>
          </div>
        </div>
        <div className={`project-status ${statusConfig.className}`}>
          {statusConfig.icon}
          <span>{statusConfig.label}</span>
        </div>
      </div>

      <div className="project-description">
        <p>{safeProject.deskripsi}</p>
      </div>

      <div className="project-meta">
        <div className="meta-item">
          <Calendar size={12} strokeWidth={2} />
          <span>
            {t("start_date_label")}: {formatDate(safeProject.waktu_mulai)}
          </span>
        </div>
        {safeProject.waktu_selesai && (
          <div className="meta-item">
            <CheckCircle size={12} strokeWidth={2} />
            <span>
              {t("end_date_label")}: {formatDate(safeProject.waktu_selesai)}
            </span>
          </div>
        )}
        <div className="meta-item">
          <Clock size={12} strokeWidth={2} />
          <span>
            {t("duration_label")}: {getDuration()}
          </span>
        </div>
        {safeProject.log_count !== undefined && (
          <div className="meta-item">
            <FileText size={12} strokeWidth={2} />
            <span>
              {safeProject.log_count} {t("process_logs_label")}
            </span>
          </div>
        )}
      </div>

      <div className="project-info">
        <div className="info-item">
          <span className="info-label">{t("format_label")}:</span>
          <span className="info-value">{safeProject.format_file}</span>
        </div>
      </div>

      <div className="project-actions">
        <div className="project-actions-row">
          <button
            className="project-action-btn project-action-btn--primary"
            onClick={() => handleDetailClick(safeProject.karya_id)}
            aria-label={t("view_detail_aria_label")}
          >
            <Eye size={14} strokeWidth={2} />
            <span>{t("view_detail_button")}</span>
          </button>

          <button
            className="project-action-btn project-action-btn--secondary"
            onClick={() => handleCertificateClick(safeProject.karya_id)}
            aria-label={t("view_certificate_aria_label")}
          >
            <FileText size={14} strokeWidth={2} />
            <span>{t("view_certificate_button")}</span>
          </button>
        </div>

        <div className="project-actions-row">
          <button
            className="project-action-btn project-action-btn--secondary"
            onClick={() => handleAnalyticsClick(safeProject.karya_id)}
            aria-label={t("view_analytics_aria_label")}
          >
            <BarChart3 size={14} strokeWidth={2} />
            <span>{t("view_analytics_button")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
