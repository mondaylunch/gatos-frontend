import { logout } from "~/lib/session";

export function GET() {
  return logout();
}
