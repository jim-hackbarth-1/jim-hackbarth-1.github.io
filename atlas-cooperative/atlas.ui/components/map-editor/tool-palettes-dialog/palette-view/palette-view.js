
import {
    ChangeType,
    EntityReference,
    MapWorkerClient,
    MapWorkerInputMessageType,
    ToolPalette,
    ToolType
} from "../../../../domain/references.js";
import { ToolPalettesDialogModel } from "../tool-palettes-dialog.js";

export function createModel() {
    return new PaletteViewModel();
}

class PaletteViewModel {

    // event handlers
    async init(kitElement, kitObjects) {
        this.#kitElement = kitElement;
        PaletteViewModel.#dialogModel = kitObjects.find(o => o.alias == "dialogModel")?.object;
    }

    // methods
    getTitle() {
        const id = PaletteViewModel.#dialogModel.getSelectedDetailComponentInfo()?.id;
        if (id == "palette.editing.tools") {
            return "Editing tools palette";
        }
        if (id == "palette.drawing.tools") {
            return "Drawing tools palette";
        }
        if (id == "palette.map.item.templates") {
            return "Map item templates palette";
        }
        return "";
    }

    async getSubPalettes() {
        let palettes = [];
        const map = await MapWorkerClient.getMap();
        const id = PaletteViewModel.#dialogModel.getSelectedDetailComponentInfo()?.id;
        if (id === "palette.editing.tools" && map?.toolPalette?.editingToolPalettes) {
            palettes = map.toolPalette.editingToolPalettes;
        }
        if (id === "palette.drawing.tools" && map?.toolPalette?.drawingToolPalettes) {
            palettes = map.toolPalette.drawingToolPalettes;
        }
        if (id === "palette.map.item.templates" && map?.toolPalette?.mapItemTemplatePalettes) {
            palettes = map.toolPalette.mapItemTemplatePalettes;
        }
        return palettes;
    }

    async getPaletteItems(subPaletteIndex) {
        const items = [];
        const map = await MapWorkerClient.getMap();
        const palettes = await this.getSubPalettes();
        const subPalette = palettes[subPaletteIndex];
        const id = PaletteViewModel.#dialogModel.getSelectedDetailComponentInfo()?.id;
        if (id === "palette.map.item.templates") {
            let itemIndex = 0;
            for (const mapItemTemplateRef of subPalette) {
                const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, mapItemTemplateRef));
                if (mapItemTemplate) {
                    items.push({
                        ref: mapItemTemplate.ref,
                        refId: ToolPalettesDialogModel.serializeRef(mapItemTemplate.ref),
                        location: `${subPaletteIndex},${itemIndex}`,
                        thumbnailSrc: mapItemTemplate.thumbnailSrc
                    });
                }
                itemIndex++;
            }
        }
        else {
            let itemIndex = 0;
            for (const toolRef of subPalette) {
                const tool = map.tools.find(t => EntityReference.areEqual(t.ref, toolRef));
                if (tool) {
                    items.push({
                        ref: tool.ref,
                        refId: ToolPalettesDialogModel.serializeRef(tool.ref),
                        location: `${subPaletteIndex},${itemIndex}`,
                        thumbnailSvgSrc: tool.thumbnailSrc
                    });
                }
                itemIndex++;
            }
        }
        return items;
    }

    async getAvailableItems() {
        const map = await MapWorkerClient.getMap();
        let allItems = map.mapItemTemplates;
        const id = PaletteViewModel.#dialogModel.getSelectedDetailComponentInfo()?.id;
        if (id == "palette.editing.tools") {
            allItems = map.tools.filter(t => t.toolType == ToolType.EditingTool)
        }
        if (id == "palette.drawing.tools") {
            allItems = map.tools.filter(t => t.toolType == ToolType.DrawingTool)
        }

        const currentPaletteItems = [];
        const subPalettes = await this.getSubPalettes();
        for (const subPalette of subPalettes) {
            for (const item of subPalette) {
                currentPaletteItems.push(item);
            }
        }
        
        const availableItems = [];
        for (const item of allItems) {
            if (!currentPaletteItems.some(i => EntityReference.areEqual(i, item.ref))) {
                availableItems.push(item);
            }
        }
        function sortAvailableItems(item1, item2) {
            if (item1.ref.name.toLowerCase() < item2.ref.name.toLowerCase()) {
                return -1;
            }
            if (item1.ref.name.toLowerCase() > item2.ref.name.toLowerCase()) {
                return 1;
            }
            return 0;
        }
        availableItems.sort(sortAvailableItems);

        return availableItems.map(i => ({
            ref: i.ref,
            refId: ToolPalettesDialogModel.serializeRef(i.ref),
            thumbnailSrc: (id == "palette.map.item.templates") ? i.thumbnailSrc : null,
            thumbnailSvgSrc: (id != "palette.map.item.templates") ? i.thumbnailSrc : null,
            refTypeLabel: i.ref.isBuiltIn ? "built-in" : i.ref.isFromTemplate ? "from template" : "custom",
            refVersionLabel: `version ${i.ref.versionId}`
        }));
    }

    allowDrop(event) {
        event.preventDefault();
    }

    async dropAvailableItem(event) {

        // get ref
        event.preventDefault();
        const refId = event.dataTransfer.getData("text");
        const ref = new EntityReference(ToolPalettesDialogModel.deSerializeRef(refId));

        // get drag from location
        let fromLocation = [-1, -1];
        const button = this.#kitElement.querySelector(`[id="${refId}"`);
        if (button && button.hasAttribute("data-location")) {
            const parts = button.getAttribute("data-location").split(",");
            fromLocation = [Number(parts[0]), Number(parts[1])];
        }

        // get drag to location
        const currentIitemsContainer = this.#kitElement.querySelector("#current-items-container");
        const buttons = currentIitemsContainer.querySelectorAll(".tool-button");
        const mouseY = event.clientY;
        const mouseX = event.clientX;
        let newRow = -1;
        let newColumn = 0;
        const length = buttons.length;
        for (let i = 0; i < length; i++) {
            const rect = buttons[i].getBoundingClientRect();
            const locationInfo = buttons[i].getAttribute("data-location").split(",");
            const buttonRow = parseInt(locationInfo[0]);
            const buttonColumn = parseInt(locationInfo[1]);
            if (mouseY > rect.top) {
                newRow = buttonRow;
            }
            if (mouseY > rect.bottom) {
                newRow++;
            }
            if (newRow == buttonRow) {
                if (mouseX > rect.left) {
                    newColumn = buttonColumn;
                }
                if (mouseX > rect.right) {
                    newColumn++;
                }
            }
        }
        const toLocation = [newRow, newColumn];
        if (fromLocation[0] == toLocation[0]) {
            if (fromLocation[1] < toLocation[1]) {
                toLocation[1] = toLocation[1] - 1;
            }
            if (fromLocation[1] > -1 && fromLocation[1] == toLocation[1]) {
                return;
            }
        }

        // update palettes
        const subPalettes = await this.getSubPalettes();
        const map = await MapWorkerClient.getMap();
        const oldValue = map.toolPalette.getPalettesData(subPalettes);
        if (fromLocation[0] > -1) {
            subPalettes[fromLocation[0]].splice(fromLocation[1], 1);
        }

        if (toLocation[0] < 0) {
            subPalettes.unshift([ref]);
        }
        else {
            if (toLocation[0] >= subPalettes.length) {
                subPalettes.push([ref]);
            }
            else {
                const subPalette = subPalettes[toLocation[0]];
                if (toLocation[1] < 0) {
                    subPalette.unshift(ref);
                }
                else {
                    if (toLocation[1] >= subPalette.length) {
                        subPalette.push(ref);
                    }
                    else {
                        subPalette.splice(toLocation[1], 0, ref);
                    }
                }
            }
        }

        const newValue = map.toolPalette.getPalettesData(subPalettes);

        // update map
        const id = PaletteViewModel.#dialogModel.getSelectedDetailComponentInfo()?.id;
        let propertyName = "mapItemTemplatePalettes";
        if (id == "palette.editing.tools") {
            propertyName = "editingToolPalettes";
        }
        if (id == "palette.drawing.tools") {
            propertyName = "drawingToolPalettes";
        }
        const changes = [
            {
                changeType: ChangeType.Edit,
                changeObjectType: ToolPalette.name,
                propertyName: propertyName,
                oldValue: oldValue,
                newValue: newValue
            }
        ];
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    dragItem(event) {
        event.dataTransfer.setData("text", event.srcElement.id);
    }

    async dropPaletteItem(event) {

        // get palette item indices
        event.preventDefault();
        const refId = event.dataTransfer.getData("text");
        const button = this.#kitElement.querySelector(`[id="${refId}"`);
        if (!button) {
            return;
        }
        const locationAttr = button.getAttribute("data-location");
        if (!locationAttr) {
            return;
        }
        const parts = locationAttr.split(",");
        const subPaletteIndex = Number(parts[0]);
        const itemIndex = Number(parts[1]);

        // update map
        const map = await MapWorkerClient.getMap();
        let subPalettes = map.toolPalette.mapItemTemplatePalettes;
        let propertyName = "mapItemTemplatePalettes";
        const id = PaletteViewModel.#dialogModel.getSelectedDetailComponentInfo()?.id;
        if (id == "palette.editing.tools") {
            subPalettes = map.toolPalette.editingToolPalettes;
            propertyName = "editingToolPalettes";
        }
        if (id == "palette.drawing.tools") {
            subPalettes = map.toolPalette.drawingToolPalettes;
            propertyName = "drawingToolPalettes";
        }
        const oldValue = map.toolPalette.getPalettesData(subPalettes);
        let newValue = map.toolPalette.getPalettes(oldValue);
        newValue[subPaletteIndex].splice(itemIndex, 1);
        newValue = map.toolPalette.getPalettesData(newValue);
        const changes = [
            {
                changeType: ChangeType.Edit,
                changeObjectType: ToolPalette.name,
                propertyName: propertyName,
                oldValue: oldValue,
                newValue: newValue
            }
        ];
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    getManageButtonLabel() {
        const id = PaletteViewModel.#dialogModel.getSelectedDetailComponentInfo()?.id;
        if (id == "palette.map.item.templates") {
            return "Manage map item templates";
        }
        return "Manage tools";
    }

    async manageItems() {
        const id = PaletteViewModel.#dialogModel.getSelectedDetailComponentInfo()?.id;
        if (id == "palette.map.item.templates") {
            await PaletteViewModel.#dialogModel.selectNavItemByRefId("map.item.templates");
        }
        else {
            await PaletteViewModel.#dialogModel.selectNavItemByRefId("tools");
        }
    }

    // helpers
    static #dialogModel = null;
    #kitElement = null;

}
