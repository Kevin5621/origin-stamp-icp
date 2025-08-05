import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Loader, ErrorDisplay, FloatingHeader, AppLayout } from "./components";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthRedirect from "./components/auth/AuthRedirect";
import { PhysicalArtService } from "./services/physicalArtService";
// Import pages dari sistem modular baru
import LandingPage from "./pages/landing/LandingPage";
import HowItWorksPage from "./pages/how-it-works/HowItWorksPage";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SessionPage from "./pages/dashboard/SessionPage";
import SessionRecordPage from "./pages/dashboard/SessionRecordPage";
import CreateSessionPage from "./pages/dashboard/CreateSessionPage";
import ViewCertificatePage from "./pages/dashboard/ViewCertificatePage";
import FinalizationPage from "./pages/dashboard/FinalizationPage";
import VerificationPage from "./pages/dashboard/VerificationPage";
import CertificatesPage from "./pages/dashboard/CertificatesPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import AnalyticsDetailPage from "./pages/dashboard/AnalyticsDetailPage";
import CertificateDetailPage from "./pages/dashboard/CertificateDetailPage";
import KaryaDetailPage from "./pages/dashboard/KaryaDetailPage";
import SettingsPage from "./pages/SettingsPage";
// Import marketplace pages
import { MarketplaceHomePage, CollectionDetailPage } from "./pages/marketplace";

// Component untuk menentukan apakah navbar harus ditampilkan
function NavigationWrapper() {
  // Navigation sudah dihapus - tidak ditampilkan lagi
  return null;
}

// Component untuk menentukan layout berdasarkan halaman
function MainContentWrapper() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isHowItWorksPage = location.pathname === "/how-it-works";
  const isMarketplacePage = location.pathname.startsWith("/marketplace");

  // Halaman yang tidak memerlukan sidebar
  if (isLandingPage || isLoginPage || isHowItWorksPage) {
    return (
      <main className="main-content main-content--overlay">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    );
  }

  // Halaman marketplace tanpa AppLayout (sudah punya sidebar sendiri)
  if (isMarketplacePage) {
    return (
      <main className="main-content">
        <Routes>
          <Route path="/marketplace" element={<MarketplaceHomePage />} />
          <Route
            path="/marketplace/collection/:collectionId"
            element={<CollectionDetailPage />}
          />
        </Routes>
      </main>
    );
  }

  // Halaman dengan sidebar
  return (
    <AppLayout variant="dashboard">
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-session"
          element={
            <ProtectedRoute>
              <CreateSessionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/session"
          element={
            <ProtectedRoute>
              <SessionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions/:sessionId"
          element={
            <ProtectedRoute>
              <SessionRecordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certificate/:certificateId"
          element={
            <ProtectedRoute>
              <ViewCertificatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/finalization"
          element={
            <ProtectedRoute>
              <FinalizationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/verification"
          element={
            <ProtectedRoute>
              <VerificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certificates"
          element={
            <ProtectedRoute>
              <CertificatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/:karyaId"
          element={
            <ProtectedRoute>
              <AnalyticsDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certificate/:karyaId"
          element={
            <ProtectedRoute>
              <CertificateDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/karya/:karyaId"
          element={
            <ProtectedRoute>
              <KaryaDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        {/* Fallback route - harus di akhir */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

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
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          {/* Global authentication redirect handler */}
          <AuthRedirect />
          
          <FloatingHeader className="app-floating-header" />

          <MainContentWrapper />

          {/* Navigation untuk halaman yang memerlukan autentikasi */}
          <NavigationWrapper />

          {loading && !error && <Loader />}
          {!!error && <ErrorDisplay message={error} />}

          {/* Portal target untuk modal */}
          <div id="modal-root"></div>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
