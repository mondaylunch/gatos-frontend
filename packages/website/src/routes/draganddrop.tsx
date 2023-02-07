import {
    DragDropProvider,
    DragDropSensors,
    DragEventHandler,
    createDraggable,
    createDroppable,
} from "@thisbeyond/solid-dnd";
import {Component, createSignal, JSX, Show} from "solid-js";
import "./sample.css";
import "./index.css";

type DraggableProps = {
    children?: JSX.Element;
};

const Draggable: Component = () => {
    const draggable = createDraggable(1);
    return (
        // @ts-expect-error type incompatibility with solid.js
        <div use:draggable class="draggable">
            Draggable
        </div>
    );
};

const DraggableDroppable: Component<DraggableProps> = (props) => {
    const droppable = Droppable(props)
    const draggable = createDraggable(2);
    return (
        // @ts-expect-error type incompatibility with solid.js
        <div use:draggable class="draggable">
            Draggable
            {droppable}
        </div>
    );
};

const Droppable: Component<DraggableProps> = (props) => {
    const droppable = createDroppable(1);
    return (
        <div
            // @ts-expect-error type incompatibility with solid.js
            use:droppable
            class="droppable"
            classList={{ "!droppable-accept": droppable.isActiveDroppable }}
        >
            Droppable
            {props.children}
        </div>
    );
};

const DragAndDropExample: Component = () => {
    const [where, setWhere] = createSignal("outside");

    const onDragEnd: DragEventHandler = ({ droppable }) => {
        if (droppable) {
            setWhere("inside");
        } else {
            setWhere("outside");
        }
    };

    return (
        <DragDropProvider onDragEnd={onDragEnd}>
            <DragDropSensors />
            <div class="min-h-15">
                <Show when={where() === "outside"}>
                    <Draggable />
                </Show>
            </div>
            <DraggableDroppable>
                <Show when={where() === "inside"}>
                    <Draggable />
                </Show>
            </DraggableDroppable>
        </DragDropProvider>
    );
};

export default DragAndDropExample;
