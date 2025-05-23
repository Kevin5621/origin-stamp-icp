import "@testing-library/jest-dom/vitest";
import "@testing-library/jest-dom";
import "cross-fetch/polyfill";
import { vi } from "vitest";

// Mock console.error globally to suppress error logs in tests
// This prevents expected errors from cluttering test output
vi.spyOn(console, "error").mockImplementation(() => {});
