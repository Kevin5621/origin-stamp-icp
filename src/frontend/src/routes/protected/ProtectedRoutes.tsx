import React from "react";
import { Route } from "react-router-dom";
import { RouteConfig } from "../../types/routes";
import DashboardPage from "../../pages/dashboard/DashboardPage";
import SessionPage from "../../pages/dashboard/SessionPage";
import SessionRecordPage from "../../pages/dashboard/SessionRecordPage";
import FinalizationPage from "../../pages/dashboard/FinalizationPage";
import VerificationPage from "../../pages/dashboard/VerificationPage";

/**
 * Konfigurasi rute yang memerlukan autentikasi
 */
export const protectedRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    element: DashboardPage,
    title: "Dashboard",
    isProtected: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/session",
    element: SessionPage,
    title: "Session Management",
    isProtected: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/sessions/:sessionId",
    element: SessionRecordPage,
    title: "Session Recording",
    isProtected: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/finalization",
    element: FinalizationPage,
    title: "Finalization",
    isProtected: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/verification",
    element: VerificationPage,
    title: "Verification",
    isProtected: true,
    meta: {
      requiresAuth: true,
    },
  },
];

/**
 * Component untuk render rute yang memerlukan autentikasi
 */
export const ProtectedRoutes: React.FC = () => {
  return (
    <>
      {protectedRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={<route.element />} />
      ))}
    </>
  );
};
