import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";

interface LayoutRefrencesProps {
  onNavigate: (view: string) => void;
}

const LayoutRefrences: React.FC<LayoutRefrencesProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const modelViewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Load model-viewer script if not already loaded
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement("script");
      script.type = "module";
      script.src =
        "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
      document.head.appendChild(script);
    }

    // Add Google Fonts
    if (!document.querySelector('link[href*="Raleway"]')) {
      const link = document.createElement("link");
      link.href =
        "https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Left Side - Text Content */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <h1 className="text-6xl font-light tracking-tight text-gray-900 lg:text-7xl">
              Origin
            </h1>
            <h2 className="text-6xl font-semibold tracking-tight text-gray-900 lg:text-7xl">
              Stamp
            </h2>
          </div>

          <p className="mx-auto max-w-xl text-xl leading-relaxed font-light text-gray-600 lg:mx-0 lg:text-2xl">
            Authentic verification through blockchain technology
          </p>

          <div className="space-y-4">
            <button
              onClick={() => onNavigate("dashboard")}
              className="group relative transform rounded-full bg-gray-900 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800 hover:shadow-lg"
            >
              <span className="flex items-center gap-3">
                Get Started
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>

            <button
              onClick={() => onNavigate("verification")}
              className="mx-auto block text-lg font-medium text-gray-600 transition-colors duration-300 hover:text-gray-900 lg:mx-0"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Right Side - 3D Model */}
        <div className="flex items-center justify-center">
          <div className="relative">
            {/* 3D Model Container */}
            <div className="h-96 w-96 overflow-hidden rounded-3xl bg-white shadow-xl lg:h-[500px] lg:w-[500px]">
              <model-viewer
                ref={modelViewerRef}
                src="a/home/kevin/Documents/IC-Vibe-Coding-Template-Rust/src/frontend/assets/3d/woman-statue.glb"
                alt="3D Woman Statue"
                auto-rotate
                camera-controls
                environment-image="neutral"
                shadow-intensity="1"
                className="h-full w-full"
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "transparent",
                }}
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-20 blur-xl"></div>
            <div className="absolute -right-4 -bottom-4 h-32 w-32 rounded-full bg-gradient-to-br from-pink-400 to-orange-500 opacity-20 blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Floating Features */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform">
        <div className="flex items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
            <span>Blockchain Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
            <span>Instant Proof</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-purple-500"></div>
            <span>Secure</span>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute top-0 left-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap");

        * {
          font-family: "Raleway", sans-serif;
        }

        model-viewer {
          --poster-color: transparent;
          --progress-bar-color: #4f46e5;
          --progress-bar-height: 2px;
        }

        model-viewer::part(default-progress-bar) {
          display: none;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LayoutRefrences;
