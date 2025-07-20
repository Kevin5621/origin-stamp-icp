import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ThreeModelViewer from "../../components/ThreeModelViewer";
import DollyZoomContainer from "../../components/DollyZoomContainer";
import { TypingEffect } from "../../utils";
import { useGLTF } from "@react-three/drei";
import { useTheme } from "../../hooks/useTheme";

/**
 * Landing Page - Halaman utama aplikasi
 * Tidak memerlukan autentikasi
 */
const LandingPage: React.FC = () => {
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

  const handleAnimationComplete = () => {
    console.log("Dolly Zoom animation completed");
    // Optional: Navigate to next page or show additional content
  };

  return (
    <DollyZoomContainer
      theme={currentTheme}
      onAnimationComplete={handleAnimationComplete}
      leftSection={
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
              style={{
                position: "relative",
                zIndex: 100,
                pointerEvents: "auto",
              }}
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
      }
      rightSection={
        <div className="landing-right">
          {/* 3D Model Viewer positioned on right side */}
          {show3DModel && (
            <ThreeModelViewer
              src="/woman-statue.glb"
              enableInteraction={false}
              enableRotation={true}
              theme={currentTheme}
            />
          )}
        </div>
      }
    />
  );
};

export default LandingPage;
