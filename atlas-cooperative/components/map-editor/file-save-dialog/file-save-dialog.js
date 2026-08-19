
import { EditorModel } from "../editor/editor.js";
import { DialogHelper } from "../../shared/dialog-helper.js";

export function createModel() {
    return new FileSaveDialogModel();
}

class FileSaveDialogModel {

    // event handlers
    async init(kitElement) {
        this.#kitElement = kitElement;
    }

    async onRendered() {
        if (FileSaveDialogModel.#isVisible) {
            this.#kitElement.querySelector("#file-name").value = "";
            this.#kitElement.querySelector("#button-ok").disabled = true;
            FileSaveDialogModel.#fileHandle = null;
            const dialog = this.#kitElement.querySelector("dialog");
            const header = this.#kitElement.querySelector("header");
            this.#dialogHelper = new DialogHelper();
            this.#dialogHelper.show(dialog, header, this.#onCloseDialog);
        }
    }

    // methods
    isVisible() {
        return FileSaveDialogModel.#isVisible;
    }

    async showDialog() {
        FileSaveDialogModel.#isVisible = true;
        await UIKit.renderer.renderElement(this.#kitElement);
    }

    closeDialog() {
        this.#dialogHelper.close();
    }

    async browse() {
        try {
            FileSaveDialogModel.#fileHandle = await UIKit.window.showSaveFilePicker({
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
        const fileNameElement = this.#kitElement.querySelector("#file-name");
        fileNameElement.value = FileSaveDialogModel.#fileHandle.name;
        this.#kitElement.querySelector("#button-ok").disabled = false;
    }

    onFileNameChanged() {
        const element = this.#kitElement.querySelector("#file-name");
        let disabled = true;
        if (element.value && element.value.trim().length > 0) {
            disabled = false;
        }
        this.#kitElement.querySelector("#button-ok").disabled = disabled;
    }

    async buttonOkClicked() {
        this.closeDialog();
        if (this.hasFileSystemAccess()) {
            await UIKit.messenger.publish(EditorModel.SaveFileRequestTopic, { fileHandle: FileSaveDialogModel.#fileHandle });
        }
        else {
            let fileName = this.#kitElement.querySelector("#file-name").value.trim();
            if (!fileName.toLowerCase().endsWith(".json")) {
                fileName += ".json";
            }
            await UIKit.messenger.publish(EditorModel.SaveFileRequestTopic, { fileName: fileName });
        }
    }

    hasFileSystemAccess() {
        if ('showSaveFilePicker' in UIKit.window) {
            return true;
        }
        return false;
    }

    // helpers
    static #isVisible = false;
    static #fileHandle = null;
    #kitElement = null;
    #dialogHelper = null;

    #onCloseDialog = async () => {
        FileSaveDialogModel.#isVisible = false;
        await UIKit.renderer.renderElement(this.#kitElement);
    }
}
