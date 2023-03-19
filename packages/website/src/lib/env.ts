/**
 * URL pointing to the Gatos API
 */
export const ENDPOINT = process.env.API_URL ?? "http://localhost:8080";

/**
 * Whether the application is currently running in production
 */
export const PRODUCTION = process.NODE_ENV === "production";

/**
 * Secret used to encrypt session storage
 */
export const AUTH_SECRET =
  process.env.AUTH_SECRET! ?? "joigfgjhogfjhgjksaghdsfjklgdsfjklgsdfjd";

export const AUTH0_ID = process.env.VITE_AUTH0_ID ?? "";
export const AUTH0_SECRET = process.env.AUTH0_SECRET ?? "";
export const AUTH0_ISSUER = process.env.VITE_AUTH0_ISSUER ?? "";
export const AUTH0_TOKEN_URL = process.env.AUTH0_TOKEN_URL ?? "";
export const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE ?? "";
