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

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private readonly config: GoogleAuthConfig;
  private initialized = false;

  constructor(config: GoogleAuthConfig) {
    this.config = config;
  }

  static getInstance(config?: GoogleAuthConfig): GoogleAuthService {
    if (!GoogleAuthService.instance && config) {
      GoogleAuthService.instance = new GoogleAuthService(config);
    }
    return GoogleAuthService.instance;
  }

  async initialize(): Promise<void> {
    return new Promise((resolve) => {
      if (this.initialized) {
        resolve();
        return;
      }

      if (!window.google) {
        const checkGoogle = () => {
          if (window.google) {
            this.initializeGoogleAuth();
            resolve();
          } else {
            setTimeout(checkGoogle, 100);
          }
        };
        checkGoogle();
      } else {
        this.initializeGoogleAuth();
        resolve();
      }
    });
  }

  private initializeGoogleAuth(): void {
    try {
      window.google!.accounts!.id!.initialize({
        client_id: this.config.clientId,
        callback: () => {},
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      this.initialized = true;
    } catch (error) {
      console.error("GoogleAuth: Initialization failed:", error);
    }
  }

  async signIn(): Promise<GoogleUser> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "fixed";
      tempDiv.style.top = "-9999px";
      tempDiv.style.left = "-9999px";
      tempDiv.style.visibility = "hidden";
      document.body.appendChild(tempDiv);

      try {
        window.google!.accounts!.id!.initialize({
          client_id: this.config.clientId,
          callback: (credentialResponse: CredentialResponse) => {
            try {
              document.body.removeChild(tempDiv);

              if (!credentialResponse.credential) {
                reject(new Error("No credential received"));
                return;
              }

              const userInfo = this.parseJWTToken(
                credentialResponse.credential,
              );
              resolve(userInfo);
            } catch (error) {
              reject(error);
            }
          },
          context: "signin",
          ux_mode: "popup",
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google!.accounts!.id!.renderButton(tempDiv, {
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
            window.google!.accounts!.id!.prompt((notification) => {
              if (
                notification.isNotDisplayed() ||
                notification.isSkippedMoment()
              ) {
                document.body.removeChild(tempDiv);
                reject(
                  new Error("Google Sign-In was cancelled or not displayed"),
                );
              }
            });
          }
        }, 100);

        setTimeout(() => {
          if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv);
            reject(new Error("Google Sign-In timeout"));
          }
        }, 30000);
      } catch (error) {
        if (document.body.contains(tempDiv)) {
          document.body.removeChild(tempDiv);
        }
        reject(error);
      }
    });
  }

  async signUp(): Promise<GoogleUser> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "fixed";
      tempDiv.style.top = "-9999px";
      tempDiv.style.left = "-9999px";
      tempDiv.style.visibility = "hidden";
      document.body.appendChild(tempDiv);

      try {
        window.google!.accounts!.id!.initialize({
          client_id: this.config.clientId,
          callback: (credentialResponse: CredentialResponse) => {
            try {
              document.body.removeChild(tempDiv);

              if (!credentialResponse.credential) {
                reject(new Error("No credential received"));
                return;
              }

              const userInfo = this.parseJWTToken(
                credentialResponse.credential,
              );
              resolve(userInfo);
            } catch (error) {
              reject(error);
            }
          },
          context: "signup",
          ux_mode: "popup",
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google!.accounts!.id!.renderButton(tempDiv, {
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
            window.google!.accounts!.id!.prompt((notification) => {
              if (
                notification.isNotDisplayed() ||
                notification.isSkippedMoment()
              ) {
                document.body.removeChild(tempDiv);
                reject(
                  new Error("Google Sign-Up was cancelled or not displayed"),
                );
              }
            });
          }
        }, 100);

        setTimeout(() => {
          if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv);
            reject(new Error("Google Sign-Up timeout"));
          }
        }, 30000);
      } catch (error) {
        if (document.body.contains(tempDiv)) {
          document.body.removeChild(tempDiv);
        }
        reject(error);
      }
    });
  }

  private parseJWTToken(token: string): GoogleUser {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );

      const payload = JSON.parse(jsonPayload);

      return {
        id: payload.sub,
        name: payload.name || payload.email,
        email: payload.email,
        picture: payload.picture || "",
        given_name: payload.given_name,
        family_name: payload.family_name,
      };
    } catch (error) {
      throw new Error("Failed to parse JWT token: " + error);
    }
  }

  signOut(): void {
    if (this.initialized) {
      window.google!.accounts!.id!.disableAutoSelect();
    }
  }
}

export const googleAuthService = GoogleAuthService.getInstance({
  clientId: envService.getGoogleClientId(),
});
