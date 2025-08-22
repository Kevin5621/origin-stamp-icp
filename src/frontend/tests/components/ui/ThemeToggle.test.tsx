import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "../../utils/testUtils";
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

    // Mock setAttribute on documentElement
    document.documentElement.setAttribute = vi.fn();

    // Mock matchMedia to return false by default
    window.matchMedia = matchMediaMock(false);

    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders with light theme by default when no preference is set", () => {
    render(<ThemeToggle />);

    // Should show the moon icon (for light theme)
    const moonIcon = screen.getByLabelText(/switch to dark theme/i);
    expect(moonIcon).toBeInTheDocument();

    // Verify theme is set to light
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      "data-theme",
      "light",
    );
  });

  it("renders with dark theme when local storage has dark theme", () => {
    // Mock localStorage to return dark theme
    localStorageMock.getItem.mockReturnValue("dark");

    render(<ThemeToggle />);

    // Should show the sun icon (for dark theme)
    const sunIcon = screen.getByLabelText(/switch to light theme/i);
    expect(sunIcon).toBeInTheDocument();

    // Verify theme is set to dark
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      "data-theme",
      "dark",
    );
  });

  it("renders with dark theme when system preference is dark and no local storage", () => {
    // Mock matchMedia to return true (dark preference)
    window.matchMedia = matchMediaMock(true);

    render(<ThemeToggle />);

    // Should show the sun icon (for dark theme)
    const sunIcon = screen.getByLabelText(/switch to light theme/i);
    expect(sunIcon).toBeInTheDocument();

    // Verify theme is set to dark
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      "data-theme",
      "dark",
    );
  });

  it("toggles from light to dark theme when clicked", () => {
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
    // Mock localStorage to return dark theme
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

  it("applies custom className when provided", () => {
    render(<ThemeToggle className="custom-class" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("theme-toggle");
    expect(button).toHaveClass("custom-class");
  });
});
