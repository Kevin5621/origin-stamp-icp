import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Download,
  Share2,
  Copy,
  ExternalLink,
  Sparkles,
  FileText,
  Hash,
  Calendar,
  User,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { CertificateService } from "../../services/certificateService";

interface NFTDisplayProps {
  certificateId: string;
  nftData?: {
    nft_id: string;
    token_uri: string;
  };
  className?: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url: string;
  verification_hash: string;
}

export const NFTDisplay: React.FC<NFTDisplayProps> = ({
  certificateId,
  nftData,
  className = "",
}) => {
  const { t } = useTranslation("common");
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (certificateId) {
      loadNFTMetadata();
    }
  }, [certificateId]);

  const loadNFTMetadata = async () => {
    setLoading(true);
    setError(null);

    try {
      const metadataString =
        await CertificateService.getNFTMetadata(certificateId);
      if (metadataString) {
        const parsedMetadata = JSON.parse(metadataString);
        setMetadata(parsedMetadata);
      } else {
        setError("NFT metadata not found");
      }
    } catch (err) {
      console.error("Failed to load NFT metadata:", err);
      setError("Failed to load NFT metadata");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadMetadata = () => {
    if (!metadata) return;

    const dataStr = JSON.stringify(metadata, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nft-metadata-${certificateId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyHash = () => {
    if (metadata?.verification_hash) {
      navigator.clipboard.writeText(metadata.verification_hash);
      setCopiedField("verification_hash");
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share && metadata) {
      navigator.share({
        title: metadata.name,
        text: metadata.description,
        url: metadata.external_url,
      });
    } else if (metadata?.external_url) {
      navigator.clipboard.writeText(metadata.external_url);
      setCopiedField("external_url");
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  if (loading) {
    return (
      <div className={`nft-display nft-display--loading ${className}`}>
        <div className="nft-display__loading">
          <div className="loading-spinner">
            <Sparkles size={20} strokeWidth={1.5} className="loading-icon" />
          </div>
          <span className="loading-text">{t("loading_nft_metadata")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`nft-display nft-display--error ${className}`}>
        <div className="nft-display__error">
          <div className="error-icon">
            <FileText size={24} strokeWidth={1.5} />
          </div>
          <span className="error-message">{error}</span>
          <button
            className="btn btn--secondary btn--small"
            onClick={loadNFTMetadata}
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  if (!metadata) {
    return null;
  }

  return (
    <div className={`nft-display ${className}`}>
      {/* Header Section */}
      <div className="nft-display__header">
        <div className="nft-display__title">
          <div className="title-icon">
            <Sparkles size={16} strokeWidth={1.5} />
          </div>
          <h3>{t("nft_certificate")}</h3>
        </div>

        <div className="nft-display__actions">
          <button
            className="action-btn action-btn--secondary"
            onClick={handleDownloadMetadata}
            title={t("download_metadata")}
          >
            <Download size={14} strokeWidth={1.5} />
            <span className="action-label">{t("download")}</span>
          </button>

          <button
            className="action-btn action-btn--secondary"
            onClick={handleShare}
            title={t("share_nft")}
          >
            <Share2 size={14} strokeWidth={1.5} />
            <span className="action-label">{t("share")}</span>
          </button>

          <button
            className="action-btn action-btn--secondary"
            onClick={handleCopyHash}
            title={t("copy_verification_hash")}
          >
            {copiedField === "verification_hash" ? (
              <Check size={14} strokeWidth={1.5} />
            ) : (
              <Copy size={14} strokeWidth={1.5} />
            )}
            <span className="action-label">
              {copiedField === "verification_hash" ? t("copied") : t("copy")}
            </span>
          </button>

          <a
            href={metadata.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn action-btn--primary"
            title={t("view_on_blockchain")}
          >
            <ExternalLink size={14} strokeWidth={1.5} />
            <span className="action-label">{t("view")}</span>
          </a>
        </div>
      </div>

      {/* Content Section */}
      <div className="nft-display__content">
        {/* NFT Image Section */}
        <div className="nft-display__image-section">
          <div className="nft-image-container">
            <img
              src={metadata.image}
              alt={metadata.name}
              className="nft-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-nft.png";
              }}
            />
          </div>

          <div className="nft-basic-info">
            <h4 className="nft-title">{metadata.name}</h4>
            <p className="nft-description">{metadata.description}</p>
          </div>
        </div>

        {/* NFT Attributes Section */}
        <div className="nft-display__attributes-section">
          <div className="section-header">
            <h5 className="section-title">
              <FileText size={14} strokeWidth={1.5} />
              {t("nft_attributes")}
            </h5>
          </div>

          <div className="nft-attributes-grid">
            {metadata.attributes.map((attr, index) => (
              <div key={index} className="nft-attribute-item">
                <div className="attribute-icon">
                  {getAttributeIcon(attr.trait_type)}
                </div>
                <div className="attribute-content">
                  <span className="attribute-label">
                    {formatAttributeLabel(attr.trait_type)}
                  </span>
                  <span className="attribute-value">
                    {formatAttributeValue(attr.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NFT Details Section */}
        {nftData && (
          <div className="nft-display__details-section">
            <div className="section-header">
              <h5 className="section-title">
                <Hash size={14} strokeWidth={1.5} />
                {t("nft_details")}
              </h5>
            </div>

            <div className="nft-details-grid">
              <div className="detail-item">
                <div className="detail-icon">
                  <Hash size={14} strokeWidth={1.5} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">{t("nft_id")}</span>
                  <span className="detail-value">{nftData.nft_id}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">
                  <ExternalLink size={14} strokeWidth={1.5} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">{t("token_uri")}</span>
                  <a
                    href={nftData.token_uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="token-uri-link"
                  >
                    {nftData.token_uri}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get appropriate icon for attribute type
const getAttributeIcon = (traitType: string) => {
  const type = traitType.toLowerCase();

  if (type.includes("date") || type.includes("time")) {
    return <Calendar size={14} strokeWidth={1.5} />;
  } else if (
    type.includes("user") ||
    type.includes("artist") ||
    type.includes("admin")
  ) {
    return <User size={14} strokeWidth={1.5} />;
  } else if (
    type.includes("image") ||
    type.includes("photo") ||
    type.includes("file")
  ) {
    return <ImageIcon size={14} strokeWidth={1.5} />;
  } else if (type.includes("hash") || type.includes("id")) {
    return <Hash size={14} strokeWidth={1.5} />;
  } else {
    return <FileText size={14} strokeWidth={1.5} />;
  }
};

// Helper function to format attribute labels
const formatAttributeLabel = (label: string): string => {
  return label
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper function to format attribute values
const formatAttributeValue = (value: string | number): string => {
  if (typeof value === "string" && value.startsWith("http")) {
    return value.length > 50 ? value.substring(0, 50) + "..." : value;
  }
  return String(value);
};

export default NFTDisplay;
