import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import LandingPage from "../pages/landing/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import SessionPage from "../pages/dashboard/SessionPage";
import FinalizationPage from "../pages/dashboard/FinalizationPage";
import VerificationPage from "../pages/dashboard/VerificationPage";
import AdminPage from "../pages/admin/AdminPage";
import SettingsPage from "../pages/SettingsPage";

/**
 * App Routes - Route manager utama
 * Mengelola semua rute aplikasi dengan proteksi autentikasi
 */
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
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
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
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

      {/* Fallback - Redirect ke landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
