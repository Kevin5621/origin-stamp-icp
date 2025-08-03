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
} from "lucide-react";

const CertificatesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(
    null,
  );

  // Debug: Log when component mounts
  useEffect(() => {
    console.log("CertificatesPage mounted");
    console.log("Current location:", window.location.pathname);
  }, []);

  // Mock data untuk sertifikat
  const certificates = [
    {
      id: "CERT-001",
      title: "Digital Artwork - Abstract Composition",
      artist: "John Doe",
      issueDate: "2024-01-15",
      status: "verified",
      type: "digital",
      duration: "2h 30m",
      actions: 156,
      certificateUrl: "https://originstamp.io/cert/CERT-001",
    },
    {
      id: "CERT-002",
      title: "Physical Painting - Landscape",
      artist: "Jane Smith",
      issueDate: "2024-01-10",
      status: "verified",
      type: "physical",
      duration: "4h 15m",
      actions: 89,
      certificateUrl: "https://originstamp.io/cert/CERT-002",
    },
    {
      id: "CERT-003",
      title: "Code Project - Web Application",
      artist: "Mike Johnson",
      issueDate: "2024-01-08",
      status: "verified",
      type: "digital",
      duration: "8h 45m",
      actions: 234,
      certificateUrl: "https://originstamp.io/cert/CERT-003",
    },
  ];

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || cert.status === filterStatus;
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
    // Mock download functionality
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "var(--color-success)";
      case "pending":
        return "var(--color-warning)";
      case "expired":
        return "var(--color-error)";
      default:
        return "var(--color-text-secondary)";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "digital" ? "💻" : "🎨";
  };

  return (
    <section
      className="certificates-section"
      aria-labelledby="certificates-title"
    >
      <div className="certificates-layout">
        {/* Header */}
        <header className="certificates-header">
          <div className="header-content">
            <h1 id="certificates-title" className="certificates-title">
              {t("view_certificates_title")}
            </h1>
            <p className="certificates-subtitle">
              {t("view_certificates_description")}
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">{certificates.length}</span>
              <span className="stat-label">{t("total_certificates")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {certificates.filter((c) => c.status === "verified").length}
              </span>
              <span className="stat-label">{t("verified_certificates")}</span>
            </div>
          </div>
        </header>

        {/* Search and Filter */}
        <div className="search-filter-section">
          <div className="search-container">
            <Search className="search-icon" size={20} strokeWidth={2} />
            <input
              type="text"
              placeholder={t("search_certificates_placeholder")}
              value={searchTerm}
              onChange={handleSearch}
              className="search-input wireframe-input"
            />
          </div>
          <div className="filter-controls">
            <div className="filter-tabs wireframe-tabs">
              <button
                className={`filter-tab wireframe-tab ${filterStatus === "all" ? "active" : ""}`}
                onClick={() => handleFilterChange("all")}
              >
                {t("all")}
              </button>
              <button
                className={`filter-tab wireframe-tab ${filterStatus === "verified" ? "active" : ""}`}
                onClick={() => handleFilterChange("verified")}
              >
                {t("verified")}
              </button>
              <button
                className={`filter-tab wireframe-tab ${filterStatus === "pending" ? "active" : ""}`}
                onClick={() => handleFilterChange("pending")}
              >
                {t("pending")}
              </button>
            </div>
          </div>
        </div>

        {/* Certificates List */}
        <main className="certificates-main">
          {filteredCertificates.length > 0 ? (
            <div className="certificates-grid">
              {filteredCertificates.map((cert) => (
                <div key={cert.id} className="certificate-card wireframe-card">
                  <div className="certificate-header">
                    <div className="certificate-icon">
                      <FileText size={24} strokeWidth={2} />
                    </div>
                    <div className="certificate-info">
                      <h3 className="certificate-title">{cert.title}</h3>
                      <p className="certificate-artist">by {cert.artist}</p>
                      <div className="certificate-meta">
                        <span className="certificate-id">{cert.id}</span>
                        <span className="certificate-type">
                          {getTypeIcon(cert.type)} {cert.type}
                        </span>
                      </div>
                    </div>
                    <div className="certificate-status">
                      <div
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(cert.status) }}
                      >
                        <CheckCircle size={16} strokeWidth={2} />
                        <span>{cert.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="certificate-details">
                    <div className="detail-item">
                      <Calendar size={16} strokeWidth={2} />
                      <span>
                        Issued: {new Date(cert.issueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="detail-item">
                      <Clock size={16} strokeWidth={2} />
                      <span>Duration: {cert.duration}</span>
                    </div>
                    <div className="detail-item">
                      <span>Actions: {cert.actions}</span>
                    </div>
                  </div>

                  <div className="certificate-actions">
                    <button
                      onClick={() => handleViewCertificate(cert.id)}
                      className="action-btn wireframe-button"
                      title="View Certificate"
                    >
                      <Eye size={16} strokeWidth={2} />
                      View
                    </button>
                    <button
                      onClick={() => handleDownloadCertificate(cert.id)}
                      className="action-btn wireframe-button"
                      title="Download Certificate"
                    >
                      <Download size={16} strokeWidth={2} />
                      Download
                    </button>
                    <button
                      onClick={() =>
                        handleShareCertificate(cert.certificateUrl)
                      }
                      className="action-btn wireframe-button"
                      title="Share Certificate"
                    >
                      <Share2 size={16} strokeWidth={2} />
                      Share
                    </button>
                    <button
                      onClick={() => handleCopyLink(cert.certificateUrl)}
                      className="action-btn wireframe-button"
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
            <div className="empty-state wireframe-card">
              <div className="empty-icon">
                <FileText size={64} strokeWidth={1} />
              </div>
              <h3 className="empty-title">{t("no_certificates_found")}</h3>
              <p className="empty-description">
                {searchTerm || filterStatus !== "all"
                  ? t("adjust_search_filter")
                  : t("no_certificates_description")}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn-new-project wireframe-button primary"
                >
                  {t("create_new_project")}
                </button>
              )}
            </div>
          )}
        </main>

        {/* Certificate Preview Modal */}
        {selectedCertificate && (
          <div className="certificate-modal">
            <div
              className="modal-overlay"
              onClick={() => setSelectedCertificate(null)}
            />
            <div className="modal-content wireframe-card">
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
                  className="wireframe-button primary"
                >
                  <Download size={16} strokeWidth={2} />
                  {t("download_pdf")}
                </button>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="wireframe-button"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificatesPage;
