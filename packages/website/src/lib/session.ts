import {getSession} from "@auth/solid-start";
import {authOpts} from "~/routes/api/auth/[...solidauth]";
import {createServerData$} from "solid-start/server";

export const useSession = () => {
  return createServerData$(
    async (_, {request}) => {
      return await getSession(request, authOpts);
    },
    {key: () => ["auth_user"]}
  );
};