
import { KitComponent, KitDependencyManager, KitMessenger, KitRenderer } from "../../../ui-kit.js";
import {
    ChangeType,
    EntityReference,
    Map,
    MapItemTemplate,
    MapWorkerClient,
    MapWorkerInputMessageType,
    PathStyle,
    PathStyleType,
    Tool,
    ToolPalette,
    ToolSource,
    ToolType
} from "../../../domain/references.js";
import { EditorModel } from "../editor/editor.js";
import { DomHelper } from "../../shared/dom-helper.js";

export function createModel() {
    return new ToolPaletteDialogModel();
}

export class ToolPaletteDialogModel {

    // event handlers
    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {
        KitMessenger.subscribe(EditorModel.MapUpdatedNotificationTopic, this.componentId, this.onMapUpdated.name);
        const kitIfVisibleComponent = DomHelper.findComponentByElementId(this.#componentElement, "kitIfVisible");
        kitIfVisibleComponent.addEventListener(KitComponent.OnRenderCompleteEvent, this.onKitIfVisibleRenderComplete);
    }

    onKitIfVisibleRenderComplete = async () => {
        const map = await MapWorkerClient.getMap();
        this.#applyDetailsState();
        this.#updateMapItemTemplateListItemLabels(map);
    }

    async onMapUpdated(message) {
        if (this.#isVisible) { 
            const map = await MapWorkerClient.getMap();
            let reRender = false;
            if (message?.data?.changeSet?.changes) {
                const toolPaletteChange = message.data.changeSet.changes.some(c => c.changeObjectType == ToolPalette.name);
                const toolChangeType = message.data.changeSet.changes.some(c =>
                    c.changeObjectType == Tool.name && c.propertyName == "toolType" && c.changeType == ChangeType.Edit);
                const toolInsert = message.data.changeSet.changes.some(c =>
                    c.changeObjectType == Map.name && c.propertyName == "tools" && c.changeType == ChangeType.Insert);
                if (toolInsert || toolChangeType) {
                    let newToolRef = null;
                    if (toolInsert) {
                        newToolRef = message.data.changeSet.changes.find(c =>
                            c.changeObjectType == Map.name && c.propertyName == "tools" && c.changeType == ChangeType.Insert).itemValue.ref;
                    }
                    else {
                        newToolRef = message.data.changeSet.changes.find(c =>
                            c.changeObjectType == Tool.name && c.propertyName == "toolType" && c.changeType == ChangeType.Edit).toolRef;
                    }
                    this.#currentTool = map.tools.find(t => EntityReference.areEqual(t.ref, newToolRef));
                }
                const toolDelete = message.data.changeSet.changes.some(c =>
                    c.changeObjectType == Map.name && c.propertyName == "tools" && c.changeType == ChangeType.Delete);
                const mapItemTemplateInsert = message.data.changeSet.changes.some(c =>
                    c.changeObjectType == Map.name && c.propertyName == "mapItemTemplates" && c.changeType == ChangeType.Insert);
                if (mapItemTemplateInsert) {
                    const newMapItemTemplateRef = message.data.changeSet.changes.find(c =>
                        c.changeObjectType == Map.name && c.propertyName == "mapItemTemplates" && c.changeType == ChangeType.Insert).itemValue.ref;
                    this.#currentMapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, newMapItemTemplateRef));
                }
                const mapItemTemplateDelete = message.data.changeSet.changes.some(c =>
                    c.changeObjectType == Map.name && c.propertyName == "mapItemTemplates" && c.changeType == ChangeType.Delete);
                const propertiesAffectingListItems = ["thumbnailSrc", "name", "version", "toolType"];
                const hasToolListItemChange = message.data.changeSet.changes.some(c =>
                    c.changeObjectType == Tool.name && propertiesAffectingListItems.includes(c.propertyName));
                const hasMapItemTemplateListItemChange = message.data.changeSet.changes.some(c =>
                    c.changeObjectType == MapItemTemplate.name && propertiesAffectingListItems.includes(c.propertyName));
                if (hasToolListItemChange) {
                    this.#updateToolListItemLabels(map);
                }
                if (hasMapItemTemplateListItemChange) {
                    this.#updateMapItemTemplateListItemLabels(map);
                }
                reRender = toolPaletteChange || toolInsert || toolDelete || mapItemTemplateInsert || mapItemTemplateDelete || toolChangeType;
            }
            if (reRender) {
                await DomHelper.reRenderElement(this.#componentElement, "kitIfVisible");
            } 
            ToolPaletteDialogModel.restoreScrollPosition();
        }      
    }

    onDetailsToggleEvent(event) {
        const detailsState = this.#getDetailsState();
        let stateItem = detailsState.find(x => x.id == event.target.id);
        if (stateItem) {
            stateItem.isOpen = event.target.open;
        }
        else {
            stateItem = { id: event.target.id, isOpen: event.target.open };
            detailsState.push(stateItem);
        }
        this.#detailsState = detailsState;
    }

    // methods
    static #scrollPosition = 0;
    static saveScrollPosition() {
        const appDocument = KitDependencyManager.getDocument();
        let container = appDocument.querySelector("#top-details-list");
        ToolPaletteDialogModel.#scrollPosition = container.scrollTop;
    }

    static restoreScrollPosition() {
        const appDocument = KitDependencyManager.getDocument();
        const container = appDocument.querySelector("#top-details-list");
        container.scrollTo({
            top: ToolPaletteDialogModel.#scrollPosition,
            left: 0,
            behavior: "smooth",
        });
    }

    #isVisible;
    isVisible() {
        return this.#isVisible;
    }

    async showDialog() {
        this.#isVisible = true;
        await DomHelper.reRenderElement(this.#componentElement, "kitIfVisible");
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
                    me.closeDialog();
                }
            });
            this.#clickHandlerRegistered = true;
        }
    }

    closeDialog() {
        this.#currentTool = null;
        this.#currentMapItemTemplate = null;
        this.#isVisible = false;
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        componentElement.querySelector("dialog").close();
    }

    openToolsSection() {
        this.#openSection("details-tools", true);
    }

    openMapItemTemplatesSection() {
        this.#openSection("details-map-item-templates", true);
    }

    async getToolPalettes(paletteType) {
        let palettes = [];
        const map = await MapWorkerClient.getMap();
        if (paletteType === "EditingTools" && map?.toolPalette?.editingToolPalettes) {
            palettes = map.toolPalette.editingToolPalettes;
        }
        if (paletteType === "DrawingTools" && map?.toolPalette?.drawingToolPalettes) {
            palettes = map.toolPalette.drawingToolPalettes;
        }
        if (paletteType === "MapItemTemplates" && map?.toolPalette?.mapItemTemplatePalettes) {
            palettes = map.toolPalette.mapItemTemplatePalettes;
        }
        return palettes;
    }

    async getToolPaletteItems(paletteType, paletteIndex) {
        const items = [];
        const map = await MapWorkerClient.getMap();
        const palettes = await this.getToolPalettes(paletteType);
        let palette = null;
        if (palettes && palettes.length > paletteIndex) {
            palette = palettes[paletteIndex];
        }
        if (palette && map) {
            if (paletteType === "MapItemTemplates") {
                let itemIndex = 0;
                for (const mapItemTemplateRef of palette) {
                    const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, mapItemTemplateRef));
                    if (mapItemTemplate) {
                        const elementId = `${mapItemTemplate.ref.name}-${mapItemTemplate.ref.versionId}${mapItemTemplate.ref.isBuiltIn ? "-builtin" : ""}${mapItemTemplate.ref.isFromTemplate ? "-fromtemplate" : ""}`;
                        items.push({
                            id: `${paletteType}-${paletteIndex}-${itemIndex}`,
                            elementId: elementId,
                            data: mapItemTemplate,
                            thumbnail: `<image height="100%" width="100%" href="${mapItemTemplate.thumbnailSrc}" />`
                        });
                    }
                    itemIndex++;
                }
            }
            else {
                let itemIndex = 0;
                for (const toolRef of palette) {
                    const tool = map.tools.find(t => EntityReference.areEqual(t.ref, toolRef));
                    if (tool) {
                        const elementId = `${tool.ref.name}-${tool.ref.versionId}${tool.ref.isBuiltIn ? "-builtin" : ""}${tool.ref.isFromTemplate ? "-fromtemplate" : ""}`;
                        items.push({ id: `${paletteType}-${paletteIndex}-${itemIndex}`, elementId: elementId, data: tool });
                    }
                    itemIndex++;
                }
            }
        }
        return items;
    }

    async getAvailableItems(paletteType) {

        const map = await MapWorkerClient.getMap();
        let allItems = map.mapItemTemplates;
        if (paletteType == "EditingTools") {
            allItems = map.tools.filter(t => t.toolType == ToolType.EditingTool)
        }
        if (paletteType == "DrawingTools") {
            allItems = map.tools.filter(t => t.toolType == ToolType.DrawingTool)
        }

        const currentPaletteItems = [];
        const palettes = await this.getToolPalettes(paletteType);
        for (let i = 0; i < palettes.length; i++) {
            const paletteItems = await this.getToolPaletteItems(paletteType, i);
            for (const paletteItem of paletteItems) {
                currentPaletteItems.push(paletteItem);
            }
        }

        const availableItems = [];
        for (const item of allItems) {
            if (!currentPaletteItems.some(i => EntityReference.areEqual(i.data.ref, item.ref))) {
                availableItems.push(item);
            }
        }
        function sortAvailableItems(item1, item2) {
            if (item1.ref.name < item2.ref.name) {
                return -1;
            }
            if (item1.ref.name > item2.ref.name) {
                return 1;
            }
            return 0;
        }
        availableItems.sort(sortAvailableItems);

        return availableItems.map(i => ({
            elementId: `${i.ref.name}-${i.ref.versionId}${i.ref.isBuiltIn ? "-builtin" : ""}${i.ref.isFromTemplate ? "-fromtemplate" : ""}`,
            thumbnailSrc: i.thumbnailSrc,
            thumbnail: `<image height="100%" width="100%" href="${i.thumbnailSrc}" />`,
            name: i.ref.name,
            referenceTypeLabel: i.ref.isBuiltIn ? "built-in" : i.ref.isFromTemplate ? "from template" : "custom",
            versionLabel: `version ${i.ref.versionId}`
        }));
    }

    async dragStartItem(evt, elementId) {
        DomHelper.dragStartItem(this.#componentElement, evt, elementId);
    }

    dragItem(evt) {
        DomHelper.dragItem(evt);
    }

    allowDrop(evt) {
        DomHelper.allowDrop(evt);
    }

    async dropAvailableItem(evt, paletteType) {

        // get ref item
        const elementId = evt.dataTransfer.getData("text");
        const operationInfo = elementId.split("-");
        const isCurrentItem = !isNaN(operationInfo[2]);
        const map = await MapWorkerClient.getMap();
        let palettes = map.toolPalette.mapItemTemplatePalettes;
        let propertyName = "mapItemTemplatePalettes";
        let paletteElementsId = "current-map-item-templates"
        if (paletteType == "EditingTools") {
            palettes = map.toolPalette.editingToolPalettes;
            propertyName = "editingToolPalettes";
            paletteElementsId = "current-editing-tools"
        }
        if (paletteType == "DrawingTools") {
            palettes = map.toolPalette.drawingToolPalettes;
            propertyName = "drawingToolPalettes";
            paletteElementsId = "current-drawing-tools"
        }
        let itemRef = null;
        let paletteIndex = null;
        let itemIndex = null;
        if (isCurrentItem) {
            paletteIndex = parseInt(operationInfo[1]);
            itemIndex = parseInt(operationInfo[2]);
            if (palettes.length > paletteIndex && palettes[paletteIndex].length > itemIndex) {
                itemRef = palettes[paletteIndex][itemIndex];
            }
            else {
                return;
            }
        }
        else {
            const isFromTemplate = operationInfo[2] == "fromtemplate";
            const isBuiltIn = operationInfo[2] == "builtin";
            const version = parseInt(operationInfo[1]);
            const name = operationInfo[0];
            itemRef = new EntityReference({
                name: name,
                versionId: version,
                isBuiltIn: isBuiltIn,
                isFromTemplate: isFromTemplate
            });
            if (paletteType == "MapItemTemplates") {
                const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, itemRef));
                if (!mapItemTemplate) {
                    return;
                }
            }
            else {
                const tool = map.tools.find(t => EntityReference.areEqual(t.ref, itemRef));
                const toolType = tool?.toolType;
                if (paletteType == "EditingTools" && toolType != ToolType.EditingTool) {
                    return;
                }
                if (paletteType == "DrawingTools" && toolType != ToolType.DrawingTool) {
                    return;
                }
            }
            
        }

        // get drop location      
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const palettesElement = componentElement.querySelector(`#${paletteElementsId}`);
        const paletteButtons = palettesElement.querySelectorAll(".tool-button");
        const mouseY = evt.clientY;
        const mouseX = evt.clientX;
        let newRow = -1;
        let newColumn = -1;
        const length = paletteButtons.length;
        for (let i = 0; i < length; i++) {
            const rect = paletteButtons[i].getBoundingClientRect();
            const buttonInfo = paletteButtons[i].id.split("-");
            const buttonRow = parseInt(buttonInfo[1]);
            const buttonColumn = parseInt(buttonInfo[2]);
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

        // update map
        const oldValue = map.toolPalette.getPalettesData(palettes);
        let newValue = map.toolPalette.getPalettes(oldValue);
        if (newRow == -1) {
            newValue.splice(0, 0, [itemRef]);
        }
        else {
            if (newValue.length <= newRow) {
                newValue.push([itemRef]);
            }
            else {
                if (newValue[newRow].length <= newColumn) {
                    newValue[newRow].push(itemRef);
                }
                else {
                    newValue[newRow].splice(newColumn, 0, itemRef);
                }
            }
        }
        if (isCurrentItem) {
            if (newRow == -1) {
                paletteIndex++;
            }
            if (newRow == paletteIndex && newColumn < itemIndex) {
                itemIndex++;
            }
            newValue[paletteIndex].splice(itemIndex, 1);
        }
        const palettesLength = newValue.length;
        let rowLength = 0;
        for (let i = palettesLength - 1; i >= 0; i--) {
            rowLength = newValue[i].length;
            if (rowLength == 0) {
                newValue.splice(i, 1);
            }
        }
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
        await this.#updateMap(changes);
    }

    async dropPaletteItem(evt, paletteType) {

        // get palette item info
        evt.preventDefault();
        const elementId = evt.dataTransfer.getData("text");
        const paletteItemInfo = elementId.split("-");
        if (paletteItemInfo[0] != paletteType) {
            return;
        }
        const paletteIndex = parseInt(paletteItemInfo[1]);
        const itemIndex = parseInt(paletteItemInfo[2]);

        // update map
        const map = await MapWorkerClient.getMap();
        let palettes = map.toolPalette.mapItemTemplatePalettes;
        let propertyName = "mapItemTemplatePalettes";
        if (paletteType == "EditingTools") {
            palettes = map.toolPalette.editingToolPalettes;
            propertyName = "editingToolPalettes";
        }
        if (paletteType == "DrawingTools") {
            palettes = map.toolPalette.drawingToolPalettes;
            propertyName = "drawingToolPalettes";
        }
        const oldValue = map.toolPalette.getPalettesData(palettes);
        let newValue = map.toolPalette.getPalettes(oldValue);
        newValue[paletteIndex].splice(itemIndex, 1);
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
        await this.#updateMap(changes);
    }

    async getTools() {
        const map = await MapWorkerClient.getMap();
        let tools = map.tools;
        tools.sort(this.#sortByRefName);
        return tools.map(t => ({
            elementId: `${t.ref.name}-${t.ref.versionId}${t.ref.isBuiltIn ? "-builtin" : ""}${t.ref.isFromTemplate ? "-fromtemplate" : ""}`,
            thumbnailSrc: t.thumbnailSrc,
            name: t.ref.name,
            toolTypeLabel: t.toolType == ToolType.EditingTool ? "Editing tool" : "Drawing tool",
            referenceTypeLabel: t.ref.isBuiltIn ? "built-in" : t.ref.isFromTemplate ? "from template" : "custom",
            versionLabel: `version ${t.ref.versionId}`,
            isSelected: EntityReference.areEqual(t.ref, this.#currentTool?.ref)
        }));
    }

    async getMapItemTemplates() {
        const map = await MapWorkerClient.getMap();
        let mapItemTemplates = map.mapItemTemplates;
        mapItemTemplates.sort(this.#sortByRefName);
        return mapItemTemplates.map(mit => ({
            elementId: `${mit.ref.name}-${mit.ref.versionId}${mit.ref.isBuiltIn ? "-builtin" : ""}${mit.ref.isFromTemplate ? "-fromtemplate" : ""}`,
            thumbnailSrc: `<image height="100%" width="100%" href="${mit.thumbnailSrc}" />`,
            name: mit.ref.name,
            referenceTypeLabel: mit.ref.isBuiltIn ? "built-in" : mit.ref.isFromTemplate ? "from template" : "custom",
            versionLabel: `version ${mit.ref.versionId}`,
            isSelected: EntityReference.areEqual(mit.ref, this.#currentMapItemTemplate?.ref)
        }));
    }

    async addTool() {
        let moduleSrc = `data-${btoa(ToolSource.Default)}`
        const thumbnailSrc = `<g class="icon"><path d="M 30,10 l -20,0 0,20 M 10,70 l 0,20 20,0 M 70,90 l 20,0 0,-20 M 90,30 l 0,-20 -20,0" /></g>`;
        const cursorSrc = `<g stroke="black" stroke-width="4" fill="white"><path d="M 5,5 L 80,80 A 5 5 -45 0 0 90 70 L 35,15 z" /></g>`;
        const map = await MapWorkerClient.getMap();
        const name = this.#getNewRefName("New tool", map.toolRefs);
        const tool = new Tool({
            ref: {
                versionId: 1,
                isBuiltIn: false,
                isFromTemplate: false,
                name: name
            },
            moduleSrc: moduleSrc,
            thumbnailSrc: thumbnailSrc,
            cursorSrc: cursorSrc,
            cursorHotspot: { x: 0, y: 0 },
            toolType: ToolType.DrawingTool
        });

        const changes = [
            {
                changeType: ChangeType.Insert,
                changeObjectType: Map.name,
                propertyName: "tools",
                itemIndex: map.tools.length,
                itemValue: tool.getData()
            },
            {
                changeType: ChangeType.Insert,
                changeObjectType: Map.name,
                propertyName: "toolRefs",
                itemIndex: map.toolRefs.length,
                itemValue: tool.ref.getData()
            }
        ];
        await this.#setCurrentTool(tool);
        await this.#updateMap(changes);
    }

    async addMapItemTemplate() {
        const thumbnailSrc = MapItemTemplate.defaultThumbnailSrc;
        const map = await MapWorkerClient.getMap();
        const name = this.#getNewRefName("New map item template", map.mapItemTemplateRefs);
        const mapItemTemplate = new MapItemTemplate({
            ref: {
                versionId: 1,
                isBuiltIn: false,
                isFromTemplate: false,
                name: name
            },
            thumbnailSrc: thumbnailSrc,
            fills: [{ options: PathStyle.getOptionDefaults(PathStyleType.ColorFill)}],
            strokes: [{ options: PathStyle.getOptionDefaults(PathStyleType.ColorStroke) }]
        });
 
        const changes = [
            {
                changeType: ChangeType.Insert,
                changeObjectType: Map.name,
                propertyName: "mapItemTemplates",
                itemIndex: map.mapItemTemplates.length,
                itemValue: mapItemTemplate.getData()
            },
            {
                changeType: ChangeType.Insert,
                changeObjectType: Map.name,
                propertyName: "mapItemTemplateRefs",
                itemIndex: map.mapItemTemplateRefs.length,
                itemValue: mapItemTemplate.ref.getData()
            }
        ];
        await this.#setCurrentMapItemTemplate(mapItemTemplate);
        await this.#updateMap(changes);
    }

    async deleteTool() {
        if (this.#currentTool && !this.#currentTool.ref.isBuiltIn && !this.#currentTool.ref.isFromTemplate) {
            const map = await MapWorkerClient.getMap();
            const toolIndex = map.tools.findIndex(t => EntityReference.areEqual(t.ref, this.#currentTool.ref));
            const toolRefIndex = map.toolRefs.findIndex(tr => EntityReference.areEqual(tr, this.#currentTool.ref));
            const changes = [
                {
                    changeType: ChangeType.Delete,
                    changeObjectType: Map.name,
                    propertyName: "tools",
                    itemIndex: toolIndex,
                    itemValue: this.#currentTool.getData()
                },
                {
                    changeType: ChangeType.Delete,
                    changeObjectType: Map.name,
                    propertyName: "toolRefs",
                    itemIndex: toolRefIndex,
                    itemValue: this.#currentTool.ref.getData()
                }
            ];

            const isInEditingToolPalettes = this.#isToolInPalettes(map.toolPalette.editingToolPalettes, this.#currentTool.ref);
            if (isInEditingToolPalettes) {
                const oldEditingToolsData = map.toolPalette.getPalettesData(map.toolPalette.editingToolPalettes);
                let newEditingToolsData = this.#removeToolFromPalettesData(oldEditingToolsData, this.#currentTool.ref);
                changes.push({
                    changeType: ChangeType.Edit,
                    changeObjectType: ToolPalette.name,
                    propertyName: "editingToolPalettes",
                    oldValue: oldEditingToolsData,
                    newValue: newEditingToolsData
                });
            }

            const isInDrawingToolPalettes = this.#isToolInPalettes(map.toolPalette.drawingToolPalettes, this.#currentTool.ref);
            if (isInDrawingToolPalettes) {
                const oldDrawingToolsData = map.toolPalette.getPalettesData(map.toolPalette.drawingToolPalettes);
                let newDrawingToolsData = this.#removeToolFromPalettesData(oldDrawingToolsData, this.#currentTool.ref);
                changes.push({
                    changeType: ChangeType.Edit,
                    changeObjectType: ToolPalette.name,
                    propertyName: "drawingToolPalettes",
                    oldValue: oldDrawingToolsData,
                    newValue: newDrawingToolsData
                });
            }

            await this.#setCurrentTool(null);
            await this.#updateMap(changes);
        }
    }

    async deleteMapItemTemplate() {
        if (this.#currentMapItemTemplate && !this.#currentMapItemTemplate.ref.isBuiltIn && !this.#currentMapItemTemplate.ref.isFromTemplate) {
            const map = await MapWorkerClient.getMap();
            const mapItemTemplateIndex = map.mapItemTemplates.findIndex(mit => EntityReference.areEqual(mit.ref, this.#currentMapItemTemplate.ref));
            const mapItemTemplateRefIndex = map.mapItemTemplateRefs.findIndex(mitr => EntityReference.areEqual(mitr, this.#currentMapItemTemplate.ref));
            const mapItemInfo = await this.#getMapItemsToDelete(map, this.#currentMapItemTemplate.ref);
            const changes = [];
            for (const mapItemGroup of mapItemInfo.mapItemGroups) {
                changes.push({
                    changeType: ChangeType.Delete,
                    changeObjectType: Layer.name,
                    propertyName: "mapItemGroups",
                    itemIndex: mapItemGroup.index,
                    itemValue: mapItemGroup.mapItemGroupData,
                    layerName: mapItemGroup.layerName
                });
            }
            for (const mapItem of mapItemInfo.mapItems) {
                changes.push({
                    changeType: ChangeType.Delete,
                    changeObjectType: MapItemGroup.name,
                    propertyName: "mapItems",
                    itemIndex: mapItem.index,
                    itemValue: mapItem.mapItemData,
                    mapItemGroupRef: mapItem.mapItemGroupRef,
                    layerName: mapItem.layerName
                });
            }
            const isInMapItemTemplatePalettes = this.#isToolInPalettes(map.toolPalette.mapItemTemplatePalettes, this.#currentMapItemTemplate.ref);
            if (isInMapItemTemplatePalettes) {
                const oldMapItemTemplatesData = map.toolPalette.getPalettesData(map.toolPalette.mapItemTemplatePalettes);
                let newMapItemTemplatesData = this.#removeToolFromPalettesData(oldMapItemTemplatesData, this.#currentMapItemTemplate.ref);
                changes.push({
                    changeType: ChangeType.Edit,
                    changeObjectType: ToolPalette.name,
                    propertyName: "mapItemTemplatePalettes",
                    oldValue: oldMapItemTemplatesData,
                    newValue: newMapItemTemplatesData
                });
            }
            changes.push({
                changeType: ChangeType.Delete,
                changeObjectType: Map.name,
                propertyName: "mapItemTemplates",
                itemIndex: mapItemTemplateIndex,
                itemValue: this.#currentMapItemTemplate.getData()
            });
            changes.push({
                changeType: ChangeType.Delete,
                changeObjectType: Map.name,
                propertyName: "mapItemTemplateRefs",
                itemIndex: mapItemTemplateRefIndex,
                itemValue: this.#currentMapItemTemplate.ref.getData()
            })
            await this.#setCurrentMapItemTemplate(null);
            await this.#updateMap(changes);
        }
    }

    async selectTool(elementId) {
        await this.#selectToolPaletteItem(elementId, true);
    }

    async selectMapItemTemplate(elementId) {
        await this.#selectToolPaletteItem(elementId, false);
    }

    hasCurrentTool() {
        return this.#currentTool ? true : false;
    }

    getCurrentTool() {
        return this.#currentTool;
    }

    canDeleteToolAttribute() {
        return this.hasCurrentTool() ? "" : "disabled";
    }

    hasCurrentMapItemTemplate() {
        return this.#currentMapItemTemplate ? true : false;
    }

    getCurrentMapItemTemplate() {
        return this.#currentMapItemTemplate;
    }

    canDeleteMapItemTemplateAttribute() {
        return this.hasCurrentMapItemTemplate() ? "" : "disabled";
    }

    async copyMapItemTemplate(elementId) {
        const parts = elementId.split("-");
        const name = parts[0];
        const version = parseInt(parts[1]);
        const isFromTemplate = parts[2] == "fromtemplate";
        const isBuiltIn = parts[2] == "builtin";
        const ref = new EntityReference({
            name: name,
            versionId: version,
            isBuiltIn: isBuiltIn,
            isFromTemplate: isFromTemplate
        });
        const map = await MapWorkerClient.getMap();
        const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, ref));
        const newRef =
        {
            name: this.#getNewRefName(name, map.mapItemTemplateRefs),
            versionId: 1,
            isBuiltIn: false,
            isFromTemplate: false
        };
        const data = mapItemTemplate.getData(true);
        data.ref = newRef;
        const newMapItemTemplate = new MapItemTemplate(data);
        const changes = [
            {
                changeType: ChangeType.Insert,
                changeObjectType: Map.name,
                propertyName: "mapItemTemplates",
                itemIndex: map.mapItemTemplates.length,
                itemValue: newMapItemTemplate.getData()
            },
            {
                changeType: ChangeType.Insert,
                changeObjectType: Map.name,
                propertyName: "mapItemTemplateRefs",
                itemIndex: map.mapItemTemplateRefs.length,
                itemValue: newRef
            }
        ];
        await this.#setCurrentMapItemTemplate(newMapItemTemplate);
        await this.#updateMap(changes);
    }

    // helpers
    #clickHandlerRegistered;
    #currentTool;
    #currentMapItemTemplate;

    #componentElementInternal;
    get #componentElement() {
        if (!this.#componentElementInternal) {
            this.#componentElementInternal = KitRenderer.getComponentElement(this.componentId);
        }
        return this.#componentElementInternal
    }

    #updateToolListItemLabels(map) {
        for (const tool of map.tools) {
            const elementId = `${tool.ref.name}-${tool.ref.versionId}${tool.ref.isBuiltIn ? "-builtin" : ""}${tool.ref.isFromTemplate ? "-fromtemplate" : ""}`;
            const thumbnailElements = DomHelper.getElements(this.#componentElement, `[data-tool-thumbnail="${elementId}"]`);
            for (const thumbnailElement of thumbnailElements) {
                thumbnailElement.innerHTML = tool.thumbnailSrc;
            }
            const titleElements = DomHelper.getElements(this.#componentElement, `[data-tool-title="${elementId}"]`);
            for (const titleElement of titleElements) {
                titleElement.setAttribute("title", tool.ref.name);
            }
            const nameElements = DomHelper.getElements(this.#componentElement, `[data-tool-name="${elementId}"]`);
            for (const nameElement of nameElements) {
                nameElement.innerHTML = tool.ref.name;
            }
            const versionElements = DomHelper.getElements(this.#componentElement, `[data-tool-version="${elementId}"]`);
            for (const versionElement of versionElements) {
                versionElement.innerHTML = tool.ref.versionId;
            }
            const toolTypeElements = DomHelper.getElements(this.#componentElement, `[data-tool-type="${elementId}"]`);
            for (const toolTypeElement of toolTypeElements) {
                toolTypeElement.innerHTML = (tool.toolType == ToolType.DrawingTool) ? "Drawing tool" : "Editing tool";
            }
        }
    }

    #updateMapItemTemplateListItemLabels(map) {
        for (const mapItemTemplate of map.mapItemTemplates) {
            const elementId = `${mapItemTemplate.ref.name}-${mapItemTemplate.ref.versionId}${mapItemTemplate.ref.isFromTemplate ? "-fromtemplate" : ""}`;
            const thumbnailElements = DomHelper.getElements(this.#componentElement, `[data-map-item-template-thumbnail="${elementId}"]`);
            for (const thumbnailElement of thumbnailElements) {
                const style = `background-image: url('${mapItemTemplate.thumbnailSrc}');margin:2px;`;
                thumbnailElement.setAttribute("style", style);
            }
            const titleElements = DomHelper.getElements(this.#componentElement, `[data-map-item-template-title="${elementId}"]`);
            for (const titleElement of titleElements) {
                titleElement.setAttribute("title", mapItemTemplate.ref.name);
            }
            const nameElements = DomHelper.getElements(this.#componentElement, `[data-map-item-template-name="${elementId}"]`);
            for (const nameElement of nameElements) {
                nameElement.innerHTML = mapItemTemplate.ref.name;
            }
            const versionElements = DomHelper.getElements(this.#componentElement, `[data-map-item-template-version="${elementId}"]`);
            for (const versionElement of versionElements) {
                versionElement.innerHTML = `version: ${mapItemTemplate.ref.versionId}`;
            }
        }
    }

    #detailsState;
    #getDetailsState() {
        if (!this.#detailsState) {
            const detailsState = [];
            const detailsElements = DomHelper.getElements(this.#componentElement, "details");
            for (const detailsElement of detailsElements) {
                detailsState.push({
                    id: detailsElement.id,
                    isOpen: detailsElement.open
                });
            }
            this.#detailsState = detailsState;
        }
        return this.#detailsState;
    }

    #applyDetailsState() {
        const detailsElements = DomHelper.getElements(this.#componentElement, "details");
        const detailsState = this.#getDetailsState();
        for (const detailsElement of detailsElements) {
            const isOpen = detailsState.find(x => x.id == detailsElement.id)?.isOpen;
            detailsElement.open = isOpen;
        }
    }

    #openSection(detailsId, closeOtherSections) {
        const detailsState = this.#getDetailsState();
        if (closeOtherSections) {
            for (const stateItem of detailsState) {
                stateItem.isOpen = false;
            }
        }
        const selectedStateItem = detailsState.find(x => x.id == detailsId);
        if (selectedStateItem) {
            selectedStateItem.isOpen = true;
        }
        this.#detailsState = detailsState;
        this.#applyDetailsState();
    }

    #sortByRefName(item1, item2) {
        if (item1.ref.name.toLowerCase() < item2.ref.name.toLowerCase()) {
            return -1;
        }
        if (item1.ref.name.toLowerCase() > item2.ref.name.toLowerCase()) {
            return 1;
        }
        return 0;
    }

    async #updateMap(changes) {
        ToolPaletteDialogModel.saveScrollPosition();
        MapWorkerClient.postWorkerMessage({
            messageType: MapWorkerInputMessageType.UpdateMap,
            changeSet: { changes: changes }
        });
    }

    async #selectToolPaletteItem(elementId, isTool) {
        let className = "map-item-template-item";
        let deleteButtonId = "delete-map-item-template-button";
        if (isTool) {
            className = "tool-item";
            deleteButtonId = "delete-tool-button";
        }
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const elements = componentElement.querySelectorAll(`.${className}`);
        for (const element of elements) {
            element.setAttribute("data-selected", element.id == elementId ? "true" : "false");
        }
        const operationInfo = elementId.split("-");
        const name = operationInfo[0];
        const version = parseInt(operationInfo[1]);
        const isFromTemplate = operationInfo[2] == "fromtemplate";
        const isBuiltIn = operationInfo[2] == "builtin";
        const canDelete = !isFromTemplate && !isBuiltIn;
        const deleteButton = componentElement.querySelector(`#${deleteButtonId}`);
        deleteButton.disabled = !canDelete;
        const ref = new EntityReference({
            name: name,
            versionId: version,
            isBuiltIn: isBuiltIn,
            isFromTemplate: isFromTemplate
        });
        const map = await MapWorkerClient.getMap();
        if (isTool) {
            const tool = map.tools.find(t => EntityReference.areEqual(t.ref, ref));
            await this.#setCurrentTool(tool);
        }
        else {
            const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, ref));
            await this.#setCurrentMapItemTemplate(mapItemTemplate);
        }
    }

    async #setCurrentTool(tool) {
        this.#currentTool = tool;
        await DomHelper.reRenderElement(this.#componentElement, "currentToolForm");
    }

    async #setCurrentMapItemTemplate(mapItemTemplate) {
        this.#currentMapItemTemplate = mapItemTemplate;
        await DomHelper.reRenderElement(this.#componentElement, "currentMapItemTemplateForm");
    }

    #getNewRefName(candidate, refs) {
        if (!refs.some(r => r.name == candidate)) {
            return candidate;
        }
        for (let i = 1; i <= 100; i++) {
            const candidateN = `${candidate} (${i})`;
            if (!refs.some(r => r.name == candidateN)) {
                return candidateN;
            }
        }
        return `${candidate} (${crypto.randomUUID()})`;
    }

    #isToolInPalettes(palettes, toolRef) {
        for (const palette of palettes) {
            if (palette.some(x => EntityReference.areEqual(x, toolRef))) {
                return true;
            }
        }
        return false;
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

    #getMapItemsToDelete(map, templateRef) {
        const mapItems = [];
        const mapItemGroups = [];
        for (const layer of map.layers) {
            for (let i = layer.mapItemGroups.length - 1; i > -1; i--) {
                const mapItemGroup = layer.mapItemGroups[i];
                if (mapItemGroup.mapItems.some(mi => !EntityReference.areEqual(mi.templateRef, templateRef))) {
                    for (let j = mapItemGroup.mapItems.length - 1; j > -1; j--) {
                        const mapItem = mapItemGroup.mapItems[j];
                        if (EntityReference.areEqual(templateRef, mapItem.templateRef)) {
                            mapItems.push({
                                index: j,
                                mapItemData: mapItem.getData(),
                                mapItemGroupRef: mapItemGroup.ref.getData(),
                                layerName: layer.name
                            });
                        }
                    }
                }
                else {
                    mapItemGroups.push({
                        index: i,
                        mapItemGroupData: mapItemGroup.getData(),
                        layerName: layer.name
                    })
                }
            }
        }
        return {
            mapItemGroups: mapItemGroups,
            mapItems: mapItems
        };
    }
}
