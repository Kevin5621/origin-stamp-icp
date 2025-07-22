import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  Loader,
  ErrorDisplay,
  ThemeToggle,
  Login,
  FloatingHeader,
} from "./components";
import LanguageToggle from "./components/ui/LanguageToggle";
import { NotificationButton } from "./components/common/NotificationButton";
import { AppNavigation } from "./components/navigation/AppNavigation";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
// Import pages dari sistem modular baru
import LandingPage from "./pages/landing/LandingPage";
import HowItWorksPage from "./pages/how-it-works/HowItWorksPage";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SessionPage from "./pages/dashboard/SessionPage";
import FinalizationPage from "./pages/dashboard/FinalizationPage";
import VerificationPage from "./pages/dashboard/VerificationPage";
import CertificatesPage from "./pages/dashboard/CertificatesPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import AnalyticsDetailPage from "./pages/dashboard/AnalyticsDetailPage";
import CertificateDetailPage from "./pages/dashboard/CertificateDetailPage";
import SettingsPage from "./pages/SettingsPage";

// Component untuk menentukan apakah navbar harus ditampilkan
function NavigationWrapper() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isHowItWorksPage = location.pathname === "/how-it-works";

  // Hanya tampilkan navbar jika bukan landing page, login page, atau how it works page
  if (isLandingPage || isLoginPage || isHowItWorksPage) {
    return null;
  }

  return <AppNavigation />;
}

// Component untuk menentukan class pada main content
function MainContentWrapper() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isHowItWorksPage = location.pathname === "/how-it-works";

  const mainClass =
    isLandingPage || isLoginPage || isHowItWorksPage
      ? "main-content main-content--overlay"
      : "main-content";

  return (
    <main className={mainClass}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
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
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}

function App() {
  const [loading] = useState(false);
  const [error] = useState<string | undefined>();

  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <FloatingHeader className="app-floating-header">
            <NotificationButton />
            <LanguageToggle />
            <ThemeToggle />
            <Login />
          </FloatingHeader>

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
