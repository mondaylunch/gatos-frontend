import { ENDPOINT } from "~/lib/env";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { resolveUserByRouteEvent } from "~/lib/session";
import { SiDiscord } from 'solid-icons/si'

export function routeData() {
  return createServerData$(async (_, event) => {
    const user = await resolveUserByRouteEvent(event);

    return {
      user,
      flows: await fetch(`${ENDPOINT}/api/v1/flows/list`, {
        method: "GET",
        headers: {
          "X-Auth-Token": user.auth_token,
        },
      })
    };
  });
}

export default function Account() {
  const data = useRouteData<typeof routeData>();
  //This is a page which will have an account page displaying the users account details and a link to connect their discord account
  return (
    <div class="flex flex-col items-center justify-center w-screen h-screen bg-neutral-800">
        <div class="absolute mr-5 mt-5">
            <p class="text-neutral-200 font-medium text-3xl">Username: {data()?.user.username}</p>
            <p class="text-neutral-200 font-medium text-3xl">Email: {data()?.user.email}</p>
            <div>
                <a href="https://discord.com/api/oauth2/authorize?client_id=1076967723352993912&redirect_uri=https%3A%2F%2Fgatos.lutitious.co.uk%2Fdiscordauth&response_type=code&scope=identify%20email%20guilds">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        <SiDiscord class="inline-block w-6 h-6" />  Connect Discord
                    </button>
                </a>
            </div>
        </div>
    </div>
  );
}
