import { useLocation } from "solid-start";
import useStorage from "solid-start";
import DiscordOauth2 from "discord-oauth2";
import { storage } from "~/lib/session";

export default function DiscordAuth() {
  // Use the useLocation hook to get the URL query parameters
  const location = useLocation();
  const client_secret: string = process.env.CLIENT_SECRET ?? '0';

  // Split the URL search string by the = and & symbols
  const codeInitial = location.search.split("=")[1];
  const code = codeInitial.split("&")[0];

  // Create a new DiscordOauth2 object
  const oauth = new DiscordOauth2({
    clientId: "1076967723352993912",
    clientSecret: client_secret,
    redirectUri: "https://gatos.lutitious.co.uk/discordauth",
  });
  
  // Get the access token from the code and use it to get the user's username
  oauth.tokenRequest({
    code: code,
    scope: "identify",
    grantType: "authorization_code",
  })
  .then((token) => {
    // Use the access token to get the user's details
    oauth.getUser(token.access_token)
    .then((user) => {
      console.log(user);
    });
    }).catch((err) => {
      // If its a 400 error, the code is invalid, output an error that the code is invalid
      if (err.statusCode == 400) {
        console.log("Invalid code");
      }
    });

}
