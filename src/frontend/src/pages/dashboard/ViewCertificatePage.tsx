// src/frontend/src/pages/dashboard/ViewCertificatePage.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Share2, Download, Eye, X } from "lucide-react";

// Types for certificate data
interface CertificateData {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  issuedTo: string;
  issuedDate: Date;
  expiresDate: Date;
  issuedBy: string;
  platform: string;
  acceptedDate: Date;
  lastUpdated: Date;
  description: string;
  earningCriteria: string[];
  tags: string[];
  badgeUrl: string;
  status: "verified" | "pending" | "expired";
}

/**
 * View Certificate Page - Halaman untuk melihat detail sertifikat
 */
const ViewCertificatePage: React.FC = () => {
  const { t } = useTranslation("certificates");
  const navigate = useNavigate();
  const { certificateId } = useParams<{ certificateId: string }>();
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load certificate data from backend
  useEffect(() => {
    const loadCertificate = async () => {
      if (certificateId) {
        try {
          // TODO: Implement real certificate loading from backend
          // For now, set loading to false and certificate to null
          setIsLoading(false);
          setCertificate(null);
        } catch (error) {
          console.error("Failed to load certificate:", error);
          setIsLoading(false);
          setCertificate(null);
        }
      }
    };

    loadCertificate();
  }, [certificateId]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleVerify = () => {
    setShowVerificationModal(true);
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: certificate?.title,
        text: `Check out my ${certificate?.title} certificate!`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Certificate URL copied to clipboard!");
    }
  };

  const handleDownload = () => {
    // Implement download functionality
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

  if (!certificate) {
    return (
      <div className="view-certificate">
        <div className="view-certificate__error">
          <h2>{t("certificate_not_found")}</h2>
          <p>{t("certificate_not_found_description")}</p>
          <button
            className="btn-back"
            onClick={() => navigate("/certificates")}
          >
            {t("back_to_certificates")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-certificate">
      <div className="view-certificate__container">
        {/* Modern Header */}
        <div className="view-certificate__header">
          <button
            className="btn-back"
            onClick={() => navigate("/certificates")}
          >
            <ArrowLeft size={20} />
            {t("back_to_certificates")}
          </button>
          <div className="view-certificate__actions">
            <button className="btn-action" onClick={handleShare}>
              <Share2 size={16} />
              {t("share")}
            </button>
            <button className="btn-action" onClick={handleDownload}>
              <Download size={16} />
              {t("download")}
            </button>
          </div>
        </div>

        {/* Certificate Content - Bento Layout */}
        <div className="view-certificate__content">
          {/* Certificate Info */}
          <div className="view-certificate__info">
            <div className="certificate-issued-to">
              {t("certificate_issued_to")}{" "}
              <strong>{certificate.issuedTo}</strong>
            </div>
            <div className="certificate-dates">
              {t("date_issued")}: {formatDate(certificate.issuedDate)} |{" "}
              {t("expires")}: {formatDate(certificate.expiresDate)}
            </div>
          </div>

          {/* Badge and Actions */}
          <div className="view-certificate__main">
            <div className="certificate-badge">
              <div className="badge-hexagon">
                <div className="badge-content">
                  <div className="badge-title">{t("certificate_title")}</div>
                  <div className="badge-subtitle">
                    {t("certificate_preview_description")}
                  </div>
                  <div className="badge-level">{t("advanced")}</div>
                </div>
              </div>
            </div>

            <div className="certificate-actions">
              <button className="btn-verify" onClick={handleVerify}>
                <Eye size={16} />
                {t("verify")}
              </button>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="view-certificate__details">
            <div className="certificate-description">
              <h3>{t("description")}</h3>
              <p>{t("certificate_description")}</p>
            </div>

            <div className="certificate-tags">
              {certificate.tags.map((tag, index) => (
                <span key={index} className="certificate-tag">
                  {t(`tag_${tag.toLowerCase().replace(/\s+/g, "_")}`)}
                </span>
              ))}
            </div>

            <div className="certificate-criteria">
              <h3>{t("earning_criteria")}</h3>
              <ul>
                {certificate.earningCriteria.map((index) => (
                  <li key={index}>{t(`criteria_${index + 1}`)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Verification Modal */}
        {showVerificationModal && (
          <div className="verification-modal">
            <div
              className="verification-modal__overlay"
              onClick={() => setShowVerificationModal(false)}
            />
            <div className="verification-modal__content">
              <div className="verification-modal__header">
                <h2>{t("verification")}</h2>
                <button
                  className="verification-modal__close"
                  onClick={() => setShowVerificationModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="verification-modal__list">
                <div className="verification-item">
                  <CheckCircle size={20} />
                  <span>
                    {t("issued_on")} {formatDate(certificate.issuedDate)}
                  </span>
                </div>
                <div className="verification-item">
                  <CheckCircle size={20} />
                  <span>
                    {t("issued_by")} {certificate.issuedBy}
                  </span>
                </div>
                <div className="verification-item">
                  <CheckCircle size={20} />
                  <span>
                    {t("issued_using")} {certificate.platform}
                  </span>
                </div>
                <div className="verification-item">
                  <CheckCircle size={20} />
                  <span>
                    {t("issued_to")} {certificate.issuedTo}
                  </span>
                </div>
                <div className="verification-item">
                  <CheckCircle size={20} />
                  <span>
                    {t("accepted_on")} {formatDate(certificate.acceptedDate)}
                  </span>
                </div>
                <div className="verification-item">
                  <CheckCircle size={20} />
                  <span>
                    {t("last_updated")} {formatDate(certificate.lastUpdated)}
                  </span>
                </div>
                <div className="verification-item verification-item--verified">
                  <CheckCircle size={20} />
                  <span>
                    <strong>{t("verified_status")}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCertificatePage;
