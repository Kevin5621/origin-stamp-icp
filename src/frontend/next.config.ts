import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Backend Configuration
    CANISTER_ID_BACKEND: process.env.CANISTER_ID_BACKEND,
    CANISTER_ID_FRONTEND: process.env.CANISTER_ID_FRONTEND,
    CANISTER_ID: process.env.CANISTER_ID,
    DFX_NETWORK: process.env.DFX_NETWORK,
    DFX_VERSION: process.env.DFX_VERSION,
    DFX_REPLICA_HOST: process.env.DFX_REPLICA_HOST,
    DFX_REPLICA_PORT: process.env.DFX_REPLICA_PORT,
    CANISTER_CANDID_PATH_BACKEND: process.env.CANISTER_CANDID_PATH_BACKEND,
    CANISTER_CANDID_PATH: process.env.CANISTER_CANDID_PATH,

    // Google OAuth Configuration
    VITE_GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID,

    // S3 Configuration
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(self)",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
