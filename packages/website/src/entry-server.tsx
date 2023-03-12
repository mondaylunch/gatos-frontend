import { getSession } from "@auth/solid-start";
import { redirect } from "solid-start";
import {
  createHandler,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";
import { authOpts } from "~/routes/api/auth/[...solidauth]";

const anonymousPaths = ["/"];
const protectedPaths = ["/dash"];

export default createHandler(
  ({ forward }) => {
    return async (event) => {
      const session = await getSession(event.request, authOpts);
      if (anonymousPaths.includes(new URL(event.request.url).pathname)) {
        if (session && session.user) {
          return redirect("/dash");
        }
      } else if (protectedPaths.includes(new URL(event.request.url).pathname)) {
        if (!session || !session.user) {
          return redirect("/");
        }
      }

      return forward(event);
    };
  },
  renderAsync((event) => <StartServer event={event} />)
);
