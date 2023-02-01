export function Action_Node() {
    return (
        <div class="group relative w-72 h-32 rounded-[35px] bg-white flex items-center justify-center">
             <p class="font-bold capitalize">
             Concatenate
        </p>
        </div>
    )
}

export function Variable_Node() {
    return (
        <div class="text-white group relative w-28 h-8 rounded-[35px] bg-rose-500 flex items-center justify-center">
             <p class="font-bold">
             name
        </p>
        </div>
    )
}

export function Start_Node() {
    return (
        <div class="rounded-t-full h-32 w-64 flex bg-neutral-900 m-2 flex items-center justify-center">
            <p class="font-bold text-white">
             HTTP request
        </p>

        </div>
    )
}

export function End_Node() {
    return (
        <div class="rounded-b-full h-32 w-64 flex bg-neutral-900 m-2 flex items-center justify-center">
            <p class="font-bold text-white">
             OUTPUT
        </p>

        </div>
    )
}