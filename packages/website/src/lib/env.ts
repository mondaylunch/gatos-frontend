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
export const SESSION_SECRET =
  process.env.SESSION_SECRET! ?? "joigfgjhogfjhgfjd";
