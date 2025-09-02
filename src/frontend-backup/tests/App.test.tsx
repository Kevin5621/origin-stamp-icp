import { render as rtlRender } from "@testing-library/react";
import { describe, it } from "vitest";
import App from "../src/App";
import { StrictMode, act } from "react";

describe("App", () => {
  it("renders the main headings", async () => {
    await act(async () => {
      rtlRender(
        <StrictMode>
          <App />
        </StrictMode>,
      );
    });
  });
});
