import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader, ErrorDisplay, ThemeToggle, Login } from "./components";
import LanguageToggle from "./components/ui/LanguageToggle";
import {
  LandingView,
  DashboardView,
  SessionView,
  FinalizationView,
  VerificationView,
} from "./views";
import LoginView from "./views/LoginView";
import { AppNavigation } from "./components/navigation/AppNavigation";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  const [loading] = useState(false);
  const [error] = useState<string | undefined>();

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="controls-container">
          <Login />
          <ThemeToggle />
          <LanguageToggle />
        </div>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingView />} />
            <Route path="/login" element={<LoginView />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/session"
              element={
                <ProtectedRoute>
                  <SessionView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/finalization"
              element={
                <ProtectedRoute>
                  <FinalizationView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verification"
              element={
                <ProtectedRoute>
                  <VerificationView />
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
