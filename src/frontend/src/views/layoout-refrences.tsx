import { useEffect, useRef } from "react";

interface LayoutRefrencesProps {
  onNavigate: (view: string) => void;
}

const LayoutRefrences: React.FC<LayoutRefrencesProps> = ({ onNavigate }) => {
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

    // Load Google Fonts
    if (!document.querySelector('link[href*="Raleway"]')) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = "https://fonts.googleapis.com";
      document.head.appendChild(link);

      const link2 = document.createElement("link");
      link2.rel = "preconnect";
      link2.href = "https://fonts.gstatic.com";
      link2.crossOrigin = "anonymous";
      document.head.appendChild(link2);

      const link3 = document.createElement("link");
      link3.rel = "stylesheet";
      link3.href =
        "https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap";
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
              Prove
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Authenticity
              </span>
            </h1>
            <p className="text-xl text-gray-600 lg:text-2xl">
              Secure your original work on the blockchain with immutable proof
              of creation
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <button
              onClick={() => onNavigate("dashboard")}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              Get Started
            </button>
            <button
              onClick={() => onNavigate("verification")}
              className="rounded-2xl border-2 border-gray-300 px-8 py-4 text-lg font-semibold text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-50"
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
              <div
                ref={modelViewerRef as any}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  fontSize: '18px',
                  fontWeight: '500'
                }}
              >
                🎨 3D Model View
              </div>
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

      {/* Animated Background Grid */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 transform"
          viewBox="0 0 100 100"
          fill="none"
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
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-gray-200"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
};

export default LayoutRefrences;
