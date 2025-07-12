import React from "react";
import ReactDOM from "react-dom/client";
import App from "./src/App";
import "./src/index.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./src/i18n";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>,
);
