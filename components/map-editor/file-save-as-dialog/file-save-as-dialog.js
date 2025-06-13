
import { KitDependencyManager, KitMessenger, KitRenderer } from "../../../ui-kit.js";
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
    async showDialog() {
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
        this.#fileHandle = null;
        DomHelper.getElement(this.#componentElement, "#file-name").value = "";
        DomHelper.getElement(this.#componentElement, "#button-ok").disabled = true;
        await DomHelper.reRenderElement(this.#componentElement, "file-controls-container");
    }

    closeDialog() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").close();
    }

    canBrowse() {
        return this.#hasFileSystemAccess() ? this.#asMap : false;
    }

    #asMap = true;
    async setAsMap(asMap) {
        this.#asMap = asMap;
        this.#fileHandle = null;
        DomHelper.getElement(this.#componentElement, "#file-name").value = "";
        DomHelper.getElement(this.#componentElement, "#button-ok").disabled = true;
        await DomHelper.reRenderElement(this.#componentElement, "file-controls-container");
    }

    async browse() {
        const fileTypes = {
            description: "Json Files",
            accept: { "text/plain": [".json"] }
        };
        try {
            this.#fileHandle = await window.showSaveFilePicker({ types: [fileTypes] });
        }
        catch {
            return;
        }
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
        if (this.canBrowse()) {
            await KitMessenger.publish(EditorModel.SaveFileAsRequestTopic, { fileHandle: this.#fileHandle, fileType: fileType });
        }
        else {
            let fileName = DomHelper.getElement(this.#componentElement, "#file-name").value.trim();
            if (fileType == "map" && !fileName.toLowerCase().endsWith(".json")) {
                fileName += ".json";
            }
            if (fileType == "image" && !fileName.toLowerCase().endsWith(".png")) {
                fileName += ".png";
            }
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

    #hasFileSystemAccess() {
        if ('showSaveFilePicker' in KitDependencyManager.getWindow()) {
            return true;
        }
        return false;
    }
}
