// Google Identity Services type definitions
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfiguration) => void;
          prompt: (callback?: (notification: PromptMoment) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: GsiButtonConfiguration,
          ) => void;
          disableAutoSelect: () => void;
          storeCredential: (credential: {
            id: string;
            password: string;
          }) => void;
          cancel: () => void;
          onGoogleLibraryLoad: () => void;
          revoke: (
            email: string,
            callback: (response: RevocationResponse) => void,
          ) => void;
        };
        oauth2: {
          initTokenClient: (config: TokenClientConfig) => TokenClient;
          hasGrantedAnyScope: (
            tokenResponse: TokenResponse,
            ...scopes: string[]
          ) => boolean;
          hasGrantedAllScopes: (
            tokenResponse: TokenResponse,
            ...scopes: string[]
          ) => boolean;
          revoke: (
            token: string,
            callback?: (response: RevokeTokenResponse) => void,
          ) => void;
        };
      };
    };
  }

  interface GoogleIdConfiguration {
    client_id: string;
    callback?: (credentialResponse: CredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: "signin" | "signup" | "use";
    state_cookie_domain?: string;
    ux_mode?: "popup" | "redirect";
    login_uri?: string;
    native_callback?: (response: GoogleCredentialResponse) => void;
    intermediate_iframe_close_callback?: () => void;
    itp_support?: boolean;
    use_fedcm_for_prompt?: boolean;
  }

  interface CredentialResponse {
    credential: string;
    select_by: string;
    clientId?: string;
  }

  interface GoogleCredentialResponse {
    credential: string;
    clientId?: string;
  }

  interface GsiButtonConfiguration {
    theme?: "outline" | "filled_blue" | "filled_black";
    size?: "large" | "medium" | "small";
    text?: "signin_with" | "signup_with" | "continue_with" | "signin";
    shape?: "rectangular" | "pill" | "circle" | "square";
    logo_alignment?: "left" | "center";
    width?: number;
    type?: "standard" | "icon";
  }

  interface PromptMoment {
    getMomentType: () => "display" | "skipped" | "dismissed";
    getDismissedReason: () =>
      | "credential_returned"
      | "cancel_called"
      | "flow_restarted";
    getSkippedReason: () =>
      | "auto_cancel"
      | "user_cancel"
      | "tap_outside"
      | "issuer_mixed";
    getNotDisplayedReason: () =>
      | "browser_not_supported"
      | "invalid_client"
      | "missing_client_id";
    isDisplayMoment: () => boolean;
    isDisplayed: () => boolean;
    isNotDisplayed: () => boolean;
    isSkippedMoment: () => boolean;
    isDismissedMoment: () => boolean;
  }

  interface TokenClient {
    requestAccessToken: (options?: OverridableTokenClientConfig) => void;
  }

  interface TokenClientConfig {
    client_id: string;
    callback: (tokenResponse: TokenResponse) => void;
    scope: string;
    include_granted_scopes?: boolean;
    enable_serial_consent?: boolean;
    hint?: string;
    hosted_domain?: string;
    state?: string;
  }

  interface OverridableTokenClientConfig {
    scope?: string;
    include_granted_scopes?: boolean;
    enable_serial_consent?: boolean;
    hint?: string;
    hosted_domain?: string;
    state?: string;
  }

  interface TokenResponse {
    access_token: string;
    authuser: string;
    expires_in: number;
    hd?: string;
    prompt: string;
    scope: string;
    state?: string;
    token_type: string;
  }

  interface RevocationResponse {
    successful: boolean;
    error: string;
  }

  interface RevokeTokenResponse {
    error?: string;
    error_description?: string;
  }
}

export {};
