import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../src/App";
import { StrictMode } from "react";
import { act } from "react";

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
    expect(screen.getByText("welcome_message")).toBeInTheDocument();
    expect(screen.getByText("hello_world")).toBeInTheDocument();
  });
});
