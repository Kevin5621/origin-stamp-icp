import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorDisplay } from "../../../src/components/ui/ErrorDisplay";

describe("ErrorDisplay Component", () => {
  it("renders the error message", () => {
    const errorMessage = "This is an error message";
    render(<ErrorDisplay message={errorMessage} />);

    // Check that the error message is displayed
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("applies the error-display class", () => {
    render(<ErrorDisplay message="Test error" />);

    const errorContainer = screen
      .getByText("Test error")
      .closest(".error-display");
    expect(errorContainer).toBeInTheDocument();
    expect(errorContainer).toHaveClass("error-display");
  });

  it("applies custom className when provided", () => {
    render(<ErrorDisplay message="Test error" className="custom-class" />);

    const errorContainer = screen
      .getByText("Test error")
      .closest(".error-display");
    expect(errorContainer).toHaveClass("error-display");
    expect(errorContainer).toHaveClass("custom-class");
  });

  it("maintains error icon and styling", () => {
    render(<ErrorDisplay message="Test error" />);

    // Check for the SVG error icon
    const errorIcon = screen
      .getByText("Test error")
      .closest(".error-display")
      ?.querySelector("svg");
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon).toHaveClass("text-red-500");

    // Check heading styling
    const heading = screen.getByText("Error");
    expect(heading).toHaveClass("text-red-800");

    // Check message styling
    const message = screen.getByText("Test error");
    expect(message).toHaveClass("text-red-700");
  });

  it("properly renders long error messages with pre-wrap", () => {
    const longError = `Error: Failed to load resource
      at https://example.com/script.js:123:45
      at processTicksAndRejections (internal/process/task_queues.js:95:5)`;

    render(<ErrorDisplay message={longError} />);

    // Get the pre element directly with a test-id
    const errorContainer = screen.getByText("Error").closest(".error-display");
    const preElement = errorContainer!.querySelector("pre");

    expect(preElement).not.toBeNull();
    expect(preElement).toHaveClass("whitespace-pre-wrap");
  });
});
