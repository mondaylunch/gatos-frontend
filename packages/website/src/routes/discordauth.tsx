import { useLocation } from "solid-start";

export default function DiscordAuth() {
  // Use the useLocation hook to get the URL query parameters
  const location = useLocation();
  const client_secret: string = process.env.CLIENT_SECRET ?? '0';

  // Split the URL search string by the = and & symbols
  const codeInitial = location.search.split("=")[1];
  const code = codeInitial.split("&")[0];

  // Make a POST request to the Discord API to exchange the authorization code for an access token
  fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: "1076967723352993912",
      client_secret: client_secret,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "https://gatos.lutitious.co.uk/discordauth",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Make a GET request to the Discord API's /users/@me endpoint with the access token
      fetch("https://discord.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })
        .then((response) => response.json())
        .then((user) => {
          // The user object will contain the username of the user
          console.log(user.username);
        })
        .catch((error) => {
          console.error("Error getting user:", error);
        });
    })
    .catch((error) => {
      console.error("Error exchanging authorization code for access token:", error);
    });
}
