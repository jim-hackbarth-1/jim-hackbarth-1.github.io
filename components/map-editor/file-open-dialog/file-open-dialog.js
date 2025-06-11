
import { KitDependencyManager, KitMessenger, KitRenderer } from "../../../ui-kit.js";
import { DomHelper } from "../../shared/dom-helper.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new FileOpenDialogModel();
}

class FileOpenDialogModel {

    // event handlers
    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {
    }

    // methods
    #clickHandlerRegistered;
    showDialog() {
        const dialog = DomHelper.getElement(this.#componentElement, "dialog");
        const fileNameElement = DomHelper.getElement(this.#componentElement, "#file-name");
        fileNameElement.value = "";
        fileNameElement.disabled = true;
        DomHelper.getElement(this.#componentElement, "#button-ok").disabled = true;
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

    closeDialog() {
        DomHelper.getElement(this.#componentElement, "dialog").close();
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
            DomHelper.getElement(this.#componentElement, "#file-name").value = this.#fileHandle.name;
            DomHelper.getElement(this.#componentElement, "#button-ok").disabled = false;
        }
        else {
            const clickEvent = new MouseEvent('click', {
                clientX: event.clientX,
                clientY: event.clientY
            });
            DomHelper.getElement(this.#componentElement, "#file-input").dispatchEvent(clickEvent);
        }
        
    }

    onFileSelected() {
        const appDocument = KitDependencyManager.getDocument();
        const startCursor = appDocument.body.style.cursor;
        const file = DomHelper.getElement(this.#componentElement, "#file-input").files[0];
        if (file) {
            try {
                appDocument.body.style.cursor = "wait";
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.#fileContents = e.target.result;
                    DomHelper.getElement(this.#componentElement, "#file-name").value = file.name;
                    DomHelper.getElement(this.#componentElement, "#button-ok").disabled = false;
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

    // helpers
    #fileHandle;
    #fileContents;

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
