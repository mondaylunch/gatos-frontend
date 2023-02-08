import { storage } from "~/lib/session";

export async function GET() {
  const session = await storage.getSession();
  session.set("auth-token", "token");
  return new Response("", {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
