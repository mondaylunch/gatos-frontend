import { Button } from "~/components/inputs/Button";
import "./index.css";

export default function Home() {
    return (
        <main>
        <h1>[Insert login form here]</h1>
        <Button onClick={() => window.location.href = "/home"}>Log In</Button>
        </main>
    );
}