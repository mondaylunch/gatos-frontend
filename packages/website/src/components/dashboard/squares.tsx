import { BsPlus } from 'solid-icons/bs';

type DisplayProps = {
    title: string;
    description: string
}

export function Square_New() {
    return (
        <div class="relative h-32 w-32 rounded-[35px] border-dashed border-8 border-neutral-700 bg-transparent flex items-center justify-center hover:scale-110 hover:bg-neutral-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-00 transition duration-150 ease-in-out ">
            <BsPlus class="fill-neutral-500 text-8xl" />
        </div>
    )
    }

export function Square_File(props: DisplayProps) {
    return (
        <div class="relative h-32 w-32 rounded-[35px] bg-neutral-900 flex items-center justify-center hover:scale-110 hover:bg-neutral-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-00 transition duration-150 ease-in-out ">
                <p>{props.title}</p>
                <p>{props.description}</p>
        </div>
    )
}