import { useState } from "react";
import { Loader, ErrorDisplay } from "./components";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [currentView, setCurrentView] = useState<
    "landing" | "dashboard" | "session" | "finalization" | "verification"
  >("landing");

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const clearError = () => {
    setError(undefined);
  };

  const navigateToView = (view: typeof currentView) => {
    setCurrentView(view);
    clearError();
  };

  return (
    <div className="app-container">
      <div className="page-container">
        {/* Header */}
        <header className="page-header">
          <h1 className="page-title">OriginStamp</h1>
          <p className="page-subtitle">
            Protokol Verifikasi Terdesentralisasi untuk Era Digital
          </p>
        </header>

        {/* Main Content */}
        <main>
          {currentView === "landing" && (
            <section className="content-center">
              <h2 className="section-title">Buktikan Keaslian Karya Anda</h2>
              <p className="section-subtitle content-max-width">
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
            </section>
          )}

          {currentView === "dashboard" && (
            <section>
              <div className="mb-8 flex items-center justify-between">
                <h2 className="section-title mb-0">Dashboard Kreator</h2>
                <button
                  onClick={() => navigateToView("session")}
                  className="btn-primary"
                >
                  + Proyek Baru
                </button>
              </div>

              <div className="grid-projects">
                {/* Project Cards - placeholder for now */}
                <div className="card-inset">
                  <h3 className="text-primary mb-2 text-lg font-medium">
                    Belum Ada Proyek
                  </h3>
                  <p className="text-secondary">
                    Klik "Proyek Baru" untuk memulai verifikasi karya pertama
                    Anda
                  </p>
                </div>
              </div>
            </section>
          )}

          {currentView === "session" && (
            <section className="content-center">
              <h2 className="section-title">Sesi Perekaman Aktif</h2>
              <div className="card-inset mb-8 inline-block">
                <div className="animate-pulse">
                  <div className="indicator-recording mx-auto mb-4 h-4 w-4"></div>
                  <p className="text-primary text-lg font-medium">
                    Merekam Proses Kreatif...
                  </p>
                </div>
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
            </section>
          )}

          {currentView === "finalization" && (
            <section className="content-center">
              <h2 className="section-title">Finalisasi Proyek</h2>
              <div className="card-inset content-max-width mb-8">
                <h3 className="text-primary mb-4 text-xl font-medium">
                  Ringkasan Proses Kreatif
                </h3>
                <div className="grid-two-cols mb-6">
                  <div>
                    <p className="text-secondary text-sm">Durasi Total</p>
                    <p className="text-primary text-lg font-medium">
                      8 Jam 24 Menit
                    </p>
                  </div>
                  <div>
                    <p className="text-secondary text-sm">Aksi Terekam</p>
                    <p className="text-primary text-lg font-medium">
                      1.245 Aksi
                    </p>
                  </div>
                </div>
                <p className="text-secondary mb-6">
                  Apakah Anda yakin ingin menyelesaikan proyek ini dan
                  menerbitkan sertifikat keaslian?
                </p>
                <button
                  onClick={() => navigateToView("verification")}
                  className="btn-cta"
                >
                  Selesaikan & Terbitkan Sertifikat
                </button>
              </div>
            </section>
          )}

          {currentView === "verification" && (
            <section>
              <h2 className="section-title content-center">
                Sertifikat Keaslian
              </h2>
              <div className="content-max-width-lg">
                <div className="card-raised mb-6">
                  <h3 className="text-primary mb-4 text-xl font-medium">
                    ✓ Karya Terverifikasi
                  </h3>
                  <p className="text-secondary mb-4">
                    Sertifikat keaslian telah diterbitkan untuk karya Anda.
                    Proses kreatif telah direkam secara permanen di blockchain.
                  </p>
                  <div className="grid-stats">
                    <div className="card-inset">
                      <h4 className="text-primary font-medium">
                        Durasi Proses
                      </h4>
                      <p className="text-primary">8 Jam 24 Menit</p>
                    </div>
                    <div className="card-inset">
                      <h4 className="text-primary font-medium">Aksi Terekam</h4>
                      <p className="text-primary">1.245 Aksi</p>
                    </div>
                    <div className="card-inset">
                      <h4 className="text-primary font-medium">Status</h4>
                      <p className="text-primary">Terverifikasi</p>
                    </div>
                  </div>
                </div>
                <div className="content-center">
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
