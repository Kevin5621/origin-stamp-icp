// Google Authentication Service
export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

export interface GoogleAuthConfig {
  clientId: string;
}

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private config: GoogleAuthConfig;
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
    window.google.accounts.id.initialize({
      client_id: this.config.clientId,
      callback: () => {}, // Will be overridden in each login call
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    this.initialized = true;
  }

  async signIn(): Promise<GoogleUser> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      window.google.accounts.id.initialize({
        client_id: this.config.clientId,
        callback: (credentialResponse: CredentialResponse) => {
          try {
            if (!credentialResponse.credential) {
              reject(new Error("No credential received"));
              return;
            }

            // Parse JWT token to get user info
            const userInfo = this.parseJWTToken(credentialResponse.credential);
            resolve(userInfo);
          } catch (error) {
            reject(error);
          }
        },
        context: "signin",
        ux_mode: "popup",
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject(new Error("Google Sign-In was cancelled or not displayed"));
        }
      });
    });
  }

  async signUp(): Promise<GoogleUser> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      window.google.accounts.id.initialize({
        client_id: this.config.clientId,
        callback: (credentialResponse: CredentialResponse) => {
          try {
            if (!credentialResponse.credential) {
              reject(new Error("No credential received"));
              return;
            }

            // Parse JWT token to get user info
            const userInfo = this.parseJWTToken(credentialResponse.credential);
            resolve(userInfo);
          } catch (error) {
            reject(error);
          }
        },
        context: "signup",
        ux_mode: "popup",
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject(new Error("Google Sign-Up was cancelled or not displayed"));
        }
      });
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
      window.google.accounts.id.disableAutoSelect();
    }
  }
}

// Export default instance
export const googleAuthService = GoogleAuthService.getInstance({
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id",
});
