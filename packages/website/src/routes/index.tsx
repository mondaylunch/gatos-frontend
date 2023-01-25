import {
  Button_Success,
  Button_Danger,
  Button_Option,
  Button_Primary,
} from "~/components/inputs/Buttons";
import "./index.css";

export default function Home() {
  return (
    <main>
      <h1>Gatos</h1>
      <div class="flex space-x-2 justify-center">
        <Button_Success>Success</Button_Success>
        <Button_Danger>Danger</Button_Danger>
        <Button_Option>Option</Button_Option>
        <Button_Primary>Primary</Button_Primary>
      </div>
    </main>
  );
}
