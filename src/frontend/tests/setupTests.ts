import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Mock IndexedDB for @dfinity/auth-client
Object.defineProperty(global, "indexedDB", {
  value: {
    open: vi.fn(),
    deleteDatabase: vi.fn(),
    databases: vi.fn().mockResolvedValue([]),
  },
  writable: true,
});

// Mock IDBDatabase
global.IDBDatabase = vi.fn();
global.IDBObjectStore = vi.fn();
global.IDBIndex = vi.fn();
global.IDBTransaction = vi.fn();
global.IDBRequest = vi.fn();

// Mock window.scrollTo for GSAP ScrollTrigger
Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  writable: true,
});

// Mock window.scroll for GSAP ScrollTrigger
Object.defineProperty(window, "scroll", {
  value: vi.fn(),
  writable: true,
});

// Mock scrollY and scrollX properties
Object.defineProperty(window, "scrollY", {
  value: 0,
  writable: true,
});

Object.defineProperty(window, "scrollX", {
  value: 0,
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver for GSAP
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  setTimeout(cb, 16);
  return 1;
});
global.cancelAnimationFrame = vi.fn();

// Mock localStorage
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock GSAP
vi.mock("gsap", () => ({
  gsap: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    })),
    to: vi.fn(),
    from: vi.fn(),
    fromTo: vi.fn(),
    set: vi.fn(),
  },
  ScrollTrigger: {
    create: vi.fn(),
    getAll: vi.fn(() => []),
    refresh: vi.fn(),
    kill: vi.fn(),
  },
}));

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: vi.fn(),
      language: "en",
    },
  }),
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock @dfinity/auth-client
vi.mock("@dfinity/auth-client", () => ({
  AuthClient: {
    create: vi.fn().mockResolvedValue({
      isAuthenticated: vi.fn().mockResolvedValue(false),
      getIdentity: vi.fn().mockReturnValue({
        getPrincipal: vi.fn().mockReturnValue({
          toString: vi.fn().mockReturnValue("2vxsx-fae"),
        }),
      }),
      login: vi.fn(),
      logout: vi.fn(),
    }),
  },
}));

// runs cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});
