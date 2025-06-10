
import { KitDependencyManager, KitMessenger, KitRenderer } from "../../../ui-kit.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new FileSaveDialogModel();
}

class FileSaveDialogModel {

    #fileHandle;

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
        componentElement.querySelector("#file-name").value = "";
        componentElement.querySelector("#button-ok").disable = true;
        this.#fileHandle = null;
    }

    #clickHandlerRegistered;

    closeDialog() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").close();
    }

    hasFileSystemAccess() {
        if ('showSaveFilePicker' in KitDependencyManager.getWindow()) {
            return true;
        }
        return false;
    }

    async browse() {
        try {
            this.#fileHandle = await window.showSaveFilePicker({
                types: [
                    {
                        description: "Json Files",
                        accept: { "text/plain": [".json"] }
                    }
                ]
            });
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
        const element = this.#getElement("#file-name");
        let disabled = true;
        if (element.value && element.value.trim().length > 0) {
            disabled = false;
        }
        this.#getElement("#button-ok").disabled = disabled;
    }

    async buttonOkClicked() {
        this.closeDialog();
        if (this.hasFileSystemAccess()) {
            await KitMessenger.publish(EditorModel.SaveFileRequestTopic, { fileHandle: this.#fileHandle });
        }
        else {
            const fileName = this.#getElement("#file-name").value.trim();
            await KitMessenger.publish(EditorModel.SaveFileRequestTopic, { fileName: fileName });
        }  
    }

    #componentElement;
    #getElement(selector) {
        if (!this.#componentElement) {
            this.#componentElement = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElement.querySelector(selector);
    }
}
