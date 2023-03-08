import {Accessor} from "solid-js";

/**
 * Mark an element in the canvas as an area to drop into.
 * @param el Element reference
 * @param nodeId Unique identifier for element
 * @returns Clean up
 */
export function dropZone(el: HTMLElement, nodeId: Accessor<string>) {
  el.setAttribute("data-drop-zone", nodeId());
}
