import { useState } from "react";
import { Loader, ErrorDisplay, ThemeToggle } from "./components";

function App() {
  const [loading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [currentView, setCurrentView] = useState<
    "landing" | "dashboard" | "session" | "finalization" | "verification"
  >("landing");

  const clearError = () => {
    setError(undefined);
  };

  const navigateToView = (view: typeof currentView) => {
    setCurrentView(view);
    clearError();
  };

  return (
    <div className="app-container">
      <ThemeToggle />

      <div className="page-container">
        {/* Semantic Header */}
        <header className="app-header">
          <div className="header-content">
            <h1 className="brand-title">OriginStamp</h1>
            <p className="brand-subtitle">
              Protokol Verifikasi Terdesentralisasi untuk Era Digital
            </p>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="main-content">
          {currentView === "landing" && (
            <section className="hero-section" aria-labelledby="hero-title">
              <div className="bento-hero">
                <article className="hero-primary-card">
                  <div className="hero-content">
                    <h2 id="hero-title" className="hero-title">
                      Buktikan Keaslian Karya Anda
                    </h2>
                    <p className="hero-description">
                      Dalam era AI generatif, buktikan bahwa karya Anda adalah
                      hasil dari proses kreatif manusia yang autentik.
                      OriginStamp memberikan "sertifikat kelahiran digital" yang
                      tidak dapat dipalsukan.
                    </p>
                    <button
                      onClick={() => navigateToView("dashboard")}
                      className="btn-hero-cta"
                      aria-label="Mulai proses verifikasi karya"
                    >
                      <span className="btn-text">
                        Mulai Verifikasi Karya Saya
                      </span>
                      <svg
                        className="btn-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </button>
                  </div>
                </article>

                <aside className="hero-features">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="feature-title">Verifikasi Otomatis</h3>
                    <p className="feature-description">
                      Proses kreatif direkam secara real-time
                    </p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="feature-title">Blockchain Secure</h3>
                    <p className="feature-description">
                      Sertifikat permanen di Internet Computer
                    </p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="feature-title">Instant Proof</h3>
                    <p className="feature-description">
                      Bukti keaslian yang dapat diverifikasi
                    </p>
                  </div>
                </aside>
              </div>
            </section>
          )}

          {currentView === "dashboard" && (
            <section
              className="dashboard-section"
              aria-labelledby="dashboard-title"
            >
              <div className="bento-dashboard">
                <header className="dashboard-header-card">
                  <h2 id="dashboard-title" className="dashboard-title">
                    Dashboard Kreator
                  </h2>
                  <button
                    onClick={() => navigateToView("session")}
                    className="btn-new-project"
                    aria-label="Buat proyek verifikasi baru"
                  >
                    <svg
                      className="btn-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Proyek Baru</span>
                  </button>
                </header>

                <div className="projects-grid">
                  <article className="empty-state-card">
                    <div className="empty-state-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <h3 className="empty-state-title">Belum Ada Proyek</h3>
                    <p className="empty-state-description">
                      Klik "Proyek Baru" untuk memulai verifikasi karya pertama
                      Anda
                    </p>
                    <div className="empty-state-hint">
                      <svg
                        className="hint-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Mulai perjalanan verifikasi Anda</span>
                    </div>
                  </article>

                  <aside className="dashboard-stats">
                    <div className="stat-card">
                      <div className="stat-value">0</div>
                      <div className="stat-label">Proyek Selesai</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-value">0</div>
                      <div className="stat-label">Sertifikat Diterbitkan</div>
                    </div>
                  </aside>
                </div>
              </div>
            </section>
          )}

          {currentView === "session" && (
            <section
              className="session-section"
              aria-labelledby="session-title"
            >
              <div className="bento-session">
                <header className="session-header-card">
                  <h2 id="session-title" className="session-title">
                    Sesi Perekaman Aktif
                  </h2>
                  <div className="session-status-indicator">
                    <div
                      className="recording-dot"
                      aria-label="Sedang merekam"
                    ></div>
                    <span className="status-text">
                      Merekam Proses Kreatif...
                    </span>
                  </div>
                </header>

                <article className="session-main-card">
                  <div className="session-visual">
                    <div className="recording-animation">
                      <div className="pulse-ring"></div>
                      <div className="pulse-ring delay-1"></div>
                      <div className="pulse-ring delay-2"></div>
                      <div className="recording-core"></div>
                    </div>
                  </div>

                  <div className="session-content">
                    <p className="session-description">
                      Silakan lanjutkan bekerja di software kreatif Anda. Plugin
                      OriginStamp akan secara otomatis merekam setiap langkah
                      proses kreatif Anda.
                    </p>

                    <div className="session-info">
                      <div className="info-item">
                        <span className="info-label">Plugin Status:</span>
                        <span className="info-value status-active">Aktif</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Durasi:</span>
                        <span className="info-value">0:00:00</span>
                      </div>
                    </div>
                  </div>
                </article>

                <aside className="session-controls">
                  <button
                    onClick={() => navigateToView("finalization")}
                    className="btn-finalize"
                    aria-label="Finalisasi dan selesaikan proyek"
                  >
                    <span>Finalisasi Proyek</span>
                    <svg
                      className="btn-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                </aside>
              </div>
            </section>
          )}

          {currentView === "finalization" && (
            <section
              className="finalization-section"
              aria-labelledby="finalization-title"
            >
              <div className="bento-finalization">
                <header className="finalization-header">
                  <h2 id="finalization-title" className="finalization-title">
                    Finalisasi Proyek
                  </h2>
                  <div className="completion-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Proses Selesai</span>
                  </div>
                </header>

                <article className="process-summary-card">
                  <h3 className="summary-title">Ringkasan Proses Kreatif</h3>

                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-value">8h 24m</div>
                      <div className="metric-label">Durasi Total</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">1,245</div>
                      <div className="metric-label">Aksi Terekam</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">24</div>
                      <div className="metric-label">Milestone</div>
                    </div>
                  </div>

                  <div className="success-indicator">
                    <div className="success-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="success-content">
                      <h4 className="success-title">Proses Berhasil Direkam</h4>
                      <p className="success-description">
                        Semua aktivitas kreatif telah disimpan secara permanen
                      </p>
                    </div>
                  </div>
                </article>

                <aside className="finalization-actions">
                  <p className="confirmation-text">
                    Apakah Anda yakin ingin menyelesaikan proyek ini dan
                    menerbitkan sertifikat keaslian?
                  </p>
                  <button
                    onClick={() => navigateToView("verification")}
                    className="btn-publish"
                    aria-label="Selesaikan dan terbitkan sertifikat keaslian"
                  >
                    <span>Selesaikan & Terbitkan Sertifikat</span>
                    <svg
                      className="btn-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </button>
                </aside>
              </div>
            </section>
          )}

          {currentView === "verification" && (
            <section
              className="verification-section"
              aria-labelledby="verification-title"
            >
              <div className="bento-verification">
                <header className="verification-header">
                  <h2 id="verification-title" className="verification-title">
                    Sertifikat Keaslian
                  </h2>
                  <div className="verified-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Karya Terverifikasi</span>
                  </div>
                </header>

                <article className="certificate-card">
                  <div className="certificate-header">
                    <div className="certificate-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="certificate-title">
                      Sertifikat Keaslian Diterbitkan
                    </h3>
                    <p className="certificate-description">
                      Sertifikat keaslian telah diterbitkan untuk karya Anda.
                      Proses kreatif telah direkam secara permanen di blockchain
                      dan tidak dapat diubah.
                    </p>
                  </div>

                  <div className="certificate-details">
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">ID Sertifikat:</span>
                        <span className="detail-value">OS-2024-001</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Tanggal Terbit:</span>
                        <span className="detail-value">24 Des 2024</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Blockchain:</span>
                        <span className="detail-value">Internet Computer</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value status-active">
                          Aktif
                        </span>
                      </div>
                    </div>
                  </div>
                </article>

                <div className="verification-stats-grid">
                  <div className="stat-card-large">
                    <div className="stat-value">8h 24m</div>
                    <div className="stat-label">Durasi Proses</div>
                  </div>
                  <div className="stat-card-large">
                    <div className="stat-value">1,245</div>
                    <div className="stat-label">Aksi Terekam</div>
                  </div>
                  <div className="stat-card-large">
                    <div className="stat-value success">✓</div>
                    <div className="stat-label">Status Verifikasi</div>
                  </div>
                </div>

                <aside className="verification-actions">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(window.location.href)
                    }
                    className="btn-copy-link"
                    aria-label="Salin tautan sertifikat ke clipboard"
                  >
                    <svg
                      className="btn-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Salin Tautan Sertifikat</span>
                  </button>
                </aside>
              </div>
            </section>
          )}
        </main>

        {/* Semantic Navigation */}
        {currentView !== "landing" && (
          <nav className="app-navigation" aria-label="Navigasi utama">
            <div className="nav-container">
              <button
                onClick={() => navigateToView("dashboard")}
                className={`nav-button ${currentView === "dashboard" ? "active" : ""}`}
                aria-current={currentView === "dashboard" ? "page" : undefined}
              >
                <svg
                  className="nav-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 15v4m8-4v4"
                  />
                </svg>
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => navigateToView("landing")}
                className="nav-button"
                aria-label="Kembali ke beranda"
              >
                <svg
                  className="nav-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Beranda</span>
              </button>
            </div>
          </nav>
        )}

        {/* Loading and Error States */}
        {loading && !error && <Loader />}
        {!!error && <ErrorDisplay message={error} />}
      </div>
    </div>
  );
}

export default App;
