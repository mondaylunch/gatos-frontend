import {
  Square_New,
  Square_File
} from "~/components/dashboard/squares";


export default function Home() {
  //TODO: Get the username from the local storage once i figure out how solid does that
  var username = "username";
  return (
      <div class="flex flex-col items-center justify-center w-screen h-screen bg-neutral-800">
          <div class="absolute top-0 right-0 mr-5 mt-5">
            <p class="text-neutral-200 font-medium">Hi {username}</p>
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