import { BsPlus } from "solid-icons/bs";

type DisplayProps = {
  title: string;
  description: string;
};

export function Square_New() {
  return (
    <div class="group relative h-32 w-32 rounded-[35px] border-dashed border-8 border-neutral-700 bg-transparent flex items-center justify-center hover:scale-110 hover:bg-neutral-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-00 transition duration-150 ease-in-out">
      <BsPlus class="fill-neutral-500 text-8xl group-hover:fill-sky-500" />
    </div>
  );
}

export function Square_File(props: DisplayProps) {
  return (
    <div class="group relative h-32 w-32 rounded-[35px] bg-neutral-900 flex items-center justify-center align-items-center hover:scale-110 hover:bg-neutral-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-00 transition duration-150 ease-in-out">
      <div class="flex flex-col text-center items-center text-neutral-200 hover:text-neutral-300">
        <p class="font-bold capitalize group-hover:text-sky-500 transition duration-150 ease-in-out">
          {props.title}
        </p>
        <hr class="border-neutral-500 w-5/6" />
        <p>{props.description}</p>
      </div>
    </div>
  );
}
