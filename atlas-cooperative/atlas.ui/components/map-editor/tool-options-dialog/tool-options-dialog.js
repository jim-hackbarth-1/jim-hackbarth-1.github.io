
import { MapWorkerClient } from "../../../domain/references.js";
import { DialogHelper } from "../../shared/dialog-helper.js";

export function createModel() {
    return new ToolOptionsDialogModel();
}

class ToolOptionsDialogModel {

    // event handlers
    async init(kitElement) {
        this.#kitElement = kitElement;
        const toolOptions = MapWorkerClient.getToolOptions() ?? [];
        ToolOptionsDialogModel.#toolOptions = toolOptions.filter(option => option.isVisible);
        this.#initializeKeyEvents();
    }

    async onRendered() {
        if (ToolOptionsDialogModel.#isVisible) {
            const dialog = this.#kitElement.querySelector("dialog");
            const header = this.#kitElement.querySelector("header");
            this.#dialogHelper = new DialogHelper();
            this.#dialogHelper.show(dialog, header, this.#onCloseDialog);
        }
    }

    // methods
    isVisible() {
        return ToolOptionsDialogModel.#isVisible;
    }

    async showDialog() {
        ToolOptionsDialogModel.#isVisible = true;
        await UIKit.renderer.renderElement(this.#kitElement);
    }

    closeDialog() {
        this.#dialogHelper.close();
    }

    getToolOptions() {
        return ToolOptionsDialogModel.#toolOptions;
    }

    isToolOptionStateChecked(toolOptionName, stateName) {
        const toolOption = ToolOptionsDialogModel.#toolOptions.find(option => option.name == toolOptionName);
        return toolOption.currentStateName == stateName;
    }

    setStatesToolOption(toolOptionName, radioButton) {
        MapWorkerClient.applyToolOption({ name: toolOptionName, value: radioButton.value});
    }

    isToolOptionChecked(toolOptionName) {
        const toolOption = ToolOptionsDialogModel.#toolOptions.find(option => option.name == toolOptionName);
        return toolOption.isToggledOn;
    }

    setBooleanToolOption(toolOptionName, checkbox) {
        MapWorkerClient.applyToolOption({ name: toolOptionName, value: checkbox.checked });
    }

    applyToolOption(toolOptionName) {
        MapWorkerClient.applyToolOption({ name: toolOptionName });
    }

    // helpers
    static #isVisible = false;
    static #toolOptions = [];
    static #keyDownHandlerRegistered = false;
    #kitElement = null;
    #dialogHelper = null;

    #onCloseDialog = async () => {
        ToolOptionsDialogModel.#isVisible = false;
        await UIKit.renderer.renderElement(this.#kitElement);
    }

    #initializeKeyEvents() {
        if (!ToolOptionsDialogModel.#keyDownHandlerRegistered) {
            UIKit.document.addEventListener("keydown", async (event) => await this.#handleKeyDownEvent(event));
            ToolOptionsDialogModel.#keyDownHandlerRegistered = true;
        }
    }

    async #handleKeyDownEvent(event) {
        if (!ToolOptionsDialogModel.#isVisible) {
            return;
        }
        let key = event.key;
        if (key) {
            key = key.toLowerCase();
        }
        if (key && !event.repeat && key != "control" && key != "alt" && key != "shift") {
            const ctrlKey = event.ctrlKey;
            const altKey = event.altKey;
            const shiftKey = event.shiftKey;
            const toolOptions = this.getToolOptions();
            for (const toolOption of toolOptions) {
                if (toolOption.typeName == "BooleanToolOption") {
                    if (toolOption.keyboardEventInfo
                        && toolOption.keyboardEventInfo.isApplicableKeyEvent(key, ctrlKey, altKey, shiftKey)) {
                        const checkbox = this.#kitElement.querySelector(`#tool-option-checkbox-${toolOption.name}`);
                        if (checkbox) {
                            checkbox.checked = !checkbox.checked;
                        }
                    }
                }
                if (toolOption.typeName == "StatesToolOption") {
                    for (const toolOptionState of toolOption.states) {
                        if (toolOptionState.keyboardEventInfo
                            && toolOptionState.keyboardEventInfo.isApplicableKeyEvent(key, ctrlKey, altKey, shiftKey)) {
                            const radio = this.#kitElement.querySelector(
                                `#tool-option-radio-${toolOption.name}-${toolOptionState.name}`);
                            if (radio) {
                                radio.checked = !radio.checked;
                            }
                        }
                    }
                }
            }
        }
    }
}
