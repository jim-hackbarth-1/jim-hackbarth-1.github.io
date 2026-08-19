import { FileManager } from "../../../../domain/references.js";

export function createModel() {
    return new ImageViewModel();
}

class ImageViewModel {

    // event handlers
    async init(kitElement, kitObjects) {
        this.#kitElement = kitElement;
        this.#changeHandler = kitObjects.find(o => o.alias == "changeHandler")?.object;  
    }

    // methods
    getSrc() {
        let src = this.#kitElement.getAttribute("src");
        if (!src) {
            src = null;
        }
        return src;
    }

    async setSrc() {
        let fileHandles = null;
        try {
            fileHandles = await UIKit.window.showOpenFilePicker({
                types: [
                    {
                        description: "Image files",
                        accept: { "image/*": [".png", ".gif", ".jpeg", ".jpg"] }
                    }
                ]
            });
        }
        catch {
            return;
        }
        const fileHandle = fileHandles[0];
        const src = await FileManager.getImageSource(fileHandle);
        this.#kitElement.setAttribute("src", src);
        this.#kitElement.querySelector("img").src = src;
        if (this.#changeHandler) {
            this.#changeHandler(this.#kitElement);
        }
    }

    isDisabled() {
        return this.#kitElement.hasAttribute("disabled");
    }

    // helpers
    #kitElement = null;
    #changeHandler = null;

}
