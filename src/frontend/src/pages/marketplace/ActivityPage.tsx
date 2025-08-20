import React from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "../../components/layout/AppLayout";

export const ActivityPage: React.FC = () => {
  const { t } = useTranslation("marketplace");

  return (
    <AppLayout variant="marketplace">
      <div className="marketplace-main">
        <div className="marketplace-main__content">
          <div className="marketplace-activity">
            <header className="marketplace-activity__header">
              <h1 className="marketplace-activity__title">
                {t("activity_title", "Marketplace Activity")}
              </h1>
              <p className="marketplace-activity__subtitle">
                {t(
                  "activity_subtitle",
                  "Recent transactions and marketplace events",
                )}
              </p>
            </header>

            <div className="marketplace-activity__content">
              <div className="activity-feed">
                <div className="activity-item">
                  <div className="activity-item__icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
                    </svg>
                  </div>
                  <div className="activity-item__content">
                    <h3 className="activity-item__title">
                      Digital Art Collection Created
                    </h3>
                    <p className="activity-item__description">
                      New collection "Modern Abstracts" added to marketplace
                    </p>
                    <span className="activity-item__time">2 hours ago</span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-item__icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div className="activity-item__content">
                    <h3 className="activity-item__title">
                      Certificate Verified
                    </h3>
                    <p className="activity-item__description">
                      Artwork "Sunset Canvas" certificate has been verified
                    </p>
                    <span className="activity-item__time">5 hours ago</span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-item__icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                    </svg>
                  </div>
                  <div className="activity-item__content">
                    <h3 className="activity-item__title">
                      High Volume Trading
                    </h3>
                    <p className="activity-item__description">
                      Increased activity in "Contemporary Art" category
                    </p>
                    <span className="activity-item__time">1 day ago</span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-item__icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                  </div>
                  <div className="activity-item__content">
                    <h3 className="activity-item__title">New Artist Joined</h3>
                    <p className="activity-item__description">
                      Artist "Marina K." joined the marketplace
                    </p>
                    <span className="activity-item__time">2 days ago</span>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-item__icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div className="activity-item__content">
                    <h3 className="activity-item__title">
                      Featured Collection
                    </h3>
                    <p className="activity-item__description">
                      "Urban Landscapes" has been featured on homepage
                    </p>
                    <span className="activity-item__time">3 days ago</span>
                  </div>
                </div>
              </div>

              <div
                className="marketplace-activity__empty-state"
                style={{ display: "none" }}
              >
                <div className="empty-state">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                  </svg>
                  <h3>{t("activity_empty_title", "No Activity Yet")}</h3>
                  <p>
                    {t(
                      "activity_empty_description",
                      "Marketplace activity will appear here once transactions begin.",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ActivityPage;
