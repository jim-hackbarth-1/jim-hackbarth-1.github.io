
import { MapWorkerClient } from "../../../domain/references.js";

export function createModel() {
    return new PresentationViewerModel();
}

class PresentationViewerModel {

    // event handlers
    async init(kitElement) {
        this.#kitElement = kitElement;
        if (this.isPresentationView()) {
            await this.#startListeningForMessages();
        }
    }

    async onRendered() {
        if (this.isPresentationView()) {
            UIKit.window.opener.postMessage({ messageType: "loaded" }, UIKit.window.location.origin);
        }
    }

    // methods
    isPresentationView() {
        const routeName = UIKit.navigator.getHash(UIKit.document.location.href) ?? "";
        return (routeName == "#presentation-view");
    }

    async toggleFullScreen() {
        if (!UIKit.document.fullscreenElement) {
            UIKit.document.documentElement.requestFullscreen();
        }
        else {
            UIKit.document.exitFullscreen();
        }
        await this.#refresh();
    }

    // helpers
    static #messageHandlerRegistered = false;
    static #flipped = false;
    static #showCaptions = false;
    #kitElement = null;
    
    async #startListeningForMessages() {
        if (!PresentationViewerModel.#messageHandlerRegistered) {
            const me = this;
            UIKit.window.addEventListener('message', async (event) => {
                if (event.origin === UIKit.window.origin) {
                    switch (event.data.messageType) {
                        case "refresh":
                            const canvas = me.#kitElement.querySelector("#presentation-canvas");
                            canvas.setAttribute("width", UIKit.window.innerWidth );
                            canvas.setAttribute("height", UIKit.window.innerHeight);
                            await me.#refresh();
                            break;
                        case "flip-map":
                            PresentationViewerModel.#flipped = !PresentationViewerModel.#flipped;
                            await me.#refresh();
                            break;
                        case "toggle-captions":
                            PresentationViewerModel.#showCaptions = !PresentationViewerModel.#showCaptions;
                            await me.#refresh();
                            break;
                    }
                }
            });
            UIKit.window.addEventListener('beforeunload', function (event) {
                UIKit.window.opener.postMessage({ messageType: "unloading" }, UIKit.window.location.origin);
            });
            let resizeTimer;
            UIKit.window.addEventListener('resize', function (event) {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(async function () {
                    const canvas = me.#kitElement.querySelector("#presentation-canvas");
                    canvas.setAttribute("width", UIKit.window.innerWidth);
                    canvas.setAttribute("height", UIKit.window.innerHeight);
                    const message = { messageType: "resized", width: UIKit.window.innerWidth, height: UIKit.window.innerHeight };
                    UIKit.window.opener.postMessage(message, UIKit.window.location.origin);
                    await me.#refresh();
                }, 250);
            });
            PresentationViewerModel.#messageHandlerRegistered = true;
        }
    }

    async #refresh() {
        const map = await MapWorkerClient.getMap(true);
        const canvas = this.#kitElement.querySelector("#presentation-canvas");
        const context = canvas.getContext("2d");
        const options = {
            updatedViewPort: true,
            flipped: PresentationViewerModel.#flipped,
            presentationView: true,
            hideCaptions: !PresentationViewerModel.#showCaptions
        };
        await map.render(canvas, context, options);
        const button = this.#kitElement.querySelector("#full-screen-button");
        if (UIKit.document.fullscreenElement) {
            button.classList.add("hidden");
        }
        else {
            button.classList.remove("hidden");
        }        
    } 
}
