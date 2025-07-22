import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../../utils/testUtils";
import QuickActionCard from "../../../src/components/dashboard/QuickActionCard";

describe("QuickActionCard Component", () => {
  const mockIcon = <svg data-testid="test-icon" />;
  const mockTitle = "Create Project";
  const mockDescription = "Start a new digital art project";
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with all props correctly", () => {
    render(
      <QuickActionCard
        icon={mockIcon}
        title={mockTitle}
        description={mockDescription}
        onClick={mockOnClick}
      />,
    );

    // Check if all elements are rendered
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(screen.getByText(mockTitle)).toBeInTheDocument();
    expect(screen.getByText(mockDescription)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    render(
      <QuickActionCard
        icon={mockIcon}
        title={mockTitle}
        description={mockDescription}
        onClick={mockOnClick}
      />,
    );

    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when Enter key is pressed", () => {
    render(
      <QuickActionCard
        icon={mockIcon}
        title={mockTitle}
        description={mockDescription}
        onClick={mockOnClick}
      />,
    );

    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when Space key is pressed", () => {
    render(
      <QuickActionCard
        icon={mockIcon}
        title={mockTitle}
        description={mockDescription}
        onClick={mockOnClick}
      />,
    );

    fireEvent.keyDown(screen.getByRole("button"), { key: " " });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("renders with 'secondary' variant by default", () => {
    render(
      <QuickActionCard
        icon={mockIcon}
        title={mockTitle}
        description={mockDescription}
        onClick={mockOnClick}
      />,
    );

    const card = screen.getByRole("button");
    expect(card).toHaveClass("quick-action-secondary");
    expect(card).not.toHaveClass("quick-action-primary");
  });

  it("renders with 'primary' variant when specified", () => {
    render(
      <QuickActionCard
        icon={mockIcon}
        title={mockTitle}
        description={mockDescription}
        onClick={mockOnClick}
        variant="primary"
      />,
    );

    const card = screen.getByRole("button");
    expect(card).toHaveClass("quick-action-primary");
    expect(card).not.toHaveClass("quick-action-secondary");
  });

  it("renders arrow icon", () => {
    render(
      <QuickActionCard
        icon={mockIcon}
        title={mockTitle}
        description={mockDescription}
        onClick={mockOnClick}
      />,
    );

    const arrowSVG = screen
      .getByRole("button")
      .querySelector(".action-arrow svg");
    expect(arrowSVG).toBeInTheDocument();
  });
});
