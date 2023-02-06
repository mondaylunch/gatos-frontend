import "./index.css";
import {
    DragDropProvider,
    DragDropSensors,
    DragEventHandler,
    createDraggable,
    DragOverlay,
} from "@thisbeyond/solid-dnd";
import { Action_Node, Variable_Node, Start_Node, End_Node } from "~/components/nodes/Node";
import {JSX} from "solid-js";

type DraggableProps = {
    id: number;
    children?: JSX.Element;
}

const Draggable = (props: DraggableProps) => {
    const draggable = createDraggable(props.id);
    return (
        <div
            // @ts-expect-error type incompatibility with solid.js
            use:draggable
            class="draggable absolute"
            classList={{ "opacity-0": draggable.isActiveDraggable }}
            style={{ top: 0, left: (props.id === 1 ? 0 : 300) + "px" }}
        >
            {props.children}
        </div>
    );
};

const DragMoveExample = () => {
    let transform = { x: 0, y: 0 };

    const onDragMove: DragEventHandler = ({ overlay }) => {
        if (overlay) {
            transform = { ...overlay.transform };
        }
    };

    const onDragEnd: DragEventHandler = ({ draggable }) => {
        const node = draggable.node;
        node.style.setProperty("top", node.offsetTop + transform.y + "px");
        node.style.setProperty("left", node.offsetLeft + transform.x + "px");
    };

    return (
        <DragDropProvider onDragMove={onDragMove} onDragEnd={onDragEnd}>
            <DragDropSensors />
            <div class="min-h-15 w-full h-full relative">
                <Draggable id={1}>
                    <Variable_Node />
                </Draggable>
                <Draggable id={2}>
                    <Action_Node />
                </Draggable>
            </div>
            <DragOverlay>
                {((draggable: DraggableProps) => <Variable_Node />) as any}
            </DragOverlay>
        </DragDropProvider>
    );
};


export default function Home() {
    return (
        <div class="flex flex-col items-center justify-center w-screen h-screen bg-neutral-800">
          <DragMoveExample />
        </div>
        
    );
}