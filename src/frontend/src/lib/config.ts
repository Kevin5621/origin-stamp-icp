export const config = {
  app: {
    env: process.env.NEXT_PUBLIC_APP_ENV || "development",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  backend: {
    canisterId: process.env.NEXT_PUBLIC_BACKEND_CANISTER_ID || "",
  },
  auth: {
    internetIdentityUrl:
      process.env.NEXT_PUBLIC_INTERNET_IDENTITY_URL ||
      "https://identity.ic0.app",
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  },
  security: {
    cookieMaxAge: 86400,
    cookieSecure: process.env.NODE_ENV === "production",
    cookieSameSite: "strict" as const,
  },
};
