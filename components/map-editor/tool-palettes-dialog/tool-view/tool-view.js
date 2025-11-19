
import {
    ChangeType,
    EntityReference,
    InputUtilities,
    Map,
    MapWorkerClient,
    MapWorkerInputMessageType,
    Tool,
    ToolPalette
} from "../../../../domain/references.js";
import { ToolPalettesDialogModel } from "../tool-palettes-dialog.js";

export function createModel() {
    return new ToolViewModel();
}

class ToolViewModel {

    // event handlers
    async init(kitElement, kitObjects) {
        ToolViewModel.#dialogModel = kitObjects.find(o => o.alias == "dialogModel")?.object;
        const componentInfo = ToolViewModel.#dialogModel.getSelectedDetailComponentInfo();
        if (componentInfo.componentName == 'tool') {
            this.#kitElement = kitElement;
            let toolId = componentInfo.id;
            toolId = toolId.replace("tool-", "");
            const ref = ToolPalettesDialogModel.deSerializeRef(toolId);
            ToolViewModel.#map = await MapWorkerClient.getMap();
            ToolViewModel.#tool = ToolViewModel.#map.tools.find(t => EntityReference.areEqual(t.ref, ref));
        }
    }

    // methods
    getDisplayName() {
        const ref = ToolViewModel.#tool.ref;
        return ref.name.length > 25 ? ref.name.slice(0, 25) + "..." : ref.name;
    }

    isBuiltIn() {
        return ToolViewModel.#tool.ref.isBuiltIn;
    }

    isFromTemplate() {
        return ToolViewModel.#tool.ref.isFromTemplate;
    }

    isReadOnly() {
        const ref = ToolViewModel.#tool.ref;
        return ref.isBuiltIn || ref.isFromTemplate;
    }

    async saveTool() {
        const validationResult = this.#validate();
        if (validationResult.isValid) {
            const currentTool = ToolViewModel.#tool;
            const updatedTool = new Tool(validationResult.toolData);
            let changes = [];
            if (EntityReference.areEqual(currentTool.ref, updatedTool.ref)) {
                changes = ToolViewModel.#getUpdateChanges(currentTool, updatedTool);
            }
            else {
                changes = ToolViewModel.#getAddChanges(currentTool, updatedTool);
            }
            if (changes.length > 0) {
                MapWorkerClient.postWorkerMessage({
                    messageType: MapWorkerInputMessageType.UpdateMap,
                    changeSet: { changes: changes }
                });
            }
        }
    }

    async deleteTool() {
        const map = ToolViewModel.#map;
        const currentTool = ToolViewModel.#tool;
        const toolIndex = map.tools.findIndex(t => EntityReference.areEqual(t.ref, currentTool.ref));
        const toolRefIndex = map.toolRefs.findIndex(tr => EntityReference.areEqual(tr, currentTool.ref));
        const changes = [
            {
                changeType: ChangeType.Delete,
                changeObjectType: Map.name,
                propertyName: "tools",
                itemIndex: toolIndex,
                itemValue: currentTool.getData()
            },
            {
                changeType: ChangeType.Delete,
                changeObjectType: Map.name,
                propertyName: "toolRefs",
                itemIndex: toolRefIndex,
                itemValue: currentTool.ref.getData()
            }
        ];
        const inEditTools = ToolViewModel.#isPaletteItemInPalettes(
            ToolViewModel.#map.toolPalette.editingToolPalettes, currentTool.ref);
        if (inEditTools) {
            const currentPalettes = ToolViewModel.#getPalettesData(
                ToolViewModel.#map.toolPalette.editingToolPalettes);
            const updatedPalettes = ToolViewModel.#removePaletteItem(
                ToolViewModel.#map.toolPalette.editingToolPalettes, currentTool.ref);
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: ToolPalette.name,
                propertyName: "editingToolPalettes",
                oldValue: currentPalettes,
                newValue: updatedPalettes
            });
        }
        const inDrawingTools = ToolViewModel.#isPaletteItemInPalettes(
            ToolViewModel.#map.toolPalette.drawingToolPalettes, currentTool.ref);
        if (inDrawingTools) {
            const currentPalettes = ToolViewModel.#getPalettesData(
                ToolViewModel.#map.toolPalette.drawingToolPalettes);
            const updatedPalettes = ToolViewModel.#removePaletteItem(
                ToolViewModel.#map.toolPalette.drawingToolPalettes, currentTool.ref);
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: ToolPalette.name,
                propertyName: "drawingToolPalettes",
                oldValue: currentPalettes,
                newValue: updatedPalettes
            });
        }
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    getName() {
        return ToolViewModel.#tool.ref.name;
    }

    getVersion() {
        return ToolViewModel.#tool.ref.versionId;
    }

    getToolTypes() {
        const items = [
            { id: "EditingTool", name: "Editing tool", isSelectedAttr: null },
            { id: "DrawingTool", name: "Drawing tool", isSelectedAttr: null }
        ];
        const toolType = ToolViewModel.#tool.toolType;
        const selectedItem = items.find(i => i.id == toolType);
        if (selectedItem) {
            selectedItem.isSelectedAttr = "";
        }
        return items;
    }

    getModuleSource() {
        let moduleSrc = ToolViewModel.#tool.moduleSrc;
        if (moduleSrc.startsWith("data-")) {
            moduleSrc = atob(moduleSrc.substring(5)).trimStart();
        }
        return InputUtilities.cleanseString(moduleSrc);
    }

    getThumbnailSource() {
        return ToolViewModel.#tool.thumbnailSrc;
    }

    getCursorSource() {
        return ToolViewModel.#tool.cursorSrc;
    }

    getCursorHotspotX() {
        return ToolViewModel.#tool.cursorHotspot.x;
    }

    getCursorHotspotY() {
        return ToolViewModel.#tool.cursorHotspot.y;
    }

    validate() {
        this.#validate();
    }

    // helpers
    static #dialogModel = null;
    #kitElement = null;
    static #map = null;
    static #tool = null;

    #validate() {
        let isValid = true;
        const validationLabels = this.#kitElement.querySelectorAll(".validation-message");
        for (const label of validationLabels) {
            label.classList.remove("active");
            label.innerHTML = "";
        }
        
        // validate name
        const name = this.#kitElement.querySelector("#tool-name").value;
        if (name.length == 0) {
            this.#showValidationMessage("#tool-name-validation", "Name is required.");
            isValid = false;
        }
        if (!name.match(/^[a-zA-Z0-9\s()]*$/)) {
            this.#showValidationMessage("#tool-name-validation", "Invalid character(s). Alpha-numeric only.");
            isValid = false;
        }

        // validate version
        const versionId = parseInt(this.#kitElement.querySelector("#tool-version").value);
        if (isNaN(versionId)) {
            this.#showValidationMessage("#tool-version-validation", "Version is required.");
            isValid = false;
        }
        if (versionId < 1 || versionId > 1000) {
            this.#showValidationMessage("#tool-version-validation", "Version must be an integer between 1 and 1000.");
            isValid = false;
        }
        const newRef = {
            name: name,
            versionId: versionId,
            isBuiltIn: false,
            isFromTemplate: false
        };
        const isStartingRef = EntityReference.areEqual(ToolViewModel.#tool.ref, newRef);
        if (!isStartingRef && ToolViewModel.#map.toolRefs.some(tr => EntityReference.areEqual(tr, newRef))) {
            this.#showValidationMessage("#tool-name-validation", "The combination of name and version must be unique.");
            isValid = false;
        }

        // validate module source
        let moduleSrc = this.#kitElement.querySelector("#tool-module-source").value;
        if (!moduleSrc || moduleSrc.length == 0) {
            this.#showValidationMessage("#tool-module-source-validation", "Source is required.");
            isValid = false;
        }
        if (moduleSrc && !moduleSrc.includes("export function createToolModel()")) {
            this.#showValidationMessage("#tool-module-source-validation", "Source must export a function named 'createToolModel'");
            isValid = false;
        }
        moduleSrc = `data-${btoa(moduleSrc.trim())}`

        // validate thumbnail
        const thumbnailSrc = this.#kitElement.querySelector("#tool-thumbnail-source").value;
        if (!thumbnailSrc || thumbnailSrc.length == 0) {
            this.#showValidationMessage("#tool-thumbnail-source-validation", "Thumbnail is required.");
            isValid = false;
        }

        // validate cursor
        const cursorSrc = this.#kitElement.querySelector("#tool-cursor-source").value;
        if (!cursorSrc || cursorSrc.length == 0) {
            this.#showValidationMessage("#tool-cursor-source-validation", "Cursor source is required.");
            isValid = false;
        }

        // validate cursor hot spot
        const cursorHotspotX = parseInt(this.#kitElement.querySelector("#tool-cursor-hotspot-x").value);
        const cursorHotspotY = parseInt(this.#kitElement.querySelector("#tool-cursor-hotspot-y").value);
        if (isNaN(cursorHotspotX) || isNaN(cursorHotspotY)) {
            this.#showValidationMessage("#tool-cursor-hotspot-validation", "Cursor hotspot x and y coordinates are required.");
            isValid = false;
        }
        if (cursorHotspotX < 0 || cursorHotspotX > 100 || cursorHotspotY < 0 || cursorHotspotY > 100) {
            this.#showValidationMessage(
                "#tool-cursor-hotspot-validation", "Cursor hotspot coordinates must be an integer between 0 and 100.");
            isValid = false;
        }

        // get tool type
        const toolType = this.#kitElement.querySelector("#tool-type").value;

        // enable/disable save button
        const enabled = (isValid && !this.isReadOnly());
        this.#kitElement.querySelector("#save-button").disabled = !enabled;

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

    #showValidationMessage(selector, message) {
        const element = this.#kitElement.querySelector(selector);
        element.innerHTML = message;
        element.classList.add("active");
        element.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    static #getUpdateChanges(currentTool, updatedTool) {
        const changes = [];
        if (currentTool.toolType != updatedTool.toolType) {
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: Tool.name,
                propertyName: "toolType",
                oldValue: currentTool.toolType,
                newValue: updatedTool.toolType,
                toolRef: currentTool.ref.getData()
            });
        }
        if (currentTool.moduleSrc != updatedTool.moduleSrc) {
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: Tool.name,
                propertyName: "moduleSrc",
                oldValue: currentTool.moduleSrc,
                newValue: updatedTool.moduleSrc,
                toolRef: currentTool.ref.getData()
            });
        }
        if (currentTool.thumbnailSrc != updatedTool.thumbnailSrc) {
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: Tool.name,
                propertyName: "thumbnailSrc",
                oldValue: currentTool.thumbnailSrc,
                newValue: updatedTool.thumbnailSrc,
                toolRef: currentTool.ref.getData()
            });
        }
        if (currentTool.cursorSrc != updatedTool.cursorSrc) {
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: Tool.name,
                propertyName: "cursorSrc",
                oldValue: currentTool.cursorSrc,
                newValue: updatedTool.cursorSrc,
                toolRef: currentTool.ref.getData()
            });
        }
        if (currentTool.cursorHotspot.x != updatedTool.cursorHotspot.x
            || currentTool.cursorHotspot.y != updatedTool.cursorHotspot.y) {
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: Tool.name,
                propertyName: "cursorHotspot",
                oldValue: currentTool.cursorHotspot,
                newValue: updatedTool.cursorHotspot,
                toolRef: currentTool.ref.getData()
            });
        }
        if (currentTool.toolType != updatedTool.toolType) {
            const inEditTools = ToolViewModel.#isPaletteItemInPalettes(
                ToolViewModel.#map.toolPalette.editingToolPalettes, currentTool.ref);
            if (inEditTools) {
                const currentPalettes = ToolViewModel.#getPalettesData(
                    ToolViewModel.#map.toolPalette.editingToolPalettes);
                const updatedPalettes = ToolViewModel.#removePaletteItem(
                    ToolViewModel.#map.toolPalette.editingToolPalettes, currentTool.ref);
                changes.push({
                    changeType: ChangeType.Edit,
                    changeObjectType: ToolPalette.name,
                    propertyName: "editingToolPalettes",
                    oldValue: currentPalettes,
                    newValue: updatedPalettes
                });
            }
            const inDrawingTools = ToolViewModel.#isPaletteItemInPalettes(
                ToolViewModel.#map.toolPalette.drawingToolPalettes, currentTool.ref);
            if (inDrawingTools) {
                const currentPalettes = ToolViewModel.#getPalettesData(
                    ToolViewModel.#map.toolPalette.drawingToolPalettes);
                const updatedPalettes = ToolViewModel.#removePaletteItem(
                    ToolViewModel.#map.toolPalette.drawingToolPalettes, currentTool.ref);
                changes.push({
                    changeType: ChangeType.Edit,
                    changeObjectType: ToolPalette.name,
                    propertyName: "drawingToolPalettes",
                    oldValue: currentPalettes,
                    newValue: updatedPalettes
                });
            }
        }
        return changes;
    }

    static #getAddChanges(currentTool, updatedTool) {
        const map = ToolViewModel.#map;
        const toolRefIndex = map.toolRefs.findIndex(tr => EntityReference.areEqual(tr, currentTool.ref));
        const toolIndex = map.tools.findIndex(t => EntityReference.areEqual(t.ref, currentTool.ref));
        const changes = [];
        changes.push({
            changeType: ChangeType.Delete,
            changeObjectType: Map.name,
            propertyName: "toolRefs",
            itemIndex: toolRefIndex,
            itemValue: currentTool.ref.getData()
        });
        changes.push({
            changeType: ChangeType.Delete,
            changeObjectType: Map.name,
            propertyName: "tools",
            itemIndex: toolIndex,
            itemValue: currentTool.getData()
        });
        changes.push({
            changeType: ChangeType.Insert,
            changeObjectType: Map.name,
            propertyName: "toolRefs",
            itemIndex: toolRefIndex,
            itemValue: updatedTool.ref.getData()
        });
        changes.push({
            changeType: ChangeType.Insert,
            changeObjectType: Map.name,
            propertyName: "tools",
            itemIndex: toolIndex,
            itemValue: updatedTool.getData()
        });
        const inEditTools = ToolViewModel.#isPaletteItemInPalettes(
            ToolViewModel.#map.toolPalette.editingToolPalettes, currentTool.ref);
        if (inEditTools) {
            const currentPalettes = ToolViewModel.#getPalettesData(
                ToolViewModel.#map.toolPalette.editingToolPalettes);
            let updatedPalettes = [];
            if (currentTool.toolType != updatedTool.toolType) {
                updatedPalettes = ToolViewModel.#removePaletteItem(
                    ToolViewModel.#map.toolPalette.editingToolPalettes, currentTool.ref);
            }
            else {
                updatedPalettes = ToolViewModel.#replacePaletteItem(
                    ToolViewModel.#map.toolPalette.editingToolPalettes, currentTool.ref, updatedTool.ref);
            }
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: ToolPalette.name,
                propertyName: "editingToolPalettes",
                oldValue: currentPalettes,
                newValue: updatedPalettes
            });
        }
        const inDrawingTools = ToolViewModel.#isPaletteItemInPalettes(
            ToolViewModel.#map.toolPalette.drawingToolPalettes, currentTool.ref);
        if (inDrawingTools) {
            const currentPalettes = ToolViewModel.#getPalettesData(
                ToolViewModel.#map.toolPalette.drawingToolPalettes);
            let updatedPalettes = [];
            if (currentTool.toolType != updatedTool.toolType) {
                updatedPalettes = ToolViewModel.#removePaletteItem(
                    ToolViewModel.#map.toolPalette.drawingToolPalettes, currentTool.ref);
            }
            else {
                updatedPalettes = ToolViewModel.#replacePaletteItem(
                    ToolViewModel.#map.toolPalette.drawingToolPalettes, currentTool.ref, updatedTool.ref);
            }
            changes.push({
                changeType: ChangeType.Edit,
                changeObjectType: ToolPalette.name,
                propertyName: "drawingToolPalettes",
                oldValue: currentPalettes,
                newValue: updatedPalettes
            });
        }
        return changes;
    }

    static #isPaletteItemInPalettes(palettes, paletteItem) {
        for (const palette of palettes) {
            for (const item of palette) {
                if (EntityReference.areEqual(item, paletteItem)) {
                    return true;
                }
            }
        }
        return false
    }

    static #removePaletteItem(palettes, paletteItem) {
        const newPalettesData = [];
        for (const palette of palettes) {
            const newPaletteData = [];
            for (const item of palette) {
                if (!EntityReference.areEqual(item, paletteItem)) {
                    newPaletteData.push(item.getData());
                }
            }
            if (newPaletteData.length > 0) {
                newPalettesData.push(newPaletteData);
            }
        }
        return newPalettesData;
    }

    static #replacePaletteItem(palettes, oldPaletteItem, newPaletteItem) {
        const newPalettesData = [];
        for (const palette of palettes) {
            const newPaletteData = [];
            for (const item of palette) {
                if (EntityReference.areEqual(item, oldPaletteItem)) {
                    newPaletteData.push(newPaletteItem.getData());
                }
                else {
                    newPaletteData.push(item.getData());
                }
            }
            newPalettesData.push(newPaletteData);
        }
        return newPalettesData;
    }

    static #getPalettesData(palettes) {
        const palettesData = [];
        for (const palette of palettes) {
            const paletteData = [];
            for (const item of palette) {
                paletteData.push(item.getData());
            }
            palettesData.push(paletteData);
        }
        return palettesData;
    }

}
