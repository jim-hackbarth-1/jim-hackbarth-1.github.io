
import { KitRenderer } from "../../../../ui-kit.js";
import { ChangeSet, ChangeType, EntityReference, InputUtilities, MapWorkerClient, MapWorkerInputMessageType, ToolType } from "../../../../domain/references.js";

export function createModel() {
    return new ToolViewModel();
}

class ToolViewModel {

    // event handlers
    async onRenderStart(componentId, modelInput) {
        this.componentId = componentId;
        this.startingTool = modelInput.tool;
        this.tool = modelInput.tool;
        this.dialogModel = modelInput.dialogModel;
        this.validationResult = {
            isValid: false
        };
    }

    async onRenderComplete() {
    }

    onKeyDown(event) {
        event.stopPropagation();
    }

    // methods
    isDisabled() {
        return (!this.tool || this.tool.ref.isBuiltIn || this.tool.ref.isFromTemplate) ? "disabled" : null;
    }

    isToolTypeChecked(toolType, matchingToolType) {
        if (toolType == matchingToolType) {
            return "checked";
        }
        return null;
    }

    getToolSource() {
        let moduleSrc = this.tool.moduleSrc;
        if (moduleSrc.startsWith("data-")) {
            moduleSrc = atob(moduleSrc.substring(5))
        }
        return InputUtilities.cleanseString(moduleSrc);
    }

    async update() {
        const tool = {
            ref: {
                isBuiltIn: this.tool?.ref.isBuiltIn,
                isFromTemplate: this.tool?.ref.isFromTemplate
            }
        };
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        tool.ref.name = InputUtilities.cleanseString(componentElement.querySelector("#tool-name").value.trim());
        tool.ref.versionId = parseInt(componentElement.querySelector("#tool-version").value);
        if (componentElement.querySelector("#tool-type-drawing").checked) {
            tool.toolType = ToolType.DrawingTool;
        }
        else {
            tool.toolType = ToolType.EditingTool;
        }
        tool.thumbnailSrc = InputUtilities.cleanseSvg(componentElement.querySelector("#tool-thumbnail").value.trim());
        tool.cursorSrc = InputUtilities.cleanseSvg(componentElement.querySelector("#tool-cursor").value.trim());
        tool.cursorHotspot = InputUtilities.cleansePoint({
            x: parseInt(componentElement.querySelector("#tool-cursor-hot-spot-x").value),
            y: parseInt(componentElement.querySelector("#tool-cursor-hot-spot-y").value)
        });
        tool.moduleSrc = `data-${btoa(componentElement.querySelector("#tool-source").value.trim())}`;
        this.tool = tool;
        this.validationResult = await this.#validate();      
        await this.#reRenderElement("if-visible");
    }

    isSaveDisabled() {
        return this.validationResult.isValid ? null : "disabled";
    }

    async save() {
        const validationResult = await this.#validate();
        if (validationResult.isValid) {
            const map = await MapWorkerClient.getMap();
            const toolRefIndex = map.toolRefs.findIndex(tr => EntityReference.areEqual(tr, this.startingTool.ref));
            const toolIndex = map.tools.findIndex(t => EntityReference.areEqual(t.ref, this.startingTool.ref));
            const changes = [
                {
                    changeType: ChangeType.Delete,
                    changeObjectType: Map.name,
                    propertyName: "toolRefs",
                    itemIndex: toolRefIndex,
                    itemValue: this.startingTool.ref
                },
                {
                    changeType: ChangeType.Delete,
                    changeObjectType: Map.name,
                    propertyName: "tools",
                    itemIndex: toolIndex,
                    itemValue: this.startingTool
                },
                {
                    changeType: ChangeType.Insert,
                    changeObjectType: Map.name,
                    propertyName: "toolRefs",
                    itemIndex: toolRefIndex,
                    itemValue: this.tool.ref
                },
                {
                    changeType: ChangeType.Insert,
                    changeObjectType: Map.name,
                    propertyName: "tools",
                    itemIndex: toolIndex,
                    itemValue: this.tool
                }
            ];
            await this.#updateMap(changes);
        }
    }

    // helpers
    async #validate() {
        const validationResult = {
            isValid: false
        };
        const map = await MapWorkerClient.getMap();
        if (this.tool && !this.tool.ref.isBuiltIn && !this.tool.ref.isFromTemplate) {

            const isStartingRef = EntityReference.areEqual(this.startingTool.ref, this.tool.ref);

            // validate name
            if (this.tool.ref.name.length == 0) {
                validationResult.name = "Name is required.";
            }
            if (!this.tool.ref.name.match(/^[a-zA-Z0-9\s()]*$/)) {
                validationResult.name = "Invalid character(s). Alpha-numeric only.";
            }
            if (!isStartingRef && map.toolRefs.some(tr => EntityReference.areEqual(tr, this.tool.ref))) {
                validationResult.name = "The combination of name and version must be unique.";
            }
            
            // validate version
            if (isNaN(this.tool.ref.versionId)) {
                validationResult.version = "Version is required.";
            }
            if (this.tool.ref.versionId < 1 || this.tool.ref.versionId > 1000) {
                validationResult.version = "Version must be an integer between 1 and 1000.";
            }
            if (!isStartingRef && map.toolRefs.some(tr => EntityReference.areEqual(tr, this.tool.ref))) {
                validationResult.version = "The combination of name and version must be unique.";
            }

            // validate thumbnail
            if (!this.tool.thumbnailSrc || this.tool.thumbnailSrc.length == 0) {
                validationResult.thumbnail = "Thumbnail is required.";
            }

            // validate cursor
            if (!this.tool.cursorSrc || this.tool.cursorSrc.length == 0) {
                validationResult.cursor = "Cursor is required.";
            }

            // validate cursor hotspot
            if (isNaN(this.tool.cursorHotspot.x) || isNaN(this.tool.cursorHotspot.y)) {
                validationResult.cursorHotspot = "Cursor hotspot x and y coordinates are required.";
            }
            if (this.tool.cursorHotspot.x < 0 || this.tool.cursorHotspot.x > 100 || this.tool.cursorHotspot.y < 0 || this.tool.cursorHotspot.y > 100) {
                validationResult.cursorHotspot = "Cursor hotspot coordinates must be an integer between 0 and 100.";
            }

            // validate source
            if (!this.tool.moduleSrc || this.tool.moduleSrc.length == 0) {
                validationResult.source = "Source is required.";
            }
            const componentElement = KitRenderer.getComponentElement(this.componentId);
            const source = componentElement.querySelector("#tool-source").value.trim();
            if (source && !source.includes("export function createToolModel()")) {
                validationResult.source = "Source must export a function named 'createToolModel'";
            }

            if (!validationResult.name
                && !validationResult.version
                && !validationResult.thumbnail
                && !validationResult.cursor
                && !validationResult.cursorHotspot
                && !validationResult.source) {
                validationResult.isValid = true;
            }
        }
        return validationResult;
    }

    async #reRenderElement(elementId) {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const element = componentElement.querySelector(`#${elementId}`);
        const componentId = element.getAttribute("data-kit-component-id");
        await KitRenderer.renderComponent(componentId);
    }

    async #updateMap(changes) {

        // update local copy
        const map = await MapWorkerClient.getMap();
        map.applyChangeSet(new ChangeSet({ changes: changes }));

        // update map worker
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }
}
