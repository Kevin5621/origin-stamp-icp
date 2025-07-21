import React from "react";
import { useTranslation } from "react-i18next";
import {
  Clock,
  CheckCircle,
  Edit3,
  Home,
  BarChart3,
  FileText,
  Calendar,
  Palette,
  Music,
  Hammer,
  Eye,
  Settings,
} from "lucide-react";
import { KaryaWithLogs } from "../../types/karya";
import { useErrorHandler } from "../../hooks/useErrorHandler";

interface ProjectCardProps {
  project: KaryaWithLogs;
  onClick: (karyaId: string) => void;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  index,
}) => {
  const { t } = useTranslation();
  const { handleError, safeExecute } = useErrorHandler({
    context: `ProjectCard-${index}`,
  });

  // Validasi data project
  if (!project) {
    return (
      <div className="project-card project-card--error">
        <div className="project-error">
          <p>Data karya tidak tersedia</p>
        </div>
      </div>
    );
  }

  // Fallback values untuk mencegah error
  const safeProject = {
    karya_id: project.karya_id || `karya-${index}`,
    nama_karya: project.nama_karya || "Karya Tanpa Nama",
    deskripsi: project.deskripsi || "Tidak ada deskripsi",
    tipe_karya: project.tipe_karya || "other",
    format_file: project.format_file || "unknown",
    status_karya: project.status_karya || "draft",
    waktu_mulai: project.waktu_mulai || new Date(),
    waktu_selesai: project.waktu_selesai,
    user_id: project.user_id || "unknown",
    log_count: project.log_count || 0,
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          icon: <Clock size={12} strokeWidth={2} />,
          label: t("status_active", "Sedang Berlangsung"),
          className: "project-status--active",
        };
      case "completed":
        return {
          icon: <CheckCircle size={12} strokeWidth={2} />,
          label: t("status_completed", "Selesai"),
          className: "project-status--completed",
        };
      case "draft":
        return {
          icon: <Edit3 size={12} strokeWidth={2} />,
          label: t("status_draft", "Draft"),
          className: "project-status--draft",
        };
      default:
        return {
          icon: <Edit3 size={12} strokeWidth={2} />,
          label: t("status_draft", "Draft"),
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
        return "Lukisan";
      case "sculpture":
        return "Patung";
      case "audio":
        return "Audio";
      case "digital":
        return "Digital";
      case "photography":
        return "Fotografi";
      case "craft":
        return "Kerajinan";
      default:
        return tipe;
    }
  };

  const statusConfig = getStatusConfig(safeProject.status_karya);

  const formatDate = (date: Date) => {
    try {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return "Tanggal tidak valid";
      }
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      handleError(error as Error, "formatDate");
      return "Tanggal tidak valid";
    }
  };

  const getDuration = () => {
    try {
      const start = safeProject.waktu_mulai;
      const end = safeProject.waktu_selesai || new Date();

      if (!start || !(start instanceof Date) || isNaN(start.getTime())) {
        return "Durasi tidak tersedia";
      }

      if (!end || !(end instanceof Date) || isNaN(end.getTime())) {
        return "Sedang berlangsung";
      }

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "1 hari";
      if (diffDays < 7) return `${diffDays} hari`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu`;
      return `${Math.floor(diffDays / 30)} bulan`;
    } catch (error) {
      handleError(error as Error, "getDuration");
      return "Durasi tidak tersedia";
    }
  };

  const handleClick = (karyaId: string) => {
    safeExecute(() => {
      onClick(karyaId);
    }, "handleClick");
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
          <span>Mulai: {formatDate(safeProject.waktu_mulai)}</span>
        </div>
        {safeProject.waktu_selesai && (
          <div className="meta-item">
            <CheckCircle size={12} strokeWidth={2} />
            <span>Selesai: {formatDate(safeProject.waktu_selesai)}</span>
          </div>
        )}
        <div className="meta-item">
          <Clock size={12} strokeWidth={2} />
          <span>Durasi: {getDuration()}</span>
        </div>
        {safeProject.log_count !== undefined && (
          <div className="meta-item">
            <FileText size={12} strokeWidth={2} />
            <span>{safeProject.log_count} log proses</span>
          </div>
        )}
      </div>

      <div className="project-info">
        <div className="info-item">
          <span className="info-label">Format:</span>
          <span className="info-value">{safeProject.format_file}</span>
        </div>
      </div>

      <div className="project-actions">
        <button
          className="project-action-btn project-action-btn--primary"
          onClick={() => handleClick(safeProject.karya_id)}
          aria-label="Lihat detail karya"
        >
          <Eye size={14} strokeWidth={2} />
          <span>Lihat Detail</span>
        </button>

        <button
          className="project-action-btn project-action-btn--secondary"
          onClick={() => handleClick(safeProject.karya_id)}
          aria-label="Lihat sertifikat"
        >
          <FileText size={14} strokeWidth={2} />
          <span>Sertifikat</span>
        </button>

        <button
          className="project-action-btn project-action-btn--secondary"
          onClick={() => handleClick(safeProject.karya_id)}
          aria-label="Analytics karya"
        >
          <BarChart3 size={14} strokeWidth={2} />
          <span>Analytics</span>
        </button>

        <button
          className="project-action-btn project-action-btn--secondary"
          onClick={() => handleClick(safeProject.karya_id)}
          aria-label="Pengaturan karya"
        >
          <Settings size={14} strokeWidth={2} />
          <span>Pengaturan</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
