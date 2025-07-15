import { describe, it, expect, vi, beforeEach } from "vitest";
import { backendService } from "../../src/services/backendService";
import { backend } from "../../../declarations/backend";

// Mock the backend canister
vi.mock("../../../declarations/backend", () => ({
  backend: {
    prompt: vi.fn().mockResolvedValue("This is a mock LLM response"),
    register_user: vi.fn().mockResolvedValue({
      success: true,
      message: "User registered successfully",
      username: ["testuser"],
    }),
    login: vi.fn().mockResolvedValue({
      success: true,
      message: "Login successful",
      username: ["testuser"],
    }),
    get_all_users: vi.fn().mockResolvedValue(["testuser1", "testuser2"]),
    get_user_info: vi
      .fn()
      .mockResolvedValue([["testuser", BigInt(1234567890)]]),
    get_user_count: vi.fn().mockResolvedValue(BigInt(2)),
  },
}));

describe("backendService", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe("sendLlmPrompt", () => {
    it("should call backend.prompt with the provided prompt", async () => {
      // Execute
      const result = await backendService.sendLlmPrompt("Test prompt");

      // Assert
      expect(backend.prompt).toHaveBeenCalledWith("Test prompt");
      expect(result).toBe("This is a mock LLM response");
    });
  });

  describe("registerUser", () => {
    it("should call backend.register_user with username and password", async () => {
      // Execute
      const result = await backendService.registerUser(
        "testuser",
        "password123",
      );

      // Assert
      expect(backend.register_user).toHaveBeenCalledWith(
        "testuser",
        "password123",
      );
      expect(result.success).toBe(true);
      expect(result.message).toBe("User registered successfully");
    });
  });

  describe("login", () => {
    it("should call backend.login with username and password", async () => {
      // Execute
      const result = await backendService.login("testuser", "password123");

      // Assert
      expect(backend.login).toHaveBeenCalledWith("testuser", "password123");
      expect(result.success).toBe(true);
      expect(result.message).toBe("Login successful");
    });
  });

  describe("getAllUsers", () => {
    it("should call backend.get_all_users", async () => {
      // Execute
      const result = await backendService.getAllUsers();

      // Assert
      expect(backend.get_all_users).toHaveBeenCalled();
      expect(result).toEqual(["testuser1", "testuser2"]);
    });
  });

  describe("getUserInfo", () => {
    it("should call backend.get_user_info with username", async () => {
      // Execute
      const result = await backendService.getUserInfo("testuser");

      // Assert
      expect(backend.get_user_info).toHaveBeenCalledWith("testuser");
      expect(result).toEqual(["testuser", BigInt(1234567890)]);
    });
  });

  describe("getUserCount", () => {
    it("should call backend.get_user_count", async () => {
      // Execute
      const result = await backendService.getUserCount();

      // Assert
      expect(backend.get_user_count).toHaveBeenCalled();
      expect(result).toBe(BigInt(2));
    });
  });
});
