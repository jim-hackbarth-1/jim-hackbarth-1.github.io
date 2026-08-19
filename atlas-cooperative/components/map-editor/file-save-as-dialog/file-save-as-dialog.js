
import { EditorModel } from "../editor/editor.js";
import { DialogHelper } from "../../shared/dialog-helper.js";

export function createModel() {
    return new FileSaveAsDialogModel();
}

class FileSaveAsDialogModel {

    // event handlers
    async init(kitElement) {
        this.#kitElement = kitElement;
    }

    async onRendered() {
        if (FileSaveAsDialogModel.#isVisible) {
            FileSaveAsDialogModel.#asMap = true;
            FileSaveAsDialogModel.#fileHandle = null;
            this.#kitElement.querySelector("#as-map-radio").checked = true;
            this.#kitElement.querySelector("#file-name").value = "";
            this.#kitElement.querySelector("#button-ok").disabled = true;
            const dialog = this.#kitElement.querySelector("dialog");
            const header = this.#kitElement.querySelector("header");
            this.#dialogHelper = new DialogHelper();
            this.#dialogHelper.show(dialog, header, this.#onCloseDialog);
        }
    }

    // methods
    isVisible() {
        return FileSaveAsDialogModel.#isVisible;
    }

    async showDialog() {
        FileSaveAsDialogModel.#isVisible = true;
        await UIKit.renderer.renderElement(this.#kitElement);
    }

    closeDialog() {
        this.#dialogHelper.close();
    }

    async setAsMap(asMap) {
        FileSaveAsDialogModel.#asMap = asMap;
        FileSaveAsDialogModel.#fileHandle = null;
        this.#kitElement.querySelector("#file-name").value = "";
        this.#kitElement.querySelector("#button-ok").disabled = true;
        const kitElement = this.#kitElement.querySelector("#file-controls-container");
        await UIKit.renderer.renderElement(kitElement);
    }

    canBrowse() {
        return FileSaveAsDialogModel.#hasFileSystemAccess() ? FileSaveAsDialogModel.#asMap : false;
    }

    async browse() {
        const fileTypes = {
            description: "Json Files",
            accept: { "text/plain": [".json"] }
        };
        try {
            FileSaveAsDialogModel.#fileHandle = await UIKit.window.showSaveFilePicker({ types: [fileTypes] });
        }
        catch {
            return;
        }
        this.#kitElement.querySelector("#file-name").value = FileSaveAsDialogModel.#fileHandle.name;
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
        const fileType = FileSaveAsDialogModel.#asMap ? "map" : "image";
        if (this.canBrowse()) {
            await UIKit.messenger.publish(
                EditorModel.SaveFileAsRequestTopic, { fileHandle: FileSaveAsDialogModel.#fileHandle, fileType: fileType });
        }
        else {
            let fileName = this.#kitElement.querySelector("#file-name").value.trim();
            if (fileType == "map" && !fileName.toLowerCase().endsWith(".json")) {
                fileName += ".json";
            }
            if (fileType == "image" && !fileName.toLowerCase().endsWith(".png")) {
                fileName += ".png";
            }
            await UIKit.messenger.publish(EditorModel.SaveFileAsRequestTopic, { fileName: fileName, fileType: fileType });
        }
    }

    // helpers
    static #isVisible = false;
    static #asMap = true;
    static #fileHandle = null;
    #kitElement = null;
    #dialogHelper = null;

    #onCloseDialog = async () => {
        FileSaveAsDialogModel.#isVisible = false;
        await UIKit.renderer.renderElement(this.#kitElement);
    }

    static #hasFileSystemAccess() {
        if ('showSaveFilePicker' in UIKit.window) {
            return true;
        }
        return false;
    }
}
