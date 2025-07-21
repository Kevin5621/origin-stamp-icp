import React from "react";
import { useTranslation } from "react-i18next";
import {
  Play,
  Edit3,
  Flag,
  CheckCircle,
  Pause,
  RotateCcw,
  Clock,
} from "lucide-react";
import { LogProses, JenisLog } from "../../types/karya";

interface ProcessTimelineProps {
  logs: LogProses[];
  isLoading?: boolean;
}

const ProcessTimeline: React.FC<ProcessTimelineProps> = ({
  logs,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  const getLogIcon = (jenisLog: JenisLog) => {
    switch (jenisLog) {
      case "start":
        return <Play size={16} strokeWidth={2} />;
      case "update":
        return <Edit3 size={16} strokeWidth={2} />;
      case "milestone":
        return <Flag size={16} strokeWidth={2} />;
      case "completion":
        return <CheckCircle size={16} strokeWidth={2} />;
      case "pause":
        return <Pause size={16} strokeWidth={2} />;
      case "resume":
        return <RotateCcw size={16} strokeWidth={2} />;
      default:
        return <Clock size={16} strokeWidth={2} />;
    }
  };

  const getLogColor = (jenisLog: JenisLog) => {
    switch (jenisLog) {
      case "start":
        return "timeline-item--start";
      case "update":
        return "timeline-item--update";
      case "milestone":
        return "timeline-item--milestone";
      case "completion":
        return "timeline-item--completion";
      case "pause":
        return "timeline-item--pause";
      case "resume":
        return "timeline-item--resume";
      default:
        return "timeline-item--default";
    }
  };

  const getLogLabel = (jenisLog: JenisLog) => {
    switch (jenisLog) {
      case "start":
        return t("log_start", "Memulai");
      case "update":
        return t("log_update", "Update");
      case "milestone":
        return t("log_milestone", "Milestone");
      case "completion":
        return t("log_completion", "Selesai");
      case "pause":
        return t("log_pause", "Jeda");
      case "resume":
        return t("log_resume", "Lanjutkan");
      default:
        return jenisLog;
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="process-timeline">
        <div className="timeline-loading">
          <div className="loading-skeleton">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
          </div>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="process-timeline">
        <div className="timeline-empty">
          <Clock size={48} strokeWidth={1} />
          <h3>{t("no_logs_title", "Belum Ada Log Proses")}</h3>
          <p>
            {t(
              "no_logs_description",
              "Log proses akan muncul di sini saat Anda mulai bekerja",
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="process-timeline">
      <div className="timeline-header">
        <h3>{t("process_timeline_title", "Timeline Proses")}</h3>
        <span className="timeline-count">
          {logs.length} {t("log_entries", "entri log")}
        </span>
      </div>

      <div className="timeline-container">
        {logs.map((log, index) => (
          <div
            key={log.tindakan_id}
            className={`timeline-item ${getLogColor(log.jenis_log)}`}
          >
            <div className="timeline-marker">{getLogIcon(log.jenis_log)}</div>

            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-type">
                  {getLogLabel(log.jenis_log)}
                </span>
                <span className="timeline-time">
                  {formatDateTime(log.waktu_log)}
                </span>
              </div>

              <div className="timeline-description">
                <p>{log.deskripsi_log}</p>
              </div>

              {index < logs.length - 1 && (
                <div className="timeline-connector"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="timeline-footer">
        <div className="timeline-stats">
          <div className="stat-item">
            <span className="stat-label">
              {t("total_duration", "Total Durasi")}:
            </span>
            <span className="stat-value">
              {(() => {
                if (logs.length < 2) return "0 jam";
                const firstLog = logs[0];
                const lastLog = logs[logs.length - 1];
                const diffTime = Math.abs(
                  lastLog.waktu_log.getTime() - firstLog.waktu_log.getTime(),
                );
                const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
                return `${diffHours} jam`;
              })()}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">{t("milestones", "Milestone")}:</span>
            <span className="stat-value">
              {logs.filter((log) => log.jenis_log === "milestone").length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessTimeline;
