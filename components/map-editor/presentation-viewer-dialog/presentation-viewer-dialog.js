
import { EditorModel } from "../editor/editor.js";
import { DialogHelper } from "../../shared/dialog-helper.js";

export function createModel() {
    return new PresentationViewerDialogModel();
}

class PresentationViewerDialogModel {

    // event handlers
    async init(kitElement) {
        this.#kitElement = kitElement;
    }

    async onRendered() {
        if (PresentationViewerDialogModel.#isVisible) {
            await this.#startListeningForMessages();
            const dialog = this.#kitElement.querySelector("dialog");
            const header = this.#kitElement.querySelector("header");
            this.#dialogHelper = new DialogHelper();
            this.#dialogHelper.show(dialog, header, this.#onCloseDialog);
        }
    }

    // methods
    isVisible() {
        return PresentationViewerDialogModel.#isVisible;
    }

    async showDialog() {
        PresentationViewerDialogModel.#isVisible = true;
        await UIKit.renderer.renderKitElement(this.#kitElement);
    }

    closeDialog() {
        this.#dialogHelper.close();
    }

    openViewerWindow() {
        PresentationViewerDialogModel.#presentationWindow
            = UIKit.window.open("index.html#presentation-view", "presentation-view", "width=500,height=300,resizable=no");
    }

    flipMap() {
        if (PresentationViewerDialogModel.#presentationWindow) {
            PresentationViewerDialogModel.#presentationWindow.postMessage({ messageType: "flip-map" }, UIKit.window.location.origin);
        }
    }

    toggleCaptions() {
        if (PresentationViewerDialogModel.#presentationWindow) {
            PresentationViewerDialogModel.#presentationWindow.postMessage(
                { messageType: "toggle-captions" }, UIKit.window.location.origin);
        }
    }

    refresh() {
        if (PresentationViewerDialogModel.#presentationWindow) {
            PresentationViewerDialogModel.#presentationWindow.postMessage({ messageType: "refresh" }, UIKit.window.location.origin);
        }
    }

    // helpers
    static #isVisible = false;
    static #presentationWindow = null;
    static #messageHandlerRegistered = false;
    #kitElement = null;
    #dialogHelper = null;

    #onCloseDialog = async () => {
        PresentationViewerDialogModel.#isVisible = false;
        await UIKit.renderer.renderKitElement(this.#kitElement);
    }

    async #startListeningForMessages() {
        if (!PresentationViewerDialogModel.#messageHandlerRegistered) {
            UIKit.window.addEventListener('message', async (event) => {
                if (event.origin === UIKit.window.origin) {
                    switch (event.data.messageType) {
                        case "loaded":
                            this.#updateButtonAvailability();
                            await UIKit.messenger.publish(
                                EditorModel.PresentationViewerStatusTopic,
                                { presentationWindow: PresentationViewerDialogModel.#presentationWindow });
                            this.refresh();
                            break;
                        case "unloading":
                            PresentationViewerDialogModel.#presentationWindow = null;
                            this.#updateButtonAvailability();
                            await UIKit.messenger.publish(
                                EditorModel.PresentationViewerStatusTopic,
                                { isPresentationWindowOpen: null });
                            break;
                        case "resized":
                            let width = event.data.width;
                            let height = event.data.height;
                            if (width < 1200 && height < 750) {
                                width = 1200;
                                height = 750
                            }
                            await UIKit.messenger.publish(
                                EditorModel.CanvasResizeRequestTopic,
                                { width: width, height: height });
                            break;
                    }
                }
            });
            PresentationViewerDialogModel.#messageHandlerRegistered = true;
        }
    }

    #updateButtonAvailability() {
        let disabled = true;
        if (PresentationViewerDialogModel.#presentationWindow) {
            disabled = false;
        }
        let element = this.#kitElement.querySelector("#button-flip-map");
        if (element) {
            element.disabled = disabled;
        }
        element = this.#kitElement.querySelector("#button-toggle-captions");
        if (element) {
            element.disabled = disabled;
        }
        element = this.#kitElement.querySelector("#button-refresh");
        if (element) {
            element.disabled = disabled;
        }
    }
}
