import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: "/home/kevin/Documents/origin-stamp-icp",
  env: {
    CANISTER_ID_BACKEND:
      process.env.CANISTER_ID_BACKEND || "bkyz2-fmaaa-aaaaa-qaaaq-cai",
    CANISTER_ID_FRONTEND:
      process.env.CANISTER_ID_FRONTEND || "bd3sg-teaaa-aaaaa-qaaba-cai",
    DFX_NETWORK: process.env.DFX_NETWORK || "local",
    NEXT_PUBLIC_CANISTER_ID_BACKEND:
      process.env.NEXT_PUBLIC_CANISTER_ID_BACKEND ||
      "bkyz2-fmaaa-aaaaa-qaaaq-cai",
    NEXT_PUBLIC_DFX_NETWORK: process.env.NEXT_PUBLIC_DFX_NETWORK || "local",
  },
  experimental: {
    esmExternals: true,
  },
  async rewrites() {
    // Only apply rewrites for local development
    if (
      process.env.DFX_NETWORK === "local" ||
      process.env.NODE_ENV === "development"
    ) {
      return [
        {
          source: "/api/v2/:path*",
          destination: "http://127.0.0.1:4943/api/v2/:path*",
        },
        {
          source: "/api/v3/:path*",
          destination: "http://127.0.0.1:4943/api/v3/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
