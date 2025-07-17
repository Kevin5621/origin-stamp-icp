import { useTranslation } from "react-i18next";
import { ViewType } from "./index";
import ThreeModelViewer from "../components/ThreeModelViewer";

interface LandingViewProps {
  onNavigate: (view: ViewType) => void;
}


const LandingView: React.FC<LandingViewProps> = () => {
  const { t } = useTranslation();

  return (
    <section className="landing-layout" aria-labelledby="welcome-title">
      <div className="landing-grid">
        {/* Left Section: Welcome Message */}
        <div className="landing-left">
          <h1 id="welcome-title" className="landing-title">
            {t("welcome_message")}
          </h1>
        </div>
        {/* Right Section: Neumorphic Card with Triangle */}
        <div className="landing-right">
          <div className="neumorphic-card" style={{ width: "100%", height: "400px", minHeight: "400px", minWidth: "400px" }}>
            {/* 3D Model Viewer: woman-statue.glb (served from public folder) */}
            <ThreeModelViewer src="/woman-statue.glb" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingView;
