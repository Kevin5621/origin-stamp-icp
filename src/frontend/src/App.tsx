import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Loader, ErrorDisplay } from "./components";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AuthRedirect from "./components/auth/AuthRedirect";
import { AppErrorBoundary } from "./components/error";
import { PhysicalArtService } from "./services/physicalArtService";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  const [loading] = useState(false);
  const [error] = useState<string | undefined>();

  // Initialize S3 configuration from environment variables
  useEffect(() => {
    const initializeS3 = async () => {
      try {
        await PhysicalArtService.initializeS3FromEnv();
      } catch (error) {
        console.error("Failed to initialize S3:", error);
      }
    };

    initializeS3();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppErrorBoundary>
              {/* Global authentication redirect handler */}
              <AuthRedirect />

              {/* Main routing */}
              <AppRoutes />

              {loading && !error && <Loader />}
              {!!error && <ErrorDisplay message={error} />}

              {/* Portal target untuk modal */}
              <div id="modal-root"></div>
            </AppErrorBoundary>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
