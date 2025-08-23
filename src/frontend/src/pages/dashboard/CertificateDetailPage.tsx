import React, { useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Download,
  Share2,
  Copy,
  Eye,
  Award,
  Shield,
  FileText,
  Hash,
  Clock,
  Globe,
  QrCode,
  ExternalLink,
  Printer,
  MessageCircle,
  Share,
  Building2,
} from "lucide-react";
import { KaryaService } from "../../services/artService";
import { KaryaWithLogs } from "../../types/karya";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { usePreloadData } from "../../hooks/usePreloadData";
import DashboardLoader from "../../components/dashboard/DashboardLoader";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import NFTDisplay from "../../components/certificate/NFTDisplay";

interface CertificateData {
  certificate_id: string;
  issue_date: Date;
  expiry_date: Date;
  verification_hash: string;
  blockchain_tx: string;
  qr_code_data: string;
  verification_url: string;
  certificate_type: "standard" | "premium" | "enterprise";
  verification_score: number;
  authenticity_rating: number;
  provenance_score: number;
  community_trust: number;
  certificate_status: "active" | "expired" | "revoked";
  issuer: string;
  blockchain: string;
  token_standard: string;
  metadata: {
    creation_duration: string;
    total_actions: number;
    file_size: string;
    file_format: string;
    creation_tools: string[];
  };
}

const CertificateDetailPage: React.FC = () => {
  const { karyaId } = useParams<{ karyaId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  useErrorHandler({
    context: "CertificateDetailPage",
  });

  // Get NFT data from navigation state
  const nftData = location.state?.nftData;

  const [activeTab, setActiveTab] = useState<
    "overview" | "verification" | "metadata" | "share"
  >("overview");

  // TODO: Generate real certificate data from backend
  const generateCertificate = useCallback(
    (_karya: KaryaWithLogs): CertificateData | null => {
      // TODO: Implement real certificate generation from backend
      return null;
    },
    [],
  );

  // Preload data dengan caching dan background fetch
  const { data: karya, loading: karyaLoading } = usePreloadData(
    `karya-${karyaId}`,
    () => KaryaService.getKaryaById(karyaId!),
    { immediate: !!karyaId, background: true },
  );

  const { data: certificateData, loading: certificateLoading } = usePreloadData(
    `certificate-${karyaId}`,
    async () => {
      if (!karya) return null;
      return generateCertificate(karya);
    },
    { immediate: !!karyaId && !!karya, background: true },
  );

  const loading = karyaLoading || certificateLoading;

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownload = () => {
    // Mock download functionality
    const link = document.createElement("a");
    link.href = "#";
    link.download = `certificate-${certificateData?.certificate_id}.pdf`;
    link.click();
  };

  const handleShare = () => {
    if (navigator.share && certificateData) {
      navigator.share({
        title: `Certificate: ${karya?.nama_karya}`,
        text: `Check out this verified artwork certificate: ${certificateData.verification_url}`,
        url: certificateData.verification_url,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(certificateData?.verification_url || "");
    }
  };

  const handleCopyHash = () => {
    if (certificateData) {
      navigator.clipboard.writeText(certificateData.verification_hash);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "expired":
        return "text-red-500";
      case "revoked":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle size={16} className="text-green-500" />;
      case "expired":
        return <Clock size={16} className="text-red-500" />;
      case "revoked":
        return <Shield size={16} className="text-orange-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="certificate-detail-page">
        <DashboardLoader
          message={t("loading_certificate")}
          variant="skeleton"
        />
      </div>
    );
  }

  if (!karya || !certificateData) {
    return (
      <div className="certificate-detail-page">
        <div className="certificate-detail-page__error">
          <p>{t("certificate_not_found")}</p>
          <Button onClick={handleBack} variant="primary">
            {t("back")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="certificate-detail-page">
      {/* Header */}
      <div className="certificate-detail-page__header">
        <div className="certificate-detail-page__header-left">
          <Button
            onClick={handleBack}
            variant="secondary"
            className="certificate-detail-page__back-btn"
          >
            <ArrowLeft size={20} />
            <span>{t("back")}</span>
          </Button>
          <div className="certificate-detail-page__title">
            <h1>{t("certificate_title")}</h1>
            <p className="certificate-detail-page__subtitle">
              {karya.nama_karya}
            </p>
          </div>
        </div>
        <div className="certificate-detail-page__header-actions">
          <Button variant="secondary" size="small" onClick={handleDownload}>
            <Download size={16} />
            <span>{t("download")}</span>
          </Button>
          <Button variant="secondary" size="small" onClick={handleShare}>
            <Share2 size={16} />
            <span>{t("share")}</span>
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => window.print()}
          >
            <Printer size={16} />
            <span>{t("print")}</span>
          </Button>
        </div>
      </div>

      <div className="certificate-detail-page__content">
        {/* Left Panel - Certificate Display */}
        <div className="certificate-detail-page__main-panel">
          <Card className="certificate-detail-page__certificate-card">
            <div className="certificate-detail-page__certificate-header">
              <div className="certificate-detail-page__certificate-logo">
                <Award size={33} className="text-primary" />
                <h2>OriginStamp</h2>
                <p>{t("certificate_of_authenticity")}</p>
              </div>
              <div className="certificate-detail-page__certificate-status">
                {getStatusIcon(certificateData.certificate_status)}
                <span
                  className={getStatusColor(certificateData.certificate_status)}
                >
                  {t(
                    `certificate_status_${certificateData.certificate_status}`,
                  )}
                </span>
              </div>
            </div>

            <div className="certificate-detail-page__certificate-body">
              <div className="certificate-detail-page__artwork-info">
                <h3>{karya.nama_karya}</h3>
                <p>{karya.deskripsi}</p>
                <div className="certificate-detail-page__artwork-meta">
                  <span>
                    {t("artist")}: {t("verified_artist")}
                  </span>
                  <span>
                    {t("creation_date")}: {formatDate(karya.waktu_mulai)}
                  </span>
                  <span>
                    {t("completion_date")}:{" "}
                    {formatDate(karya.waktu_selesai || new Date())}
                  </span>
                </div>
              </div>

              <div className="certificate-detail-page__certificate-details">
                <div className="certificate-detail-page__detail-row">
                  <span className="certificate-detail-page__detail-label">
                    {t("certificate_id")}:
                  </span>
                  <span className="certificate-detail-page__detail-value">
                    {certificateData.certificate_id}
                  </span>
                </div>
                <div className="certificate-detail-page__detail-row">
                  <span className="certificate-detail-page__detail-label">
                    {t("issue_date")}:
                  </span>
                  <span className="certificate-detail-page__detail-value">
                    {formatDate(certificateData.issue_date)}
                  </span>
                </div>
                <div className="certificate-detail-page__detail-row">
                  <span className="certificate-detail-page__detail-label">
                    {t("expiry_date")}:
                  </span>
                  <span className="certificate-detail-page__detail-value">
                    {formatDate(certificateData.expiry_date)}
                  </span>
                </div>
                <div className="certificate-detail-page__detail-row">
                  <span className="certificate-detail-page__detail-label">
                    {t("issuer")}:
                  </span>
                  <span className="certificate-detail-page__detail-value">
                    {certificateData.issuer}
                  </span>
                </div>
              </div>

              <div className="certificate-detail-page__verification-section">
                <h4>{t("verification_information")}</h4>
                <div className="certificate-detail-page__verification-hash">
                  <span className="certificate-detail-page__hash-label">
                    {t("verification_hash")}:
                  </span>
                  <div className="certificate-detail-page__hash-container">
                    <span className="certificate-detail-page__hash-value">
                      {certificateData.verification_hash.substring(0, 20)}...
                    </span>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={handleCopyHash}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
                <div className="certificate-detail-page__verification-url">
                  <span className="certificate-detail-page__url-label">
                    {t("verification_url")}:
                  </span>
                  <div className="certificate-detail-page__url-container">
                    <span className="certificate-detail-page__url-value">
                      {certificateData.verification_url}
                    </span>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() =>
                        window.open(certificateData.verification_url, "_blank")
                      }
                    >
                      <ExternalLink size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="certificate-detail-page__qr-section">
                <h4>{t("qr_code")}</h4>
                <div className="certificate-detail-page__qr-container">
                  <div className="certificate-detail-page__qr-code">
                    {/* Mock QR Code - akan diganti dengan library QR code */}
                    <div className="certificate-detail-page__qr-mock">
                      <QrCode size={84} />
                      <p>{t("scan_to_verify")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel - Details */}
        <div className="certificate-detail-page__side-panel">
          {/* Tabs */}
          <div className="certificate-detail-page__tabs">
            <button
              className={`certificate-detail-page__tab ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <Eye size={16} />
              <span>{t("overview")}</span>
            </button>
            <button
              className={`certificate-detail-page__tab ${activeTab === "verification" ? "active" : ""}`}
              onClick={() => setActiveTab("verification")}
            >
              <Shield size={16} />
              <span>{t("verification")}</span>
            </button>
            <button
              className={`certificate-detail-page__tab ${activeTab === "metadata" ? "active" : ""}`}
              onClick={() => setActiveTab("metadata")}
            >
              <FileText size={16} />
              <span>{t("metadata")}</span>
            </button>
            <button
              className={`certificate-detail-page__tab ${activeTab === "share" ? "active" : ""}`}
              onClick={() => setActiveTab("share")}
            >
              <Share2 size={16} />
              <span>{t("share")}</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="certificate-detail-page__tab-content">
            {activeTab === "overview" && (
              <div className="certificate-detail-page__overview">
                <Card className="certificate-detail-page__overview-card">
                  <h4>{t("certificate_summary")}</h4>
                  <div className="certificate-detail-page__summary-list">
                    <div className="certificate-detail-page__summary-item">
                      <div className="certificate-detail-page__summary-icon">
                        <Award size={20} />
                      </div>
                      <div className="certificate-detail-page__summary-content">
                        <span className="certificate-detail-page__summary-label">
                          {t("certificate_type")}
                        </span>
                        <span className="certificate-detail-page__summary-value">
                          {t(
                            `certificate_type_${certificateData.certificate_type}`,
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="certificate-detail-page__summary-item">
                      <div className="certificate-detail-page__summary-icon">
                        <Calendar size={20} />
                      </div>
                      <div className="certificate-detail-page__summary-content">
                        <span className="certificate-detail-page__summary-label">
                          {t("valid_until")}
                        </span>
                        <span className="certificate-detail-page__summary-value">
                          {formatDate(certificateData.expiry_date)}
                        </span>
                      </div>
                    </div>
                    <div className="certificate-detail-page__summary-item">
                      <div className="certificate-detail-page__summary-icon">
                        <Globe size={20} />
                      </div>
                      <div className="certificate-detail-page__summary-content">
                        <span className="certificate-detail-page__summary-label">
                          {t("blockchain")}
                        </span>
                        <span className="certificate-detail-page__summary-value">
                          {certificateData.blockchain}
                        </span>
                      </div>
                    </div>
                    <div className="certificate-detail-page__summary-item">
                      <div className="certificate-detail-page__summary-icon">
                        <Hash size={20} />
                      </div>
                      <div className="certificate-detail-page__summary-content">
                        <span className="certificate-detail-page__summary-label">
                          {t("token_standard")}
                        </span>
                        <span className="certificate-detail-page__summary-value">
                          {certificateData.token_standard}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="certificate-detail-page__overview-card">
                  <h4>{t("verification_scores")}</h4>
                  <div className="certificate-detail-page__scores-grid">
                    <div className="certificate-detail-page__score-item">
                      <div className="certificate-detail-page__score-circle">
                        <span>{certificateData.verification_score}</span>
                      </div>
                      <span className="certificate-detail-page__score-label">
                        {t("verification_score")}
                      </span>
                    </div>
                    <div className="certificate-detail-page__score-item">
                      <div className="certificate-detail-page__score-circle">
                        <span>{certificateData.authenticity_rating}</span>
                      </div>
                      <span className="certificate-detail-page__score-label">
                        {t("authenticity_rating")}
                      </span>
                    </div>
                    <div className="certificate-detail-page__score-item">
                      <div className="certificate-detail-page__score-circle">
                        <span>{certificateData.provenance_score}</span>
                      </div>
                      <span className="certificate-detail-page__score-label">
                        {t("provenance_score")}
                      </span>
                    </div>
                    <div className="certificate-detail-page__score-item">
                      <div className="certificate-detail-page__score-circle">
                        <span>{certificateData.community_trust}</span>
                      </div>
                      <span className="certificate-detail-page__score-label">
                        {t("community_trust")}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* NFT Display Section */}
                {nftData && (
                  <NFTDisplay
                    certificateId={karyaId || ""}
                    nftData={nftData}
                    className="certificate-detail-page__nft-section"
                  />
                )}
              </div>
            )}

            {activeTab === "verification" && (
              <div className="certificate-detail-page__verification">
                <Card className="certificate-detail-page__verification-card">
                  <h4>{t("blockchain_verification")}</h4>
                  <div className="certificate-detail-page__verification-list">
                    <div className="certificate-detail-page__verification-item">
                      <div className="certificate-detail-page__verification-icon">
                        <Hash size={20} />
                      </div>
                      <div className="certificate-detail-page__verification-content">
                        <span className="certificate-detail-page__verification-label">
                          {t("transaction_hash")}
                        </span>
                        <span className="certificate-detail-page__verification-value">
                          {certificateData.blockchain_tx.substring(0, 20)}...
                        </span>
                      </div>
                    </div>
                    <div className="certificate-detail-page__verification-item">
                      <div className="certificate-detail-page__verification-icon">
                        <Globe size={20} />
                      </div>
                      <div className="certificate-detail-page__verification-content">
                        <span className="certificate-detail-page__verification-label">
                          {t("blockchain")}
                        </span>
                        <span className="certificate-detail-page__verification-value">
                          {certificateData.blockchain}
                        </span>
                      </div>
                    </div>
                    <div className="certificate-detail-page__verification-item">
                      <div className="certificate-detail-page__verification-icon">
                        <FileText size={20} />
                      </div>
                      <div className="certificate-detail-page__verification-content">
                        <span className="certificate-detail-page__verification-label">
                          {t("token_standard")}
                        </span>
                        <span className="certificate-detail-page__verification-value">
                          {certificateData.token_standard}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="certificate-detail-page__verification-card">
                  <h4>{t("verification_steps")}</h4>
                  <div className="certificate-detail-page__steps-list">
                    <div className="certificate-detail-page__step">
                      <div className="certificate-detail-page__step-number">
                        1
                      </div>
                      <div className="certificate-detail-page__step-content">
                        <span className="certificate-detail-page__step-title">
                          {t("scan_qr_code")}
                        </span>
                        <span className="certificate-detail-page__step-description">
                          {t("scan_qr_description")}
                        </span>
                      </div>
                    </div>
                    <div className="certificate-detail-page__step">
                      <div className="certificate-detail-page__step-number">
                        2
                      </div>
                      <div className="certificate-detail-page__step-content">
                        <span className="certificate-detail-page__step-title">
                          {t("verify_hash")}
                        </span>
                        <span className="certificate-detail-page__step-description">
                          {t("verify_hash_description")}
                        </span>
                      </div>
                    </div>
                    <div className="certificate-detail-page__step">
                      <div className="certificate-detail-page__step-number">
                        3
                      </div>
                      <div className="certificate-detail-page__step-content">
                        <span className="certificate-detail-page__step-title">
                          {t("check_blockchain")}
                        </span>
                        <span className="certificate-detail-page__step-description">
                          {t("check_blockchain_description")}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "metadata" && (
              <div className="certificate-detail-page__metadata">
                <Card className="certificate-detail-page__metadata-card">
                  <h4>{t("creation_metadata")}</h4>
                  <div className="certificate-detail-page__metadata-list">
                    <div className="certificate-detail-page__metadata-item">
                      <span className="certificate-detail-page__metadata-label">
                        {t("creation_duration")}:
                      </span>
                      <span className="certificate-detail-page__metadata-value">
                        {certificateData.metadata.creation_duration}
                      </span>
                    </div>
                    <div className="certificate-detail-page__metadata-item">
                      <span className="certificate-detail-page__metadata-label">
                        {t("total_actions")}:
                      </span>
                      <span className="certificate-detail-page__metadata-value">
                        {certificateData.metadata.total_actions}
                      </span>
                    </div>
                    <div className="certificate-detail-page__metadata-item">
                      <span className="certificate-detail-page__metadata-label">
                        {t("file_size")}:
                      </span>
                      <span className="certificate-detail-page__metadata-value">
                        {certificateData.metadata.file_size}
                      </span>
                    </div>
                    <div className="certificate-detail-page__metadata-item">
                      <span className="certificate-detail-page__metadata-label">
                        {t("file_format")}:
                      </span>
                      <span className="certificate-detail-page__metadata-value">
                        {certificateData.metadata.file_format}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="certificate-detail-page__metadata-card">
                  <h4>{t("creation_tools")}</h4>
                  <div className="certificate-detail-page__tools-list">
                    {certificateData.metadata.creation_tools.map(
                      (tool, index) => (
                        <div
                          key={`tool-${index}-${tool}`}
                          className="certificate-detail-page__tool-item"
                        >
                          <span>{tool}</span>
                        </div>
                      ),
                    )}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "share" && (
              <div className="certificate-detail-page__share">
                <Card className="certificate-detail-page__share-card">
                  <h4>{t("share_certificate")}</h4>
                  <div className="certificate-detail-page__share-options">
                    <Button
                      variant="primary"
                      onClick={handleShare}
                      className="certificate-detail-page__share-btn"
                    >
                      <Share2 size={16} />
                      <span>{t("share_certificate")}</span>
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        window.open(certificateData.verification_url, "_blank")
                      }
                      className="certificate-detail-page__share-btn"
                    >
                      <ExternalLink size={16} />
                      <span>{t("open_verification_page")}</span>
                    </Button>
                  </div>
                </Card>

                <Card className="certificate-detail-page__share-card">
                  <h4>{t("social_media")}</h4>
                  <div className="certificate-detail-page__social-buttons">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => {
                        const tweetText = `Check out this verified artwork: ${certificateData.verification_url}`;
                        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
                        window.open(tweetUrl, "_blank");
                      }}
                    >
                      <MessageCircle size={16} />
                      <span>Twitter</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() =>
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(certificateData.verification_url)}`,
                          "_blank",
                        )
                      }
                    >
                      <Share size={16} />
                      <span>Facebook</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() =>
                        window.open(
                          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateData.verification_url)}`,
                          "_blank",
                        )
                      }
                    >
                      <Building2 size={16} />
                      <span>LinkedIn</span>
                    </Button>
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

export default CertificateDetailPage;
