import { useState } from "react";
import { Loader, ErrorDisplay, ThemeToggle, Login } from "./components";
import LanguageToggle from "./components/ui/LanguageToggle";
import {
  LandingView,
  DashboardView,
  SessionView,
  FinalizationView,
  VerificationView,
  ViewType,
} from "./views";
import { AppNavigation } from "./components/navigation/AppNavigation";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const [loading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [currentView, setCurrentView] = useState<ViewType>("landing");

  const clearError = () => {
    setError(undefined);
  };

  const navigateToView = (view: ViewType) => {
    setCurrentView(view);
    clearError();
  };

  const viewProps = { onNavigate: navigateToView };
  const renderCurrentView = () => {
    switch (currentView) {
      case "landing":
        return <LandingView {...viewProps} />;
      case "dashboard":
        return <DashboardView {...viewProps} />;
      case "session":
        return <SessionView {...viewProps} />;
      case "finalization":
        return <FinalizationView {...viewProps} />;
      case "verification":
        return <VerificationView {...viewProps} />;
      default:
        return <LandingView {...viewProps} />;
    }
  };

  return (
    <AuthProvider>
      <div className="controls-container">
        <Login />
        <ThemeToggle />
        <LanguageToggle />
      </div>
      {/* Main view is now the core element, no container wrappers */}
      <main className="main-content">{renderCurrentView()}</main>
      {/* Navigation remains functional and styled via semantic CSS */}
      {currentView !== "landing" && (
        <AppNavigation currentView={currentView} onNavigate={navigateToView} />
      )}
      {loading && !error && <Loader />}
      {!!error && <ErrorDisplay message={error} />}
    </AuthProvider>
  );
}

export default App;
