import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import React from "react";

// Mock environment variables
vi.mock("../src/services/googleAuth", () => ({
  googleAuthService: {
    signIn: vi.fn().mockResolvedValue({
      id: "test-id",
      name: "Test User",
      email: "test@example.com",
      picture: "test-picture.jpg",
    }),
    signOut: vi.fn().mockResolvedValue(undefined),
    isAuthenticated: vi.fn().mockReturnValue(false),
    getCurrentUser: vi.fn().mockReturnValue(null),
  },
}));

// Mock Vite environment variables
Object.defineProperty(import.meta, "env", {
  value: {
    VITE_GOOGLE_CLIENT_ID: "test-google-client-id",
    MODE: "test",
    DEV: false,
    PROD: false,
    SSR: false,
  },
  writable: true,
});

// Animation frame tracking for cleanup
let animationFrameCallbacks = new Set<FrameRequestCallback>();
let animationFrameTimeouts = new Set<NodeJS.Timeout>();
let currentAnimationId = 0;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "sessionStorage", {
  value: sessionStorageMock,
  writable: true,
});

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

// Mock window.matchMedia for theme detection - improved version
Object.defineProperty(window, "matchMedia", {
  value: vi.fn((query: string) => {
    const mediaQuery = {
      matches: false,
      media: query || "",
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    return mediaQuery;
  }),
  writable: true,
  configurable: true,
});

// Mock ResizeObserver for react-use-measure and other libraries
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock getBoundingClientRect for testing layout components
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
  toJSON: vi.fn(),
}));

// Mock XMLHttpRequest
global.XMLHttpRequest = vi.fn(() => ({
  open: vi.fn(),
  send: vi.fn(),
  setRequestHeader: vi.fn(),
  readyState: 4,
  status: 200,
  response: "",
})) as any;

// Mock scrollY and scrollX properties
Object.defineProperty(window, "scrollY", {
  value: 0,
  writable: true,
});

Object.defineProperty(window, "scrollX", {
  value: 0,
  writable: true,
});

// Mock requestAnimationFrame and cancelAnimationFrame to prevent async issues
global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
  const id = ++currentAnimationId;
  animationFrameCallbacks.add(callback);

  // In tests, we don't want continuous RAF loops, so we just call the callback once
  const timeout = setTimeout(() => {
    if (animationFrameCallbacks.has(callback)) {
      try {
        callback(performance.now());
        animationFrameCallbacks.delete(callback);
      } catch (error) {
        // Silently ignore errors in animation frames during tests
        console.debug("Animation frame error (ignored in tests):", error);
      }
    }
    animationFrameTimeouts.delete(timeout);
  }, 0);

  animationFrameTimeouts.add(timeout);
  return id;
});

global.cancelAnimationFrame = vi.fn((_id: number) => {
  // Clear all callbacks and timeouts
  animationFrameCallbacks.clear();
  animationFrameTimeouts.forEach((timeout) => clearTimeout(timeout));
  animationFrameTimeouts.clear();
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
      login: vi.fn().mockResolvedValue(undefined),
      logout: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));

// Mock backend declarations
vi.mock("../../declarations/backend", () => ({
  backend: {
    get_s3_config_status: vi.fn().mockResolvedValue({ Ok: false }),
    whoami: vi.fn().mockResolvedValue("2vxsx-fae"),
    greet: vi.fn().mockResolvedValue("Hello, test!"),
  },
  createActor: vi.fn(),
}));

// Mock @studio-freight/lenis to prevent all RAF and lifecycle issues
vi.mock("@studio-freight/lenis", () => {
  const MockLenis = vi.fn().mockImplementation((_options?: any) => {
    const instance = {
      destroyed: false,
      raf: vi.fn((_time?: number) => {
        // No-op during tests to prevent RAF loops
      }),
      scrollTo: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      stop: vi.fn(),
      start: vi.fn(),
      destroy: vi.fn(() => {
        instance.destroyed = true;
      }),
    };
    return instance;
  });

  return {
    __esModule: true,
    default: MockLenis,
  };
});

// Mock react-use-measure to prevent ResizeObserver issues
vi.mock("react-use-measure", () => ({
  default: vi.fn(() => [
    vi.fn(), // ref
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
    },
  ]),
}));

// Mock @react-three/fiber and drei to prevent Canvas issues
vi.mock("@react-three/fiber", () => ({
  Canvas: vi.fn(({ children }: { children: React.ReactNode }) =>
    React.createElement("div", { "data-testid": "canvas" }, children),
  ),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: {
      position: { set: vi.fn(), copy: vi.fn() },
      lookAt: vi.fn(),
    },
    scene: {
      traverse: vi.fn(),
      add: vi.fn(),
      remove: vi.fn(),
    },
    gl: {
      render: vi.fn(),
      setSize: vi.fn(),
    },
    controls: {
      enabled: true,
      enableDamping: true,
      dampingFactor: 0.1,
      update: vi.fn(),
    },
  })),
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: vi.fn(() => null),
  useGLTF: Object.assign(
    vi.fn(() => ({
      scene: {
        traverse: vi.fn(),
        clone: vi.fn(() => ({
          traverse: vi.fn(),
        })),
        position: {
          set: vi.fn().mockReturnThis(),
          copy: vi.fn().mockReturnThis(),
          sub: vi.fn().mockReturnThis(),
          add: vi.fn().mockReturnThis(),
          x: 0,
          y: 0,
          z: 0,
        },
      },
      animations: [],
      nodes: {},
      materials: {},
    })),
    {
      preload: vi.fn(() => {
        console.log("3D model preloaded successfully");
      }),
    },
  ),
  Preload: vi.fn(() => null),
  Html: vi.fn(({ children }: { children: React.ReactNode }) =>
    React.createElement("div", {}, children),
  ),
  PerspectiveCamera: vi.fn(() => null),
  Environment: vi.fn(() => null),
}));

// Mock THREE.js
vi.mock("three", () => ({
  Scene: vi.fn(() => ({
    traverse: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
  })),
  PerspectiveCamera: vi.fn(() => ({
    position: { set: vi.fn(), copy: vi.fn() },
    lookAt: vi.fn(),
  })),
  WebGLRenderer: vi.fn(() => ({
    render: vi.fn(),
    setSize: vi.fn(),
    setClearColor: vi.fn(),
  })),
  Vector3: vi.fn(() => ({
    set: vi.fn().mockReturnThis(),
    copy: vi.fn().mockReturnThis(),
    normalize: vi.fn().mockReturnThis(),
    sub: vi.fn().mockReturnThis(),
    add: vi.fn().mockReturnThis(),
    x: 0,
    y: 0,
    z: 0,
  })),
  Box3: vi.fn(() => {
    const mockVector3 = {
      set: vi.fn().mockReturnThis(),
      copy: vi.fn().mockReturnThis(),
      normalize: vi.fn().mockReturnThis(),
      sub: vi.fn().mockReturnThis(),
      add: vi.fn().mockReturnThis(),
      x: 0,
      y: 0,
      z: 0,
    };

    return {
      setFromObject: vi.fn().mockReturnThis(),
      getCenter: vi.fn((target) => {
        // Return the target vector if provided, or create a new one
        if (target) {
          target.x = 0;
          target.y = 0;
          target.z = 0;
          return target;
        }
        return mockVector3;
      }),
      getSize: vi.fn((target) => {
        if (target) {
          target.x = 1;
          target.y = 1;
          target.z = 1;
          return target;
        }
        return mockVector3;
      }),
      min: { x: -0.5, y: -0.5, z: -0.5 },
      max: { x: 0.5, y: 0.5, z: 0.5 },
    };
  }),
  Mesh: vi.fn(),
  Group: vi.fn(() => ({
    traverse: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    position: {
      set: vi.fn(),
      copy: vi.fn(),
      sub: vi.fn(),
      add: vi.fn(),
      x: 0,
      y: 0,
      z: 0,
    },
  })),
  Object3D: vi.fn(() => ({
    traverse: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    position: {
      set: vi.fn(),
      copy: vi.fn(),
      sub: vi.fn(),
      add: vi.fn(),
      x: 0,
      y: 0,
      z: 0,
    },
  })),
  MeshStandardMaterial: vi.fn(),
  BoxGeometry: vi.fn(),
  SphereGeometry: vi.fn(),
  PlaneGeometry: vi.fn(),
  AmbientLight: vi.fn(),
  DirectionalLight: vi.fn(),
  PointLight: vi.fn(),
  SpotLight: vi.fn(),
  TextureLoader: vi.fn(),
  LoadingManager: vi.fn(),
  Material: vi.fn(),
  Geometry: vi.fn(),
  BufferGeometry: vi.fn(),
}));

// runs cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
  // Clear all localStorage/sessionStorage between tests
  localStorageMock.clear();
  sessionStorageMock.clear();
  // Clear any pending animation frames and timeouts
  animationFrameCallbacks.clear();
  animationFrameTimeouts.forEach((timeout) => clearTimeout(timeout));
  animationFrameTimeouts.clear();
  // Reset all mocks
  vi.clearAllMocks();
});
