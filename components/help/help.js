
import { KitRenderer } from "../../ui-kit.js";
import { DebugConsole } from "../shared/debug-console.js";
import { DomHelper } from "../shared/dom-helper.js";
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
        DomHelper.getElement(this.#componentElement, "#select-theme").value = Preferences.theme;
        DomHelper.getElement(this.#componentElement, "#select-dark-mode").value = Preferences.darkMode;
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
        Preferences.theme = DomHelper.getElement(this.#componentElement, "#select-theme").value;
        Preferences.darkMode = DomHelper.getElement(this.#componentElement, "#select-dark-mode").value;
        Preferences.applyTheme();
    }

    // helpers
    #componentElementInternal;
    get #componentElement() {
        if (!this.#componentElementInternal) {
            this.#componentElementInternal = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElementInternal
    }
}
