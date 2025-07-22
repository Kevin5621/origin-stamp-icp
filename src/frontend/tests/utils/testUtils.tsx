import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { screen, fireEvent, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/contexts/AuthContext";
import { ToastProvider } from "../../src/contexts/ToastContext";

// All-in-one test wrapper that provides all necessary context providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

// Custom render function that includes all providers by default
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
export * from "@testing-library/dom";

// Override render method and export specific functions
export { customRender as render, screen, fireEvent, waitFor, userEvent };
