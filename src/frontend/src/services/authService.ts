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
      // Fallback to local storage if IC not available
    }

    // Check local storage for cached principal
    const cachedPrincipal = localStorage.getItem("ic_vibe_user_principal");
    if (cachedPrincipal) {
      try {
        const principal = Principal.fromText(cachedPrincipal);
        this.currentUserPrincipal = principal;
        this.isAuthenticated = true;
        return principal;
      } catch (error) {
        localStorage.removeItem("ic_vibe_user_principal");
      }
    }

    return null;
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
