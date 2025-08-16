import React from "react";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

interface HeroBannerProps {
  featuredCollection: {
    id: string;
    name: string;
    creator?: string;
    image: string;
    floorPrice: string;
    currency: string;
    items?: number;
    totalVolume?: string;
    listedPercentage?: string;
    previewImages?: string[];
  };
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredCollection,
}) => {
  const { t } = useTranslation("marketplace");

  return (
    <section className="hero-banner">
      <div className="hero-banner__container">
        {/* Main Banner */}
        <div className="hero-banner__main">
          <div className="hero-banner__image">
            <img src={featuredCollection.image} alt={featuredCollection.name} />

            {/* Collection Info Overlay */}
            <div className="hero-banner__info">
              <div className="collection-header">
                <h2 className="collection-name">
                  {featuredCollection.name}
                  <Check className="verified-icon" size={16} />
                </h2>
                <p className="collection-creator">
                  {t("by")} {featuredCollection.creator || "Unknown"}
                </p>
              </div>

              {/* Collection Stats */}
              <div className="collection-stats">
                <div className="stat-item">
                  <span className="stat-label">{t("floorPrice")}</span>
                  <span className="stat-value">
                    {featuredCollection.floorPrice}{" "}
                    {featuredCollection.currency}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">{t("items")}</span>
                  <span className="stat-value">
                    {featuredCollection.items?.toLocaleString() || "0"}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">{t("totalVolume")}</span>
                  <span className="stat-value">
                    {featuredCollection.totalVolume || "0"}{" "}
                    {featuredCollection.currency}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">{t("listed")}</span>
                  <span className="stat-value">
                    {featuredCollection.listedPercentage || "0%"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Images */}
          <div className="hero-banner__previews">
            {featuredCollection.previewImages?.map((image, index) => (
              <div key={index} className="preview-image">
                <img src={image} alt={`Preview ${index + 1}`} />
              </div>
            )) || null}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="hero-banner__pagination">
          <div className="pagination-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </div>
    </section>
  );
};
