import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ThreeModelViewer from "../../components/ThreeModelViewer";
import { TypingEffect } from "../../utils";
import { useGLTF } from "@react-three/drei";
import { useTheme } from "../../hooks/useTheme";
import { useLandingLenis, scrollToElement } from "../../hooks/useLenis";
import { useCursorSpotlight } from "../../hooks/useCursorSpotlight";

/**
 * Landing Page - Halaman utama aplikasi
 * Tidak memerlukan autentikasi
 */
const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showButton, setShowButton] = useState(false);
  const [show3DModel, setShow3DModel] = useState(false);
  const currentTheme = useTheme();
  const lenis = useLandingLenis();

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
  }, []);

  const handleTypingComplete = () => {
    setShowButton(true);
    setTimeout(() => {
      setShow3DModel(true);
    }, 800);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleLearnMore = () => {
    navigate("/how-it-works");
  };

  return (
    <div className="landing-layout">
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

      {/* Hero Section */}
      <section id="hero" className="landing-hero">
        <div className="landing-hero-content">
          <h1 id="welcome-title" className="landing-title">
            <TypingEffect
              text={t("welcome_message")}
              speed={50}
              delay={100}
              className="landing-title"
              onComplete={handleTypingComplete}
            />
          </h1>

          <p className="landing-subtitle">{t("hero_subtitle")}</p>

          {/* Hero Buttons */}
          <div className="landing-hero-buttons">
            <button
              type="button"
              className="btn-wireframe"
              aria-label={t("get_started_button")}
              style={{
                opacity: showButton ? 1 : 0,
                transition: "opacity 0.5s ease-in-out",
                visibility: showButton ? "visible" : "hidden",
              }}
              onClick={handleGetStarted}
            >
              {t("get_started_button")}
            </button>

            <button
              type="button"
              className="btn-wireframe"
              aria-label={t("learn_how_button")}
              style={{
                opacity: showButton ? 1 : 0,
                transition: "opacity 0.5s ease-in-out",
                visibility: showButton ? "visible" : "hidden",
              }}
              onClick={handleLearnMore}
            >
              {t("learn_how_button")}
            </button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section
        id="problem"
        className="landing-section landing-section--problem"
      >
        <div className="landing-container">
          <h2 className="landing-section-title">{t("problem_title")}</h2>
          <p className="landing-section-description">
            {t("problem_description")}
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section
        id="solution"
        className="landing-section landing-section--solution"
      >
        <div className="landing-container">
          <h2 className="landing-section-title">{t("solution_title")}</h2>
          <p className="landing-section-description">
            {t("solution_description")}
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="howitworks"
        className="landing-section landing-section--how-it-works"
      >
        <div className="landing-container">
          <h2 className="landing-section-title">{t("how_it_works_title")}</h2>

          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-content">
                <div className="landing-step-number">1</div>
                <h3 className="landing-step-title">{t("step_1_title")}</h3>
                <p className="landing-step-description">
                  {t("step_1_description")}
                </p>
              </div>
            </div>

            <div className="landing-step">
              <div className="landing-step-content">
                <div className="landing-step-number">2</div>
                <h3 className="landing-step-title">{t("step_2_title")}</h3>
                <p className="landing-step-description">
                  {t("step_2_description")}
                </p>
              </div>
            </div>

            <div className="landing-step">
              <div className="landing-step-content">
                <div className="landing-step-number">3</div>
                <h3 className="landing-step-title">{t("step_3_title")}</h3>
                <p className="landing-step-description">
                  {t("step_3_description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why OriginStamp Section */}
      <section
        id="why-originstamp"
        className="landing-section landing-section--why-originstamp"
      >
        <div className="landing-container">
          <h2 className="landing-section-title">
            {t("why_originstamp_title")}
          </h2>

          <div className="landing-features">
            <div className="landing-feature">
              <div className="landing-feature-content">
                <h3 className="landing-feature-title">
                  {t("feature_1_title")}
                </h3>
                <p className="landing-feature-description">
                  {t("feature_1_description")}
                </p>
              </div>
            </div>

            <div className="landing-feature">
              <div className="landing-feature-content">
                <h3 className="landing-feature-title">
                  {t("feature_2_title")}
                </h3>
                <p className="landing-feature-description">
                  {t("feature_2_description")}
                </p>
              </div>
            </div>

            <div className="landing-feature">
              <div className="landing-feature-content">
                <h3 className="landing-feature-title">
                  {t("feature_3_title")}
                </h3>
                <p className="landing-feature-description">
                  {t("feature_3_description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section
        id="final-cta"
        className="landing-section landing-section--final-cta"
      >
        <div className="landing-container">
          <h2 className="landing-section-title">{t("final_cta_title")}</h2>
          <p className="landing-section-description">
            {t("final_cta_description")}
          </p>

          <div style={{ marginTop: "2rem" }}>
            <button
              type="button"
              className="btn-wireframe"
              aria-label={t("start_verification_button")}
              onClick={handleGetStarted}
            >
              {t("start_verification_button")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
