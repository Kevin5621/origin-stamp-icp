import { Principal } from "@dfinity/principal";

declare global {
  interface Window {
    ic?: {
      plug?: {
        agent?: {
          getPrincipal(): Promise<Principal>;
        };
      };
    };
  }
}

export class AuthService {
  private static currentUserPrincipal: Principal | null = null;
  private static isAuthenticated: boolean = false;

  static async getCurrentUserPrincipal(): Promise<Principal | null> {
    if (this.isAuthenticated && this.currentUserPrincipal) {
      return this.currentUserPrincipal;
    }

    try {
      if (window.ic?.plug?.agent) {
        const principal = await window.ic.plug.agent.getPrincipal();
        if (principal) {
          this.currentUserPrincipal = principal;
          this.isAuthenticated = true;
          return principal;
        }
      }
    } catch (error) {
      console.error("IC Principal detection failed:", error);
    }

    const googleUser = this.getGoogleOAuthUser();
    if (googleUser) {
      const googlePrincipal =
        await this.generatePrincipalFromGoogleUser(googleUser);
      this.currentUserPrincipal = googlePrincipal;
      this.isAuthenticated = true;
      return googlePrincipal;
    }

    const usernameAuth = this.getUsernamePasswordUser();
    if (usernameAuth) {
      const usernamePrincipal =
        await this.generatePrincipalFromUsername(usernameAuth);
      this.currentUserPrincipal = usernamePrincipal;
      this.isAuthenticated = true;
      return usernamePrincipal;
    }

    const cachedPrincipal = localStorage.getItem("originstamp_user_principal");
    if (cachedPrincipal) {
      try {
        const principal = Principal.fromText(cachedPrincipal);
        this.currentUserPrincipal = principal;
        this.isAuthenticated = true;
        return principal;
      } catch (error) {
        try {
          const validPrincipalText =
            await this.convertHashToValidPrincipal(cachedPrincipal);
          const principal = Principal.fromText(validPrincipalText);
          this.currentUserPrincipal = principal;
          this.isAuthenticated = true;
          return principal;
        } catch (fallbackError) {
          console.error(
            "Failed to create valid principal from hash:",
            fallbackError,
          );
          localStorage.removeItem("originstamp_user_principal");
        }
      }
    }

    return null;
  }

  private static getGoogleOAuthUser(): any {
    const googleUser = sessionStorage.getItem("google_oauth_user");
    if (googleUser) {
      try {
        return JSON.parse(googleUser);
      } catch (error) {
        return null;
      }
    }

    const localGoogleUser = localStorage.getItem("google_oauth_user");
    if (localGoogleUser) {
      try {
        return JSON.parse(localGoogleUser);
      } catch (error) {
        return null;
      }
    }

    const possibleKeys = [
      "google_user",
      "google_oauth_token",
      "google_auth_user",
      "g_oauth_user",
    ];

    for (const key of possibleKeys) {
      const userData = sessionStorage.getItem(key) || localStorage.getItem(key);
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (error) {
          continue;
        }
      }
    }

    return null;
  }

  private static async generatePrincipalFromGoogleUser(
    googleUser: any,
  ): Promise<Principal> {
    try {
      const userId = googleUser.id || googleUser.email || "google_user";
      const salt = this.getOrCreateSalt();
      const secureHash = await this.generateSecureHash(userId + salt);
      const principalText = secureHash.toString(16).padStart(16, "0");
      return Principal.fromText(principalText);
    } catch (error) {
      console.error("Failed to generate secure principal:", error);
      throw new Error("Authentication failed - principal generation error");
    }
  }

  private static async generateSecureHash(input: string): Promise<number> {
    try {
      if (window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
        const hashArray = new Uint8Array(hashBuffer);

        let hash = 0;
        for (let i = 0; i < 4 && i < hashArray.length; i++) {
          hash = (hash << 8) | hashArray[i];
        }
        return Math.abs(hash);
      } else {
        return this.secureFallbackHash(input);
      }
    } catch (error) {
      console.error("SHA-256 hash failed, using fallback:", error);
      return this.secureFallbackHash(input);
    }
  }

  private static secureFallbackHash(str: string): number {
    let hash = 0x811c9dc5;
    const prime = 0x01000193;

    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = (hash * prime) >>> 0;
    }

    return hash;
  }

  private static getOrCreateSalt(): string {
    let salt = localStorage.getItem("originstamp_auth_salt");
    if (!salt) {
      salt = this.generateSecureSalt();
      localStorage.setItem("originstamp_auth_salt", salt);
    }
    return salt;
  }

  private static generateSecureSalt(): string {
    const array = new Uint8Array(16);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      "",
    );
  }

  private static getUsernamePasswordUser(): any {
    const possibleKeys = [
      "originstamp_user",
      "username_auth",
      "user_session",
      "login_user",
    ];

    for (const key of possibleKeys) {
      const userData = sessionStorage.getItem(key) || localStorage.getItem(key);
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (error) {
          continue;
        }
      }
    }

    return null;
  }

  private static async generatePrincipalFromUsername(
    userData: any,
  ): Promise<Principal> {
    try {
      const username = userData.username || userData.email || "username_user";
      const salt = this.getOrCreateSalt();
      const secureHash = await this.generateSecureHash(username + salt);
      const principalText = secureHash.toString(16).padStart(16, "0");
      return Principal.fromText(principalText);
    } catch (error) {
      console.error("Failed to generate secure principal:", error);
      throw new Error("Authentication failed - principal generation error");
    }
  }

  static async authenticateUser(principal: Principal): Promise<boolean> {
    try {
      this.currentUserPrincipal = principal;
      this.isAuthenticated = true;
      localStorage.setItem("originstamp_user_principal", principal.toString());
      return true;
    } catch (error) {
      return false;
    }
  }

  static signOut(): void {
    this.currentUserPrincipal = null;
    this.isAuthenticated = false;
    localStorage.removeItem("originstamp_user_principal");
  }

  static isUserAuthenticated(): boolean {
    return this.isAuthenticated && this.currentUserPrincipal !== null;
  }

  static getUserPrincipalString(): string | null {
    return this.currentUserPrincipal?.toString() || null;
  }

  private static async convertHashToValidPrincipal(
    hash: string,
  ): Promise<string> {
    try {
      const shortHash = hash.slice(0, 8).padEnd(8, "0");
      const bytes = new Uint8Array(8);
      for (let i = 0; i < 8; i++) {
        bytes[i] = parseInt(shortHash[i], 16) || 0;
      }
      return Principal.fromUint8Array(bytes).toText();
    } catch (error) {
      console.warn(
        "Failed to create Principal from bytes, using fallback:",
        error,
      );
      return "2vxsx-fae";
    }
  }
}

export default AuthService;
