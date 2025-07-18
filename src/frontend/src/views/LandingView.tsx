import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewType } from "./index";
import ThreeModelViewer from "../components/ThreeModelViewer";
import { TypingEffect } from "../utils";

interface LandingViewProps {
  onNavigate: (view: ViewType) => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [showButton, setShowButton] = useState(false);

  const handleTypingComplete = () => {
    setShowButton(true);
  };

  return (
    <section className="landing-layout" aria-labelledby="welcome-title">
      <div className="landing-grid">
        {/* Left Section: Welcome Message */}
        <div className="landing-left">
          <h1 id="welcome-title" className="landing-title">
            <TypingEffect
              text={t("welcome_message")}
              speed={50}
              delay={100}
              className="landing-title"
              onComplete={handleTypingComplete}
            />
          </h1>
          {/* Wireframe Get Started Button is directly below welcome_message */}
          <div
            style={{
              opacity: showButton ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
              visibility: showButton ? "visible" : "hidden",
            }}
          >
            <button
              type="button"
              className="btn-wireframe"
              aria-label={t("get_started_button")}
              onClick={() => onNavigate("dashboard")}
            >
              {t("get_started_button")}
            </button>
          </div>
        </div>
        {/* Right Section: Neumorphic Card with Triangle */}
        <div className="landing-right">
          <div
            className="neumorphic-card"
            style={{
              width: "100%",
              height: "400px",
              minHeight: "400px",
              minWidth: "400px",
            }}
          >
            {/* 3D Model Viewer: woman-statue.glb (served from public folder) */}
            <ThreeModelViewer src="/woman-statue.glb" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingView;
