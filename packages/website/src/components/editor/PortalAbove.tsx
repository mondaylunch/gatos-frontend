import { createEffect, createSignal, JSX } from "solid-js";
import { Portal } from "solid-js/web";

interface Props {
  children: JSX.Element;

  centre: boolean;
}

export function PortalAbove(props: Props) {
  const [bounds, setBounds] = createSignal<DOMRect | undefined>(undefined);

  let containerRef: HTMLDivElement | undefined;

  createEffect(() => {
    if (containerRef) {
      let active = true;
      function update() {
        setBounds(containerRef!.getBoundingClientRect());
        active && requestAnimationFrame(update);
      }

      update();
      return () => (active = false);
    }
  }, [containerRef]);

  return (
    <div ref={containerRef}>
      <Portal>
        <div
          style={{
            display: "flex",
            position: "fixed",
            "justify-content": "stretch",
            left: `${
              (bounds()?.x || 0) +
              (props.centre ? -(bounds()?.width || 0) / 2 : 0)
            }px`,
            top: `${
              (bounds()?.y || 0) +
              (props.centre ? -(bounds()?.height || 0) / 2 : 0)
            }px`,
            width: `${bounds()?.width}px`,
            height: `${bounds()?.height}px`,
          }}
        >
          {props.children}
        </div>
      </Portal>
    </div>
  );
}
