import {Accessor, useContext} from "solid-js";
import {CanvasContext} from "../context";

/**
 * Mark an element in the canvas as moveable.
 * @param el Element reference
 * @param ref Unique identifier for element
 * @returns Clean up
 */
export function movable<T>(el: HTMLElement, ref: Accessor<T>) {
  const context = useContext(CanvasContext);

  function onMouseDown(ev: MouseEvent) {
    ev.stopPropagation();
    context.setMoving(ref);
  }

  el.addEventListener("mousedown", onMouseDown);
  return () => el.removeEventListener("mousedown", onMouseDown);
}
