
import { KitDependencyManager } from "../../ui-kit.js";

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
        if (!DebugConsole.#errorHandlerRegistered) {
            appWindow.addEventListener("error", (event) => this.#handleError(event));
            DebugConsole.#errorHandlerRegistered = true;
        }
        if (!DebugConsole.#promiseRejectionHandlerRegistered) {
            appWindow.addEventListener("unhandledrejection", (event) => this.#handlePromiseRejection(event));
            DebugConsole.#promiseRejectionHandlerRegistered = true;
        }
    }

    static #errorHandlerRegistered;
    #handleError(event) {
        this.error(`Uncaught ${event.error.message}\n ${event.error.stack}`, true);
    }

    static #promiseRejectionHandlerRegistered;
    #handlePromiseRejection(event) {
        this.error(`Uncaught (in promise) ${event.reason.message}\n ${event.reason.stack}`, true);
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
