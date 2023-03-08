/**
 * URL pointing to the Gatos API
 */
export const ENDPOINT = process.env.API_URL ?? "http://127.0.0.1:8080";

/**
 * Whether the application is currently running in production
 */
export const PRODUCTION = process.NODE_ENV === "production";

/**
 * Secret used to encrypt session storage
 */
export const AUTH_SECRET =
  process.env.AUTH_SECRET! ?? "joigfgjhogfjhgjksaghdsfjklgdsfjklgsdfjd";

export const AUTH0_ID = import.meta.env.VITE_AUTH0_ID ?? "";
export const AUTH0_SECRET = process.env.AUTH0_SECRET ?? "";
export const AUTH0_ISSUER = import.meta.env.VITE_AUTH0_ISSUER ?? "";
