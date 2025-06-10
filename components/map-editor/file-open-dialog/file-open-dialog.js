
import { KitDependencyManager, KitMessenger, KitRenderer } from "../../../ui-kit.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new FileOpenDialogModel();
}

class FileOpenDialogModel {

    #fileHandle;
    #fileContents;

    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {
    }

    showDialog() {
        const dialog = this.#getElement("dialog");
        const fileNameElement = this.#getElement("#file-name");
        fileNameElement.value = "";
        fileNameElement.disabled = true;
        this.#getElement("#button-ok").disabled = true;
        this.#fileHandle = null;
        this.#fileContents = null;
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
    }

    #clickHandlerRegistered;

    closeDialog() {
        this.#getElement("dialog").close();
    }

    async browse(event) {
        if (this.#hasFileSystemAccess()) {
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
            this.#getElement("#file-name").value = this.#fileHandle.name;
            this.#getElement("#button-ok").disabled = false;
        }
        else {
            const clickEvent = new MouseEvent('click', {
                clientX: event.clientX,
                clientY: event.clientY
            });
            this.#getElement("#file-input").dispatchEvent(clickEvent);
        }
        
    }

    onFileSelected() {
        const appDocument = KitDependencyManager.getDocument();
        const startCursor = appDocument.body.style.cursor;
        const file = this.#getElement("#file-input").files[0];
        if (file) {
            try {
                appDocument.body.style.cursor = "wait";
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.#fileContents = e.target.result;
                    this.#getElement("#file-name").value = file.name;
                    this.#getElement("#button-ok").disabled = false;
                };
                reader.readAsText(file);
            }
            finally {
                appDocument.body.style.cursor = startCursor;
            }  
        }
    }

    async buttonOkClicked() {
        this.closeDialog();
        if (this.#hasFileSystemAccess()) {
            await KitMessenger.publish(EditorModel.OpenFileRequestTopic, { fileHandle: this.#fileHandle });
        }
        else {
            await KitMessenger.publish(EditorModel.OpenFileRequestTopic, { fileContents: this.#fileContents });
        }
    }

    #componentElement;
    #getElement(selector) {
        if (!this.#componentElement) {
            this.#componentElement = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElement.querySelector(selector);
    }

    #hasFileSystemAccess() {
        if ('showSaveFilePicker' in KitDependencyManager.getWindow()) {
            return true;
        }
        return false;
    }
}
