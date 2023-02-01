import { Meta } from "solid-start";
import { Canvas } from "../../components/editor/Canvas";
import styles from "./editor.module.css";

export default function Home() {
  return (
    <main class={styles.container}>
      <Meta
        name="viewport"
        content="width=device-width, initial-scale=1, user-scalable=no"
      />
      <div class="w-40 h-full shadow-md bg-neutral-900 px-1 absolute">
</div>
      <Canvas />
    </main>
  );
}
