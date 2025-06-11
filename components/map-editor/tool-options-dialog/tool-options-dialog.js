
import { MapWorkerClient } from "../../../domain/references.js";
import { KitDependencyManager, KitRenderer } from "../../../ui-kit.js";

export function createModel() {
    return new ToolOptionsDialogModel();
}

class ToolOptionsDialogModel {

    // event handlers
    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() { 
        this.#initializeKeyEvents();
    }

    // methods
    #clickHandlerRegistered;
    async showDialog() {
        this.#isVisible = true;
        const toolOptions = MapWorkerClient.getToolOptions() ?? [];
        this.#toolOptions = toolOptions.filter(option => option.isVisible);
        await this.#reRenderDialog();
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const dialog = componentElement.querySelector("dialog");
        dialog.showModal();
        if (!this.#clickHandlerRegistered) {
            const me = this;
            dialog.addEventListener('click', function (event) {
                var rect = dialog.getBoundingClientRect();
                var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
                    rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
                if (!isInDialog) {
                    me.#isVisible = false;
                    dialog.close();
                }
            });
        }
    }

    #isVisible;
    isVisible() {
        return this.#isVisible
    }

    getToolOptions() {
        return this.#toolOptions;
    }

    isToolOptionChecked(toolOptionName) {
        const toolOption = this.#toolOptions.find(option => option.name == toolOptionName);
        return toolOption.isToggledOn ? "checked" : null;
    }

    isToolOptionStateChecked(toolOptionName, stateName) {
        const toolOption = this.#toolOptions.find(option => option.name == toolOptionName);
        return toolOption.currentStateName == stateName ? "checked" : null;
    }

    setStatesToolOption(toolOptionName, radioButton) {
        MapWorkerClient.applyToolOption({ name: toolOptionName, value: radioButton.value});
    }

    setBooleanToolOption(toolOptionName, checkbox) {
        MapWorkerClient.applyToolOption({ name: toolOptionName, value: checkbox.checked });
    }

    applyToolOption(toolOptionName) {
        MapWorkerClient.applyToolOption({ name: toolOptionName });
    }

    closeDialog() {
        this.#isVisible = false;
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").close();
    }

    // helpers
    #toolOptions = [];

    static #keyDownHandlerRegistered;
    #initializeKeyEvents() {
        if (!ToolOptionsDialogModel.#keyDownHandlerRegistered) {
            const appDocument = KitDependencyManager.getDocument();
            appDocument.addEventListener("keydown", async (event) => await this.#handleKeyDownEvent(event));
            ToolOptionsDialogModel.#keyDownHandlerRegistered = true;
        }
    }

    async #handleKeyDownEvent(event) { 
        let key = event.key;
        if (key) {
            key = key.toLowerCase();
        } 
        if (key && !event.repeat && key != "control" && key != "alt" && key != "shift") {  
            const ctrlKey = event.ctrlKey;
            const altKey = event.altKey;
            const shiftKey = event.shiftKey;
            const componentElement = KitRenderer.getComponentElement(this.componentId);
            const toolOptions = this.getToolOptions();
            for (const toolOption of toolOptions) {
                if (toolOption.typeName == "BooleanToolOption") {
                    if (toolOption.keyboardEventInfo && toolOption.keyboardEventInfo.isApplicableKeyEvent(key, ctrlKey, altKey, shiftKey)) {
                        const checkbox = componentElement.querySelector(`#tool-option-checkbox-${toolOption.name}`);
                        if (checkbox) {
                            checkbox.checked = !checkbox.checked;
                        }
                    }
                }
                if (toolOption.typeName == "StatesToolOption") {
                    for (const toolOptionState of toolOption.states) {
                        if (toolOptionState.keyboardEventInfo && toolOptionState.keyboardEventInfo.isApplicableKeyEvent(key, ctrlKey, altKey, shiftKey)) {
                            const radio = componentElement.querySelector(`#tool-option-radio-${toolOption.name}-${toolOptionState.name}`);
                            if (radio) {
                                radio.checked = !radio.checked;
                            }
                        }
                    }
                }
            }
        }
    }

    async #reRenderDialog() {
        let componentElement = KitRenderer.getComponentElement(this.componentId);
        const kitIfVisibleElement = componentElement.querySelector("#kitIfVisible");
        const componentId = kitIfVisibleElement.getAttribute("data-kit-component-id");
        await KitRenderer.renderComponent(componentId);
    }
}
