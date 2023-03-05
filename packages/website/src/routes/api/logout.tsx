import { logout } from "~/lib/session";

export function GET(request: Request) {
  return logout(request);
}
