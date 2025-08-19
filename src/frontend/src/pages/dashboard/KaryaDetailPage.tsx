import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Clock,
  FileText,
  Palette,
  Music,
  Hammer,
  Eye,
  Download,
  Share2,
  Edit3,
  CheckCircle,
  AlertCircle,
  Play,
  BarChart3,
  User,
  Settings,
  Brush,
  Camera,
  Monitor,
  Activity,
  TrendingUp,
  Star,
  Heart,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { KaryaService } from "../../services/artService";
import { KaryaWithLogs } from "../../types/karya";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { Loader } from "../../components/common/Loader";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";

interface KaryaDetailData {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  rating: number;
  tags: string[];
  collaborators: string[];
  version: string;
  file_hash: string;
  thumbnail_url: string;
  preview_url: string;
  download_url: string;
  license: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  estimated_time: string;
  materials: string[];
  techniques: string[];
  inspiration: string;
  notes: string;
  revision_history: {
    version: string;
    date: Date;
    changes: string;
    author: string;
  }[];
  performance_metrics: {
    metric: string;
    value: number;
    unit: string;
    trend: "up" | "down" | "stable";
  }[];
}

const KaryaDetailPage: React.FC = () => {
  const { karyaId } = useParams<{ karyaId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { handleError, safeExecute } = useErrorHandler({
    context: "KaryaDetailPage",
  });

  const [karya, setKarya] = useState<KaryaWithLogs | null>(null);
  const [detailData, setDetailData] = useState<KaryaDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "metadata" | "performance" | "revisions"
  >("overview");

  // TODO: Generate real detail data from backend
  const generateDetailData = (
    _karya: KaryaWithLogs,
  ): KaryaDetailData | null => {
    // TODO: Implement real detail data generation from backend
    return null;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!karyaId) return;

      try {
        setLoading(true);
        const karyaData = await KaryaService.getKaryaById(karyaId);
        if (karyaData) {
          setKarya(karyaData);
          const detail = generateDetailData(karyaData);
          setDetailData(detail);
        }
      } catch (error) {
        handleError(error as Error, "loadData");
      } finally {
        setLoading(false);
      }
    };

    safeExecute(loadData, "loadData");
  }, [karyaId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownload = () => {
    if (detailData) {
      const link = document.createElement("a");
      link.href = detailData.download_url;
      link.download = `${karya?.nama_karya || "karya"}.${karya?.format_file || "jpg"}`;
      link.click();
    }
  };

  const handleShare = () => {
    if (navigator.share && karya) {
      navigator.share({
        title: karya.nama_karya,
        text: karya.deskripsi,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          icon: <Play size={16} className="text-green-500" />,
          label: t("status_active"),
          className: "text-green-500",
        };
      case "completed":
        return {
          icon: <CheckCircle size={16} className="text-blue-500" />,
          label: t("status_completed"),
          className: "text-blue-500",
        };
      case "draft":
        return {
          icon: <Edit3 size={16} className="text-orange-500" />,
          label: t("status_draft"),
          className: "text-orange-500",
        };
      default:
        return {
          icon: <AlertCircle size={16} className="text-gray-500" />,
          label: t("status_unknown"),
          className: "text-gray-500",
        };
    }
  };

  const getTipeKaryaIcon = (tipe: string) => {
    switch (tipe) {
      case "painting":
        return <Palette size={20} />;
      case "sculpture":
        return <Hammer size={20} />;
      case "audio":
        return <Music size={20} />;
      case "digital":
        return <Monitor size={20} />;
      case "photography":
        return <Camera size={20} />;
      case "craft":
        return <Brush size={20} />;
      default:
        return <FileText size={20} />;
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-500";
      case "intermediate":
        return "text-yellow-500";
      case "advanced":
        return "text-orange-500";
      case "expert":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp size={16} className="text-green-500" />;
      case "down":
        return <TrendingUp size={16} className="rotate-180 text-red-500" />;
      default:
        return <Activity size={16} className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="karya-detail-page">
        <div className="karya-detail-page__loading">
          <Loader />
          <p>{t("loading_karya")}</p>
        </div>
      </div>
    );
  }

  if (!karya || !detailData) {
    return (
      <div className="karya-detail-page">
        <div className="karya-detail-page__error">
          <p>{t("karya_not_found")}</p>
          <Button onClick={handleBack} variant="primary">
            {t("back")}
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(karya.status_karya);

  return (
    <div className="karya-detail-page">
      {/* Header */}
      <div className="karya-detail-page__header">
        <div className="karya-detail-page__header-left">
          <Button
            onClick={handleBack}
            variant="secondary"
            className="karya-detail-page__back-btn"
          >
            <ArrowLeft size={20} />
            <span>{t("back")}</span>
          </Button>
          <div className="karya-detail-page__title">
            <h1>{karya.nama_karya}</h1>
            <div className="karya-detail-page__meta">
              <span className="karya-detail-page__type">
                {getTipeKaryaIcon(karya.tipe_karya)}
                {getTipeKaryaLabel(karya.tipe_karya)}
              </span>
              <span
                className={`karya-detail-page__status ${statusConfig.className}`}
              >
                {statusConfig.icon}
                {statusConfig.label}
              </span>
            </div>
          </div>
        </div>
        <div className="karya-detail-page__header-actions">
          <Button variant="secondary" size="small" onClick={handleDownload}>
            <Download size={16} />
            <span>{t("download")}</span>
          </Button>
          <Button variant="secondary" size="small" onClick={handleShare}>
            <Share2 size={16} />
            <span>{t("share")}</span>
          </Button>
          <Button variant="secondary" size="small" onClick={() => {}}>
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </div>

      <div className="karya-detail-page__content">
        {/* Left Panel - Main Content */}
        <div className="karya-detail-page__main-panel">
          {/* Preview Section */}
          <Card className="karya-detail-page__preview-card">
            <div className="karya-detail-page__preview">
              <div className="karya-detail-page__preview-placeholder">
                <Eye size={30} />
                <p>{t("preview_placeholder")}</p>
              </div>
            </div>
          </Card>

          {/* Description Section */}
          <Card className="karya-detail-page__description-card">
            <h3>{t("description")}</h3>
            <p className="karya-detail-page__description">{karya.deskripsi}</p>

            {detailData.inspiration && (
              <div className="karya-detail-page__inspiration">
                <h4>{t("inspiration")}</h4>
                <p>{detailData.inspiration}</p>
              </div>
            )}

            {detailData.notes && (
              <div className="karya-detail-page__notes">
                <h4>{t("notes")}</h4>
                <p>{detailData.notes}</p>
              </div>
            )}
          </Card>

          {/* Tags Section */}
          <Card className="karya-detail-page__tags-card">
            <h3>{t("tags")}</h3>
            <div className="karya-detail-page__tags">
              {detailData.tags.map((tag, index) => (
                <span
                  key={`tag-${index}-${tag}`}
                  className="karya-detail-page__tag"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Panel - Details */}
        <div className="karya-detail-page__side-panel">
          {/* Tabs */}
          <div className="karya-detail-page__tabs">
            <button
              className={`karya-detail-page__tab ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <Eye size={16} />
              <span>{t("overview")}</span>
            </button>
            <button
              className={`karya-detail-page__tab ${activeTab === "timeline" ? "active" : ""}`}
              onClick={() => setActiveTab("timeline")}
            >
              <Clock size={16} />
              <span>{t("timeline")}</span>
            </button>
            <button
              className={`karya-detail-page__tab ${activeTab === "metadata" ? "active" : ""}`}
              onClick={() => setActiveTab("metadata")}
            >
              <FileText size={16} />
              <span>{t("metadata")}</span>
            </button>
            <button
              className={`karya-detail-page__tab ${activeTab === "performance" ? "active" : ""}`}
              onClick={() => setActiveTab("performance")}
            >
              <BarChart3 size={16} />
              <span>{t("performance")}</span>
            </button>
            <button
              className={`karya-detail-page__tab ${activeTab === "revisions" ? "active" : ""}`}
              onClick={() => setActiveTab("revisions")}
            >
              <Settings size={16} />
              <span>{t("revisions")}</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="karya-detail-page__tab-content">
            {activeTab === "overview" && (
              <div className="karya-detail-page__overview">
                <Card className="karya-detail-page__overview-card">
                  <h4>{t("basic_information")}</h4>
                  <div className="karya-detail-page__info-list">
                    <div className="karya-detail-page__info-item">
                      <span className="karya-detail-page__info-label">
                        {t("creation_date")}:
                      </span>
                      <span className="karya-detail-page__info-value">
                        {formatDate(karya.waktu_mulai)}
                      </span>
                    </div>
                    {karya.waktu_selesai && (
                      <div className="karya-detail-page__info-item">
                        <span className="karya-detail-page__info-label">
                          {t("completion_date")}:
                        </span>
                        <span className="karya-detail-page__info-value">
                          {formatDate(karya.waktu_selesai)}
                        </span>
                      </div>
                    )}
                    <div className="karya-detail-page__info-item">
                      <span className="karya-detail-page__info-label">
                        {t("format")}:
                      </span>
                      <span className="karya-detail-page__info-value">
                        {karya.format_file}
                      </span>
                    </div>
                    <div className="karya-detail-page__info-item">
                      <span className="karya-detail-page__info-label">
                        {t("version")}:
                      </span>
                      <span className="karya-detail-page__info-value">
                        {detailData.version}
                      </span>
                    </div>
                    <div className="karya-detail-page__info-item">
                      <span className="karya-detail-page__info-label">
                        {t("difficulty")}:
                      </span>
                      <span
                        className={`karya-detail-page__info-value ${getDifficultyColor(detailData.difficulty)}`}
                      >
                        {t(`difficulty_${detailData.difficulty}`)}
                      </span>
                    </div>
                    <div className="karya-detail-page__info-item">
                      <span className="karya-detail-page__info-label">
                        {t("estimated_time")}:
                      </span>
                      <span className="karya-detail-page__info-value">
                        {detailData.estimated_time}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="karya-detail-page__overview-card">
                  <h4>{t("engagement_metrics")}</h4>
                  <div className="karya-detail-page__metrics-grid">
                    <div className="karya-detail-page__metric">
                      <div className="karya-detail-page__metric-icon">
                        <Eye size={20} />
                      </div>
                      <div className="karya-detail-page__metric-content">
                        <span className="karya-detail-page__metric-value">
                          {detailData.views.toLocaleString()}
                        </span>
                        <span className="karya-detail-page__metric-label">
                          {t("views")}
                        </span>
                      </div>
                    </div>
                    <div className="karya-detail-page__metric">
                      <div className="karya-detail-page__metric-icon">
                        <Heart size={20} />
                      </div>
                      <div className="karya-detail-page__metric-content">
                        <span className="karya-detail-page__metric-value">
                          {detailData.likes}
                        </span>
                        <span className="karya-detail-page__metric-label">
                          {t("likes")}
                        </span>
                      </div>
                    </div>
                    <div className="karya-detail-page__metric">
                      <div className="karya-detail-page__metric-icon">
                        <Share2 size={20} />
                      </div>
                      <div className="karya-detail-page__metric-content">
                        <span className="karya-detail-page__metric-value">
                          {detailData.shares}
                        </span>
                        <span className="karya-detail-page__metric-label">
                          {t("shares")}
                        </span>
                      </div>
                    </div>
                    <div className="karya-detail-page__metric">
                      <div className="karya-detail-page__metric-icon">
                        <MessageCircle size={20} />
                      </div>
                      <div className="karya-detail-page__metric-content">
                        <span className="karya-detail-page__metric-value">
                          {detailData.comments}
                        </span>
                        <span className="karya-detail-page__metric-label">
                          {t("comments")}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="karya-detail-page__overview-card">
                  <h4>{t("rating")}</h4>
                  <div className="karya-detail-page__rating">
                    <div className="karya-detail-page__rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={20}
                          className={
                            star <= Math.floor(detailData.rating)
                              ? "fill-current text-yellow-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="karya-detail-page__rating-value">
                      {detailData.rating}/5.0
                    </span>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="karya-detail-page__timeline">
                <Card className="karya-detail-page__timeline-card">
                  <h4>{t("creation_timeline")}</h4>
                  <div className="karya-detail-page__timeline-list">
                    <div className="karya-detail-page__timeline-item">
                      <div className="karya-detail-page__timeline-marker">
                        <div className="karya-detail-page__timeline-dot"></div>
                        <div className="karya-detail-page__timeline-line"></div>
                      </div>
                      <div className="karya-detail-page__timeline-content">
                        <span className="karya-detail-page__timeline-date">
                          {formatDate(karya.waktu_mulai)}
                        </span>
                        <span className="karya-detail-page__timeline-title">
                          {t("project_started")}
                        </span>
                        <span className="karya-detail-page__timeline-description">
                          {t("project_started_description")}
                        </span>
                      </div>
                    </div>

                    {karya.waktu_selesai && (
                      <div className="karya-detail-page__timeline-item">
                        <div className="karya-detail-page__timeline-marker">
                          <div className="karya-detail-page__timeline-dot completed"></div>
                        </div>
                        <div className="karya-detail-page__timeline-content">
                          <span className="karya-detail-page__timeline-date">
                            {formatDate(karya.waktu_selesai)}
                          </span>
                          <span className="karya-detail-page__timeline-title">
                            {t("project_completed")}
                          </span>
                          <span className="karya-detail-page__timeline-description">
                            {t("project_completed_description")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="karya-detail-page__timeline-card">
                  <h4>{t("process_logs")}</h4>
                  <div className="karya-detail-page__logs-info">
                    <div className="karya-detail-page__logs-count">
                      <FileText size={20} />
                      <span>
                        {karya.log_count || 0} {t("log_entries")}
                      </span>
                    </div>
                    <p>{t("logs_description")}</p>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "metadata" && (
              <div className="karya-detail-page__metadata">
                <Card className="karya-detail-page__metadata-card">
                  <h4>{t("file_information")}</h4>
                  <div className="karya-detail-page__metadata-list">
                    <div className="karya-detail-page__metadata-item">
                      <span className="karya-detail-page__metadata-label">
                        {t("file_hash")}:
                      </span>
                      <span className="karya-detail-page__metadata-value">
                        {detailData.file_hash.substring(0, 20)}...
                      </span>
                    </div>
                    <div className="karya-detail-page__metadata-item">
                      <span className="karya-detail-page__metadata-label">
                        {t("license")}:
                      </span>
                      <span className="karya-detail-page__metadata-value">
                        {detailData.license}
                      </span>
                    </div>
                    <div className="karya-detail-page__metadata-item">
                      <span className="karya-detail-page__metadata-label">
                        {t("category")}:
                      </span>
                      <span className="karya-detail-page__metadata-value">
                        {detailData.category}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="karya-detail-page__metadata-card">
                  <h4>{t("materials")}</h4>
                  <div className="karya-detail-page__materials-list">
                    {detailData.materials.map((material, index) => (
                      <div
                        key={`material-${index}-${material}`}
                        className="karya-detail-page__material-item"
                      >
                        <span>{material}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="karya-detail-page__metadata-card">
                  <h4>{t("techniques")}</h4>
                  <div className="karya-detail-page__techniques-list">
                    {detailData.techniques.map((technique, index) => (
                      <div
                        key={`technique-${index}-${technique}`}
                        className="karya-detail-page__technique-item"
                      >
                        <span>{technique}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="karya-detail-page__metadata-card">
                  <h4>{t("collaborators")}</h4>
                  <div className="karya-detail-page__collaborators-list">
                    {detailData.collaborators.map((collaborator, index) => (
                      <div
                        key={`collaborator-${index}-${collaborator}`}
                        className="karya-detail-page__collaborator-item"
                      >
                        <User size={16} />
                        <span>{collaborator}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "performance" && (
              <div className="karya-detail-page__performance">
                <Card className="karya-detail-page__performance-card">
                  <h4>{t("performance_metrics")}</h4>
                  <div className="karya-detail-page__performance-list">
                    {detailData.performance_metrics.map((metric, index) => (
                      <div
                        key={`performance-${index}-${metric.metric}`}
                        className="karya-detail-page__performance-item"
                      >
                        <div className="karya-detail-page__performance-info">
                          <span className="karya-detail-page__performance-label">
                            {metric.metric}
                          </span>
                          <span className="karya-detail-page__performance-value">
                            {metric.value} {metric.unit}
                          </span>
                        </div>
                        <div className="karya-detail-page__performance-trend">
                          {getTrendIcon(metric.trend)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "revisions" && (
              <div className="karya-detail-page__revisions">
                <Card className="karya-detail-page__revisions-card">
                  <h4>{t("revision_history")}</h4>
                  <div className="karya-detail-page__revisions-list">
                    {detailData.revision_history.map((revision, index) => (
                      <div
                        key={`revision-${index}-${revision.version}`}
                        className="karya-detail-page__revision-item"
                      >
                        <div className="karya-detail-page__revision-header">
                          <span className="karya-detail-page__revision-version">
                            v{revision.version}
                          </span>
                          <span className="karya-detail-page__revision-date">
                            {formatDate(revision.date)}
                          </span>
                        </div>
                        <div className="karya-detail-page__revision-content">
                          <p className="karya-detail-page__revision-changes">
                            {revision.changes}
                          </p>
                          <div className="karya-detail-page__revision-author">
                            <User size={14} />
                            <span>{revision.author}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaryaDetailPage;
