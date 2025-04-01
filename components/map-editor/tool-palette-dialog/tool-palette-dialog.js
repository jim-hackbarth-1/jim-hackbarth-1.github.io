
import { KitMessenger, KitRenderer } from "../../../ui-kit.js";
import { ChangeSet, ChangeType, EntityReference, Map, MapWorkerClient, MapWorkerInputMessageType, Tool, ToolPalette, ToolSource, ToolType } from "../../../domain/references.js";
import { EditorModel } from "../editor/editor.js";

export function createModel() {
    return new ToolPaletteDialogModel();
}

class ToolPaletteDialogModel {

    // event handlers
    async onRenderStart(componentId) {
        this.componentId = componentId;
    }

    async onRenderComplete() {
        KitMessenger.subscribe(EditorModel.MapUpdatedNotificationTopic, this.componentId, this.onMapUpdated.name);
    }

    async onMapUpdated(message) {
        if (this.#isVisible) { 
            const map = await MapWorkerClient.getMap();
            if (this.#currentTool) {
                this.#currentTool = map.tools.find(t => EntityReference.areEqual(t.ref, this.#currentTool.ref));
            }
            let componentElement = KitRenderer.getComponentElement(this.componentId);
            const scrollTop = componentElement.querySelector("#top-details-list").scrollTop;
            await this.#reRenderElement("kitIfVisible");
            this.#applyDetailsState();
            setTimeout(() => {
                componentElement.querySelector("#top-details-list").scrollTop = scrollTop;
            }, 20);     
        }
    }

    onDetailsToggleEvent(event) {
        const detailsState = this.#getDetailsState();
        const stateItem = detailsState.find(x => x.id == event.target.id);
        if (stateItem) {
            stateItem.isOpen = event.target.open;
        }
        this.#detailsState = detailsState;
    }

    // properties
    #isVisible;
    isVisible() {
        return this.#isVisible
    }

    // methods
    async showDialog() {
        this.#isVisible = true;
        await this.#reRenderElement("kitIfVisible");
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
                        items.push({ id: `${paletteType}-${paletteIndex}-${itemIndex}`, data: mapItemTemplate });
                    }
                    itemIndex++;
                }
            }
            else {
                let itemIndex = 0;
                for (const toolRef of palette) {
                    const tool = map.tools.find(t => EntityReference.areEqual(t.ref, toolRef));
                    if (tool) {
                        items.push({ id: `${paletteType}-${paletteIndex}-${itemIndex}`, data: tool });
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
            name: i.ref.name,
            referenceTypeLabel: i.ref.isBuiltIn ? "built-in" : i.ref.isFromTemplate ? "from template" : "custom tool",
            versionLabel: `version ${i.ref.versionId}`
        }));
    }

    async dragStartItem(evt, elementId) {
        if (!evt?.dataTransfer) {
            return;
        }
        evt.dataTransfer.setData("text", elementId);
        const dragStartEvent = new DragEvent("dragstart", {
            bubbles: true,
            cancelable: true,
            clientX: evt.clientX,
            clientY: evt.clientY,
        });
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const element = componentElement.querySelector(`#${elementId}`);
        element.dispatchEvent(dragStartEvent);
    }

    dragItem(evt) {
        evt.dataTransfer.setData("text", evt.srcElement.id);
    }

    allowDrop(evt) {
        evt.preventDefault();
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
        function sortTools(tool1, tool2) {
            if (tool1.ref.name < tool2.ref.name) {
                return -1;
            }
            if (tool1.ref.name > tool2.ref.name) {
                return 1;
            }
            return 0;
        }
        tools.sort(sortTools);

        return tools.map(t => ({
            elementId: `${t.ref.name}-${t.ref.versionId}${t.ref.isBuiltIn ? "-builtin" : ""}${t.ref.isFromTemplate ? "-fromtemplate" : ""}`,
            thumbnailSrc: t.thumbnailSrc,
            name: t.ref.name,
            toolTypeLabel: t.toolType == ToolType.EditingTool ? "Editing tool" : "Drawing tool",
            referenceTypeLabel: t.ref.isBuiltIn ? "built-in" : t.ref.isFromTemplate ? "from template" : "custom tool",
            versionLabel: `version ${t.ref.versionId}`
        }));
    }

    async addTool() {
        let moduleSrc = `data-${btoa(ToolSource.Default)}`
        const thumbnailSrc = `<g class="icon"><path d="M 30,10 l -20,0 0,20 M 10,70 l 0,20 20,0 M 70,90 l 20,0 0,-20 M 90,30 l 0,-20 -20,0" /></g>`;
        const cursorSrc = `<g stroke="black" stroke-width="4" fill="white"><path d="M 5,5 L 80,80 A 5 5 -45 0 0 90 70 L 35,15 z" /></g>`;
        const name = await this.#getNewToolName();
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

        const map = await MapWorkerClient.getMap();
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
        this.#setCurrentTool(tool);
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

            this.#setCurrentTool(null);
            await this.#updateMap(changes);
        }
    }

    async selectTool(elementId) {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const toolElements = componentElement.querySelectorAll(".tool-item");
        for (const toolElement of toolElements) {
            const toolElementId = toolElement.id;
            if (elementId == toolElementId) {
                toolElement.setAttribute("data-selected", "true");
            }
            else {
                toolElement.setAttribute("data-selected", "false");
            }
        }
        const operationInfo = elementId.split("-");
        const name = operationInfo[0];
        const version = parseInt(operationInfo[1]);
        const isFromTemplate = operationInfo[2] == "fromtemplate";
        const isBuiltIn = operationInfo[2] == "builtin";
        const canDelete = !isFromTemplate && !isBuiltIn;
        const deleteButton = componentElement.querySelector("#delete-tool-button");
        deleteButton.disabled = !canDelete;
        const ref = new EntityReference({
            name: name,
            versionId: version,
            isBuiltIn: isBuiltIn,
            isFromTemplate: isFromTemplate
        });
        const map = await MapWorkerClient.getMap();
        const tool = map.tools.find(t => EntityReference.areEqual(t.ref, ref));
        await this.#setCurrentTool(tool);
    }

    getCurrentTool() {
        return this.#currentTool?.getData();
    }

    // helpers
    #clickHandlerRegistered;
    #currentTool;

    #detailsState;
    #getDetailsState() {
        if (!this.#detailsState) {
            const detailsState = [];
            const componentElement = KitRenderer.getComponentElement(this.componentId);
            const detailsElements = componentElement.querySelectorAll("details");
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
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const detailsElements = componentElement.querySelectorAll("details");
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

    async #reRenderElement(elementId) {
        const componentElement = KitRenderer.getComponentElement(this.componentId);
        const element = componentElement.querySelector(`#${elementId}`);
        const componentId = element.getAttribute("data-kit-component-id");
        await KitRenderer.renderComponent(componentId);
    }

    async #setCurrentTool(tool) {
        this.#currentTool = tool;
        await this.#reRenderElement("currentToolForm");
    }

    async #getNewToolName() {
        const map = await MapWorkerClient.getMap();
        let candidate = "New tool";
        if (!map.toolRefs.some(tr => tr.name == candidate)) {
            return candidate;
        }
        for (let i = 1; i <= 100; i++) {
            candidate = `${candidate} (${i})`;
            if (!map.toolRefs.some(tr => tr.name == candidate)) {
                return candidate;
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
}
