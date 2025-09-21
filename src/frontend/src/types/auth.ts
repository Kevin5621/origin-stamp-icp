export interface User {
  username: string;
  loginTime: string;
  principal?: string;
  email?: string;
  picture?: string;
  loginMethod?: "username" | "icp" | "google";
}

export interface LoginResult {
  success: boolean;
  message: string;
  username?: string;
}

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

export interface CredentialResponse {
  credential?: string;
}
