import {
  createCookieSessionStorage,
  redirect,
  ServerFunctionEvent,
} from "solid-start";
import { ENDPOINT, PRODUCTION, SESSION_SECRET } from "./env";
import { User } from "./types";

/**
 * Fetch a user by their given token
 * @param token token
 * @returns User
 */
export function resolveUserByToken(token: string): Promise<User | undefined> {
  return fetch(ENDPOINT + "/api/v1/login/self", {
    headers: {
      "x-auth-token": token,
    },
  }).then((x) => (x.ok ? x.json() : undefined));
}

/**
 * Fetch a user using the server request context
 * @param request Request
 * @returns User
 */
export async function resolveUserByRequest(request: Request): Promise<User> {
  // Pull the session data out
  const cookie = request.headers.get("Cookie") ?? "";
  const session = await storage.getSession(cookie);
  const token = session.get("authToken");
  if (!token) throw redirect("/login");

  // Fetch using token
  const user = await resolveUserByToken(token);
  if (!user) throw redirect("/login");
  return user;
}

/**
 * Fetch a user using the server function event context
 * @param data Server function event
 * @returns User
 */
export function resolveUserByRouteEvent(
  data: ServerFunctionEvent
): Promise<User> {
  return resolveUserByRequest(data.request);
}

/**
 * Session storage configuration
 */
export const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: PRODUCTION,
    secrets: [SESSION_SECRET],
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

/**
 * Try to log into Gatos API with the given credentials
 * @param data Credentials
 * @returns User
 */
export function login(data: Pick<User, "email" | "password">): Promise<User> {
  return fetch(ENDPOINT + "/api/v1/login/authenticate", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) =>
    res.ok
      ? res.json()
      : // if request failed, throw the reason
        res.json().then(({ message }) => {
          throw message;
        })
  );
}

/**
 * Try to register a new user with Gatos API using the given credentials
 * @param data Credentials
 * @returns User
 */
export function register(
  data: Pick<User, "username" | "email" | "password">
): Promise<User> {
  return fetch(ENDPOINT + "/api/v1/sign_up", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) =>
    res.ok
      ? res.json()
      : // if request failed, throw the reason
        res.json().then(({ message }) => {
          throw message;
        })
  );
}
