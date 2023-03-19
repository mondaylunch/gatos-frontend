/**
 * URL pointing to the Gatos API
 */
export const ENDPOINT = process.env.API_URL ?? "http://localhost:8080";

/**
 * Whether the application is currently running in production
 */
export const PRODUCTION = import.meta.env.PROD;

/**
 * Secret used to encrypt session storage
 */
export const AUTH_SECRET =
  process.env.AUTH_SECRET! ??
  "e4e11a548656af6d8b1e4edf36a5d06acca47a03035e9fd9eb833cf37e18bd9b";

export const AUTH0_ID = process.env.AUTH0_CLIENT_ID ?? "";
export const AUTH0_AUTHORIZATION_LINK =
  process.env.AUTH0_AUTHORIZATION_LINK ?? "";
export const AUTH0_SECRET = process.env.AUTH0_CLIENT_SECRET ?? "";
export const AUTH0_ISSUER = process.env.AUTH0_ISSUER ?? "";
export const AUTH0_TOKEN_URL = process.env.AUTH0_TOKEN_URL ?? "";
export const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE ?? "";
