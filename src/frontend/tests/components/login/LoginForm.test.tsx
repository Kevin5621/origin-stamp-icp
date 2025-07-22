import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "../../utils/testUtils";
import { LoginForm } from "../../../src/components/login/LoginForm";
import { backendService } from "../../../src/services/backendService";

// Mock backendService
vi.mock("../../../src/services/backendService", () => ({
  backendService: {
    login: vi.fn(),
    registerUser: vi.fn(),
  },
}));

describe("LoginForm Component", () => {
  const onBack = vi.fn();
  const onLoginSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLoginForm = () => {
    return render(
      <LoginForm onBack={onBack} onLoginSuccess={onLoginSuccess} />,
    );
  };

  it("renders the login form correctly", () => {
    renderLoginForm();

    expect(screen.getByText(/login_register_title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/login_username_label/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/login_password_label/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /login_button/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register_button/i }),
    ).toBeInTheDocument();
  });

  it("calls onBack when back button is clicked", () => {
    renderLoginForm();

    const backButton = screen.getByRole("button", { name: /kembali/i });
    fireEvent.click(backButton);

    expect(onBack).toHaveBeenCalled();
  });

  it("shows an error toast when attempting to login with empty fields", async () => {
    renderLoginForm();

    const loginButton = screen.getByRole("button", { name: /login_button/i });
    fireEvent.click(loginButton);

    // Should show an error toast
    await waitFor(() => {
      expect(
        screen.getByText(/login_fill_username_password/i),
      ).toBeInTheDocument();
    });
  });

  it("shows an error toast when attempting to register with empty fields", async () => {
    renderLoginForm();

    const registerButton = screen.getByRole("button", {
      name: /register_button/i,
    });
    fireEvent.click(registerButton);

    // Should show an error toast
    await waitFor(() => {
      expect(
        screen.getByText(/login_fill_username_password/i),
      ).toBeInTheDocument();
    });
  });

  it("calls the login service when filling out form and clicking login", async () => {
    // Mock successful login response
    const mockLoginResult = {
      success: true,
      username: ["testuser"],
      message: "Login successful",
    };
    (backendService.login as any).mockResolvedValue(mockLoginResult);

    renderLoginForm();

    // Fill out the form
    const usernameInput = screen.getByLabelText(/login_username_label/i);
    const passwordInput = screen.getByLabelText(/login_password_label/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Click login
    const loginButton = screen.getByRole("button", { name: /login_button/i });
    fireEvent.click(loginButton);

    // Verify service was called with correct params
    await waitFor(() => {
      expect(backendService.login).toHaveBeenCalledWith(
        "testuser",
        "password123",
      );
    });

    // Success toast should show
    await waitFor(() => {
      expect(screen.getByText(/login_success/i)).toBeInTheDocument();
    });

    // onLoginSuccess should be called
    await waitFor(() => {
      expect(onLoginSuccess).toHaveBeenCalled();
    });
  });

  it("shows error message when login fails", async () => {
    // Mock failed login response
    const mockLoginResult = {
      success: false,
      username: [],
      message: "Invalid credentials",
    };
    (backendService.login as any).mockResolvedValue(mockLoginResult);

    renderLoginForm();

    // Fill out the form
    const usernameInput = screen.getByLabelText(/login_username_label/i);
    const passwordInput = screen.getByLabelText(/login_password_label/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    // Click login
    const loginButton = screen.getByRole("button", { name: /login_button/i });
    fireEvent.click(loginButton);

    // Error toast should show
    await waitFor(() => {
      expect(screen.getByText(/login_failed/i)).toBeInTheDocument();
    });

    // onLoginSuccess should not be called
    expect(onLoginSuccess).not.toHaveBeenCalled();
  });

  it("calls the register service when filling out form and clicking register", async () => {
    // Mock successful registration response
    const mockRegisterResult = {
      success: true,
      username: ["newuser"],
      message: "Registration successful",
    };
    (backendService.registerUser as any).mockResolvedValue(mockRegisterResult);

    renderLoginForm();

    // Fill out the form
    const usernameInput = screen.getByLabelText(/login_username_label/i);
    const passwordInput = screen.getByLabelText(/login_password_label/i);

    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Click register
    const registerButton = screen.getByRole("button", {
      name: /register_button/i,
    });
    fireEvent.click(registerButton);

    // Verify service was called with correct params
    await waitFor(() => {
      expect(backendService.registerUser).toHaveBeenCalledWith(
        "newuser",
        "password123",
      );
    });

    // Success toast should show
    await waitFor(() => {
      expect(screen.getByText(/register_success/i)).toBeInTheDocument();
    });
  });

  it("shows error message when registration fails", async () => {
    // Mock failed registration response
    const mockRegisterResult = {
      success: false,
      username: [],
      message: "Username already exists",
    };
    (backendService.registerUser as any).mockResolvedValue(mockRegisterResult);

    renderLoginForm();

    // Fill out the form
    const usernameInput = screen.getByLabelText(/login_username_label/i);
    const passwordInput = screen.getByLabelText(/login_password_label/i);

    fireEvent.change(usernameInput, { target: { value: "existinguser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Click register
    const registerButton = screen.getByRole("button", {
      name: /register_button/i,
    });
    fireEvent.click(registerButton);

    // Error toast should show
    await waitFor(() => {
      expect(screen.getByText(/register_failed/i)).toBeInTheDocument();
    });
  });

  it("handles login service errors gracefully", async () => {
    // Mock service error
    (backendService.login as any).mockRejectedValue(new Error("Network error"));

    renderLoginForm();

    // Fill out the form
    const usernameInput = screen.getByLabelText(/login_username_label/i);
    const passwordInput = screen.getByLabelText(/login_password_label/i);

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Click login
    const loginButton = screen.getByRole("button", { name: /login_button/i });
    fireEvent.click(loginButton);

    // Error toast should show
    await waitFor(() => {
      expect(screen.getByText(/login_error/i)).toBeInTheDocument();
    });
  });

  it("handles register service errors gracefully", async () => {
    // Mock service error
    (backendService.registerUser as any).mockRejectedValue(
      new Error("Network error"),
    );

    renderLoginForm();

    // Fill out the form
    const usernameInput = screen.getByLabelText(/login_username_label/i);
    const passwordInput = screen.getByLabelText(/login_password_label/i);

    fireEvent.change(usernameInput, { target: { value: "newuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Click register
    const registerButton = screen.getByRole("button", {
      name: /register_button/i,
    });
    fireEvent.click(registerButton);

    // Error toast should show
    await waitFor(() => {
      expect(screen.getByText(/register_error/i)).toBeInTheDocument();
    });
  });
});
