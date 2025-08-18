import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { StrictMode } from "react";
import { Activity } from "../../src/components/marketplace";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n-test-setup";
import userEvent from "@testing-library/user-event";

describe("Activity", () => {
  it("should render the activity page with header and filters", () => {
    // Setup
    render(
      <StrictMode>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <Activity />
          </I18nextProvider>
        </BrowserRouter>
      </StrictMode>
    );

    // Assert
    expect(screen.getByText("Activity")).toBeInTheDocument();
    expect(
      screen.getByText("Track recent marketplace actions and transactions.")
    ).toBeInTheDocument();
    expect(screen.getByText("All Activity")).toBeInTheDocument();
    expect(screen.getByText("Listings")).toBeInTheDocument();
    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.getByText("Bids")).toBeInTheDocument();
    expect(screen.getByText("Transfers")).toBeInTheDocument();
    expect(screen.getByText("Likes")).toBeInTheDocument();
  });

  it("should filter activities when an activity type is clicked", async () => {
    // Setup
    const user = userEvent.setup();
    render(
      <StrictMode>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <Activity />
          </I18nextProvider>
        </BrowserRouter>
      </StrictMode>
    );

    // Execute
    const salesFilterButton = screen.getByText("Sales");
    await user.click(salesFilterButton);
    
    // Wait for the content to update
    await vi.waitFor(() => {
      // Assert - This would check for specific sale items, but in our mock setup
      // we need to add more detailed assertions based on the actual implementation
      expect(salesFilterButton).toHaveClass("activity-filter__type-btn--active");
    });
  });

  it("should open date range picker when date filter is clicked", async () => {
    // Setup
    const user = userEvent.setup();
    render(
      <StrictMode>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <Activity />
          </I18nextProvider>
        </BrowserRouter>
      </StrictMode>
    );

    // Execute
    const dateRangeButton = screen.getByText("Date Range");
    await user.click(dateRangeButton);
    
    // Assert
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("End Date")).toBeInTheDocument();
    expect(screen.getByText("Apply")).toBeInTheDocument();
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });
});
