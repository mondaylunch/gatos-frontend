import {Match, Switch, useContext} from "solid-js";
import {grabSource} from "../editor/directives/grabSource";
import {SelectedElementContext} from "../editor/InteractiveCanvas";

grabSource;

export function SettingsSidebar() {
    const [selected] = useContext(SelectedElementContext)!;

    return (
        <Switch
            fallback={
                <div class="w-[360px] bg-neutral-700 grid place-items-center">
                    Select a node
                </div>
            }
        >
            <Match when={selected()}>
                <div class="w-[360px] bg-neutral-700">
                    Settings for {selected()}
                </div>
            </Match>
        </Switch>
    );
}
