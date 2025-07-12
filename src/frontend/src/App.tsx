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
      {/* Theme Toggle */}
      <ThemeToggle />

      <div className="page-container">
        {/* Header */}
        <header className="page-header">
          <h1 className="page-title">
            OriginStamp
          </h1>
          <p className="page-subtitle">
            Protokol Verifikasi Terdesentralisasi untuk Era Digital
          </p>
        </header>

        {/* Main Content */}
        <main>
          {currentView === "landing" && (
            <section className="hero-section">
              <div className="hero-content">
                <h2 className="hero-title">
                  Buktikan Keaslian Karya Anda
                </h2>
                <p className="hero-description">
                  Dalam era AI generatif, buktikan bahwa karya Anda adalah hasil
                  dari proses kreatif manusia yang autentik. OriginStamp
                  memberikan "sertifikat kelahiran digital" yang tidak dapat
                  dipalsukan.
                </p>
                <button
                  onClick={() => navigateToView("dashboard")}
                  className="btn-cta"
                >
                  Mulai Verifikasi Karya Saya
                </button>
              </div>
            </section>
          )}

          {currentView === "dashboard" && (
            <section className="section-container">
              <div className="section-content">
                <div className="dashboard-header">
                  <h2 className="dashboard-title">
                    Dashboard Kreator
                  </h2>
                  <div className="dashboard-actions">
                    <button
                      onClick={() => navigateToView("session")}
                      className="btn-primary"
                    >
                      + Proyek Baru
                    </button>
                  </div>
                </div>

                <div className="grid-projects">
                  {/* Project Cards - placeholder for now */}
                  <div className="card-enhanced">
                    <h3 className="mb-4 text-xl font-semibold text-primary">
                      Belum Ada Proyek
                    </h3>
                    <p className="text-secondary mb-4">
                      Klik "Proyek Baru" untuk memulai verifikasi karya pertama
                      Anda
                    </p>
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Mulai perjalanan verifikasi Anda</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {currentView === "session" && (
            <section className="session-container">
              <div className="section-content">
                <h2 className="section-title">
                  Sesi Perekaman Aktif
                </h2>
                <div className="session-indicator">
                  <div className="indicator-recording mx-auto mb-4 h-6 w-6"></div>
                  <p className="session-status">
                    Merekam Proses Kreatif...
                  </p>
                  <p className="text-secondary text-sm">
                    Plugin OriginStamp sedang aktif
                  </p>
                </div>
                <p className="section-subtitle">
                  Silakan lanjutkan bekerja di software kreatif Anda. Plugin
                  OriginStamp akan secara otomatis merekam setiap langkah proses
                  kreatif Anda.
                </p>
                <button
                  onClick={() => navigateToView("finalization")}
                  className="btn-cta"
                >
                  Finalisasi Proyek
                </button>
              </div>
            </section>
          )}

          {currentView === "finalization" && (
            <section className="section-container">
              <div className="section-content">
                <h2 className="section-title">
                  Finalisasi Proyek
                </h2>
                <div className="card-enhanced content-max-width">
                  <h3 className="mb-6 text-2xl font-semibold text-primary">
                    Ringkasan Proses Kreatif
                  </h3>
                  <div className="grid-two-cols mb-8">
                    <div className="text-center p-4">
                      <div className="text-3xl font-bold text-primary mb-2">8h 24m</div>
                      <div className="text-secondary text-sm">Durasi Total</div>
                    </div>
                    <div className="text-center p-4">
                      <div className="text-3xl font-bold text-primary mb-2">1,245</div>
                      <div className="text-secondary text-sm">Aksi Terekam</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-info to-success p-4 rounded-xl mb-6">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="text-white font-semibold">Proses Berhasil Direkam</div>
                        <div className="text-white/80 text-sm">Semua aktivitas kreatif telah disimpan</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-secondary mb-6 text-center">
                    Apakah Anda yakin ingin menyelesaikan proyek ini dan
                    menerbitkan sertifikat keaslian?
                  </p>
                  <div className="text-center">
                    <button
                      onClick={() => navigateToView("verification")}
                      className="btn-cta"
                    >
                      Selesaikan & Terbitkan Sertifikat
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {currentView === "verification" && (
            <section className="section-container">
              <div className="verification-container">
                <div className="verification-header">
                  <h2 className="section-title">
                    Sertifikat Keaslian
                  </h2>
                  <div className="verification-badge">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Karya Terverifikasi
                  </div>
                </div>

                <div className="card-enhanced">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-primary mb-4">
                      ✓ Sertifikat Keaslian Diterbitkan
                    </h3>
                    <p className="text-secondary max-w-2xl mx-auto">
                      Sertifikat keaslian telah diterbitkan untuk karya Anda.
                      Proses kreatif telah direkam secara permanen di blockchain
                      dan tidak dapat diubah.
                    </p>
                  </div>

                  <div className="verification-stats">
                    <div className="card-inset text-center p-6">
                      <div className="text-2xl font-bold text-primary mb-2">8h 24m</div>
                      <div className="text-secondary text-sm font-medium">Durasi Proses</div>
                    </div>
                    <div className="card-inset text-center p-6">
                      <div className="text-2xl font-bold text-primary mb-2">1,245</div>
                      <div className="text-secondary text-sm font-medium">Aksi Terekam</div>
                    </div>
                    <div className="card-inset text-center p-6">
                      <div className="text-2xl font-bold text-success mb-2">✓</div>
                      <div className="text-secondary text-sm font-medium">Status</div>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl">
                    <h4 className="font-semibold text-primary mb-3">Informasi Sertifikat</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-secondary">ID Sertifikat:</span>
                        <span className="text-primary ml-2 font-mono">OS-2024-001</span>
                      </div>
                      <div>
                        <span className="text-secondary">Tanggal Terbit:</span>
                        <span className="text-primary ml-2">24 Des 2024</span>
                      </div>
                      <div>
                        <span className="text-secondary">Blockchain:</span>
                        <span className="text-primary ml-2">Internet Computer</span>
                      </div>
                      <div>
                        <span className="text-secondary">Status:</span>
                        <span className="text-success ml-2 font-semibold">Aktif</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-8">
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(window.location.href)
                      }
                      className="btn-cta"
                    >
                      Salin Tautan Sertifikat
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Navigation */}
        {currentView !== "landing" && (
          <nav className="nav-container">
            <div className="nav-wrapper">
              <button
                onClick={() => navigateToView("dashboard")}
                className={`nav-item ${
                  currentView === "dashboard" ? "active" : ""
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigateToView("landing")}
                className="nav-item"
              >
                Beranda
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
