import { redirect } from "solid-start";
import {
  StartServer,
  createHandler,
  renderAsync,
} from "solid-start/entry-server";
import { storage } from "./lib/session";

const anonymousPaths = ["/", "/login", "/signup"];

export default createHandler(
  ({ forward }) => {
    return async (event) => {
      if (anonymousPaths.includes(new URL(event.request.url).pathname)) {
        const cookie = event.request.headers.get("Cookie") ?? "";
        const session = await storage.getSession(cookie);
        const token = session.get("authToken");

        if (token) {
          return redirect("/dash");
        }
      }

      return forward(event);
    };
  },
  renderAsync((event) => <StartServer event={event} />)
);
