import { APIEvent } from "solid-start";
import { resolveUserByToken, storage } from "~/lib/session";

export async function GET({ request }: APIEvent) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const token = session.get("auth-token");
  const user = await resolveUserByToken(token);
  return new Response(`username: ${user.username}`);
}
