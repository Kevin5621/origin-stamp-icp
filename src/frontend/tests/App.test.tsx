import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import App from "../src/App";
import { StrictMode } from "react";
import { act } from "react";

// Mock the backend canister
vi.mock("../../declarations/backend", () => ({
  backend: {
    greet: vi.fn().mockResolvedValue("Hello, Test!"),
    get_count: vi.fn().mockResolvedValue(BigInt(0)),
    increment: vi.fn().mockResolvedValue(BigInt(1)),
    prompt: vi.fn().mockResolvedValue("This is a mock LLM response"),
  },
}));

describe("App", () => {
  it("renders the main headings", async () => {
    await act(async () => {
      render(
        <StrictMode>
          <App />
        </StrictMode>,
      );
    });

    // After act completes, all state updates from useEffect should be processed
    expect(screen.getByText("Vibe Coding Template")).toBeInTheDocument();
    expect(
      screen.getByText("React + Rust + Internet Computer"),
    ).toBeInTheDocument();
  });

  it("handles greeting interaction", async () => {
    const { backend } = await import("../../declarations/backend");

    await act(async () => {
      render(
        <StrictMode>
          <App />
        </StrictMode>,
      );
    });

    const input = screen.getByPlaceholderText("Enter your name");
    const button = screen.getByText("Get Greeting");

    await act(async () => {
      // Type in the input
      fireEvent.change(input, { target: { value: "Tester" } });
    });

    await act(async () => {
      // Click the button
      fireEvent.click(button);
    });

    // Check if the backend.greet was called with the right parameter
    expect(backend.greet).toHaveBeenCalledWith("Tester");

    // After the promise resolves, check if the response is displayed
    expect(await screen.findByText("Hello, Test!")).toBeInTheDocument();
  });

  it("handles counter interaction", async () => {
    const { backend } = await import("../../declarations/backend");

    await act(async () => {
      render(
        <StrictMode>
          <App />
        </StrictMode>,
      );
    });

    const incrementButton = screen.getByText("Increment");
    const refreshButton = screen.getByText("Refresh Count");

    await act(async () => {
      // Click the increment button
      fireEvent.click(incrementButton);
    });

    // Check if the backend.increment was called
    expect(backend.increment).toHaveBeenCalled();

    // After the promise resolves, check if the count is updated
    expect(await screen.findByText("Counter: 1")).toBeInTheDocument();

    // Mock the new value for refreshing
    vi.mocked(backend.get_count).mockResolvedValueOnce(BigInt(5));

    await act(async () => {
      // Click the refresh button
      fireEvent.click(refreshButton);
    });

    // Check if the backend.get_count was called
    expect(backend.get_count).toHaveBeenCalled();

    // After the promise resolves, check if the count is updated
    expect(await screen.findByText("Counter: 5")).toBeInTheDocument();
  });

  it("handles LLM prompt interaction", async () => {
    const { backend } = await import("../../declarations/backend");

    await act(async () => {
      render(
        <StrictMode>
          <App />
        </StrictMode>,
      );
    });

    const textarea = screen.getByPlaceholderText("Ask the LLM something...");
    const button = screen.getByText("Send Prompt");

    await act(async () => {
      // Type in the textarea
      fireEvent.change(textarea, { target: { value: "Tell me a joke" } });
    });

    await act(async () => {
      // Click the button
      fireEvent.click(button);
    });

    // Check if the backend.prompt was called with the right parameter
    expect(backend.prompt).toHaveBeenCalledWith("Tell me a joke");

    // After the promise resolves, check if the response is displayed
    expect(
      await screen.findByText("This is a mock LLM response"),
    ).toBeInTheDocument();
  });
});
