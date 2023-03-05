import { useNavigate } from "solid-start";
import { logout } from "~/lib/session";

export async function GET(request: Request) {
  const navigate = useNavigate();
  await logout(request);
  navigate("/login", { replace: true });
}
