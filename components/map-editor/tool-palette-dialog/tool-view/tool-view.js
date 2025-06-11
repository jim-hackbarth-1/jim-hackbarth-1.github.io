
import { KitMessenger, KitRenderer } from "../../../../ui-kit.js";
import {
    ChangeType,
    EntityReference,
    InputUtilities,
    MapWorkerClient,
    MapWorkerInputMessageType,
    Tool,
    ToolPalette,
    ToolType
} from "../../../../domain/references.js";
import { EditorModel } from "../../editor/editor.js";
import { DomHelper } from "../../../shared/dom-helper.js";

export function createModel() {
    return new ToolViewModel();
}

class ToolViewModel {

    // event handlers
    async onRenderStart(componentId, modelInput) {
        this.componentId = componentId;
        this.tool = modelInput.tool;
    }

    async onRenderComplete() {
        KitMessenger.subscribe(EditorModel.MapUpdatedNotificationTopic, this.componentId, this.onMapUpdated.name);
    }

    async onMapUpdated(message) {
        if (this.tool) {
            const map = await MapWorkerClient.getMap();
            this.tool = map.tools.find(t => EntityReference.areEqual(this.tool.ref, t.ref));
            let reRender = false;
            if (message?.data?.changeSet?.changes) {
                const toolChange = message.data.changeSet.changes.some(c => c.changeObjectType == Tool.name && EntityReference.areEqual(this.tool.ref, c.toolRef));
                reRender = toolChange;
            }
            if (reRender) {
                await DomHelper.reRenderElement(this.#componentElement, "if-tool-visible");
            }
        }
    }

    onKeyDown(event) {
        event.stopPropagation();
    }

    // methods
    isDisabled() {
        return (!this.tool || this.tool.ref.isBuiltIn || this.tool.ref.isFromTemplate) ? "disabled" : null;
    }

    isBuiltIn() {
        return this.tool.ref.isBuiltIn;
    }

    isFromTemplate() {
        return this.tool.ref.isFromTemplate;
    }

    getName() {
        return this.tool.ref.name;
    }

    getVersion() {
        return this.tool.ref.versionId;
    }

    isToolTypeChecked(toolType) {
        if (this.tool.toolType == toolType) {
            return "checked";
        }
        return null;
    }

    getThumbnailSource() {
        return this.tool.thumbnailSrc;
    }

    getCursorSrc() {
        return this.tool.cursorSrc;
    }

    getCursorHotspot() {
        return this.tool.cursorHotspot;
    }

    getToolSource() {
        let moduleSrc = this.tool.moduleSrc;
        if (moduleSrc.startsWith("data-")) {
            moduleSrc = atob(moduleSrc.substring(5))
        }
        return InputUtilities.cleanseString(moduleSrc);
    }

    async updateRef() {
        const validationResult = await this.validate();
        if (validationResult.isValid) {
            const oldValue = this.tool.getData();
            const newValue = validationResult.toolData;
            const map = await MapWorkerClient.getMap();
            const toolRefIndex = map.toolRefs.findIndex(tr => EntityReference.areEqual(tr, oldValue.ref));
            const toolIndex = map.tools.findIndex(t => EntityReference.areEqual(t.ref, oldValue.ref));
            const changes = [
                {
                    changeType: ChangeType.Delete,
                    changeObjectType: Map.name,
                    propertyName: "toolRefs",
                    itemIndex: toolRefIndex,
                    itemValue: oldValue.ref
                },
                {
                    changeType: ChangeType.Delete,
                    changeObjectType: Map.name,
                    propertyName: "tools",
                    itemIndex: toolIndex,
                    itemValue: oldValue
                },
                {
                    changeType: ChangeType.Insert,
                    changeObjectType: Map.name,
                    propertyName: "toolRefs",
                    itemIndex: toolRefIndex,
                    itemValue: newValue.ref
                },
                {
                    changeType: ChangeType.Insert,
                    changeObjectType: Map.name,
                    propertyName: "tools",
                    itemIndex: toolIndex,
                    itemValue: newValue
                }
            ];
            const isInEditingToolPalettes = this.#isToolInPalettes(map.toolPalette.editingToolPalettes, oldValue.ref);
            if (isInEditingToolPalettes) {
                const oldEditingToolsData = map.toolPalette.getPalettesData(map.toolPalette.editingToolPalettes);
                let newEditingToolsData = this.#updateToolFromPalettesData(oldEditingToolsData, oldValue.ref, newValue.ref);
                changes.push({
                    changeType: ChangeType.Edit,
                    changeObjectType: ToolPalette.name,
                    propertyName: "editingToolPalettes",
                    oldValue: oldEditingToolsData,
                    newValue: newEditingToolsData
                });
            }
            const isInDrawingToolPalettes = this.#isToolInPalettes(map.toolPalette.drawingToolPalettes, oldValue.ref);
            if (isInDrawingToolPalettes) {
                const oldDrawingToolsData = map.toolPalette.getPalettesData(map.toolPalette.drawingToolPalettes);
                let newDrawingToolsData = this.#updateToolFromPalettesData(oldDrawingToolsData, oldValue.ref, newValue.ref);
                changes.push({
                    changeType: ChangeType.Edit,
                    changeObjectType: ToolPalette.name,
                    propertyName: "drawingToolPalettes",
                    oldValue: oldDrawingToolsData,
                    newValue: newDrawingToolsData
                });
            }
            await this.#updateMap(changes);
        }
    }

    async update(propertyName) {
        const validationResult = await this.validate();
        if (validationResult.isValid) {
            let oldValue = null;
            let newValue = null;
            switch (propertyName) {
                case "moduleSrc":
                    oldValue = this.tool.moduleSrc;
                    newValue = validationResult.toolData.moduleSrc;
                    break;
                case "thumbnailSrc":
                    oldValue = this.tool.thumbnailSrc;
                    newValue = validationResult.toolData.thumbnailSrc;
                    break;
                case "cursorSrc":
                    oldValue = this.tool.cursorSrc;
                    newValue = validationResult.toolData.cursorSrc;
                    break;
                case "cursorHotspot":
                    oldValue = this.tool.cursorHotspot;
                    newValue = validationResult.toolData.cursorHotspot;
                    break;
                case "toolType":
                    oldValue = this.tool.toolType;
                    newValue = validationResult.toolData.toolType;
                    break;
            }
            const changes = [
                {
                    changeType: ChangeType.Edit,
                    changeObjectType: Tool.name,
                    propertyName: propertyName,
                    oldValue: oldValue,
                    newValue: newValue,
                    toolRef: this.tool.ref.getData()
                }
            ];
            const map = await MapWorkerClient.getMap();
            let removeFromDrawingPalette = false;
            if (this.tool.toolType == ToolType.DrawingTool && validationResult.toolData.toolType == ToolType.EditingTool) {
                removeFromDrawingPalette = this.#isToolInPalettes(map.toolPalette.drawingToolPalettes, this.tool.ref);
            }
            if (removeFromDrawingPalette) {
                const oldDrawingToolsData = map.toolPalette.getPalettesData(map.toolPalette.drawingToolPalettes);
                const newDrawingToolsData = this.#removeToolFromPalettesData(oldDrawingToolsData, this.tool.ref);
                changes.push({
                    changeType: ChangeType.Edit,
                    changeObjectType: ToolPalette.name,
                    propertyName: "drawingToolPalettes",
                    oldValue: oldDrawingToolsData,
                    newValue: newDrawingToolsData
                });
            }
            let removeFromEditingPalette = false;
            if (this.tool.toolType == ToolType.EditingTool && validationResult.toolData.toolType == ToolType.DrawingTool) {
                removeFromEditingPalette = this.#isToolInPalettes(map.toolPalette.editingToolPalettes, this.tool.ref);;
            }
            if (removeFromEditingPalette) {
                const oldEditingToolsData = map.toolPalette.getPalettesData(map.toolPalette.editingToolPalettes);
                const newEditingToolsData = this.#removeToolFromPalettesData(oldEditingToolsData, this.tool.ref);
                changes.push({
                    changeType: ChangeType.Edit,
                    changeObjectType: ToolPalette.name,
                    propertyName: "editingToolPalettes",
                    oldValue: oldEditingToolsData,
                    newValue: newEditingToolsData
                });
            }
            await this.#updateMap(changes);
        }
    }

    async validate() {
        let isValid = true;
        const map = await MapWorkerClient.getMap();

        // validate name
        const name = DomHelper.getElement(this.#componentElement, "#name")?.value;
        if (name.length == 0) {
            DomHelper.getElement(this.#componentElement, "#validation-name").innerHTML = "Name is required.";
            isValid = false;
        }
        if (!name.match(/^[a-zA-Z0-9\s()]*$/)) {
            DomHelper.getElement(this.#componentElement, "#validation-name").innerHTML = "Invalid character(s). Alpha-numeric only.";
            isValid = false;
        }

        // validate version
        const versionId = parseInt(DomHelper.getElement(this.#componentElement, "#version")?.value);
        if (isNaN(versionId)) {
            DomHelper.getElement(this.#componentElement, "#validation-version").innerHTML = "Version is required.";
            isValid = false;
        }
        if (versionId < 1 || versionId > 1000) {
            DomHelper.getElement(this.#componentElement, "#validation-version").innerHTML = "Version must be an integer between 1 and 1000.";
            isValid = false;
        }
        const newRef = {
            versionId: versionId,
            isBuiltIn: false,
            isFromTemplate: false,
            name: name
        }
        const isStartingRef = EntityReference.areEqual(this.tool.ref, newRef);
        if (!isStartingRef && map.toolRefs.some(tr => EntityReference.areEqual(tr, newRef))) {
            DomHelper.getElement(this.#componentElement, "#validation-name").innerHTML = "The combination of name and version must be unique.";
            DomHelper.getElement(this.#componentElement, "#validation-version").innerHTML = "The combination of name and version must be unique.";
            isValid = false;
        }

        // validate module source
        let moduleSrc = DomHelper.getElement(this.#componentElement, "#source")?.value;
        if (!moduleSrc || moduleSrc.length == 0) {
            DomHelper.getElement(this.#componentElement, "#validation-source").innerHTML = "Source is required.";
            isValid = false;
        }
        if (moduleSrc && !moduleSrc.includes("export function createToolModel()")) {
            DomHelper.getElement(this.#componentElement, "#validation-source").innerHTML = "Source must export a function named 'createToolModel'";
            isValid = false;
        }
        moduleSrc = `data-${btoa(moduleSrc.trim())}`

        // validate thumbnail
        const thumbnailSrc = DomHelper.getElement(this.#componentElement, "#thumbnail")?.value;
        if (!thumbnailSrc || thumbnailSrc.length == 0) {
            DomHelper.getElement(this.#componentElement, "#validation-thumbnail").innerHTML = "Thumbnail is required.";
            isValid = false;
        }

        // validate cursor
        const cursorSrc = DomHelper.getElement(this.#componentElement, "#cursor")?.value;
        if (!cursorSrc || cursorSrc.length == 0) {
            DomHelper.getElement(this.#componentElement, "#validation-cursor").innerHTML = "Cursor is required.";
            isValid = false;
        }

        // validate cursor hot spot
        const cursorHotspotX = parseInt(DomHelper.getElement(this.#componentElement, "#cursor-hot-spot-x")?.value);
        const cursorHotspotY = parseInt(DomHelper.getElement(this.#componentElement, "#cursor-hot-spot-y")?.value);
        if (isNaN(cursorHotspotX) || isNaN(cursorHotspotY)) {
            DomHelper.getElement(this.#componentElement, "#validation-cursor-hot-spot").innerHTML = "Cursor hotspot x and y coordinates are required.";
            isValid = false;
        }
        if (cursorHotspotX < 0 || cursorHotspotX > 100 || cursorHotspotY < 0 || cursorHotspotY > 100) {
            DomHelper.getElement(this.#componentElement, "#validation-cursor-hot-spot").innerHTML = "Cursor hotspot coordinates must be an integer between 0 and 100.";
            isValid = false;
        }

        // validate tool type
        const isDrawingTool = DomHelper.getElement(this.#componentElement, "#tool-type-drawing")?.checked;
        const isEditingTool = DomHelper.getElement(this.#componentElement, "#tool-type-editing")?.checked;
        if (!isDrawingTool && !isEditingTool) {
            DomHelper.getElement(this.#componentElement, "#validation-tool-type").innerHTML = "Tool type is required.";
            isValid = false;
        }
        const toolType = isDrawingTool ? ToolType.DrawingTool : ToolType.EditingTool;

        return {
            isValid: isValid,
            toolData: {
                ref: newRef,
                moduleSrc: moduleSrc,
                thumbnailSrc: thumbnailSrc,
                cursorSrc: cursorSrc,
                cursorHotspot: {
                    x: cursorHotspotX,
                    y: cursorHotspotY
                },
                toolType: toolType
            }
        };
    }

    // helpers
    #componentElementInternal;
    get #componentElement() {
        if (!this.#componentElementInternal) {
            this.#componentElementInternal = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElementInternal
    }

    #isToolInPalettes(palettes, toolRef) {
        for (const palette of palettes) {
            if (palette.some(x => EntityReference.areEqual(x, toolRef))) {
                return true;
            }
        }
        return false;
    }

    #updateToolFromPalettesData(palettes, oldToolRef, newToolRef) {
        const newPalettesData = [];
        for (const palette of palettes) {
            const newPalette = [];
            for (const item of palette) {
                if (EntityReference.areEqual(item, oldToolRef)) {
                    newPalette.push(newToolRef);
                }
                else {
                    newPalette.push(item);
                }
            }
            newPalettesData.push(newPalette);
        }
        return newPalettesData;
    }

    #removeToolFromPalettesData(palettes, toolRef) {
        const newPalettesData = [];
        for (const palette of palettes) {
            const newPalette = [];
            for (const item of palette) {
                if (!EntityReference.areEqual(item, toolRef)) {
                    newPalette.push(item);
                }
            }
            if (newPalette.length > 0) {
                newPalettesData.push(newPalette);
            }
        }
        return newPalettesData;
    }

    async #updateMap(changes) {
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }
}
