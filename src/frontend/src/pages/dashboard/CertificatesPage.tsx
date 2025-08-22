import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Download,
  Share2,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  Copy,
  Loader,
} from "lucide-react";
import CertificateService, {
  CertificateData,
} from "../../services/certificateService";
import { useAuth } from "../../contexts/AuthContext";
import { useToastContext } from "../../contexts/ToastContext";

const CertificatesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToastContext();
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(
    null,
  );
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        setLoading(true);

        if (!isAuthenticated || !user) {
          addToast("error", t("please_login_first"));
          navigate("/login");
          return;
        }

        const userCertificates = await CertificateService.getUserCertificates(
          user.username,
        );
        setCertificates(userCertificates);
      } catch (error) {
        console.error("Failed to load certificates:", error);
        addToast("error", t("failed_to_load_certificates"));
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, [user, isAuthenticated, addToast, t, navigate]);

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.art_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificate_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || cert.certificate_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
  };

  const handleViewCertificate = (certId: string) => {
    setSelectedCertificate(certId);
  };

  const handleDownloadCertificate = (certId: string) => {
    alert(`Downloading certificate ${certId}...`);
  };

  const handleShareCertificate = (certUrl: string) => {
    if (navigator.share) {
      navigator.share({
        title: t("certificate_of_authenticity"),
        text: "Check out this verified artwork certificate",
        url: certUrl,
      });
    } else {
      navigator.clipboard.writeText(certUrl);
      alert("Certificate URL copied to clipboard!");
    }
  };

  const handleCopyLink = (certUrl: string) => {
    navigator.clipboard.writeText(certUrl);
    alert("Certificate URL copied to clipboard!");
  };

  const getTypeIcon = (type: string) => {
    return type === "digital" ? "💻" : "🎨";
  };

  return (
    <div className="dashboard">
      <div className="dashboard__content">
        <div className="dashboard__main">
          {/* Header Section */}
          <div className="dashboard__section">
            <div className="dashboard__header">
              <h1 className="dashboard__title">
                {t("view_certificates_title")}
              </h1>
              <p className="dashboard__subtitle">
                {t("view_certificates_description")}
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="dashboard__section">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">
                  {t("certificates_overview")}
                </h2>
              </div>
              <div className="dashboard-card__content">
                <div className="certificates-stats">
                  <div className="certificate-stat-item">
                    <div className="certificate-stat-value">
                      {certificates.length}
                    </div>
                    <div className="certificate-stat-label">
                      {t("total_certificates")}
                    </div>
                  </div>
                  <div className="certificate-stat-item">
                    <div className="certificate-stat-value">
                      {
                        certificates.filter(
                          (c) => c.certificate_status === "active",
                        ).length
                      }
                    </div>
                    <div className="certificate-stat-label">
                      {t("verified_certificates")}
                    </div>
                  </div>
                  <div className="certificate-stat-item">
                    <div className="certificate-stat-value">
                      {
                        certificates.filter(
                          (c) => c.certificate_status === "expired",
                        ).length
                      }
                    </div>
                    <div className="certificate-stat-label">
                      {t("expired_certificates")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="dashboard__section">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">
                  {t("search_and_filter")}
                </h2>
              </div>
              <div className="dashboard-card__content">
                <div className="search-filter-container">
                  <div className="search-container">
                    <Search className="search-icon" size={20} strokeWidth={2} />
                    <input
                      type="text"
                      placeholder={t("search_certificates_placeholder")}
                      value={searchTerm}
                      onChange={handleSearch}
                      className="search-input"
                    />
                  </div>
                  <div className="filter-tabs">
                    <button
                      className={`filter-tab ${filterStatus === "all" ? "filter-tab--active" : ""}`}
                      onClick={() => handleFilterChange("all")}
                    >
                      {t("all")}
                    </button>
                    <button
                      className={`filter-tab ${filterStatus === "active" ? "filter-tab--active" : ""}`}
                      onClick={() => handleFilterChange("active")}
                    >
                      {t("active")}
                    </button>
                    <button
                      className={`filter-tab ${filterStatus === "expired" ? "filter-tab--active" : ""}`}
                      onClick={() => handleFilterChange("expired")}
                    >
                      {t("expired")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificates Grid Section */}
          <div className="dashboard__section">
            <div className="dashboard-card">
              <div className="dashboard-card__header">
                <h2 className="dashboard-card__title">
                  {t("your_certificates")}
                </h2>
              </div>
              <div className="dashboard-card__content">
                {loading ? (
                  <div className="loading-state">
                    <Loader size={24} className="loading-state__spinner" />
                    <p>{t("loading_certificates")}</p>
                  </div>
                ) : filteredCertificates.length > 0 ? (
                  <div className="certificates-grid">
                    {filteredCertificates.map((cert) => (
                      <div
                        key={cert.certificate_id}
                        className="certificate-card"
                      >
                        <div className="certificate-header">
                          <div className="certificate-icon">
                            <FileText size={24} strokeWidth={2} />
                          </div>
                          <div className="certificate-info">
                            <h3 className="certificate-title">
                              {cert.art_title}
                            </h3>
                            <p className="certificate-artist">
                              by {cert.username}
                            </p>
                            <div className="certificate-meta">
                              <span className="certificate-id">
                                {cert.certificate_id}
                              </span>
                              <span className="certificate-type">
                                {getTypeIcon(cert.certificate_type)}{" "}
                                {cert.certificate_type}
                              </span>
                            </div>
                          </div>
                          <div className="certificate-status">
                            <div
                              className={`status-badge status-badge--${cert.certificate_status}`}
                            >
                              <CheckCircle size={16} strokeWidth={2} />
                              <span>{cert.certificate_status}</span>
                            </div>
                          </div>
                        </div>

                        <div className="certificate-details">
                          <div className="detail-item">
                            <Calendar size={16} strokeWidth={2} />
                            <span>
                              Issued: {cert.issue_date.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="detail-item">
                            <Clock size={16} strokeWidth={2} />
                            <span>
                              Duration: {cert.metadata.creation_duration}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span>Actions: {cert.metadata.total_actions}</span>
                          </div>
                        </div>

                        <div className="certificate-actions">
                          <button
                            onClick={() =>
                              handleViewCertificate(cert.certificate_id)
                            }
                            className="btn btn--primary"
                            title="View Certificate"
                          >
                            <Eye size={16} strokeWidth={2} />
                            View
                          </button>
                          <button
                            onClick={() =>
                              handleDownloadCertificate(cert.certificate_id)
                            }
                            className="btn btn--secondary"
                            title="Download Certificate"
                          >
                            <Download size={16} strokeWidth={2} />
                            Download
                          </button>
                          <button
                            onClick={() =>
                              handleShareCertificate(cert.verification_url)
                            }
                            className="btn btn--secondary"
                            title="Share Certificate"
                          >
                            <Share2 size={16} strokeWidth={2} />
                            Share
                          </button>
                          <button
                            onClick={() =>
                              handleCopyLink(cert.verification_url)
                            }
                            className="btn btn--secondary"
                            title="Copy Link"
                          >
                            <Copy size={16} strokeWidth={2} />
                            Copy Link
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state__icon">
                      <FileText size={30} strokeWidth={1} />
                    </div>
                    <h3 className="empty-state__title">
                      {t("no_certificates_found")}
                    </h3>
                    <p className="empty-state__description">
                      {searchTerm || filterStatus !== "all"
                        ? t("adjust_search_filter")
                        : t("no_certificates_description")}
                    </p>
                    {!searchTerm && filterStatus === "all" && (
                      <button
                        onClick={() => navigate("/create-session")}
                        className="btn btn--primary"
                      >
                        {t("create_new_project")}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div className="certificate-modal">
          <div
            className="modal-overlay"
            onClick={() => setSelectedCertificate(null)}
          />
          <div className="modal-content">
            <div className="modal-header">
              <h2>{t("certificate_preview")}</h2>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="certificate-preview">
                <div className="preview-header">
                  <h3>{t("certificate_of_authenticity")}</h3>
                  <p>{t("certificate_preview_description")}</p>
                </div>
                <div className="preview-content">
                  <p>Certificate ID: {selectedCertificate}</p>
                  <p>Status: Verified</p>
                  <p>Issue Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => handleDownloadCertificate(selectedCertificate)}
                className="btn btn--primary"
              >
                <Download size={16} strokeWidth={2} />
                {t("download_pdf")}
              </button>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="btn btn--secondary"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
