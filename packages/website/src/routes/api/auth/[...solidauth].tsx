import { SolidAuth, type SolidAuthConfig } from "@auth/solid-start";
import Auth0 from "@auth/core/providers/auth0";
import {
  AUTH0_AUTHORIZATION_LINK,
  AUTH0_ID,
  AUTH0_ISSUER,
  AUTH0_SECRET,
} from "~/lib/env";

export const authOpts: SolidAuthConfig = {
  providers: [
    // @ts-ignore
    Auth0({
      clientId: AUTH0_ID,
      clientSecret: AUTH0_SECRET,
      issuer: AUTH0_ISSUER,
      authorization: AUTH0_AUTHORIZATION_LINK,
    }),
  ],
  debug: false,
};

export const { GET, POST } = SolidAuth(authOpts);
