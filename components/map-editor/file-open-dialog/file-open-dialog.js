
import { EditorModel } from "../editor/editor.js";
import { DialogHelper } from "../../shared/dialog-helper.js";

export function createModel() {
    return new FileOpenDialogModel();
}

class FileOpenDialogModel {

    // event handlers
    async init(kitElement) {
        this.#kitElement = kitElement;
    }

    async onRendered() {
        if (FileOpenDialogModel.#isVisible) {
            const fileNameElement = this.#kitElement.querySelector("#file-name");
            fileNameElement.value = "";
            fileNameElement.disabled = true;
            this.#kitElement.querySelector("#button-ok").disabled = true;
            FileOpenDialogModel.#fileHandle = null;
            FileOpenDialogModel.#fileContents = null;
            const dialog = this.#kitElement.querySelector("dialog");
            const header = this.#kitElement.querySelector("header");
            this.#dialogHelper = new DialogHelper();
            this.#dialogHelper.show(dialog, header, this.#onCloseDialog);
        }
    }

    // methods
    isVisible() {
        return FileOpenDialogModel.#isVisible;
    }

    async showDialog() {
        FileOpenDialogModel.#isVisible = true;
        await UIKit.renderer.renderKitElement(this.#kitElement);
    }

    closeDialog() {
        this.#dialogHelper.close();
    }

    async browse(event) {
        if (FileOpenDialogModel.#hasFileSystemAccess()) {
            let fileHandles = null;
            try {
                fileHandles = await UIKit.window.showOpenFilePicker({
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
            FileOpenDialogModel.#fileHandle = fileHandles[0];
            this.#kitElement.querySelector("#file-name").value = FileOpenDialogModel.#fileHandle.name;
            this.#kitElement.querySelector("#button-ok").disabled = false;
        }
        else {
            const clickEvent = new MouseEvent('click', {
                clientX: event.clientX,
                clientY: event.clientY
            });
            this.#kitElement.querySelector("#file-input").dispatchEvent(clickEvent);
        }
    }

    async buttonOkClicked() {
        this.closeDialog();
        if (FileOpenDialogModel.#hasFileSystemAccess()) {
            await UIKit.messenger.publish(EditorModel.OpenFileRequestTopic, { fileHandle: FileOpenDialogModel.#fileHandle });
        }
        else {
            await UIKit.messenger.publish(EditorModel.OpenFileRequestTopic, { fileContents: FileOpenDialogModel.#fileContents });
        }
    }

    onFileSelected() {
        const startCursor = UIKit.document.body.style.cursor;
        const file = this.#kitElement.querySelector("#file-input").files[0];
        if (file) {
            try {
                UIKit.document.body.style.cursor = "wait";
                const reader = new FileReader();
                reader.onload = (e) => {
                    FileOpenDialogModel.#fileContents = e.target.result;
                    this.#kitElement.querySelector("#file-name").value = file.name;
                    this.#kitElement.querySelector("#button-ok").disabled = false;
                };
                reader.readAsText(file);
            }
            finally {
                UIKit.document.body.style.cursor = startCursor;
            }
        }
    }

    // helpers
    static #isVisible = false;
    static #fileHandle = null;
    static #fileContents = null;
    #kitElement = null;
    #dialogHelper = null;

    #onCloseDialog = async () => {
        FileOpenDialogModel.#isVisible = false;
        await UIKit.renderer.renderKitElement(this.#kitElement);
    }

    static #hasFileSystemAccess() {
        if ('showSaveFilePicker' in UIKit.window) {
            return true;
        }
        return false;
    }
}
