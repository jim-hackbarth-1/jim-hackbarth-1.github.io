
import { KitDependencyManager, KitMessenger, KitRenderer } from "../../../ui-kit.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new PresentationViewerDialogModel();
}

class PresentationViewerDialogModel {

    // event handlers
    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {
        await this.#startListeningForMessages();
    }

    // methods
    async showDialog() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);    
        const dialog = componentElement.querySelector("dialog");
        dialog.showModal();
        this.#updateButtonAvailability();
        if (!this.#clickHandlerRegistered) {
            dialog.addEventListener('click', function (event) {
                var rect = dialog.getBoundingClientRect();
                var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
                    rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
                if (!isInDialog) {
                    dialog.close();
                }
            });
            this.#clickHandlerRegistered = true;
        }
    }

    closeDialog() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").close();
    }

    openViewerWindow() {
        const appWindow = KitDependencyManager.getWindow();
        this.#presentationWindow = appWindow.open("index.html#presentation-view", "presentation-view", "width=500,height=300,resizable=no");   
    }

    flipMap() {
        if (this.#presentationWindow) {
            const appWindow = KitDependencyManager.getWindow();
            this.#presentationWindow.postMessage({ messageType: "flip-map" }, appWindow.location.origin);
        }
    }

    refresh() {
        if (this.#presentationWindow) {
            const appWindow = KitDependencyManager.getWindow();
            this.#presentationWindow.postMessage({ messageType: "refresh" }, appWindow.location.origin);
        }
    }

    // helpers
    #clickHandlerRegistered;
    #presentationWindow;
    #messageHandlerRegistered;
    #componentElement;

    #getElement(selector) {
        if (!this.#componentElement) {
            this.#componentElement = KitRenderer.getComponentElement(this.componentId);
        }
        if (!this.#componentElement) {
            return null;
        }
        return this.#componentElement.querySelector(selector);
    }

    #updateButtonAvailability() {
        let disabled = true;
        if (this.#presentationWindow) {
            disabled = false;
        }
        let element = this.#getElement("#button-flip-map");
        if (element) {
            element.disabled = disabled;
        }
        element = this.#getElement("#button-refresh");
        if (element) {
            element.disabled = disabled;
        }
    }

    async #startListeningForMessages() {
        const appWindow = KitDependencyManager.getWindow();
        if (!this.#messageHandlerRegistered) {
            appWindow.addEventListener('message', async (event) => {
                if (event.origin === appWindow.origin) {
                    switch (event.data.messageType) {
                        case "loaded":
                            this.#updateButtonAvailability();
                            await KitMessenger.publish(EditorModel.PresentationViewerStatusTopic, { presentationWindow: this.#presentationWindow });
                            this.refresh();
                            break;
                        case "unloading":
                            this.#presentationWindow = null;
                            this.#updateButtonAvailability();
                            await KitMessenger.publish(EditorModel.PresentationViewerStatusTopic, { isPresentationWindowOpen: null });
                            break;
                    }
                }
            });
            this.#messageHandlerRegistered = true;
        }
    }
}
