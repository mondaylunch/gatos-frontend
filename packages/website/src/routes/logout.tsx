import { logout } from "~/lib/session";

export async function GET(request: Request) {
  return await logout(request);
}
