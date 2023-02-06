import { createEffect, createSignal, JSX, onCleanup } from "solid-js";
import styles from "./Canvas.module.css";

/**
 * Minimum linear zoom factor
 */
const MIN_ZOOM = -2;

/**
 * Maximum linear zoom factor
 */
const MAX_ZOOM = 2;

interface Props {
  /**
   * Canvas elements
   */
  children?: JSX.Element
}

export function Canvas(props: Props) {
  // Keep track of origin and zoom
  const [originX, setOriginX] = createSignal(0);
  const [originY, setOriginY] = createSignal(0);
  const [zoom, setZoom] = createSignal(0);

  // Keep track of mouse position for calculating zoom
  const [mouseX, setMouseX] = createSignal(0);
  const [mouseY, setMouseY] = createSignal(0);

  // Handle panning of canvas
  const [pan, setPan] = createSignal(false);

  /**
   * Handle mouse down event
   * This indicates the user has started to pan
   * @param event Mouse Event
   */
  const onMouseDown = (event: MouseEvent) => {
    if (event.target instanceof SVGSVGElement) {
      event.preventDefault();
      setPan(true);
    }
  };

  /**
   * Handle mouse up event
   * This indicates the user has stopped panning
   * @param event Mouse Event
   */
  const onMouseUp = () => setPan(false);

  /**
   * Handle mouse move event
   * @param event Mouse Event
   */
  const onMouseMove = (event: MouseEvent) => {
    // Keep track of the mouse location at all times
    setMouseX(event.offsetX);
    setMouseY(event.offsetY);

    // If we are panning, then adjust the origin based on mouse movement
    if (pan()) {
      event.preventDefault();
      setOriginX((ox) => ox - event.movementX / zoomFactor());
      setOriginY((oy) => oy - event.movementY / zoomFactor());
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

      // note: by default children are not observed,
      // so it is unlikely we'll have any perf. issues
      observer.observe(svgRef!);
      return () => observer.disconnect();
    }
  }, [svgRef]);

  /**
   * Compute which portion of the SVG to display
   * @returns SVG viewbox
   */
  const viewBox = () =>
    `${originX()} ${originY()} ${width() / zoomFactor()} ${
      height() / zoomFactor()
    }`;

  /**
   * Scale the canvas around a given origin point by the given factor
   * @param factor linear scale factor
   * @param origin origin coordinates
   */
  function scale(factor: number, origin: [number, number]) {
    setZoom((v) => v + factor);

    const zoomDelta = computeZoom(factor);
    const currentZoom = zoomFactor();
    const targetZoom = currentZoom * zoomDelta;

    const [originX, originY] = origin;
    const [dx, dy] = [
      -originX / targetZoom + originX / currentZoom,
      -originY / targetZoom + originY / currentZoom,
    ];

    setOriginX((x) => x + dx);
    setOriginY((y) => y + dy);
  }

  /**
   * Scale the canvas around a given origin point by the given factor
   * This function will clamp the zoom on both extremes
   * @param factor linear scale factor
   * @param origin origin coordinates
   */
  function clampScale(factor: number, origin: [number, number]) {
    const currentValue = zoom();
    const target = Math.max(
      Math.min(currentValue + factor, MAX_ZOOM),
      MIN_ZOOM
    );

    scale(target - currentValue, origin);
  }

  /**
   * Handle mouse wheel scroll
   * @param event Wheel Event
   */
  function onWheel(event: WheelEvent) {
    clampScale(-event.deltaY * 0.001, [mouseX(), mouseY()]);
  }
  /**
   * Handle key down event for intercepting shortcuts
   * @param event Keyboard Event
   */
  function onKeyDown(event: KeyboardEvent) {
    const origin = () => [width() / 2, height() / 2] as [number, number];

    if (event.ctrlKey) {
      switch (event.key) {
        case "=":
          event.preventDefault();
          clampScale(0.05, origin());
          break;
        case "-":
          event.preventDefault();
          clampScale(-0.05, origin());
          break;
      }
    }
  }

  // If not in SSR, bind the global key press events.
  if (typeof document !== "undefined") {
    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => document.removeEventListener("keydown", onKeyDown));
  }

  // Keep track of touch event information from last received event
  const [trackedTouches, setTrackedTouches] = createSignal<
    undefined | TouchList
  >();

  /**
   * Handle touch start and save touch data
   * @param event Touch Event
   */
  function onTouchStart(event: TouchEvent) {
    setTrackedTouches(event.touches);
  }

  /**
   * Handle touch end and wipe known touch data if no touches present
   * @param event Touch Event
   */
  function onTouchEnd(event: TouchEvent) {
    if (!event.touches.length) setTrackedTouches(undefined);
  }

  /**
   * Handle touch move and pan / zoom depending on gesture
   * @param event Touch Event
   */
  function onTouchMove(event: TouchEvent) {
    // If we are missing data, just skip
    const list = trackedTouches();
    if (!list) return;

    // Determine what has changed since the last even
    const touchDelta = [...list]
      .map(
        (touch) =>
          [
            touch,
            [...event.touches].find(
              (entry) => entry.identifier === touch.identifier
            ),
          ] as [Touch, Touch]
      )
      .map(
        ([start, end]) =>
          [
            end.clientX - start.clientX,
            end.clientY - start.clientY,
            [end.clientX, end.clientY],
            [start.clientX, start.clientY],
          ] as [number, number, [number, number], [number, number]]
      );

    if (touchDelta.length === 1) {
      // Only Pan
      const [[dx, dy]] = touchDelta;
      setOriginX((x) => x - dx / zoomFactor());
      setOriginY((y) => y - dy / zoomFactor());
    } else if (touchDelta.length === 2) {
      // Pan and Zoom
      const [
        [dx1, dy1, [finalX1, finalY1], [startX1, startY1]],
        [dx2, dy2, [finalX2, finalY2], [startX2, startY2]],
      ] = touchDelta;

      // Determine if we are panning or zooming on different x and y axis
      // equal signs => pan
      // diff signs => zoom
      let xScale = 0,
        yScale = 0;

      // Check on X axis
      if ((dx1 < 0 && dx2 >= 0) || (dx2 < 0 && dx1 >= 0)) {
        xScale += dx2 - dx1;
      } else {
        // Pan on X axis
        setOriginX((x) => x - dx1 / zoomFactor());
      }

      // Check on Y axis
      if ((dy1 < 0 && dy2 >= 0) || (dy2 < 0 && dy1 >= 0)) {
        yScale += dy2 - dy1;
      } else {
        // Pan on Y axis
        setOriginY((x) => x - dx1 / zoomFactor());
      }

      // Determine scale factor and whether we are zooming
      let scale = Math.sqrt(xScale ** 2 + yScale ** 2);
      if (scale) {
        // Determine magnitude of line between touch points before and after
        let startMagntiude = Math.sqrt(
          (startX2 - startX1) ** 2 + (startY2 - startY1) ** 2
        );

        let finalMagntiude = Math.sqrt(
          (finalX2 - finalX1) ** 2 + (finalY2 - finalY1) ** 2
        );

        // Determine direction of zoom
        const direction = finalMagntiude - startMagntiude > 0 ? 1 : -1;

        // Find the center point of the zoom operation
        const origin = [
          startX1 + (startX2 - startX1) / 2,
          startY1 + (startY2 - startY1) / 2,
        ] as [number, number];

        // And zoom
        clampScale(scale * direction * 0.01, origin);
      }
    }

    // Save the new touch data
    setTrackedTouches(event.touches);
  }

  return (
    <svg
      class={styles.canvas}
      ref={svgRef}
      viewBox={viewBox()}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
      onWheel={onWheel}
    >
      {props.children}
    </svg>
  );
}
