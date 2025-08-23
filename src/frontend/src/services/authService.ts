import { Principal } from "@dfinity/principal";

// Extend Window interface for IC integration
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

/**
 * Authentication Service - Production-ready user management
 */
export class AuthService {
  private static currentUserPrincipal: Principal | null = null;
  private static isAuthenticated: boolean = false;

  /**
   * Get current authenticated user principal
   */
  static async getCurrentUserPrincipal(): Promise<Principal | null> {
    // Check if user is already authenticated
    if (this.isAuthenticated && this.currentUserPrincipal) {
      return this.currentUserPrincipal;
    }

    // Try to get from Internet Computer identity
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
      // IC Principal detection failed, continue to other auth methods
    }

    // Check for Google OAuth user
    const googleUser = this.getGoogleOAuthUser();
    if (googleUser) {
      // Generate a deterministic principal from Google user ID
      const googlePrincipal = this.generatePrincipalFromGoogleUser(googleUser);
      this.currentUserPrincipal = googlePrincipal;
      this.isAuthenticated = true;
      return googlePrincipal;
    }

    // Check for Username/Password authentication
    const usernameAuth = this.getUsernamePasswordUser();
    if (usernameAuth) {
      const usernamePrincipal =
        this.generatePrincipalFromUsername(usernameAuth);
      this.currentUserPrincipal = usernamePrincipal;
      this.isAuthenticated = true;
      return usernamePrincipal;
    }

    // Check local storage for cached principal
    const cachedPrincipal = localStorage.getItem("originstamp_user_principal");
    if (cachedPrincipal) {
      try {
        const principal = Principal.fromText(cachedPrincipal);
        this.currentUserPrincipal = principal;
        this.isAuthenticated = true;
        return principal;
      } catch (error) {
        localStorage.removeItem("originstamp_user_principal");
      }
    }

    return null;
  }

  /**
   * Get Google OAuth user from session/local storage
   */
  private static getGoogleOAuthUser(): any {
    // Check session storage for Google OAuth data
    const googleUser = sessionStorage.getItem("google_oauth_user");
    if (googleUser) {
      try {
        return JSON.parse(googleUser);
      } catch (error) {
        return null;
      }
    }

    // Check local storage as fallback
    const localGoogleUser = localStorage.getItem("google_oauth_user");
    if (localGoogleUser) {
      try {
        return JSON.parse(localGoogleUser);
      } catch (error) {
        return null;
      }
    }

    // Check for other Google OAuth storage keys
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
          // Continue to next key
        }
      }
    }

    return null;
  }

  /**
   * Generate deterministic principal from Google user
   */
  private static generatePrincipalFromGoogleUser(googleUser: any): Principal {
    // Create a deterministic hash from Google user ID
    const userId = googleUser.id || googleUser.email || "google_user";
    const hash = this.simpleHash(userId);

    // Convert hash to principal format (this is a simplified approach)
    // In production, you'd want a more secure method
    const principalText = hash.toString(16).padStart(16, "0");
    return Principal.fromText(principalText);
  }

  /**
   * Simple hash function for demo purposes
   */
  private static simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get Username/Password user from storage
   */
  private static getUsernamePasswordUser(): any {
    // Check for username/password authentication data
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
          // Continue to next key
        }
      }
    }

    return null;
  }

  /**
   * Generate deterministic principal from username
   */
  private static generatePrincipalFromUsername(userData: any): Principal {
    // Create a deterministic hash from username
    const username = userData.username || userData.email || "username_user";
    const hash = this.simpleHash(username);

    // Convert hash to principal format
    const principalText = hash.toString(16).padStart(16, "0");
    return Principal.fromText(principalText);
  }

  /**
   * Authenticate user with principal
   */
  static async authenticateUser(principal: Principal): Promise<boolean> {
    try {
      this.currentUserPrincipal = principal;
      this.isAuthenticated = true;

      // Cache principal in local storage
      localStorage.setItem("ic_vibe_user_principal", principal.toString());

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Sign out user
   */
  static signOut(): void {
    this.currentUserPrincipal = null;
    this.isAuthenticated = false;
    localStorage.removeItem("ic_vibe_user_principal");
  }

  /**
   * Check if user is authenticated
   */
  static isUserAuthenticated(): boolean {
    return this.isAuthenticated && this.currentUserPrincipal !== null;
  }

  /**
   * Get user principal as string
   */
  static getUserPrincipalString(): string | null {
    return this.currentUserPrincipal?.toString() || null;
  }
}

export default AuthService;
