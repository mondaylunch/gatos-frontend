import { createContext } from "solid-js";

type Context<MoveRef, GrabRef> = {
  setMoving: (ref: MoveRef) => void;
  setGrabbed: (ref: GrabRef, virtualX: number, virtualY: number) => void;
};

const noop = () => {};
export const CanvasContext = createContext<Context<any, any>>({
  setMoving: noop,
  setGrabbed: noop,
});
