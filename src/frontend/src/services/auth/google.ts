/**
 * Google Authentication Module
 * Handles Google OAuth integration for authentication
 */

import {
  GoogleUser,
  GoogleAuthConfig,
  CredentialResponse,
} from "../../types/auth";
import { envService } from "../core";

export interface GoogleAuthError {
  code: string;
  message: string;
  details?: unknown;
}

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private readonly config: GoogleAuthConfig;
  private initialized = false;
  private isGoogleScriptLoaded = false;

  constructor(config: GoogleAuthConfig) {
    this.config = config;
    this.checkGoogleScriptAvailability();
  }

  static getInstance(config?: GoogleAuthConfig): GoogleAuthService {
    if (!GoogleAuthService.instance && config) {
      GoogleAuthService.instance = new GoogleAuthService(config);
    }
    return GoogleAuthService.instance;
  }

  /**
   * Check if Google Identity Services script is loaded
   */
  private checkGoogleScriptAvailability(): void {
    // Check if we're in browser environment
    if (typeof window === "undefined") {
      this.isGoogleScriptLoaded = false;
      return;
    }

    this.isGoogleScriptLoaded = !!window.google?.accounts?.id;
  }

  /**
   * Wait for Google script to be available
   */
  private async waitForGoogleScript(timeoutMs: number = 10000): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isGoogleScriptLoaded) {
        resolve();
        return;
      }

      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        this.checkGoogleScriptAvailability();

        if (this.isGoogleScriptLoaded) {
          clearInterval(checkInterval);
          resolve();
        } else if (Date.now() - startTime > timeoutMs) {
          clearInterval(checkInterval);
          reject(
            new Error(
              "Google Identity Services script not loaded within timeout",
            ),
          );
        }
      }, 100);
    });
  }

  async initialize(): Promise<void> {
    try {
      if (this.initialized) {
        return;
      }

      // Wait for Google script to be available
      await this.waitForGoogleScript();

      // Initialize Google Auth
      this.initializeGoogleAuth();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Google OAuth initialization failed: ${errorMsg}`);
    }
  }

  private initializeGoogleAuth(): void {
    try {
      // Check if we're in browser environment
      if (typeof window === "undefined") {
        console.warn("⚠️ Google OAuth cannot be initialized on server-side");
        return;
      }

      if (!window.google?.accounts?.id) {
        throw new Error("Google Identity Services not available");
      }

      window.google.accounts.id.initialize({
        client_id: this.config.clientId,
        callback: () => {}, // Empty callback for initialization
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      this.initialized = true;
      console.log("✅ Google OAuth initialized successfully");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ Google OAuth initialization failed:", errorMsg);
      throw new Error(`Google OAuth initialization failed: ${errorMsg}`);
    }
  }

  async signIn(): Promise<GoogleUser> {
    try {
      // Check if we're in browser environment
      if (typeof window === "undefined") {
        throw new Error(
          "Google Auth signIn can only be called in browser environment",
        );
      }

      await this.initialize();

      return new Promise((resolve, reject) => {
        const tempDiv = document.createElement("div");
        tempDiv.style.position = "fixed";
        tempDiv.style.top = "-9999px";
        tempDiv.style.left = "-9999px";
        tempDiv.style.visibility = "hidden";
        document.body.appendChild(tempDiv);

        try {
          if (!window.google?.accounts?.id) {
            throw new Error("Google Identity Services not available");
          }

          window.google.accounts.id.initialize({
            client_id: this.config.clientId,
            callback: (credentialResponse: CredentialResponse) => {
              try {
                document.body.removeChild(tempDiv);

                if (!credentialResponse.credential) {
                  reject(new Error("No credential received from Google"));
                  return;
                }

                const userInfo = this.parseJWTToken(
                  credentialResponse.credential,
                );
                console.log("✅ Google sign-in successful:", userInfo.email);
                resolve(userInfo);
              } catch (error) {
                console.error("❌ Error processing Google credential:", error);
                reject(error);
              }
            },
            context: "signin",
            ux_mode: "popup",
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          window.google.accounts.id.renderButton(tempDiv, {
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
            width: 250,
          });

          setTimeout(() => {
            const button = tempDiv.querySelector(
              'div[role="button"]',
            ) as HTMLElement;
            if (button) {
              button.click();
            } else {
              if (window.google?.accounts?.id) {
                window.google.accounts.id.prompt((notification) => {
                  if (
                    notification.isNotDisplayed() ||
                    notification.isSkippedMoment()
                  ) {
                    document.body.removeChild(tempDiv);
                    reject(
                      new Error(
                        "Google Sign-In was cancelled or not displayed",
                      ),
                    );
                  }
                });
              } else {
                document.body.removeChild(tempDiv);
                reject(new Error("Google Identity Services not available"));
              }
            }
          }, 100);

          // Timeout after 30 seconds
          setTimeout(() => {
            if (document.body.contains(tempDiv)) {
              document.body.removeChild(tempDiv);
              reject(new Error("Google Sign-In timeout - please try again"));
            }
          }, 30000);
        } catch (error) {
          if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv);
          }
          console.error("❌ Google sign-in error:", error);
          reject(error);
        }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Google sign-in failed: ${errorMsg}`);
    }
  }

  async signUp(): Promise<GoogleUser> {
    try {
      // Check if we're in browser environment
      if (typeof window === "undefined") {
        throw new Error(
          "Google Auth signUp can only be called in browser environment",
        );
      }

      await this.initialize();

      return new Promise((resolve, reject) => {
        const tempDiv = document.createElement("div");
        tempDiv.style.position = "fixed";
        tempDiv.style.top = "-9999px";
        tempDiv.style.left = "-9999px";
        tempDiv.style.visibility = "hidden";
        document.body.appendChild(tempDiv);

        try {
          if (!window.google?.accounts?.id) {
            throw new Error("Google Identity Services not available");
          }

          window.google.accounts.id.initialize({
            client_id: this.config.clientId,
            callback: (credentialResponse: CredentialResponse) => {
              try {
                document.body.removeChild(tempDiv);

                if (!credentialResponse.credential) {
                  reject(new Error("No credential received from Google"));
                  return;
                }

                const userInfo = this.parseJWTToken(
                  credentialResponse.credential,
                );
                console.log("✅ Google sign-up successful:", userInfo.email);
                resolve(userInfo);
              } catch (error) {
                console.error("❌ Error processing Google credential:", error);
                reject(error);
              }
            },
            context: "signup",
            ux_mode: "popup",
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          window.google.accounts.id.renderButton(tempDiv, {
            theme: "outline",
            size: "large",
            text: "signup_with",
            shape: "rectangular",
            width: 250,
          });

          setTimeout(() => {
            const button = tempDiv.querySelector(
              'div[role="button"]',
            ) as HTMLElement;
            if (button) {
              button.click();
            } else {
              if (window.google?.accounts?.id) {
                window.google.accounts.id.prompt((notification) => {
                  if (
                    notification.isNotDisplayed() ||
                    notification.isSkippedMoment()
                  ) {
                    document.body.removeChild(tempDiv);
                    reject(
                      new Error(
                        "Google Sign-Up was cancelled or not displayed",
                      ),
                    );
                  }
                });
              } else {
                document.body.removeChild(tempDiv);
                reject(new Error("Google Identity Services not available"));
              }
            }
          }, 100);

          // Timeout after 30 seconds
          setTimeout(() => {
            if (document.body.contains(tempDiv)) {
              document.body.removeChild(tempDiv);
              reject(new Error("Google Sign-Up timeout - please try again"));
            }
          }, 30000);
        } catch (error) {
          if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv);
          }
          console.error("❌ Google sign-up error:", error);
          reject(error);
        }
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Google sign-up failed: ${errorMsg}`);
    }
  }

  private parseJWTToken(token: string): GoogleUser {
    try {
      if (!token || typeof token !== "string") {
        throw new Error("Invalid token provided");
      }

      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT token format");
      }

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );

      const payload = JSON.parse(jsonPayload);

      // Validate required fields
      if (!payload.sub || !payload.email) {
        throw new Error("Invalid JWT payload - missing required fields");
      }

      return {
        id: payload.sub,
        name: payload.name || payload.email,
        email: payload.email,
        picture: payload.picture || "",
        given_name: payload.given_name,
        family_name: payload.family_name,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("❌ JWT token parsing failed:", errorMsg);
      throw new Error(`Failed to parse JWT token: ${errorMsg}`);
    }
  }

  signOut(): void {
    try {
      // Check if we're in browser environment
      if (typeof window === "undefined") {
        console.warn("⚠️ Google OAuth signOut called on server-side");
        return;
      }

      if (this.initialized && window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
        console.log("✅ Google OAuth sign-out completed");
      }
    } catch (error) {
      console.error("❌ Google OAuth sign-out error:", error);
    }
  }

  /**
   * Check if Google OAuth is available
   */
  isAvailable(): boolean {
    return this.isGoogleScriptLoaded && this.initialized;
  }

  /**
   * Get Google OAuth status
   */
  getStatus(): {
    scriptLoaded: boolean;
    initialized: boolean;
    available: boolean;
    clientId: string;
  } {
    return {
      scriptLoaded: this.isGoogleScriptLoaded,
      initialized: this.initialized,
      available: this.isAvailable(),
      clientId: this.config.clientId,
    };
  }
}

export const googleAuthService = GoogleAuthService.getInstance({
  clientId: envService.getGoogleClientId(),
});
