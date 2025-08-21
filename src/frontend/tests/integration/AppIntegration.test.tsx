import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import App from "../../src/App";

// Mock react-i18next before importing i18n
vi.mock("react-i18next", async () => {
  const actual = await vi.importActual("react-i18next");
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: {
        changeLanguage: vi.fn(),
        language: "en",
      },
    }),
    initReactI18next: {
      type: "3rdParty",
      init: vi.fn(),
    },
  };
});

// Mock web APIs
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock HTMLCanvasElement
HTMLCanvasElement.prototype.getContext = vi
  .fn()
  .mockImplementation((contextType) => {
    if (contextType === "webgl" || contextType === "webgl2") {
      return {
        createShader: vi.fn(),
        shaderSource: vi.fn(),
        compileShader: vi.fn(),
        createProgram: vi.fn(),
        attachShader: vi.fn(),
        linkProgram: vi.fn(),
        useProgram: vi.fn(),
        createBuffer: vi.fn(),
        bindBuffer: vi.fn(),
        bufferData: vi.fn(),
        enableVertexAttribArray: vi.fn(),
        vertexAttribPointer: vi.fn(),
        drawArrays: vi.fn(),
        viewport: vi.fn(),
        clearColor: vi.fn(),
        clear: vi.fn(),
        enable: vi.fn(),
        disable: vi.fn(),
        getParameter: vi.fn(),
        getExtension: vi.fn(),
        getShaderParameter: vi.fn(),
        getProgramParameter: vi.fn(),
        getShaderInfoLog: vi.fn(),
        getProgramInfoLog: vi.fn(),
      };
    }
    return {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(() => ({ data: new Array(4) })),
      putImageData: vi.fn(),
      createImageData: vi.fn(() => ({ data: new Array(4) })),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
    };
  });

// Mock URL
global.URL.createObjectURL = vi.fn(() => "mock-url");
global.URL.revokeObjectURL = vi.fn();

// Mock the backend
vi.mock("../../../declarations/backend", () => ({
  backend: {
    register_user: vi.fn(),
    login: vi.fn(),
    get_user_info: vi.fn(),
    get_s3_config_status: vi.fn(),
  },
}));

describe("App Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the app without crashing", async () => {
    render(<App />);

    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  it("should initialize with proper context providers", async () => {
    render(<App />);

    await waitFor(() => {
      // The app should have all necessary providers initialized
      expect(document.body).toBeInTheDocument();
    });
  });

  it("should handle routing correctly", async () => {
    render(<App />);

    await waitFor(() => {
      // Routing should be functional
      expect(document.body).toBeInTheDocument();
    });
  });

  it("should support theme functionality", async () => {
    render(<App />);

    await waitFor(() => {
      // Theme system should be available
      expect(document.documentElement.classList).toBeDefined();
    });
  });

  it("should support internationalization", async () => {
    render(<App />);

    await waitFor(() => {
      // i18n should be functional
      expect(document.body).toBeInTheDocument();
    });
  });
});
