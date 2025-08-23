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
  Award,
  Hash,
  ExternalLink,
} from "lucide-react";
import { CertificateData, CertificateService } from "../../services/certificateService";
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
 * View Certificate Page - Halaman untuk melihat detail sertifikat
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
              const backendCertificate = await CertificateService.getCertificateById(certificateId);
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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleVerify = () => {
    setShowVerificationModal(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: certificateData?.certificate.art_title,
        text: `Check out my ${certificateData?.certificate.art_title} certificate!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Certificate URL copied to clipboard!");
    }
  };

  const handleDownload = () => {
    // TODO: Implement certificate download
    console.log("Downloading certificate...");
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
      {/* Header */}
      <div className="view-certificate__header">
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn--icon"
        >
          <ArrowLeft size={20} />
        </button>
        <h1>{certificate.art_title}</h1>
        <div className="view-certificate__actions">
          <button onClick={handleShare} className="btn btn--icon">
            <Share2 size={20} />
          </button>
          <button onClick={handleDownload} className="btn btn--icon">
            <Download size={20} />
          </button>
          <button onClick={handleVerify} className="btn btn--icon">
            <Eye size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="view-certificate__content">
        {/* Left Column - Certificate Info */}
        <div className="view-certificate__info">
          <div className="certificate-card">
            <div className="certificate-card__header">
              <h2>{t("certificate_details")}</h2>
              <span
                className={`status-badge status-badge--${certificate.certificate_status}`}
              >
                {t(`status_${certificate.certificate_status}`)}
              </span>
            </div>

            <div className="certificate-card__content">
              <div className="info-row">
                <User size={16} />
                <span>
                  {t("artist")}: {certificate.username}
                </span>
              </div>
              <div className="info-row">
                <Award size={16} />
                <span>
                  {t("verification_score")}: {certificate.verification_score}%
                </span>
              </div>
              <div className="info-row">
                <Hash size={16} />
                <span>
                  {t("certificate_id")}: {certificate.certificate_id}
                </span>
              </div>
              <div className="info-row">
                <Clock size={16} />
                <span>
                  {t("issue_date")}:{" "}
                  {formatDate(new Date(certificate.issue_date))}
                </span>
              </div>
              <div className="info-row">
                <ExternalLink size={16} />
                <span>
                  {t("blockchain")}: {certificate.blockchain}
                </span>
              </div>
            </div>
          </div>

          {/* NFT Information */}
          <div className="nft-card">
            <h3>{t("nft_information")}</h3>
            <div className="nft-card__content">
              <div className="info-row">
                <span>
                  {t("nft_id")}: {nftData.nft_id}
                </span>
              </div>
              <div className="info-row">
                <span>
                  {t("token_uri")}:{" "}
                  <a
                    href={nftData.token_uri}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {nftData.token_uri}
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Main Photo & Progress */}
        <div className="view-certificate__visual">
          {/* Main Photo */}
          <div className="main-photo">
            <h3>{t("main_artwork")}</h3>
            <div className="main-photo__container">
              <img
                src={mainPhoto?.url || "/placeholder-art.jpg"}
                alt={mainPhoto?.description || "Main artwork"}
                className="main-photo__image"
              />
              <div className="main-photo__overlay">
                <span className="main-photo__step">
                  Step {mainPhoto?.step || photos.length}
                </span>
              </div>
            </div>
            <p className="main-photo__description">
              {mainPhoto?.description || t("final_artwork")}
            </p>
          </div>

          {/* Progress Photos */}
          <div className="progress-photos">
            <h3>{t("creation_progress")}</h3>
            <div className="progress-photos__grid">
              {photos.map((photo) => (
                <div key={photo.id} className="progress-photo">
                  <img
                    src={photo.url}
                    alt={photo.description}
                    className="progress-photo__image"
                  />
                  <div className="progress-photo__info">
                    <span className="progress-photo__step">
                      Step {photo.step}
                    </span>
                    <span className="progress-photo__time">
                      {formatDate(photo.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="view-certificate__tabs">
        <button
          className={`tab ${activeTab === "overview" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          {t("overview")}
        </button>
        <button
          className={`tab ${activeTab === "progress" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("progress")}
        >
          {t("progress")}
        </button>
        <button
          className={`tab ${activeTab === "nft" ? "tab--active" : ""}`}
          onClick={() => setActiveTab("nft")}
        >
          {t("nft")}
        </button>
      </div>

      {/* Tab Content */}
      <div className="view-certificate__tab-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="overview-section">
              <h3>{t("artwork_description")}</h3>
              <p>{certificate.description}</p>
            </div>

            <div className="overview-section">
              <h3>{t("creation_metadata")}</h3>
              <div className="metadata-grid">
                <div className="metadata-item">
                  <span className="metadata-label">
                    {t("creation_duration")}
                  </span>
                  <span className="metadata-value">
                    {certificate.metadata.creation_duration}
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">{t("total_actions")}</span>
                  <span className="metadata-value">
                    {certificate.metadata.total_actions}
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">{t("file_format")}</span>
                  <span className="metadata-value">
                    {certificate.metadata.file_format}
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">{t("creation_tools")}</span>
                  <span className="metadata-value">
                    {certificate.metadata.creation_tools.join(", ")}
                  </span>
                </div>
              </div>
            </div>

            {/* NFT Display in Overview */}
            <div className="overview-section">
              <h3>{t("nft_details")}</h3>
              <NFTDisplay
                nftData={nftData}
                certificateId={certificate.certificate_id}
              />
            </div>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="progress-tab">
            <div className="timeline">
              {photos.map((photo) => (
                <div key={photo.id} className="timeline-item">
                  <div className="timeline-marker">
                    <Camera size={16} />
                  </div>
                  <div className="timeline-content">
                    <h4>{photo.description}</h4>
                    <p>{formatDate(photo.timestamp)}</p>
                    <img
                      src={photo.url}
                      alt={photo.description}
                      className="timeline-photo"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "nft" && (
          <div className="nft-tab">
            <NFTDisplay
              nftData={nftData}
              certificateId={certificate.certificate_id}
            />
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal__header">
              <h3>{t("verify_certificate")}</h3>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="btn btn--icon"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal__content">
              <p>
                {t("verification_hash")}: {certificate.verification_hash}
              </p>
              <p>
                {t("blockchain_tx")}: {certificate.blockchain_tx}
              </p>
              <a
                href={certificate.verification_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary"
              >
                {t("verify_on_blockchain")}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCertificatePage;
