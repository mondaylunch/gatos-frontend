import { Button } from "~/components/inputs/Button";
import "./index.css";

export default function Home() {
    return (
        <main>
        <h1>Logged In</h1>
        <Button onClick={() => window.location.href = "/"}>Return to index</Button>
        </main>
    );
}