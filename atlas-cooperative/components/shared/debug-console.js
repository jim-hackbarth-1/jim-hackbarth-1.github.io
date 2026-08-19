
import { UIKit } from "../../ui-kit.js";

export class DebugConsole {

    static #debugItems;
    static get debugItems() {
        if (!DebugConsole.#debugItems) {
            DebugConsole.#debugItems = [];
        }
        return DebugConsole.#debugItems;
    }

    constructor() {
        if (!DebugConsole.#errorHandlerRegistered) {
            UIKit.window.addEventListener("error", (event) => this.#handleError(event));
            DebugConsole.#errorHandlerRegistered = true;
        }
        if (!DebugConsole.#promiseRejectionHandlerRegistered) {
            UIKit.window.addEventListener("unhandledrejection", (event) => this.#handlePromiseRejection(event));
            DebugConsole.#promiseRejectionHandlerRegistered = true;
        }
    }

    static #errorHandlerRegistered;
    #handleError(event) {
        const data = `Uncaught ${event.error.message}\n ${event.error.stack}`;
        DebugConsole.debugItems.push({ itemType: "error", data: data });
    }

    static #promiseRejectionHandlerRegistered;
    #handlePromiseRejection(event) {
        const data = `Uncaught (in promise) ${event.reason.message}\n ${event.reason.stack}`;
        DebugConsole.debugItems.push({ itemType: "error", data: data });
    }

    log(data) {
        console.log.apply(null, arguments);
        DebugConsole.debugItems.push({ itemType: "info", data: data });
    }

    warn(data) {
        console.warn.apply(null, arguments);
        DebugConsole.debugItems.push({ itemType: "warning", data: data });
    }

    error(data) {
        console.error.apply(null, arguments);
        DebugConsole.debugItems.push({ itemType: "error", data: data });
    }
}
