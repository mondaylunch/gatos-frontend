import {SolidAuth, type SolidAuthConfig} from "@auth/solid-start";
import Auth0 from "@auth/core/providers/auth0";
import {AUTH0_ID, AUTH0_ISSUER, AUTH0_SECRET, AUTH_SECRET} from "~/lib/env";

export const authOpts: SolidAuthConfig = {
  providers: [
    // @ts-ignore
    Auth0({
      clientId: AUTH0_ID,
      clientSecret: AUTH0_SECRET,
      issuer: AUTH0_ISSUER,
      authorization: "https://mondaylunchdev.eu.auth0.com/authorize"
    }),
  ],
  debug: false,
  secret: AUTH_SECRET
};

export const {GET, POST} = SolidAuth(authOpts);