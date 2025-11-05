
import { MapWorkerClient } from "../../../domain/references.js";
import { DialogHelper } from "../../shared/dialog-helper.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new CanvasSizeDialogModel();
}

class CanvasSizeDialogModel {

    // event handlers
    async init(kitElement) {
        this.#kitElement = kitElement;
        
    }

    async onRendered() {
        if (CanvasSizeDialogModel.#isVisible) {
            const currentCanvasSize = MapWorkerClient.getCurrentCanvasSize();
            this.#kitElement.querySelector("#inputHeight").value = currentCanvasSize.height;
            this.#kitElement.querySelector("#inputWidth").value = currentCanvasSize.width;
            const dialog = this.#kitElement.querySelector("dialog");
            const header = this.#kitElement.querySelector("header");
            this.#dialogHelper = new DialogHelper();
            this.#dialogHelper.show(dialog, header, this.#onCloseDialog);
        }
    }

    // methods
    isVisible() {
        return CanvasSizeDialogModel.#isVisible;
    }

    async showDialog() {
        CanvasSizeDialogModel.#isVisible = true;
        await UIKit.renderer.renderKitElement(this.#kitElement);
    }

    closeDialog = () => {
        this.#dialogHelper.close();
    }

    async onSizeChange() {
        const hasInvalidInput = this.#kitElement.querySelector("input:invalid");
        if (hasInvalidInput) {
            return;
        }
        await this.#updateCanvasSize();
    }

    // helpers
    static #isVisible = false;
    #kitElement = null;
    #dialogHelper = null;

    #onCloseDialog = async () => {
        CanvasSizeDialogModel.#isVisible = false;
        await UIKit.renderer.renderKitElement(this.#kitElement);
    }

    async #updateCanvasSize() {
        const height = Number(this.#kitElement.querySelector("#inputHeight").value);
        const width = Number(this.#kitElement.querySelector("#inputWidth").value);
        await UIKit.messenger.publish(EditorModel.CanvasResizeRequestTopic, { height: height, width: width });
    }
}
