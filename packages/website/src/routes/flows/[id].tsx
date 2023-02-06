import { Meta } from "solid-start";
import { CanvasElement } from "~/components/editor/CanvasElement";
import { Canvas } from "../../components/editor/Canvas";
import styles from "./editor.module.css";

export default function Home() {
  return (
    <main class={styles.container}>
      <Meta
        name="viewport"
        content="width=device-width, initial-scale=1, user-scalable=no"
      />
      <Canvas>
        <CanvasElement x={100} y={100} width={100} height={100}>
          <div style="background: gray">text</div>
        </CanvasElement>
      </Canvas>
    </main>
  );
}
