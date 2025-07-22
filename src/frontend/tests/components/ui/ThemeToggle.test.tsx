import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "../../../src/components/ui/ThemeToggle";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => {
      return store[key] || null;
    }),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Mock matchMedia
const matchMediaMock = (matches: boolean) => {
  return vi.fn().mockImplementation((query: string) => {
    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  });
};

describe("ThemeToggle Component", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    // Mock setAttribute on documentElement without redefining the property
    document.documentElement.setAttribute = vi.fn();

    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with light theme by default when no preference is set", () => {
    window.matchMedia = matchMediaMock(false);

    render(<ThemeToggle />);

    // Should show the moon icon (for light theme)
    const moonIcon = screen.getByLabelText(/switch to dark theme/i);
    expect(moonIcon).toBeInTheDocument();
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      "data-theme",
      "light",
    );
  });

  it("renders with dark theme when local storage has dark theme", () => {
    window.matchMedia = matchMediaMock(false);
    localStorageMock.getItem.mockReturnValue("dark");

    render(<ThemeToggle />);

    // Should show the sun icon (for dark theme)
    const sunIcon = screen.getByLabelText(/switch to light theme/i);
    expect(sunIcon).toBeInTheDocument();
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      "data-theme",
      "dark",
    );
  });

  it("renders with dark theme when system preference is dark and no local storage", () => {
    window.matchMedia = matchMediaMock(true);

    render(<ThemeToggle />);

    // Should show the sun icon (for dark theme)
    const sunIcon = screen.getByLabelText(/switch to light theme/i);
    expect(sunIcon).toBeInTheDocument();
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      "data-theme",
      "dark",
    );
  });

  it("toggles from light to dark theme when clicked", () => {
    window.matchMedia = matchMediaMock(false);

    render(<ThemeToggle />);

    // Initially light theme
    const toggleButton = screen.getByLabelText(/switch to dark theme/i);

    // Click to toggle to dark
    fireEvent.click(toggleButton);

    // Should have set dark theme
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      "data-theme",
      "dark",
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "originstamp-theme",
      "dark",
    );
  });

  it("toggles from dark to light theme when clicked", () => {
    window.matchMedia = matchMediaMock(false);
    localStorageMock.getItem.mockReturnValue("dark");

    render(<ThemeToggle />);

    // Initially dark theme
    const toggleButton = screen.getByLabelText(/switch to light theme/i);

    // Click to toggle to light
    fireEvent.click(toggleButton);

    // Should have set light theme
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      "data-theme",
      "light",
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "originstamp-theme",
      "light",
    );
  });

  it("dispatches themeChanged event when toggled", () => {
    window.matchMedia = matchMediaMock(false);
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    render(<ThemeToggle />);

    // Initially light theme
    const toggleButton = screen.getByLabelText(/switch to dark theme/i);

    // Click to toggle to dark
    fireEvent.click(toggleButton);

    // Should dispatch event
    expect(dispatchEventSpy).toHaveBeenCalled();
    const eventArg = dispatchEventSpy.mock.calls[0][0] as any;
    expect(eventArg.type).toBe("themeChanged");
    expect(eventArg.detail).toEqual({ theme: "dark" });
  });

  it("applies custom className when provided", () => {
    window.matchMedia = matchMediaMock(false);

    render(<ThemeToggle className="custom-class" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("theme-toggle");
    expect(button).toHaveClass("custom-class");
  });
});
