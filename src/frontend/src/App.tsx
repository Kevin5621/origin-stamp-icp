import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  Loader,
  ErrorDisplay,
  ThemeToggle,
  Login,
  FloatingHeader,
} from "./components";
import LanguageToggle from "./components/ui/LanguageToggle";
import { AppNavigation } from "./components/navigation/AppNavigation";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
// Import pages dari sistem modular baru
import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SessionPage from "./pages/dashboard/SessionPage";
import FinalizationPage from "./pages/dashboard/FinalizationPage";
import VerificationPage from "./pages/dashboard/VerificationPage";
import CertificatesPage from "./pages/dashboard/CertificatesPage";

function App() {
  const [loading] = useState(false);
  const [error] = useState<string | undefined>();

  return (
    <AuthProvider>
      <BrowserRouter>
        <FloatingHeader className="app-floating-header">
          <Login />
          <ThemeToggle />
          <LanguageToggle />
        </FloatingHeader>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Navigation untuk halaman yang memerlukan autentikasi */}
        <AppNavigation />

        {loading && !error && <Loader />}
        {!!error && <ErrorDisplay message={error} />}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
