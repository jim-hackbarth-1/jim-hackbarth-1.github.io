
import { KitMessenger, KitRenderer } from "../../../ui-kit.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new FileOpenDialogModel();
}

class FileOpenDialogModel {

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
        let fileHandles = null;
        try {
            fileHandles = await window.showOpenFilePicker({
                types: [
                    {
                        description: 'Json Files',
                        accept: {
                            'text/plain': ['.json'],
                        },
                    },
                ],
            });
        }
        catch {
            return;
        }
        this.#fileHandle = fileHandles[0];
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const fileNameElement = componentElement.querySelector("#file-name");
        fileNameElement.value = this.#fileHandle.name;
        componentElement.querySelector("#button-ok").disabled = false;
    }

    async buttonOkClicked() {
        KitMessenger.publish(EditorModel.OpenFileRequestTopic, { fileHandle: this.#fileHandle });
        this.closeDialog();
    }
}
