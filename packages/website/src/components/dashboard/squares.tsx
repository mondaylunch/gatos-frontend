import type { JSX } from "solid-js";
import "../icons.css";

export function Square_New() {
    return (
<div class="relative h-32 w-32 rounded-[35px] border-dashed border-8 border-neutral-700 bg-transparent flex items-center justify-center hover:scale-110 hover:bg-neutral-300 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-00 transition duration-150 ease-in-out ">
        <i class="bi bi-plus text-neutral-500 text-8xl"></i>
</div>
    )
    }