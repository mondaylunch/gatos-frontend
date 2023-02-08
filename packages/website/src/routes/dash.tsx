import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { Square_New, Square_File } from "~/components/dashboard/squares";
import { resolveUserByRouteEvent } from "~/lib/session";

export function routeData() {
  return createServerData$(async (_, event) => {
    return {
      user: await resolveUserByRouteEvent(event),
    };
  });
}

export default function Home() {
  const data = useRouteData<typeof routeData>();

  return (
    <div class="flex flex-col items-center justify-center w-screen h-screen bg-neutral-800">
      <div class="absolute top-0 right-0 mr-5 mt-5">
        <p class="text-neutral-200 font-medium">Hi {data()?.user.username}</p>
      </div>
      <div class="flex">
        <div class="mr-5">
          <Square_New />
        </div>
        <Square_File title="Title of me" description="Look at my description" />
      </div>
    </div>
  );
}
