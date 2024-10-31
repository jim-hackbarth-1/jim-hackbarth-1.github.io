
import { KitMessenger, KitRenderer } from "../../../ui-kit.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new FileSaveDialogModel();
}

class FileSaveDialogModel {

    #fileHandle = null;

    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {
    }

    showDialog() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").showModal();
    }

    closeDialog() {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").close();
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

    async buttonOkClicked() {
        KitMessenger.publish(EditorModel.SaveFileRequestTopic, { fileHandle: this.#fileHandle });
        this.closeDialog();
    }
}
