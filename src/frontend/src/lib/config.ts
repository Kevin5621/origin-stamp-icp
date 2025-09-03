import { envService } from "../services/envService";

const envConfig = envService.getConfig();

export const config = {
  app: {
    env: envConfig.app.env,
    url: envConfig.app.url,
  },
  backend: {
    canisterId: envConfig.canisters.backend,
    frontendCanisterId: envConfig.canisters.frontend,
    network: envConfig.dfx.network,
    version: envConfig.dfx.version,
  },
  auth: {
    internetIdentityUrl: envConfig.auth.internetIdentityUrl,
    googleClientId: envConfig.auth.googleClientId,
  },
  s3: {
    accessKey: envConfig.s3.accessKey,
    secretKey: envConfig.s3.secretKey,
    region: envConfig.s3.region,
    bucketName: envConfig.s3.bucketName,
  },
  security: {
    cookieMaxAge: 86400,
    cookieSecure: envConfig.app.isProduction,
    cookieSameSite: "strict" as const,
  },
};
