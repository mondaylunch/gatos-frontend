import server$, {
  createServerAction$,
  ServerFunctionEvent,
} from "solid-start/server";
import {
  AUTH0_AUDIENCE,
  AUTH0_ID,
  AUTH0_SECRET,
  AUTH0_TOKEN_URL,
  ENDPOINT,
} from "~/lib/env";
import { getSession } from "@auth/solid-start";
import { authOpts } from "~/routes/api/auth/[...solidauth]";
import { Session } from "@auth/core/types";

/*
 * This file handles communicating with the Gatos backend. A JWT from Auth0
 * is required to do this, so getting this token is done automatically.
 *
 * How to use:
 *
 */

let token: string | null = null;
let tokenExpiration: number | null = null;

/**
 * Get a new token from Auth0.
 */
const acquireToken: () => Promise<[any, number]> = async () => {
  token = null;
  tokenExpiration = null;
  const response = await fetch(AUTH0_TOKEN_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: AUTH0_ID,
      client_secret: AUTH0_SECRET,
      audience: AUTH0_AUDIENCE,
    }),
  });

  if (!response.ok) {
    throw new Error(
      "Could not acquire token: " + response.status + (await response.text())
    );
  }

  const data = await response.json();
  return [data.access_token, Date.now() + data.expires_in * 1000];
};

/**
 * Get the current token, or acquire a new one if needed.
 */
const getToken = async () => {
  if (!token || tokenExpiration! < Date.now()) {
    [token, tokenExpiration] = await acquireToken();
  }
  return token;
};

/**
 * Fetch from the backend, automatically adding the token. Adds the user email from the given session, if available.
 */
const backendFetchInternal = server$(
  async (
    opts: { route: string; init: RequestInit },
    session: Session | null
  ) => {
    const userEmail = session?.user?.email ?? "";
    const newInit = {
      ...opts.init,
      headers: {
        Authorization: "Bearer " + (await getToken()),
        "x-user-email": userEmail,
        ...opts.init.headers,
      },
    };

    return fetch(`${ENDPOINT}${opts.route}`, newInit);
  }
);

/**
 * Make a fetch to the backend, from the server side. You should only ever run this in server-side code,
 * such as in the function given to 'createServerData$'.
 *
 * @param route   the route to fetch from, relative to the backend URL
 * @param init    the init object to pass to fetch
 * @param session the session, or null. You can get this with 'getSession(event.request, authOpts)'
 */
export async function backendServersideFetch(
  route: string,
  init: RequestInit = {},
  session: Session | null = null
) {
  return backendFetchInternal({ route, init }, session);
}

/**
 * Makes an action which creates a fetch to the backend, from the client side. This should be run from within
 * your routes.
 *
 * The second result is the function to call to make the fetch.
 */
export function createBackendFetchAction() {
  return createServerAction$(
    async (opts: { route: string; init: RequestInit }, event) => {
      return backendFetchInternal(
        opts,
        await getSession(event.request, authOpts)
      );
    }
  );
}
