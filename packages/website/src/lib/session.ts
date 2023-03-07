import { createSignal, onMount } from "solid-js";
import {
  createCookieSessionStorage,
  redirect,
  ServerFunctionEvent,
} from "solid-start";
import { createServerData$ } from "solid-start/server";
import { ENDPOINT, PRODUCTION, SESSION_SECRET } from "./env";
import { User } from "./types";

/**
 * Global user state information
 */
export const [user, setUser] = createSignal<User>();

/**
 * Mount the user data
 */
export function MountUser(props: { user: User }) {
  onMount(() => setUser(props.user));
  return null;
}

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
  if (!token)
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });

  // Fetch using token
  const user = await resolveUserByToken(token);
  if (!user)
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await storage.destroySession(session),
      },
    });

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
 * Redirect a user to dashboard if they are logged in
 * @param event Server function event
 */
export async function redirectIfLoggedIn(event: ServerFunctionEvent) {
  const cookie = event.request.headers.get("Cookie") ?? "";
  const session = await storage.getSession(cookie);
  const token = session.get("authToken");

  if (token) {
    throw redirect("/dash");
  }
}

/**
 * Route data preset for redirecting to dashboard if logged in
 */
export async function createAuthenticatedRedirect() {
  return createServerData$(async (_, event) => redirectIfLoggedIn(event), {
    deferStream: true,
  });
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
