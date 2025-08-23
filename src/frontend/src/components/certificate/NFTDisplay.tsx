import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Download, Share2, Copy, ExternalLink, Sparkles } from "lucide-react";
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
    }
  };

  if (loading) {
    return (
      <div className={`nft-display nft-display--loading ${className}`}>
        <div className="nft-display__loading">
          <Sparkles size={24} className="loading-icon" />
          <span>{t("loading_nft_metadata")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`nft-display nft-display--error ${className}`}>
        <div className="nft-display__error">
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
      <div className="nft-display__header">
        <div className="nft-display__title">
          <Sparkles size={20} />
          <h3>{t("nft_certificate")}</h3>
        </div>
        <div className="nft-display__actions">
          <button
            className="btn btn--icon btn--secondary"
            onClick={handleDownloadMetadata}
            title={t("download_metadata")}
          >
            <Download size={16} />
          </button>
          <button
            className="btn btn--icon btn--secondary"
            onClick={handleShare}
            title={t("share_nft")}
          >
            <Share2 size={16} />
          </button>
          <button
            className="btn btn--icon btn--secondary"
            onClick={handleCopyHash}
            title={t("copy_verification_hash")}
          >
            <Copy size={16} />
          </button>
          <a
            href={metadata.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--icon btn--primary"
            title={t("view_on_blockchain")}
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <div className="nft-display__content">
        <div className="nft-display__image">
          <img
            src={metadata.image}
            alt={metadata.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-nft.png";
            }}
          />
        </div>

        <div className="nft-display__info">
          <div className="nft-info__section">
            <h4>{metadata.name}</h4>
            <p className="nft-description">{metadata.description}</p>
          </div>

          <div className="nft-info__section">
            <h5>{t("nft_attributes")}</h5>
            <div className="nft-attributes">
              {metadata.attributes.map((attr, index) => (
                <div key={index} className="nft-attribute">
                  <span className="attribute-label">{attr.trait_type}:</span>
                  <span className="attribute-value">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>

          {nftData && (
            <div className="nft-info__section">
              <h5>{t("nft_details")}</h5>
              <div className="nft-details">
                <div className="detail-item">
                  <span className="detail-label">{t("nft_id")}:</span>
                  <span className="detail-value">{nftData.nft_id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t("token_uri")}:</span>
                  <span className="detail-value">
                    <a
                      href={nftData.token_uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="token-uri-link"
                    >
                      {nftData.token_uri}
                    </a>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTDisplay;
