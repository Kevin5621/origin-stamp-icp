import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import App from "../src/App";
import { StrictMode } from "react";

// Mock the backend canister
vi.mock("../../declarations/backend", () => ({
  backend: {
    greet: vi.fn().mockResolvedValue("Hello, Test!"),
    get_count: vi.fn().mockResolvedValue(BigInt(0)),
    increment: vi.fn().mockResolvedValue(BigInt(1)),
  },
}));

describe("App", () => {
  it("renders the main headings", () => {
    render(
      <StrictMode>
        <App />
      </StrictMode>
    );

    expect(screen.getByText("Vibe Coding Template")).toBeInTheDocument();
    expect(
      screen.getByText("React + Rust + Internet Computer")
    ).toBeInTheDocument();
  });
});
