import { useEffect, useRef, useState } from "react";
import { GoogleUser } from "../../services/googleAuth";

interface GoogleLoginButtonProps {
  onSuccess: (userInfo: GoogleUser) => void;
  onError: (error: Error) => void;
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  disabled?: boolean;
}

export function GoogleLoginButton({
  onSuccess,
  onError,
  text = "signin_with",
  theme = "outline",
  size = "large",
  disabled = false,
}: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!buttonRef.current || disabled || !clientId) {
      return;
    }

    // Wait for Google library to load
    const initializeButton = () => {
      if (!window.google?.accounts?.id) {
        setTimeout(initializeButton, 100);
        return;
      }

      setIsGoogleLoaded(true);

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (credentialResponse: any) => {
            try {
              if (!credentialResponse.credential) {
                onError(new Error("No credential received"));
                return;
              }

              // Parse JWT token to get user info
              const userInfo = parseJWTToken(credentialResponse.credential);
              onSuccess(userInfo);
            } catch (error) {
              onError(error as Error);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Clear any existing content
        if (buttonRef.current) {
          buttonRef.current.innerHTML = "";

          // Create custom button instead of using Google's native button
          const customButton = document.createElement("button");
          customButton.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 0;
            background: transparent;
            color: inherit;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-3);
            font-size: var(--text-sm);
            font-weight: var(--font-weight-medium);
            cursor: pointer;
            padding: 0;
            margin: 0;
          `;

          customButton.innerHTML = `
            <img src="/assets/google-logo.svg" alt="" class="auth-btn-icon" aria-hidden="true" />
            <span>Masuk dengan Google</span>
          `;

          customButton.onclick = () => {
            if (!disabled) {
              window.google.accounts.id.prompt();
            }
          };

          buttonRef.current.appendChild(customButton);
        }
      } catch (error) {
        console.error("Failed to initialize Google button:", error);
        setShowFallback(true);
      }
    };

    // Add timeout to show fallback if Google takes too long
    const fallbackTimeout = setTimeout(() => {
      if (!isGoogleLoaded) {
        console.warn(
          "Google library taking too long to load, showing fallback",
        );
        setShowFallback(true);
      }
    }, 3000);

    initializeButton();

    return () => {
      clearTimeout(fallbackTimeout);
    };
  }, [
    clientId,
    onSuccess,
    onError,
    text,
    theme,
    size,
    disabled,
    isGoogleLoaded,
  ]);

  const parseJWTToken = (token: string): GoogleUser => {
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
  };

  const handleFallbackClick = () => {
    if (!window.google?.accounts?.id) {
      onError(new Error("Google library not loaded"));
      return;
    }

    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          onError(new Error("Google Sign-In was cancelled or not displayed"));
        }
      });
    } catch (error) {
      onError(new Error("Failed to show Google login prompt"));
    }
  };

  if (!clientId) {
    return (
      <div className="auth-btn auth-btn--google auth-btn--disabled">
        <span>Google Client ID not configured</span>
      </div>
    );
  }

  if (showFallback) {
    return (
      <button
        onClick={handleFallbackClick}
        disabled={disabled}
        className="google-fallback-button"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: "0",
          backgroundColor: "transparent",
          color: "inherit",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--space-3)",
          fontSize: "var(--text-sm)",
          fontWeight: "var(--font-weight-medium)",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
          padding: "0",
        }}
      >
        <img
          src="/assets/google-logo.svg"
          alt=""
          className="auth-btn-icon"
          aria-hidden="true"
        />
        <span>Masuk dengan Google</span>
      </button>
    );
  }

  return (
    <div
      ref={buttonRef}
      className={`google-login-button ${disabled ? "disabled" : ""}`}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
}
