import { createEffect, createSignal, onCleanup } from "solid-js";
import styles from "./Canvas.module.css";

const MIN_ZOOM = -2;
const MAX_ZOOM = 2;

export function Canvas() {
  // Keep track of origin and zoom
  const [originX, setOriginX] = createSignal(0);
  const [originY, setOriginY] = createSignal(0);
  const [zoom, setZoom] = createSignal(0);

  // Keep track of mouse position for calculating zoom
  const [mouseX, setMouseX] = createSignal(0);
  const [mouseY, setMouseY] = createSignal(0);

  // Handle panning of canvas
  const [pan, setPan] = createSignal(false);
  const startPan = (event: MouseEvent | TouchEvent) => {
    if (event.target instanceof SVGSVGElement) {
      event.preventDefault();
      setPan(true);
    }
  };
  const stopPan = () => setPan(false);
  const onPan = (event: MouseEvent | TouchEvent) => {
    if (event instanceof MouseEvent) {
      setMouseX(event.offsetX);
      setMouseY(event.offsetY);
    }

    if (pan()) {
      event.preventDefault();

      setOriginX(
        (ox) =>
          ox -
          (event instanceof MouseEvent ? event.movementX : 0) / zoomFactor()
      );

      setOriginY(
        (oy) =>
          oy -
          (event instanceof MouseEvent ? event.movementY : 0) / zoomFactor()
      );
    }
  };

  // Determine constants
  const computeZoom = (v: number) => 2 ** v;
  const zoomFactor = () => computeZoom(zoom());
  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);
  let svgRef: SVGSVGElement | undefined;

  // Keep track of the canvas size
  createEffect(() => {
    if (svgRef) {
      const observer = new ResizeObserver(() => {
        setWidth(svgRef!.clientWidth);
        setHeight(svgRef!.clientHeight);
      });

      observer.observe(svgRef!);
      return () => observer.disconnect();
    }
  }, [svgRef]);

  // Determine which portion of the SVG to display
  const viewBox = () =>
    `${originX()} ${originY()} ${width() / zoomFactor()} ${
      height() / zoomFactor()
    }`;

  // Zoom handling
  function scale(factor: number) {
    setZoom((v) => v + factor);

    const zoomDelta = computeZoom(factor);
    const currentZoom = zoomFactor();
    const targetZoom = currentZoom * zoomDelta;

    const mX = mouseX();
    const mY = mouseY();

    const [dx, dy] = [
      -mX / targetZoom + mX / currentZoom,
      -mY / targetZoom + mY / currentZoom,
    ];

    setOriginX((x) => x + dx);
    setOriginY((y) => y + dy);
  }

  function clampScale(factor: number) {
    const currentValue = zoom();
    const target = Math.max(
      Math.min(currentValue + factor, MAX_ZOOM),
      MIN_ZOOM
    );

    scale(target - currentValue);
  }

  function onWheel(event: WheelEvent) {
    clampScale(- event.deltaY * 0.001);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey) {
      switch (event.key) {
        case "=":
          event.preventDefault();
          clampScale(0.05);
          break;
        case "-":
          event.preventDefault();
          clampScale(-0.05);
          break;
      }
    }
  }

  if (typeof document !== "undefined") {
    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => document.removeEventListener("keydown", onKeyDown));
  }

  return (
    <svg
      class={styles.canvas}
      ref={svgRef}
      viewBox={viewBox()}
      onMouseDown={startPan}
      onMouseUp={stopPan}
      onMouseMove={onPan}
      onTouchStart={startPan}
      onTouchEnd={stopPan}
      onTouchMove={onPan}
      onWheel={onWheel}
    >
      <foreignObject x={100} y={100} width={100} height={100}>
        {() => (
          <div style={{ width: "100px", height: "100px", background: "gray" }}>
            a
          </div>
        )}
      </foreignObject>
      <foreignObject x={220} y={140} width={100} height={100}>
        {() => (
          <div style={{ width: "100px", height: "100px", background: "gray" }}>
            b
          </div>
        )}
      </foreignObject>
    </svg>
  );
}
