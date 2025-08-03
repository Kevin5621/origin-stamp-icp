import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ThreeModelViewer from "../../components/ThreeModelViewer";
import { useGLTF } from "@react-three/drei";
import { useTheme } from "../../hooks/useTheme";
import { useCursorSpotlight } from "../../hooks/useCursorSpotlight";

/**
 * How It Works Page - Halaman detail cara kerja OriginStamp
 * Tidak memerlukan autentikasi
 */
const HowItWorksPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [show3DModel, setShow3DModel] = useState(false);

  const currentTheme = useTheme();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Initialize cursor spotlight effect
  useCursorSpotlight();

  // Preload 3D model saat komponen mount
  useEffect(() => {
    const preloadModel = async () => {
      try {
        useGLTF.preload("/woman-statue.glb");
      } catch (error) {
        console.warn("Failed to preload 3D model:", error);
      }
    };
    preloadModel();

    // Show 3D model after a short delay
    setTimeout(() => {
      setShow3DModel(true);
    }, 500);
  }, []);

  // Handle scroll events for 3D model animation
  useEffect(() => {
    const handleScroll = () => {
      // Update data-scroll attribute for CSS animations
      const layout = document.querySelector(".how-it-works-layout");
      if (layout) {
        const scrollProgress = Math.min(Math.floor(window.scrollY / 500), 4);
        layout.setAttribute("data-scroll", scrollProgress.toString());
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleBackToLanding = () => {
    navigate("/");
  };

  return (
    <div className="how-it-works-layout">
      {/* 3D Model Background - Fixed Position */}
      <div className="landing-3d-background">
        {show3DModel && (
          <ThreeModelViewer
            src="/woman-statue.glb"
            enableInteraction={false}
            enableRotation={true}
            theme={currentTheme}
          />
        )}
      </div>

      {/* Back Navigation */}
      <nav className="how-it-works-back-nav">
        <div className="how-it-works-back-container">
          <button
            type="button"
            className="how-it-works-back-btn"
            onClick={handleBackToLanding}
            aria-label={t("back_to_home")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>{t("home")}</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
        className="how-it-works-hero"
      >
        <div className="how-it-works-hero-content">
          <div className="how-it-works-hero-badge">
            <span className="how-it-works-hero-badge-text">
              {t("how_it_works")}
            </span>
          </div>
          <h1 className="how-it-works-title">{t("page_title")}</h1>
          <p className="how-it-works-subtitle">{t("page_subtitle")}</p>

          <div className="how-it-works-hero-actions">
            <button
              type="button"
              className="btn-wireframe btn-wireframe--primary"
              onClick={handleGetStarted}
            >
              {t("cta_button")}
            </button>
          </div>
        </div>
      </section>

      {/* Paradigm Shift Section */}
      <section
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
        className="how-it-works-section how-it-works-section--paradigm"
      >
        <div className="how-it-works-container">
          <div className="how-it-works-section-header">
            <div className="how-it-works-section-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
              </svg>
            </div>
            <h2 className="how-it-works-section-title">
              {t("paradigm_shift_title")}
            </h2>
            <p className="how-it-works-section-description">
              {t("paradigm_shift_description")}
            </p>
          </div>
        </div>
      </section>

      {/* Three Phases Section */}
      <section
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        className="how-it-works-section how-it-works-section--phases"
      >
        <div className="how-it-works-container">
          <div className="how-it-works-section-header">
            <div className="how-it-works-section-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 className="how-it-works-section-title">
              {t("three_phases_title")}
            </h2>
          </div>

          <div className="how-it-works-timeline">
            {/* Phase 1 */}
            <div className="how-it-works-timeline-item">
              <div className="how-it-works-timeline-marker">
                <div className="how-it-works-timeline-number">1</div>
                <div className="how-it-works-timeline-line"></div>
              </div>

              <div className="how-it-works-timeline-content">
                <div className="how-it-works-phase-card">
                  <div className="how-it-works-phase-header">
                    <h3 className="how-it-works-phase-title">
                      {t("phase_1_title")}
                    </h3>
                    <p className="how-it-works-phase-subtitle">
                      {t("phase_1_subtitle")}
                    </p>
                  </div>

                  <div className="how-it-works-phase-features">
                    <div className="how-it-works-feature-item">
                      <div className="how-it-works-feature-icon">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                        </svg>
                      </div>
                      <div className="how-it-works-feature-content">
                        <h4 className="how-it-works-feature-title">
                          {t("phase_1_secure_login_title")}
                        </h4>
                        <p className="how-it-works-feature-description">
                          {t("phase_1_secure_login_description")}
                        </p>
                      </div>
                    </div>

                    <div className="how-it-works-feature-item">
                      <div className="how-it-works-feature-icon">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14,2 14,8 20,8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10,9 9,9 8,9" />
                        </svg>
                      </div>
                      <div className="how-it-works-feature-content">
                        <h4 className="how-it-works-feature-title">
                          {t("phase_1_logbook_title")}
                        </h4>
                        <p className="how-it-works-feature-description">
                          {t("phase_1_logbook_description")}
                        </p>
                      </div>
                    </div>

                    <div className="how-it-works-feature-item">
                      <div className="how-it-works-feature-icon">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      </div>
                      <div className="how-it-works-feature-content">
                        <h4 className="how-it-works-feature-title">
                          {t("phase_1_physical_link_title")}
                        </h4>
                        <p className="how-it-works-feature-description">
                          {t("phase_1_physical_link_description")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="how-it-works-timeline-item">
              <div className="how-it-works-timeline-marker">
                <div className="how-it-works-timeline-number">2</div>
                <div className="how-it-works-timeline-line"></div>
              </div>

              <div className="how-it-works-timeline-content">
                <div className="how-it-works-phase-card">
                  <div className="how-it-works-phase-header">
                    <h3 className="how-it-works-phase-title">
                      {t("phase_2_title")}
                    </h3>
                    <p className="how-it-works-phase-subtitle">
                      {t("phase_2_subtitle")}
                    </p>
                  </div>

                  <div className="how-it-works-phase-features">
                    <div className="how-it-works-feature-item">
                      <div className="how-it-works-feature-icon">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                        </svg>
                      </div>
                      <div className="how-it-works-feature-content">
                        <h4 className="how-it-works-feature-title">
                          {t("phase_2_integration_title")}
                        </h4>
                        <p className="how-it-works-feature-description">
                          {t("phase_2_integration_description")}
                        </p>
                      </div>
                    </div>

                    <div className="how-it-works-feature-item">
                      <div className="how-it-works-feature-icon">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14,2 14,8 20,8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10,9 9,9 8,9" />
                        </svg>
                      </div>
                      <div className="how-it-works-feature-content">
                        <h4 className="how-it-works-feature-title">
                          {t("phase_2_metadata_title")}
                        </h4>
                        <p className="how-it-works-feature-description">
                          {t("phase_2_metadata_description")}
                        </p>

                        <div className="how-it-works-examples">
                          <div className="how-it-works-example">
                            <code>{t("phase_2_example_1")}</code>
                          </div>
                          <div className="how-it-works-example">
                            <code>{t("phase_2_example_2")}</code>
                          </div>
                          <div className="how-it-works-example">
                            <code>{t("phase_2_example_3")}</code>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="how-it-works-feature-item">
                      <div className="how-it-works-feature-icon">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      </div>
                      <div className="how-it-works-feature-content">
                        <h4 className="how-it-works-feature-title">
                          {t("phase_2_onchain_title")}
                        </h4>
                        <p className="how-it-works-feature-description">
                          {t("phase_2_onchain_description")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="how-it-works-timeline-item">
              <div className="how-it-works-timeline-marker">
                <div className="how-it-works-timeline-number">3</div>
              </div>

              <div className="how-it-works-timeline-content">
                <div className="how-it-works-phase-card">
                  <div className="how-it-works-phase-header">
                    <h3 className="how-it-works-phase-title">
                      {t("phase_3_title")}
                    </h3>
                    <p className="how-it-works-phase-subtitle">
                      {t("phase_3_subtitle")}
                    </p>
                  </div>

                  <div className="how-it-works-phase-features">
                    <div className="how-it-works-feature-item">
                      <div className="how-it-works-feature-icon">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      </div>
                      <div className="how-it-works-feature-content">
                        <h4 className="how-it-works-feature-title">
                          {t("phase_3_final_hash_title")}
                        </h4>
                        <p className="how-it-works-feature-description">
                          {t("phase_3_final_hash_description")}
                        </p>
                      </div>
                    </div>

                    <div className="how-it-works-feature-item">
                      <div className="how-it-works-feature-icon">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      </div>
                      <div className="how-it-works-feature-content">
                        <h4 className="how-it-works-feature-title">
                          {t("phase_3_minting_title")}
                        </h4>
                        <p className="how-it-works-feature-description">
                          {t("phase_3_minting_description")}
                        </p>
                      </div>
                    </div>

                    <div className="how-it-works-feature-item">
                      <div className="how-it-works-feature-icon">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M15 7h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-3M10 7H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3M10 12h4" />
                        </svg>
                      </div>
                      <div className="how-it-works-feature-content">
                        <h4 className="how-it-works-feature-title">
                          {t("phase_3_nft_key_title")}
                        </h4>
                        <p className="how-it-works-feature-description">
                          {t("phase_3_nft_key_description")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Result Section */}
      <section
        ref={(el) => {
          sectionRefs.current[3] = el;
        }}
        className="how-it-works-section how-it-works-section--result"
      >
        <div className="how-it-works-container">
          <div className="how-it-works-section-header">
            <div className="how-it-works-section-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
              </svg>
            </div>
            <h2 className="how-it-works-section-title">
              {t("final_result_title")}
            </h2>
            <p className="how-it-works-section-description">
              {t("final_result_description")}
            </p>
          </div>

          <div className="how-it-works-result-grid">
            <div className="how-it-works-result-card">
              <div className="how-it-works-result-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 3v18h18" />
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
              </div>
              <h3 className="how-it-works-result-title">
                {t("view_key_stats")}
              </h3>
              <p className="how-it-works-result-description">
                {t("final_result_stat_1")}
              </p>
            </div>

            <div className="how-it-works-result-card">
              <div className="how-it-works-result-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="how-it-works-result-title">
                {t("explore_timeline")}
              </h3>
              <p className="how-it-works-result-description">
                {t("final_result_stat_2")}
              </p>
            </div>

            <div className="how-it-works-result-card">
              <div className="how-it-works-result-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              </div>
              <h3 className="how-it-works-result-title">
                {t("cross_reference")}
              </h3>
              <p className="how-it-works-result-description">
                {t("final_result_stat_3")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={(el) => {
          sectionRefs.current[4] = el;
        }}
        className="how-it-works-section"
      >
        <div className="how-it-works-container">
          <div className="how-it-works-cta">
            <div className="how-it-works-cta-content">
              <h2 className="how-it-works-cta-title">{t("cta_title")}</h2>
              <p className="how-it-works-cta-description">
                {t("start_your_journey")}
              </p>

              <div className="how-it-works-cta-actions">
                <button
                  type="button"
                  className="btn-wireframe btn-wireframe--primary btn-wireframe--large"
                  onClick={handleGetStarted}
                >
                  {t("cta_button")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
