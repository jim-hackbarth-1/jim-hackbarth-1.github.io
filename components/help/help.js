
import { KitRenderer } from "../../ui-kit.js";
import { DebugConsole } from "../shared/debug-console.js";
import { Preferences } from "../shared/preferences.js";

export function createModel() {
    return new HelpModel();
}

class HelpModel {

    // event handlers
    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {
        this.#getElement("#select-theme").value = Preferences.theme;
        this.#getElement("#select-dark-mode").value = Preferences.darkMode;
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
        Preferences.theme = this.#getElement("#select-theme").value;
        Preferences.darkMode = this.#getElement("#select-dark-mode").value;
        Preferences.applyTheme();
    }

    // helpers
    #componentElement;
    #getElement(selector) {
        if (!this.#componentElement) {
            this.#componentElement = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElement.querySelector(selector);
    }
}
