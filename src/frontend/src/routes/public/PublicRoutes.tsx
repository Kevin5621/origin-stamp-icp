import React from "react";
import { Route } from "react-router-dom";
import { RouteConfig } from "../../types/routes";
import LandingPage from "../../pages/landing/LandingPage";
import LoginPage from "../../pages/auth/LoginPage";
import HowItWorksPage from "../../pages/how-it-works/HowItWorksPage";

/**
 * Konfigurasi rute publik (tidak memerlukan autentikasi)
 */
export const publicRoutes: RouteConfig[] = [
  {
    path: "/",
    element: LandingPage,
    title: "Landing",
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/how-it-works",
    element: HowItWorksPage,
    title: "How It Works",
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/login",
    element: LoginPage,
    title: "Login",
    meta: {
      requiresAuth: false,
    },
  },
];

/**
 * Component untuk render rute publik
 */
export const PublicRoutes: React.FC = () => {
  return (
    <>
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={<route.element />} />
      ))}
    </>
  );
};
