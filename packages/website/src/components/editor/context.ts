import { createContext } from "solid-js";

type Context<MoveRef, GrabRef> = {
  /**
   * Save a reference to the element currently being moved
   * @param ref Reference to element
   */
  setMoving: (ref: MoveRef) => void;

  /**
   * Save a reference to the element currently being grabbed
   * @param ref Reference to element
   * @param virtualX Current mouse clientX
   * @param virtualY Current mouse clientY
   */
  setGrabbed: (ref: GrabRef, virtualX: number, virtualY: number) => void;
};

/**
 * No operation
 */
const noop = () => {};

export const CanvasContext = createContext<Context<any, any>>({
  setMoving: noop,
  setGrabbed: noop,
});
