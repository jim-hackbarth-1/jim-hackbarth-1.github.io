
import { KitDependencyManager, KitNavigator, KitRenderer } from "../../../ui-kit.js";
import { MapWorkerClient } from "../../../domain/references.js";
import { DomHelper } from "../../shared/dom-helper.js";

export function createModel() {
    return new PresentationViewerModel();
}

class PresentationViewerModel {

    // event handlers
    async onRenderStart(componentId) {
        this.componentId = componentId;
        if (this.isPresentationView()) {
            await this.#startListeningForMessages();
        }
    }

    async onRenderComplete() {
        if (this.isPresentationView()) {
            const appWindow = KitDependencyManager.getWindow();
            appWindow.opener.postMessage({ messageType: "loaded" }, appWindow.location.origin);
        }
    }

    // methods
    isPresentationView() {
        const routeName = KitNavigator.getCurrentUrlFragment() ?? "";
        return (routeName == "#presentation-view");
    }

    async toggleFullScreen() {
        const appDocument = KitDependencyManager.getDocument();
        if (!appDocument.fullscreenElement) {
            appDocument.documentElement.requestFullscreen();
        }
        else {
            appDocument.exitFullscreen();
        }
        await this.#refresh();
    }

    // helpers
    #messageHandlerRegistered;
    #flipped;
    #showCaptions;

    #componentElementInternal;
    get #componentElement() {
        if (!this.#componentElementInternal) {
            this.#componentElementInternal = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElementInternal
    }

    async #startListeningForMessages() {
        const appWindow = KitDependencyManager.getWindow();
        if (!this.#messageHandlerRegistered) {
            const me = this;
            appWindow.addEventListener('message', async (event) => {
                if (event.origin === appWindow.origin) {
                    switch (event.data.messageType) {
                        case "refresh":
                            const canvas = DomHelper.getElement(me.#componentElement, "#presentation-canvas");
                            canvas.setAttribute("width", appWindow.innerWidth );
                            canvas.setAttribute("height", appWindow.innerHeight);
                            await me.#refresh();
                            break;
                        case "flip-map":
                            me.#flipped = !me.#flipped;
                            await me.#refresh();
                            break;
                        case "toggle-captions":
                            me.#showCaptions = !me.#showCaptions;
                            await me.#refresh();
                            break;
                    }
                }
            });
            appWindow.addEventListener('beforeunload', function (event) {
                appWindow.opener.postMessage({ messageType: "unloading" }, appWindow.location.origin);
            });
            let resizeTimer;
            appWindow.addEventListener('resize', function (event) {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(async function () {
                    const canvas = DomHelper.getElement(me.#componentElement, "#presentation-canvas");
                    canvas.setAttribute("width", appWindow.innerWidth);
                    canvas.setAttribute("height", appWindow.innerHeight);
                    const message = { messageType: "resized", width: appWindow.innerWidth, height: appWindow.innerHeight };
                    appWindow.opener.postMessage(message, appWindow.location.origin);
                    await me.#refresh();
                }, 250);
            });
            this.#messageHandlerRegistered = true;
        }
    }

    async #refresh() {
        const map = await MapWorkerClient.getMap(true);
        const canvas = DomHelper.getElement(this.#componentElement, "#presentation-canvas");
        const context = canvas.getContext("2d");
        const options = {
            updatedViewPort: true,
            flipped: this.#flipped,
            presentationView: true,
            hideCaptions: !this.#showCaptions
        };
        await map.render(canvas, context, options);
        const appDocument = KitDependencyManager.getDocument();
        const button = DomHelper.getElement(this.#componentElement, "#full-screen-button");
        if (appDocument.fullscreenElement) {
            button.classList.add("hidden");
        }
        else {
            button.classList.remove("hidden");
        }        
    } 
}
