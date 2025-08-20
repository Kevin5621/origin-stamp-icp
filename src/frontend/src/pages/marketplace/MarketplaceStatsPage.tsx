import React from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "../../components/layout/AppLayout";

export const MarketplaceStatsPage: React.FC = () => {
  const { t } = useTranslation("marketplace");

  return (
    <AppLayout variant="marketplace">
      <div className="marketplace-stats">
        <div className="marketplace-stats__header">
          <h1 className="marketplace-stats__title">
            {t("stats.title", "Marketplace Statistics")}
          </h1>
          <p className="marketplace-stats__subtitle">
            {t("stats.subtitle", "Track marketplace performance and trends")}
          </p>
        </div>

        <div className="marketplace-stats__content">
          <div className="marketplace-stats__grid">
            {/* Overview Cards */}
            <div className="marketplace-stats__card">
              <div className="marketplace-stats__card-header">
                <h3 className="marketplace-stats__card-title">
                  {t("stats.total_volume", "Total Volume")}
                </h3>
              </div>
              <div className="marketplace-stats__card-content">
                <div className="marketplace-stats__metric">
                  <span className="marketplace-stats__metric-value">
                    1,234.56
                  </span>
                  <span className="marketplace-stats__metric-unit">ICP</span>
                </div>
                <div className="marketplace-stats__metric-change">
                  <span className="marketplace-stats__metric-change--positive">
                    +12.3%
                  </span>
                  <span className="marketplace-stats__metric-period">
                    {t("stats.this_month", "this month")}
                  </span>
                </div>
              </div>
            </div>

            <div className="marketplace-stats__card">
              <div className="marketplace-stats__card-header">
                <h3 className="marketplace-stats__card-title">
                  {t("stats.total_sales", "Total Sales")}
                </h3>
              </div>
              <div className="marketplace-stats__card-content">
                <div className="marketplace-stats__metric">
                  <span className="marketplace-stats__metric-value">892</span>
                  <span className="marketplace-stats__metric-unit">Items</span>
                </div>
                <div className="marketplace-stats__metric-change">
                  <span className="marketplace-stats__metric-change--positive">
                    +8.7%
                  </span>
                  <span className="marketplace-stats__metric-period">
                    {t("stats.this_month", "this month")}
                  </span>
                </div>
              </div>
            </div>

            <div className="marketplace-stats__card">
              <div className="marketplace-stats__card-header">
                <h3 className="marketplace-stats__card-title">
                  {t("stats.active_users", "Active Users")}
                </h3>
              </div>
              <div className="marketplace-stats__card-content">
                <div className="marketplace-stats__metric">
                  <span className="marketplace-stats__metric-value">2,456</span>
                  <span className="marketplace-stats__metric-unit">Users</span>
                </div>
                <div className="marketplace-stats__metric-change">
                  <span className="marketplace-stats__metric-change--positive">
                    +15.2%
                  </span>
                  <span className="marketplace-stats__metric-period">
                    {t("stats.this_month", "this month")}
                  </span>
                </div>
              </div>
            </div>

            <div className="marketplace-stats__card">
              <div className="marketplace-stats__card-header">
                <h3 className="marketplace-stats__card-title">
                  {t("stats.average_price", "Average Price")}
                </h3>
              </div>
              <div className="marketplace-stats__card-content">
                <div className="marketplace-stats__metric">
                  <span className="marketplace-stats__metric-value">1.38</span>
                  <span className="marketplace-stats__metric-unit">ICP</span>
                </div>
                <div className="marketplace-stats__metric-change">
                  <span className="marketplace-stats__metric-change--negative">
                    -3.1%
                  </span>
                  <span className="marketplace-stats__metric-period">
                    {t("stats.this_month", "this month")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Statistics Sections */}
          <div className="marketplace-stats__sections">
            <div className="marketplace-stats__section">
              <h2 className="marketplace-stats__section-title">
                {t("stats.top_collections", "Top Collections")}
              </h2>
              <div className="marketplace-stats__list">
                <div className="marketplace-stats__list-item">
                  <span className="marketplace-stats__list-rank">1</span>
                  <span className="marketplace-stats__list-name">
                    Digital Artworks
                  </span>
                  <span className="marketplace-stats__list-value">
                    456.78 ICP
                  </span>
                </div>
                <div className="marketplace-stats__list-item">
                  <span className="marketplace-stats__list-rank">2</span>
                  <span className="marketplace-stats__list-name">
                    Abstract Paintings
                  </span>
                  <span className="marketplace-stats__list-value">
                    234.56 ICP
                  </span>
                </div>
                <div className="marketplace-stats__list-item">
                  <span className="marketplace-stats__list-rank">3</span>
                  <span className="marketplace-stats__list-name">
                    Photography
                  </span>
                  <span className="marketplace-stats__list-value">
                    123.45 ICP
                  </span>
                </div>
              </div>
            </div>

            <div className="marketplace-stats__section">
              <h2 className="marketplace-stats__section-title">
                {t("stats.recent_activity", "Recent Activity")}
              </h2>
              <div className="marketplace-stats__activity">
                <div className="marketplace-stats__activity-item">
                  <span className="marketplace-stats__activity-time">
                    2 mins ago
                  </span>
                  <span className="marketplace-stats__activity-text">
                    New artwork listed: "Sunset Dreams"
                  </span>
                </div>
                <div className="marketplace-stats__activity-item">
                  <span className="marketplace-stats__activity-time">
                    5 mins ago
                  </span>
                  <span className="marketplace-stats__activity-text">
                    Sale completed: "Ocean Waves" for 2.5 ICP
                  </span>
                </div>
                <div className="marketplace-stats__activity-item">
                  <span className="marketplace-stats__activity-time">
                    12 mins ago
                  </span>
                  <span className="marketplace-stats__activity-text">
                    New user joined the marketplace
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MarketplaceStatsPage;
