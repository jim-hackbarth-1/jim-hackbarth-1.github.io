
import { KitMessenger, KitRenderer } from "../../../ui-kit.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new FileSaveAsDialogModel();
}

class FileSaveAsDialogModel {

    #fileHandle = null;

    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {
    }

    showDialog() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const dialog = componentElement.querySelector("dialog");
        dialog.showModal();
        if (!this.#clickHandlerRegistered) {
            dialog.addEventListener('click', function (event) {
                var rect = dialog.getBoundingClientRect();
                var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
                    rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
                if (!isInDialog) {
                    dialog.close();
                }
            });
        }
        this.#getElement("#as-map-radio").checked = true;
        this.#getElement("#file-name").value = "";
        this.#getElement("#button-ok").disabled = true;
    }

    #clickHandlerRegistered;
    #asMap = true;

    closeDialog() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").close();
    }

    async browse() {
        const asMap = this.#getElement("#as-map-radio").checked;
        let fileTypes = {
            description: "Json Files",
            accept: { "text/plain": [".json"] }
        };
        if (!asMap) {
            fileTypes = {
                description: "Image Files",
                accept: { "image/png": [".png"] }
            };
        }
        try {
            this.#fileHandle = await window.showSaveFilePicker({
                types: [fileTypes]
            });
        }
        catch {
            return;
        }
        this.#asMap = asMap;
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const fileNameElement = componentElement.querySelector("#file-name");
        fileNameElement.value = this.#fileHandle.name;
        componentElement.querySelector("#button-ok").disabled = false;
    }

    async buttonOkClicked() {
        const fileType = this.#asMap ? "map" : "image";
        KitMessenger.publish(EditorModel.SaveFileAsRequestTopic, { fileHandle: this.#fileHandle, fileType: fileType });
        this.closeDialog();
    }

    // helpers
    #componentElement;
    #getElement(selector) {
        if (!this.#componentElement) {
            this.#componentElement = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElement.querySelector(selector);
    }
}
