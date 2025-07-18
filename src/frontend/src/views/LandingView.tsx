import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ThreeModelViewer from "../components/ThreeModelViewer";
import { TypingEffect } from "../utils";
import { useGLTF } from "@react-three/drei";
import { useTheme } from "../hooks/useTheme";

const LandingView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showButton, setShowButton] = useState(false);
  const [showShadow, setShowShadow] = useState(false);
  const [show3DModel, setShow3DModel] = useState(false);
  const currentTheme = useTheme();

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
      setShowShadow(true);
    }, 800);
  };

  useEffect(() => {
    // Mulai render 3D model setelah shadow animation selesai
    if (showShadow) {
      const timer = setTimeout(() => {
        setShow3DModel(true);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [showShadow]);

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
              onClick={() => {
                if (isAuthenticated) {
                  navigate("/dashboard");
                } else {
                  navigate("/login");
                }
              }}
            >
              {t("get_started_button")}
            </button>
          </div>
        </div>
        {/* Right Section: Neumorphic Card with Triangle */}
        <div className="landing-right">
          <div
            className={`neumorphic-card ${showShadow ? "neumorphic-card--animated" : "neumorphic-card--initial"}`}
            style={{
              width: "100%",
              height: "400px",
              minHeight: "400px",
              minWidth: "400px",
              transition: "all 1.2s cubic-bezier(0.2, 0, 0.2, 1)",
            }}
          >
            {/* 3D Model Viewer: woman-statue.glb (served from public folder) */}
            {show3DModel && (
              <ThreeModelViewer
                src="/woman-statue.glb"
                enableInteraction={false}
                theme={currentTheme}
              />
            )}

            {/* 
            FASE KEDUA - GSAP Scroll Animation:
            Ganti komponen di atas dengan komponen GSAP untuk animasi scroll
            
            {show3DModel && (
              <ThreeModelViewerWithGSAP 
                src="/woman-statue.glb" 
                scrollContainer=".landing-layout"
                theme={currentTheme}
              />
            )}
            */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingView;
