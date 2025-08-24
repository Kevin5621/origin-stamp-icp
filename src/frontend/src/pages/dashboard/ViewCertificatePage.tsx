// src/frontend/src/pages/dashboard/ViewCertificatePage.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  Download,
  Eye,
  X,
  Camera,
  Clock,
  User,
  Hash,
  ExternalLink,
  CheckCircle,
  Shield,
  Calendar,
  FileText,
  Image as ImageIcon,
  Link,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  CertificateData,
  CertificateService,
} from "../../services/certificateService";
import { NFTDisplay } from "../../components/certificate/NFTDisplay";

// Types for certificate data
interface CertificateDetailData {
  certificate: CertificateData;
  nftData: {
    nft_id: string;
    token_uri: string;
  };
  sessionData: {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: Date;
    photos: Array<{
      id: string;
      filename: string;
      timestamp: Date;
      description: string;
      url: string;
      step: number;
    }>;
  };
  photos: Array<{
    id: string;
    filename: string;
    timestamp: Date;
    description: string;
    url: string;
    step: number;
  }>;
}

/**
 * View Certificate Page - Halaman untuk melihat detail sertifikat dengan desain modern
 */
const ViewCertificatePage: React.FC = () => {
  const { t } = useTranslation("certificates");
  const navigate = useNavigate();
  const { certificateId } = useParams<{ certificateId: string }>();
  const location = useLocation();
  const [certificateData, setCertificateData] =
    useState<CertificateDetailData | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "progress" | "nft">(
    "overview",
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Load certificate data from location state or backend
  useEffect(() => {
    const loadCertificate = async () => {
      if (certificateId) {
        try {
          // Check if data is passed from navigation
          if (location.state) {
            setCertificateData(location.state as CertificateDetailData);
            setIsLoading(false);
          } else {
            // Load from backend if not in state
            try {
              const backendCertificate =
                await CertificateService.getCertificateById(certificateId);
              if (backendCertificate) {
                // Transform backend data to match expected format
                const transformedData: CertificateDetailData = {
                  certificate: backendCertificate,
                  nftData: {
                    nft_id: backendCertificate.nft_id || "N/A",
                    token_uri: backendCertificate.token_uri || "N/A",
                  },
                  sessionData: {
                    id: backendCertificate.session_id,
                    title: backendCertificate.art_title,
                    description: backendCertificate.description,
                    status: "completed",
                    createdAt: backendCertificate.issue_date,
                    photos: [], // Will be loaded separately if needed
                  },
                  photos: [], // Will be loaded separately if needed
                };
                setCertificateData(transformedData);
              } else {
                setCertificateData(null);
              }
            } catch (error) {
              console.error("Failed to load certificate from backend:", error);
              setCertificateData(null);
            }
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Failed to load certificate:", error);
          setIsLoading(false);
          setCertificateData(null);
        }
      }
    };

    loadCertificate();
  }, [certificateId, location.state]);

  const formatDate = (date: Date) => {
    try {
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const handleVerify = () => {
    setShowVerificationModal(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: certificateData?.certificate.art_title,
        text: `Lihat sertifikat ${certificateData?.certificate.art_title} saya!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast or notification
      console.log("Certificate URL copied to clipboard!");
    }
  };

  const handleDownload = () => {
    // TODO: Implement certificate download
    console.log("Downloading certificate...");
  };

  const handleCopyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const nextPhoto = () => {
    if (certificateData?.photos) {
      setCurrentPhotoIndex((prev) =>
        prev === certificateData.photos.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevPhoto = () => {
    if (certificateData?.photos) {
      setCurrentPhotoIndex((prev) =>
        prev === 0 ? certificateData.photos.length - 1 : prev - 1,
      );
    }
  };

  const goToPhoto = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  if (isLoading) {
    return (
      <div className="view-certificate">
        <div className="view-certificate__loading">
          <div className="loading-spinner" />
          <p>{t("loading_certificate")}</p>
        </div>
      </div>
    );
  }

  if (!certificateData) {
    return (
      <div className="view-certificate">
        <div className="view-certificate__error">
          <h2>{t("certificate_not_found")}</h2>
          <p>{t("certificate_not_found_description")}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn--primary"
          >
            {t("back_to_dashboard")}
          </button>
        </div>
      </div>
    );
  }

  const { certificate, nftData, photos } = certificateData;
  const mainPhoto = photos[photos.length - 1]; // Main photo is the last progress photo

  return (
    <div className="view-certificate">
      {/* Modern Header */}
      <div className="view-certificate__header">
        <div className="header-left">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn--back"
            aria-label={t("view_certificate.back_to_dashboard")}
          >
            <ArrowLeft size={16} />
            <span>{t("view_certificate.back_to_dashboard")}</span>
          </button>
          <div className="header-title">
            <h1>{certificate.art_title}</h1>
            <p className="header-subtitle">Sertifikat Digital Terverifikasi</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            onClick={handleShare}
            className="btn btn--action"
            aria-label={t("view_certificate.share")}
          >
            <Share2 size={14} />
            <span>{t("view_certificate.share")}</span>
          </button>
          <button
            onClick={handleDownload}
            className="btn btn--action"
            aria-label={t("view_certificate.download")}
          >
            <Download size={14} />
            <span>{t("view_certificate.download")}</span>
          </button>
          <button
            onClick={handleVerify}
            className="btn btn--action btn--verify"
            aria-label={t("view_certificate.verify")}
          >
            <Eye size={14} />
            <span>{t("view_certificate.verify")}</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="view-certificate__content">
        {/* Left Column - Certificate Details */}
        <div className="view-certificate__sidebar">
          {/* Certificate Status Card */}
          <div className="status-card">
            <div className="status-header">
              <div className="status-icon">
                <CheckCircle size={18} />
              </div>
              <div className="status-info">
                <h3>{t("view_certificate.status_certificate")}</h3>
                <span
                  className={`status-badge status-badge--${certificate.certificate_status}`}
                >
                  {t(`status_${certificate.certificate_status}`)}
                </span>
              </div>
            </div>
            <div className="verification-score">
              <div className="score-circle">
                <span className="score-number">
                  {certificate.verification_score}%
                </span>
                <span className="score-label">
                  {t("view_certificate.verification_score")}
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Details Card */}
          <div className="details-card">
            <div className="card-header">
              <Shield size={16} />
              <h3>{t("view_certificate.certificate_details")}</h3>
            </div>

            <div className="details-list">
              <div className="detail-item">
                <div className="detail-icon">
                  <User size={14} />
                </div>
                <div className="detail-content">
                  <label>{t("view_certificate.artist")}</label>
                  <span>{certificate.username}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Hash size={14} />
                </div>
                <div className="detail-content">
                  <label>{t("view_certificate.certificate_id")}</label>
                  <div className="copy-field">
                    <span className="field-value">
                      {certificate.certificate_id}
                    </span>
                    <button
                      onClick={() =>
                        handleCopyToClipboard(
                          certificate.certificate_id,
                          "certificate_id",
                        )
                      }
                      className="copy-btn"
                      aria-label={t("view_certificate.copy")}
                    >
                      {copiedField === "certificate_id" ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <Calendar size={14} />
                </div>
                <div className="detail-content">
                  <label>{t("view_certificate.issue_date")}</label>
                  <span>{formatDate(new Date(certificate.issue_date))}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <ExternalLink size={14} />
                </div>
                <div className="detail-content">
                  <label>{t("view_certificate.blockchain")}</label>
                  <span>{certificate.blockchain}</span>
                </div>
              </div>
            </div>
          </div>

          {/* NFT Information Card */}
          <div className="nft-card">
            <div className="card-header">
              <ImageIcon size={16} />
              <h3>{t("view_certificate.nft_information")}</h3>
            </div>

            <div className="nft-details">
              <div className="nft-item">
                <label>{t("view_certificate.nft_id")}</label>
                <div className="copy-field">
                  <span className="field-value">{nftData.nft_id}</span>
                  <button
                    onClick={() =>
                      handleCopyToClipboard(nftData.nft_id, "nft_id")
                    }
                    className="copy-btn"
                    aria-label={t("view_certificate.copy")}
                  >
                    {copiedField === "nft_id" ? (
                      <Check size={12} />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              </div>

              <div className="nft-item">
                <label>Token URI</label>
                <div className="copy-field">
                  <span className="field-value">{nftData.token_uri}</span>
                  <div className="copy-actions">
                    <button
                      onClick={() =>
                        handleCopyToClipboard(nftData.token_uri, "token_uri")
                      }
                      className="copy-btn"
                      aria-label="Salin Token URI"
                    >
                      {copiedField === "token_uri" ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                    <a
                      href={nftData.token_uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-btn"
                      aria-label="Buka Token URI"
                    >
                      <Link size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Visual Content */}
        <div className="view-certificate__main">
          {/* Main Artwork Display with Carousel */}
          <div className="main-artwork">
            <div className="artwork-header">
              <h3>{t("view_certificate.main_artwork")}</h3>
              <div className="artwork-step">
                <span>
                  {t("view_certificate.step")}{" "}
                  {mainPhoto?.step || photos.length}
                </span>
              </div>
            </div>

            <div className="artwork-container">
              <img
                src={photos[currentPhotoIndex]?.url || "/placeholder-art.jpg"}
                alt={photos[currentPhotoIndex]?.description || "Karya utama"}
                className="artwork-image"
              />
              <div className="artwork-overlay">
                <div className="overlay-content">
                  <Camera size={20} />
                  <span>{t("view_certificate.final_artwork")}</span>
                </div>
              </div>

              {/* Carousel Navigation */}
              {photos.length > 1 && (
                <>
                  <button
                    className="carousel-btn carousel-btn--prev"
                    onClick={prevPhoto}
                    aria-label="Foto sebelumnya"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    className="carousel-btn carousel-btn--next"
                    onClick={nextPhoto}
                    aria-label="Foto berikutnya"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Carousel Indicators */}
                  <div className="carousel-indicators">
                    {photos.map((_, index) => (
                      <button
                        key={index}
                        className={`carousel-indicator ${index === currentPhotoIndex ? "active" : ""}`}
                        onClick={() => goToPhoto(index)}
                        aria-label={`Pergi ke foto ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="artwork-info">
              <p className="artwork-description">
                {photos[currentPhotoIndex]?.description ||
                  t("view_certificate.final_artwork")}
              </p>
              <div className="artwork-meta">
                <span className="meta-item">
                  <Clock size={12} />
                  {formatDate(
                    photos[currentPhotoIndex]?.timestamp || new Date(),
                  )}
                </span>
                <span className="meta-item">
                  <FileText size={12} />
                  {photos[currentPhotoIndex]?.filename || "artwork.jpg"}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="progress-timeline">
            <div className="timeline-header">
              <h3>{t("view_certificate.progress_timeline")}</h3>
              <span className="timeline-count">
                {photos.length} {t("view_certificate.step")}
              </span>
            </div>

            <div className="timeline-container">
              {photos.map((photo) => (
                <div key={photo.id} className="timeline-step">
                  <div className="step-marker">
                    <div className="step-number">{photo.step}</div>
                    <div className="step-line" />
                  </div>

                  <div className="step-content">
                    <div className="step-image">
                      <img
                        src={photo.url}
                        alt={photo.description}
                        className="step-photo"
                      />
                      <div className="step-overlay">
                        <span>
                          {t("view_certificate.step")} {photo.step}
                        </span>
                      </div>
                    </div>

                    <div className="step-info">
                      <h4>{photo.description}</h4>
                      <div className="step-meta">
                        <span className="step-time">
                          <Clock size={10} />
                          {formatDate(photo.timestamp)}
                        </span>
                        <span className="step-file">
                          <FileText size={10} />
                          {photo.filename}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <div className="view-certificate__tabs">
        <div className="tabs-container">
          <button
            className={`tab ${activeTab === "overview" ? "tab--active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <span className="tab-icon">📋</span>
            <span className="tab-label">{t("view_certificate.overview")}</span>
          </button>
          <button
            className={`tab ${activeTab === "progress" ? "tab--active" : ""}`}
            onClick={() => setActiveTab("progress")}
          >
            <span className="tab-icon">📈</span>
            <span className="tab-label">{t("view_certificate.progress")}</span>
          </button>
          <button
            className={`tab ${activeTab === "nft" ? "tab--active" : ""}`}
            onClick={() => setActiveTab("nft")}
          >
            <span className="tab-icon">🖼️</span>
            <span className="tab-label">{t("view_certificate.nft")}</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="view-certificate__tab-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="overview-section">
                <h3>{t("view_certificate.artwork_description")}</h3>
                <p className="description-text">{certificate.description}</p>
              </div>

              <div className="overview-section">
                <h3>{t("view_certificate.creation_metadata")}</h3>
                <div className="metadata-grid">
                  <div className="metadata-item">
                    <label>{t("view_certificate.creation_duration")}</label>
                    <span>
                      {certificate.metadata?.creation_duration || "N/A"}
                    </span>
                  </div>
                  <div className="metadata-item">
                    <label>{t("view_certificate.total_actions")}</label>
                    <span>{certificate.metadata?.total_actions || "N/A"}</span>
                  </div>
                  <div className="metadata-item">
                    <label>{t("view_certificate.file_format")}</label>
                    <span>{certificate.metadata?.file_format || "N/A"}</span>
                  </div>
                  <div className="metadata-item">
                    <label>{t("view_certificate.creation_tools")}</label>
                    <span>
                      {certificate.metadata?.creation_tools?.join(", ") ||
                        "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="overview-section">
                <h3>{t("view_certificate.nft_details")}</h3>
                <NFTDisplay
                  nftData={nftData}
                  certificateId={certificate.certificate_id}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="progress-tab">
            <div className="progress-grid">
              {photos.map((photo) => (
                <div key={photo.id} className="progress-card">
                  <div className="progress-header">
                    <div className="progress-step">
                      <span className="step-number">
                        {t("view_certificate.step")} {photo.step}
                      </span>
                    </div>
                    <div className="progress-info">
                      <h4>{photo.description}</h4>
                      <span className="progress-time">
                        {formatDate(photo.timestamp)}
                      </span>
                    </div>
                  </div>

                  <div className="progress-image">
                    <img
                      src={photo.url}
                      alt={photo.description}
                      className="progress-photo"
                    />
                  </div>

                  <div className="progress-meta">
                    <span className="meta-item">
                      <FileText size={12} />
                      {photo.filename}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "nft" && (
          <div className="nft-tab">
            <div className="nft-display">
              <NFTDisplay
                nftData={nftData}
                certificateId={certificate.certificate_id}
              />
            </div>
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowVerificationModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>{t("view_certificate.verification_modal_title")}</h3>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="modal-close"
                aria-label={t("view_certificate.close")}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal__content">
              <div className="verification-info">
                <div className="info-item">
                  <label>{t("view_certificate.verification_hash")}</label>
                  <div className="copy-field">
                    <span className="field-value">
                      {certificate.verification_hash}
                    </span>
                    <button
                      onClick={() =>
                        handleCopyToClipboard(
                          certificate.verification_hash,
                          "verification_hash",
                        )
                      }
                      className="copy-btn"
                    >
                      {copiedField === "verification_hash" ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="info-item">
                  <label>{t("view_certificate.blockchain_transaction")}</label>
                  <div className="copy-field">
                    <span className="field-value">
                      {certificate.blockchain_tx}
                    </span>
                    <button
                      onClick={() =>
                        handleCopyToClipboard(
                          certificate.blockchain_tx,
                          "blockchain_tx",
                        )
                      }
                      className="copy-btn"
                    >
                      {copiedField === "blockchain_tx" ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal__actions">
                <a
                  href={certificate.verification_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                >
                  <ExternalLink size={14} />
                  {t("view_certificate.verify_on_blockchain")}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCertificatePage;
