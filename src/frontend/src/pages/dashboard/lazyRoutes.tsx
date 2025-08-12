import { createLazyDashboardPage } from "../../components/common/LazyDashboardPage";

// Lazy load semua halaman dashboard
export const AnalyticsDetailPage = createLazyDashboardPage(
  () => import("./AnalyticsDetailPage"),
  { loadingMessage: "loading_analytics_detail", loadingVariant: "skeleton" },
);

export const AnalyticsPage = createLazyDashboardPage(
  () => import("./AnalyticsPage"),
  { loadingMessage: "loading_analytics", loadingVariant: "skeleton" },
);

export const CreateSessionPage = createLazyDashboardPage(
  () => import("./CreateSessionPage"),
  { loadingMessage: "loading_create_session", loadingVariant: "skeleton" },
);

export const CertificateDetailPage = createLazyDashboardPage(
  () => import("./CertificateDetailPage"),
  { loadingMessage: "loading_certificate_detail", loadingVariant: "skeleton" },
);

export const CertificatesPage = createLazyDashboardPage(
  () => import("./CertificatesPage"),
  { loadingMessage: "loading_certificates", loadingVariant: "skeleton" },
);

export const FinalizationPage = createLazyDashboardPage(
  () => import("./FinalizationPage"),
  { loadingMessage: "loading_finalization", loadingVariant: "skeleton" },
);

export const DashboardPage = createLazyDashboardPage(
  () => import("./DashboardPage"),
  { loadingMessage: "loading_dashboard", loadingVariant: "skeleton" },
);

export const SessionPage = createLazyDashboardPage(
  () => import("./SessionPage"),
  { loadingMessage: "loading_session", loadingVariant: "skeleton" },
);

export const SessionRecordPage = createLazyDashboardPage(
  () => import("./SessionRecordPage"),
  { loadingMessage: "loading_session_record", loadingVariant: "skeleton" },
);

export const KaryaDetailPage = createLazyDashboardPage(
  () => import("./KaryaDetailPage"),
  { loadingMessage: "loading_karya_detail", loadingVariant: "skeleton" },
);

export const VerificationPage = createLazyDashboardPage(
  () => import("./VerificationPage"),
  { loadingMessage: "loading_verification", loadingVariant: "skeleton" },
);

export const ViewCertificatePage = createLazyDashboardPage(
  () => import("./ViewCertificatePage"),
  { loadingMessage: "loading_view_certificate", loadingVariant: "skeleton" },
);
