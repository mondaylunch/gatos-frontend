import {getSession} from "@auth/solid-start";
import {authOpts} from "~/routes/api/auth/[...solidauth]";
import {createServerData$} from "solid-start/server";
import {createSignal, onMount} from "solid-js";
import {User} from "./types";
import {Session} from "@auth/core/types";

export const constructUser: (session: Session) => User = (session) => {
  return {
    username: session.user!.name!,
    email: session.user!.email!,
    avatar: session.user!.image || undefined,
  };
}

/**
 * Global user state information
 */
export const [user, setUser] = createSignal<User>();

/**
 * Mount the user data
 */
export function MountUser(props: { user: User }) {
  onMount(() => {
    setUser(props.user)
  });
  return null;
}