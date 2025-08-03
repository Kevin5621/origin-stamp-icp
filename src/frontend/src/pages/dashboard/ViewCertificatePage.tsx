// src/frontend/src/pages/dashboard/ViewCertificatePage.tsx
import React, { useState, useEffect } from "react";
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
  const navigate = useNavigate();
  const { certificateId } = useParams<{ certificateId: string }>();
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load certificate data (mock data)
  useEffect(() => {
    if (certificateId) {
      // Simulate API call delay
      setTimeout(() => {
        const mockCertificate: CertificateData = {
          id: certificateId,
          title: "Creative Process Mastery",
          subtitle: "Digital Art Documentation",
          level: "ADVANCED",
          issuedTo: "Ananda Kevin Refaldo Sariputra",
          issuedDate: new Date(2024, 7, 12),
          expiresDate: new Date(2027, 7, 12),
          issuedBy: "IC-Vibe Creative Platform",
          platform: "IC-Vibe",
          acceptedDate: new Date(2024, 7, 13),
          lastUpdated: new Date(2024, 7, 13),
          description:
            "This certificate demonstrates mastery in documenting creative processes using digital tools and platforms. The recipient has successfully completed a comprehensive creative session with step-by-step documentation, progress tracking, and final artwork completion.",
          earningCriteria: [
            "Complete a full creative session from concept to final artwork",
            "Document each step of the creative process with photos",
            "Upload and organize progress photos to S3 storage",
            "Generate NFT certificate upon completion",
            "Maintain detailed session logs and descriptions",
          ],
          tags: [
            "creative",
            "digital art",
            "documentation",
            "NFT",
            "blockchain",
          ],
          badgeUrl: "/api/placeholder/200/200",
          status: "verified",
        };
        setCertificate(mockCertificate);
        setIsLoading(false);
      }, 800);
    }
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
          <p>Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="view-certificate">
        <div className="view-certificate__error">
          <h2>Certificate Not Found</h2>
          <p>The certificate you're looking for doesn't exist.</p>
          <button
            className="btn btn--primary"
            onClick={() => navigate("/certificates")}
          >
            Back to Certificates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-certificate">
      <div className="view-certificate__container">
        {/* Header */}
        <div className="view-certificate__header">
          <button
            className="btn btn--secondary"
            onClick={() => navigate("/certificates")}
          >
            <ArrowLeft size={20} />
            Back to Certificates
          </button>
          <div className="view-certificate__actions">
            <button className="btn btn--secondary" onClick={handleShare}>
              <Share2 size={16} />
              Share
            </button>
            <button className="btn btn--secondary" onClick={handleDownload}>
              <Download size={16} />
              Download
            </button>
          </div>
        </div>

        {/* Certificate Content - Bento Layout */}
        <div className="view-certificate__content">
          {/* Certificate Info */}
          <div className="view-certificate__info">
            <div className="certificate-issued-to">
              This certificate was issued to{" "}
              <strong>{certificate.issuedTo}</strong>
            </div>
            <div className="certificate-dates">
              Date issued: {formatDate(certificate.issuedDate)} | Expires:{" "}
              {formatDate(certificate.expiresDate)}
            </div>
          </div>

          {/* Badge and Actions */}
          <div className="view-certificate__main">
            <div className="certificate-badge">
              <div className="badge-hexagon">
                <div className="badge-content">
                  <div className="badge-title">{certificate.title}</div>
                  <div className="badge-subtitle">{certificate.subtitle}</div>
                  <div className="badge-level">{certificate.level}</div>
                </div>
              </div>
            </div>

            <div className="certificate-actions">
              <button className="btn btn--primary" onClick={handleVerify}>
                <Eye size={16} />
                Verify
              </button>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="view-certificate__details">
            <div className="certificate-description">
              <h3>Description</h3>
              <p>{certificate.description}</p>
            </div>

            <div className="certificate-tags">
              {certificate.tags.map((tag, index) => (
                <span key={index} className="certificate-tag">
                  {tag}
                </span>
              ))}
            </div>

            <div className="certificate-criteria">
              <h3>Earning Criteria</h3>
              <ul>
                {certificate.earningCriteria.map((criteria, index) => (
                  <li key={index}>{criteria}</li>
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
                <h2>Verification</h2>
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
                  <span>Issued on {formatDate(certificate.issuedDate)}</span>
                </div>
                <div className="verification-item">
                  <CheckCircle size={20} />
                  <span>Issued by {certificate.issuedBy}</span>
                </div>
                <div className="verification-item">
                  <CheckCircle size={20} />
                  <span>Issued using {certificate.platform}</span>
                </div>
                <div className="verification-item">
                  <CheckCircle size={20} />
                  <span>Issued to {certificate.issuedTo}</span>
                </div>
                <div className="verification-item">
                  <CheckCircle size={20} />
                  <span>
                    Accepted on {formatDate(certificate.acceptedDate)}
                  </span>
                </div>
                <div className="verification-item">
                  <CheckCircle size={20} />
                  <span>
                    Last Updated {formatDate(certificate.lastUpdated)}
                  </span>
                </div>
                <div className="verification-item verification-item--verified">
                  <CheckCircle size={20} />
                  <span>
                    <strong>VERIFIED</strong>
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
