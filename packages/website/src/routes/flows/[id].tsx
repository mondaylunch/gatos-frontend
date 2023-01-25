import { Canvas } from "../../../components/Canvas";
import styles from "./editor.module.css";

export default function Home() {
  return (
    <main class={styles.container}>
      <Canvas />
    </main>
  );
}
