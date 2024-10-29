
import { KitDependencyManager } from "../../ui-kit.js";

export function createModel() {
    return new HeadingModel();
}

class HeadingModel {

    displayNav = true;

    async onRenderStart(componentId) {
        this.componentId = componentId;
        KitDependencyManager.setConsole(new DebugConsole());
    }

    async toggleNav() {
        this.displayNav = !this.displayNav;
        let appNavLeft = "0px";
        if (!this.displayNav) {
            appNavLeft = "calc(-1 * var(--app-nav-width-expanded))";
        }
        const appDocument = KitDependencyManager.getDocument();
        const element = appDocument.documentElement;
        element.style.setProperty("--app-nav-left", appNavLeft);
    }
   
}

export class DebugConsole {

    static #debugItems;
    static get debugItems() {
        if (!DebugConsole.#debugItems) {
            DebugConsole.#debugItems = [];
        }
        return DebugConsole.#debugItems;
    }

    constructor() {
        const appWindow = KitDependencyManager.getWindow();
        appWindow.addEventListener("error", (event) => {
            this.error(`Uncaught ${event.error.stack}`, true);
        });
        appWindow.addEventListener("unhandledrejection", (event) => {
            this.error(`Uncaught (in promise) ${event.reason.stack}`, true);
        });
    }

    log(data) {
        console.log(data);
        DebugConsole.debugItems.push({ itemType: "info", data: data });
    }

    warn(data) {
        console.warn(data);
        DebugConsole.debugItems.push({ itemType: "warning", data: data });
    }

    error(data, isUnhandled) {
        if (!isUnhandled) {
            console.error(data);
        }
        DebugConsole.debugItems.push({ itemType: "error", data: data });
    }
}
