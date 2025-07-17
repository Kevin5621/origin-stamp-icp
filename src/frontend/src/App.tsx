import { useState } from "react";
import { Loader, ErrorDisplay, ThemeToggle, Login } from "./components";
import LanguageToggle from "./components/LanguageToggle";
import { useTranslation } from "react-i18next";
import {
  LandingView,
  DashboardView,
  SessionView,
  FinalizationView,
  VerificationView,
  ViewType,
} from "./views";
import { AppContainer } from "./components/layout/AppContainer";
import { PageContainer } from "./components/layout/PageContainer";
import { AppHeader } from "./components/header/AppHeader";
import { AppNavigation } from "./components/navigation/AppNavigation";
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

  const { t } = useTranslation();

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
    <AppContainer>
      <div className="controls-container">
        <Login />
        <ThemeToggle />
        <LanguageToggle />
      </div>
      <PageContainer>
        <AppHeader title={t("welcome_message")} subtitle={t("hello_world")} />
        <main className="main-content">{renderCurrentView()}</main>
        {currentView !== "landing" && (
          <AppNavigation
            currentView={currentView}
            onNavigate={navigateToView}
          />
        )}
        {loading && !error && <Loader />}
        {!!error && <ErrorDisplay message={error} />}
      </PageContainer>
    </AppContainer>
  );
}

export default App;
