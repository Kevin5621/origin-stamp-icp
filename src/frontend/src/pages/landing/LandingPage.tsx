import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ThreeModelViewer from "../../components/ThreeModelViewer";
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
      setShow3DModel(true);
    }, 800);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "var(--color-surface)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* 3D Model di tengah */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        {show3DModel && (
          <ThreeModelViewer
            src="/woman-statue.glb"
            enableInteraction={false}
            enableRotation={true}
            theme={currentTheme}
          />
        )}
      </div>

      {/* Content overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          color: "var(--color-text-primary)",
          maxWidth: "600px",
          padding: "2rem",
        }}
      >
        <h1 id="welcome-title" className="landing-title">
          <TypingEffect
            text={t("welcome_message")}
            speed={50}
            delay={100}
            className="landing-title"
            onComplete={handleTypingComplete}
          />
        </h1>
        
        {/* Wireframe Get Started Button */}
        <div
          style={{
            opacity: showButton ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            visibility: showButton ? "visible" : "hidden",
            marginTop: "2rem",
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
    </div>
  );
};

export default LandingPage;
