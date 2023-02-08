import { createCookieSessionStorage } from "solid-start";

const ENDPOINT = process.env.API_URL ?? "http://127.0.0.1:4390";

type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  auth_token: string;
};

export function resolveUserByToken(token: string): Promise<User> {
  return fetch(ENDPOINT + "/api/v1/login/self", {
    headers: {
      "x-auth-token": token,
    },
  }).then((x) => x.json());
}

export const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET! ?? "joigfgjhogfjhgfjd"],
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export function login(data: Pick<User, "email" | "password">): Promise<User> {
  return fetch(ENDPOINT + "/api/v1/login/authenticate", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((x) => x.json());
}

export function register(
  data: Pick<User, "username" | "email" | "password">
): Promise<User> {
  return fetch(ENDPOINT + "/api/v1/sign_up", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((x) => x.json());
}

// Expose globals
if (typeof window !== "undefined") {
  (window as any).auth = {
    login,
    register,
  };
}
