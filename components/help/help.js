
import { DebugConsole } from "../shared/debug-console.js";
import { Preferences } from "../shared/preferences.js";

export function createModel() {
    return new HelpModel();
}

class HelpModel {

    // event handlers
    async init(kitElement) {
        this.#kitElement = kitElement;
    }

    async onRendered() {
        this.#kitElement.querySelector("#select-theme").value = Preferences.theme;
        this.#kitElement.querySelector("#select-dark-mode").value = Preferences.darkMode;
    }

    // methods
    getDebugConsoleItems() {
        let items = DebugConsole.debugItems;
        if (items.length === 0) {
            items = [{ itemType: "info", data: "no items" }];
        }
        return items;
    }

    setTheme() {
        Preferences.theme = this.#kitElement.querySelector("#select-theme").value;
        Preferences.darkMode = this.#kitElement.querySelector("#select-dark-mode").value;
        Preferences.applyTheme();
    }

    // helpers
    #kitElement;
}
