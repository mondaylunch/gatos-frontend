import { A } from "solid-start";
import { BsPlus } from "solid-icons/bs";
import { FaSolidXmark } from "solid-icons/fa";
import { createBackendFetchAction } from "~/lib/backend";

type DisplayProps = {
  title: string;
  description: string;
  id: string;
};

export function Square_New() {
  return (
    <div class="group relative h-32 w-32 rounded-[35px] border-dashed border-8 border-neutral-700 bg-transparent flex items-center justify-center hover:scale-110 hover:bg-neutral-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-00 transition duration-150 ease-in-out">
      <BsPlus class="fill-neutral-500 text-8xl group-hover:fill-sky-500" />
    </div>
  );
}

export function Square_File(props: DisplayProps) {
  const [_, sendBackendRequest] = createBackendFetchAction();

  async function deleteFlow() {
    await sendBackendRequest({
      route: `/api/v1/flows/${props.id}`,
      init: {
        method: "DELETE",
      },
    });
  }

  return (
    <div class="group relative h-32 w-32 rounded-3xl bg-neutral-900 flex items-center justify-center align-items-center hover:scale-110 hover:bg-neutral-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-00 transition duration-150 ease-in-out">
      <button
        class="bg-zinc-300 p-0.5 rounded-full absolute top-0 left-0 z-10 mr-2 mt-0 invisible group-hover:visible transition duration-150 ease-in-out"
        onClick={deleteFlow}
      >
        <FaSolidXmark size={22} color="#e11d48" />
      </button>
      <A
        href={`/flows/${props.id}`}
        class="absolute top-0 left-0 w-full h-full"
      >
        <div class="flex flex-col justify-center h-full items-center text-neutral-200 hover:text-neutral-300">
          <p class="font-bold capitalize group-hover:text-sky-500 transition duration-150 ease-in-out">
            {props.title}
          </p>
          <hr class="border-neutral-500 w-5/6" />
          <p>{props.description}</p>
        </div>
      </A>
    </div>
  );
}
