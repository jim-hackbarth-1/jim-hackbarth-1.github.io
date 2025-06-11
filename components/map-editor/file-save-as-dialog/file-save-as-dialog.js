
import { KitMessenger, KitRenderer } from "../../../ui-kit.js";
import { DomHelper } from "../../shared/dom-helper.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new FileSaveAsDialogModel();
}

class FileSaveAsDialogModel {

    // event handlers
    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {
    }

    // methods
    #clickHandlerRegistered;
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
        this.#asMap = true;
        DomHelper.getElement(this.#componentElement, "#as-map-radio").checked = true;
        DomHelper.getElement(this.#componentElement, "#file-name").value = "";
        DomHelper.getElement(this.#componentElement, "#button-ok").disabled = true;
        this.#fileHandle = null;
    }

    closeDialog() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").close();
    }

    #asMap = true;
    asMap() {
        return this.#asMap;
    }

    async setAsMap(asMap) {
        this.#asMap = asMap;
        await DomHelper.reRenderElement(this.#componentElement, "file-controls-container");
    }

    async browse() {
        const asMap = DomHelper.getElement(this.#componentElement, "#as-map-radio").checked;
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

    onFileNameChanged() {
        const element = DomHelper.getElement(this.#componentElement, "#file-name");
        let disabled = true;
        if (element.value && element.value.trim().length > 0) {
            disabled = false;
        }
        DomHelper.getElement(this.#componentElement, "#button-ok").disabled = disabled;
    }

    async buttonOkClicked() {
        this.closeDialog();
        const fileType = this.#asMap ? "map" : "image";
        if (fileType == "map") {
            await KitMessenger.publish(EditorModel.SaveFileAsRequestTopic, { fileHandle: this.#fileHandle, fileType: fileType });
        }
        else {
            const fileName = DomHelper.getElement(this.#componentElement, "#file-name").value.trim();
            await KitMessenger.publish(EditorModel.SaveFileAsRequestTopic, { fileName: fileName, fileType: fileType });
        }
    }

    // helpers
    #fileHandle;

    #componentElementInternal;
    get #componentElement() {
        if (!this.#componentElementInternal) {
            this.#componentElementInternal = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElementInternal
    }
}
