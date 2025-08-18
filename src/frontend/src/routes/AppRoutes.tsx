import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AppLayout } from "../components";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import LandingPage from "../pages/landing/LandingPage";
import HowItWorksPage from "../pages/how-it-works/HowItWorksPage";
import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import SessionPage from "../pages/dashboard/SessionPage";
import SessionRecordPage from "../pages/dashboard/SessionRecordPage";
import CreateSessionPage from "../pages/dashboard/CreateSessionPage";
import ViewCertificatePage from "../pages/dashboard/ViewCertificatePage";
import FinalizationPage from "../pages/dashboard/FinalizationPage";
import VerificationPage from "../pages/dashboard/VerificationPage";
import CertificatesPage from "../pages/dashboard/CertificatesPage";
import AnalyticsPage from "../pages/dashboard/AnalyticsPage";
import AnalyticsDetailPage from "../pages/dashboard/AnalyticsDetailPage";
import CertificateDetailPage from "../pages/dashboard/CertificateDetailPage";
import KaryaDetailPage from "../pages/dashboard/KaryaDetailPage";
import SettingsPage from "../pages/SettingsPage";
import { ErrorPage, NotFoundPage } from "../pages/error";
import {
  MarketplaceHomePage,
  CollectionDetailPage,
  CollectionsPage,
} from "../pages/marketplace";

// Component untuk menentukan layout berdasarkan halaman
function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isHowItWorksPage = location.pathname === "/how-it-works";
  const isMarketplacePage = location.pathname.startsWith("/marketplace");
  const isErrorPage =
    location.pathname === "/error" || location.pathname === "*";

  // Halaman yang tidak memerlukan layout khusus
  if (
    isLandingPage ||
    isLoginPage ||
    isHowItWorksPage ||
    isErrorPage ||
    isMarketplacePage
  ) {
    return (
      <main className="main-content main-content--overlay">{children}</main>
    );
  }

  // Halaman dengan AppLayout (dashboard dan halaman protected)
  return <AppLayout variant="dashboard">{children}</AppLayout>;
}

/**
 * App Routes - Route manager utama
 * Mengelola semua rute aplikasi dengan proteksi autentikasi
 */
export const AppRoutes: React.FC = () => {
  return (
    <LayoutWrapper>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
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

        {/* Marketplace Routes */}
        <Route path="/marketplace" element={<MarketplaceHomePage />} />
        <Route path="/marketplace/collections" element={<CollectionsPage />} />
        <Route
          path="/marketplace/collection/:collectionId"
          element={<CollectionDetailPage />}
        />

        {/* Error Routes */}
        <Route path="/error" element={<ErrorPage />} />

        {/* Fallback - 404 Page untuk rute yang tidak ditemukan */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </LayoutWrapper>
  );
};
