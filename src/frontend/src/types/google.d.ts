/**
 * Google Identity Services type definitions
 */

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
            auto_select: boolean;
            cancel_on_tap_outside: boolean;
            context?: string;
            ux_mode?: string;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: {
              theme: string;
              size: string;
              text: string;
              shape: string;
              width: number;
            },
          ) => void;
          prompt: (
            callback: (notification: {
              isNotDisplayed(): boolean;
              isSkippedMoment(): boolean;
            }) => void,
          ) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

export {};
