import {Accessor, useContext} from "solid-js";
import {CanvasContext} from "../context";

/**
 * Mark an element in the canvas as able to
 * be grabbed and cloned to somewhere else.
 * @param el Element reference
 * @param ref Unique identifier for element
 * @returns Clean up
 */
export function grabSource<T>(el: HTMLElement, ref: Accessor<T>) {
  const context = useContext(CanvasContext);

  function grab(ev: MouseEvent) {
    ev.stopPropagation();
    context.setGrabbed(ref(), ev.clientX, ev.clientY);
  }

  el.addEventListener("mousedown", grab);
  return () => el.removeEventListener("mousedown", grab);
}
