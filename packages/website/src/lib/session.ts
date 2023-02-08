import {
  createCookieSessionStorage,
  redirect,
  ServerFunctionEvent,
} from "solid-start";

const ENDPOINT = process.env.API_URL ?? "http://127.0.0.1:4390";

export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  authToken: string;
};

export function resolveUserByToken(token: string): Promise<User | undefined> {
  return fetch(ENDPOINT + "/api/v1/login/self", {
    headers: {
      "x-auth-token": token,
    },
  }).then((x) => (x.ok ? x.json() : undefined));
}

export async function resolveUserByRequest(request: Request): Promise<User> {
  const cookie = request.headers.get("Cookie") ?? "";
  const session = await storage.getSession(cookie);
  const token = session.get("authToken");
  const user = await resolveUserByToken(token);
  if (!user) throw redirect("/login");
  return user;
}

export function resolveUserByRouteEvent(
  data: ServerFunctionEvent
): Promise<User> {
  return resolveUserByRequest(data.request);
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
  }).then((res) =>
    res.ok
      ? res.json()
      : res.json().then(({ message }) => {
          throw message;
        })
  );
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
  }).then((res) =>
    res.ok
      ? res.json()
      : res.json().then(({ message }) => {
          throw message;
        })
  );
}
