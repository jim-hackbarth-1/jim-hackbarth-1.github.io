﻿
import {
    BuiltInTools,
    ChangeType,
    EntityReference,
    FileManager,
    Layer,
    Map,
    MapItemGroup,
    MapItemTemplate,
    MapWorkerClient,
    MapWorkerInputMessageType,
    MapWorkerOutputMessageType,
    Tool,
    ToolPalette,
    ToolType
} from "../../../domain/references.js";
import { KitComponent, KitDependencyManager, KitMessenger, KitRenderer } from "../../../ui-kit.js";
import { DomHelper } from "../../shared/dom-helper.js";
import { BuiltInTemplates } from "../file-new-dialog/file-new-dialog.js";

export function createModel() {
    return new EditorModel();
}

export class EditorModel {

    // constants
    static NewFileRequestTopic = "NewFileRequestTopic";
    static SaveFileRequestTopic = "SaveFileRequestTopic";
    static SaveFileAsRequestTopic = "SaveFileAsRequestTopic";
    static OpenFileRequestTopic = "OpenFileRequestTopic";
    static CanvasResizeRequestTopic = "CanvasResizeRequestTopic";
    static MapUpdatedNotificationTopic = "MapUpdatedNotificationTopic";
    static PresentationViewerStatusTopic = "PresentationViewerStatusTopic";

    // instance fields
    #componentId;
    #componentElement;
    #toolsPinned;
    #toolCursor;

    // event handlers
    async onRenderStart(componentId) {
        this.#componentId = componentId;
    }

    async onRenderComplete() {
        this.#componentElement = KitRenderer.getComponentElement(this.#componentId);
        const toolPaletteContentComponent = DomHelper.findComponentByElementId(this.#componentElement, "tool-palette-content");
        toolPaletteContentComponent.addEventListener(KitComponent.OnRenderCompleteEvent, this.onToolPaletteContentRenderComplete);
        this.#initializeMenu();
        this.#initializeKeyEvents();
        this.#subscribeToTopics();
        await this.#initializeToolsAndCanvas();
        this.#initializeMapWorker();
        await this.#updateMapItemTemplateThumbnails();
    }

    onToolPaletteContentRenderComplete = async () => {
        await this.#updateMapItemTemplateThumbnails();
    }

    onMapChanged = async (message) => {
        if (message?.messageType === MapWorkerOutputMessageType.ChangeCursor) {
            this.#setMapCursor(message.data?.cursor);
            await MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.CursorChanged, cursor: message.data?.cursor });
        }
        if (message?.messageType === MapWorkerOutputMessageType.ChangeToolOptions) {
            this.#componentElement.querySelector("#menuEditToolOptions").disabled = !this.#hasVisibleToolOption();
            this.#componentElement.querySelector("#buttonToolOptions").disabled = !this.#hasVisibleToolOption();
        }
        if (message?.messageType === MapWorkerOutputMessageType.MapUpdated && message?.data?.changeSet) {
            const map = await MapWorkerClient.getMap();
            const canSelectAllInView = (await this.isSelectAllInViewDisabled() == "disabled") ? false : true;
            const doesMapHaveSelections = this.#doesMapHaveSelections(map);
            const canPaste = map && this.#doesCopyPasteHaveData();
            this.#componentElement.querySelector("#menuEditSelectAllInView").disabled = !canSelectAllInView;
            this.#componentElement.querySelector("#buttonSelectAllInView").disabled = !canSelectAllInView;
            this.#componentElement.querySelector("#menuEditUnSelectAll").disabled = !doesMapHaveSelections;
            this.#componentElement.querySelector("#buttonUnSelectAll").disabled = !doesMapHaveSelections;
            this.#componentElement.querySelector("#menuEditUndo").disabled = !map.canUndo();
            this.#componentElement.querySelector("#buttonUndo").disabled = !map.canUndo();
            this.#componentElement.querySelector("#menuEditRedo").disabled = !map.canRedo();
            this.#componentElement.querySelector("#buttonRedo").disabled = !map.canRedo();
            this.#componentElement.querySelector("#menuEditCopy").disabled = !doesMapHaveSelections;
            this.#componentElement.querySelector("#buttonCopy").disabled = !doesMapHaveSelections;
            this.#componentElement.querySelector("#menuEditCut").disabled = !doesMapHaveSelections;
            this.#componentElement.querySelector("#buttonCut").disabled = !doesMapHaveSelections;
            this.#componentElement.querySelector("#menuEditPaste").disabled = !canPaste;
            this.#componentElement.querySelector("#buttonPaste").disabled = !canPaste;
            this.#componentElement.querySelector("#menuEditDelete").disabled = !doesMapHaveSelections;
            this.#componentElement.querySelector("#buttonDelete").disabled = !doesMapHaveSelections;
            this.#componentElement.querySelector("#menuEditToolOptions").disabled = !this.#hasVisibleToolOption();
            this.#componentElement.querySelector("#buttonToolOptions").disabled = !this.#hasVisibleToolOption();
            this.#componentElement.querySelector("#menuEditEditSelections").disabled = !doesMapHaveSelections;
            this.#componentElement.querySelector("#buttonEditSelections").disabled = !doesMapHaveSelections;
            if (message?.data?.changeSet?.changes) {
                for (const change of message.data.changeSet.changes) {
                    if (change.changeObjectType == Map.name) {
                        if (change.propertyName === "zoom") {
                            const zoomLabel = this.#componentElement.querySelector("#zoom-label");
                            zoomLabel.innerHTML = parseFloat(map.zoom * 100).toFixed(0) + "%";
                        }
                        if (change.propertyName === "activeLayer") {
                            const divActiveLayer = this.#componentElement.querySelector("#divActiveLayer");
                            divActiveLayer.innerHTML = map.activeLayer;
                        }
                    }
                    if (change.changeObjectType == ToolPalette.name
                        || change.changeObjectType == Tool.name
                        || change.changeObjectType == MapItemTemplate.name) {
                        await DomHelper.reRenderElement(this.#componentElement, "tool-palette-content");
                    }
                }
            }
            await KitMessenger.publish(EditorModel.MapUpdatedNotificationTopic, message);
        }
    }

    // methods
    toggleDropdown(dropdownId) {
        const appDocument = KitDependencyManager.getDocument();
        appDocument.getElementById(dropdownId).classList.toggle("show");
    }

    async showDialog(dialogId) {
        const dialogComponentId = this.#componentElement.querySelector(`#${dialogId}`).getAttribute("data-kit-component-id");
        const model = KitComponent.find(dialogComponentId).model;
        await model.showDialog();
    }

    async isSaveDisabled() {
        return this.#disabledWhenNoMap();
    }

    isOpenDisabled() {
        return null;
    }

    async saveMap() {
        if (FileManager.fileHandle) {
            const appDocument = KitDependencyManager.getDocument();
            const startCursor = appDocument.body.style.cursor;
            try {
                appDocument.body.style.cursor = "wait";
                const map = await MapWorkerClient.getMap();
                const json = EditorModel.#mapToJson(map);
                await FileManager.saveMap(json);
                this.#showSavedNotification();
            }
            finally {
                appDocument.body.style.cursor = startCursor;
            }  
        }
        else {
            await this.showDialog("file-save-dialog-component");
        }
    }

    async saveMapAs() {
        await this.showDialog("file-save-as-dialog-component");
    }

    async isCloseDisabled() {
        return await this.#disabledWhenNoMap();
    }

    async closeMap() {
        FileManager.fileHandle = null;
        await MapWorkerClient.setMap(null);
        await KitRenderer.renderComponent(this.#componentId);
    }

    async isSelectAllInViewDisabled() {
        const map = await MapWorkerClient.getMap();
        if (map) {
            const layer = map.getActiveLayer();
            if (layer && layer.mapItemGroups.some(mig => mig.inView)) {
                return null;
            }
        }
        return "disabled";
    }

    async selectAllInView() {
        MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.SelectAllInView });
    }

    async isUnSelectAllDisabled() {
        const map = await MapWorkerClient.getMap();
        return this.#doesMapHaveSelections(map) ? null : "disabled";
    }

    async unSelectAll() {
        MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.UnSelectAll });
    }

    async isUndoDisabled() {
        const map = await MapWorkerClient.getMap();
        return (map?.canUndo()) ? null : "disabled";
    }

    async undo() {
        MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.Undo });
    }

    async isRedoDisabled() {
        const map = await MapWorkerClient.getMap();
        return (map?.canRedo()) ? null : "disabled";
    }

    async redo() {
        MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.Redo });
    }

    async isToolOptionsDisabled() {
        const map = await MapWorkerClient.getMap();
        return (map && this.#hasVisibleToolOption()) ? null : "disabled";
    }

    async isEditSelectionDisabled() {
        const map = await MapWorkerClient.getMap();
        return this.#doesMapHaveSelections(map) ? null : "disabled";
    }

    async isPasteDisabled() {
        const doesCopyPasteHaveData = this.#doesCopyPasteHaveData();
        if (doesCopyPasteHaveData) {
            const map = await MapWorkerClient.getMap();
            if (map) {
                return null;
            }
        }
        return "disabled";
    }

    #pastesSinceLastCopy = 0;
    async copy() {       
        const map = await MapWorkerClient.getMap();
        if (map) {
            const layer = map.getActiveLayer();
            const mapItemGroups = layer.mapItemGroups.filter(mig => mig.selectionStatus).map(x => x.getData());
            const mapItemTemplates = [];
            for (const mapItemGroup of mapItemGroups) {
                if (mapItemGroup.mapItems) {
                    for (const mapItem of mapItemGroup.mapItems) {
                        const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, mapItem.mapItemTemplateRef));
                        if (!mapItemTemplates.some(mit => EntityReference.areEqual(mit.ref, mapItemTemplate.ref))) {
                            mapItemTemplates.push(mapItemTemplate.getData());
                        }
                    }
                }
            }
            const data = {
                mapItemTemplates: mapItemTemplates,
                mapItemGroups: mapItemGroups
            };
            const appWindow = KitDependencyManager.getWindow();
            appWindow.sessionStorage.setItem("copy-paste", JSON.stringify(data));
            appWindow.sessionStorage.setItem("copy-paste-has-data", true.toString());
            const canPaste = (await this.isPasteDisabled() == "disabled") ? false : true;
            this.#componentElement.querySelector("#menuEditPaste").disabled = !canPaste;
            this.#componentElement.querySelector("#buttonPaste").disabled = !canPaste;
            this.#pastesSinceLastCopy = 0;
        }
    }

    async cut() {
        await this.copy();
        await this.delete();
    }

    async paste() {
        const copyPasteHasData = this.#doesCopyPasteHaveData();
        let map = null;
        if (copyPasteHasData) {
            map = await MapWorkerClient.getMap();
        }
        if (map) {
            const appWindow = KitDependencyManager.getWindow();
            const text = appWindow.sessionStorage.getItem("copy-paste");
            if (text) {
                const data = JSON.parse(text);
                this.#updateMapItemTemplateDataToPaste(map, data);
                const changes = [];
                for (const mapItemTemplate of data.mapItemTemplates) {
                    changes.push({
                        changeType: ChangeType.Insert,
                        changeObjectType: Map.name,
                        propertyName: "mapItemTemplateRefs",
                        itemIndex: map.mapItemTemplateRefs.length,
                        itemValue: mapItemTemplate.ref
                    });
                    changes.push({
                        changeType: ChangeType.Insert,
                        changeObjectType: Map.name,
                        propertyName: "mapItemTemplates",
                        itemIndex: map.mapItemTemplates.length,
                        itemValue: mapItemTemplate
                    });
                }
                const mapItemGroups = [];
                this.#pastesSinceLastCopy++;
                const offset = (this.#pastesSinceLastCopy) * 15;
                for (const mapItemGroupData of data.mapItemGroups) {
                    mapItemGroupData.selectionStatus = null;
                    mapItemGroupData.bounds = null;
                    if (mapItemGroupData.mapItems) {
                        for (const mapItemData of mapItemGroupData.mapItems) {
                            mapItemData.bounds = null;
                            if (mapItemData.paths) {
                                for (const pathData of mapItemData.paths) {
                                    pathData.start = { x: pathData.start.x + offset, y: pathData.start.y + offset };
                                    pathData.bounds = null;
                                    if (pathData.clipPaths) {
                                        for (const clipPathData of pathData.clipPaths) {
                                            clipPathData.start = { x: clipPathData.start.x + offset, y: clipPathData.start.y + offset };
                                            pathData.bounds = null
                                        }
                                    }
                                }
                            }
                        }
                    }
                    mapItemGroups.push(new MapItemGroup(mapItemGroupData));
                }
                const layer = map.getActiveLayer();
                for (const mapItemGroup of mapItemGroups) {
                    changes.push({
                        changeType: ChangeType.Insert,
                        changeObjectType: Layer.name,
                        propertyName: "mapItemGroups",
                        itemIndex: layer.mapItemGroups.length,
                        itemValue: mapItemGroup.getData(true),
                        layerName: layer.name
                    })
                }
                MapWorkerClient.postWorkerMessage({
                    messageType: MapWorkerInputMessageType.UpdateMap,
                    changeSet: { changes: changes }
                });
            }
        }
    } 

    async delete() {
        MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.DeleteSelected });
    }

    async isZoomDisabled() {
        return await this.#disabledWhenNoMap();
    }

    async isResizeCanvasDisabled() {
        return await this.#disabledWhenNoMap();
    }

    async isOverlayDisabled() {
        return await this.#disabledWhenNoMap();
    }

    async isLayersDisabled() {
        return await this.#disabledWhenNoMap();
    }

    async getActiveLayerName() {
        const map = await MapWorkerClient.getMap();
        if (map) {
            const layer = map.getActiveLayer();
            if (layer) {
                return layer.name ?? "";
            }
        }
        return "";
    }

    async isPresentationViewDisabled() {
        const map = await MapWorkerClient.getMap();
        return map ? null : "disabled";
    }

    async toggleToolsPinned() {
        this.#toolsPinned = !this.#toolsPinned;
        const pinnedIcon = this.#componentElement.querySelector("#pinned-icon");
        if (this.#toolsPinned) {
            pinnedIcon.classList.add("pinned");
        }
        else {
            pinnedIcon.classList.remove("pinned");
        }
        this.#slideTools();
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
                        items.push({
                            id: `${paletteType}-${paletteIndex}-${itemIndex}`,
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
                        items.push({ id: `${paletteType}-${paletteIndex}-${itemIndex}`, data: tool });
                    }
                    itemIndex++;
                }
            }
        }
        return items;
    }

    async onToolReset() {
        let buttons = this.#componentElement.querySelectorAll(".data-editing-tool-button, .data-drawing-tool-button");
        for (const button of buttons) {
            button.classList.remove("active");
        }
        this.#toolCursor = "default";
        this.#setMapCursor();
        await MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.SetActiveTool, toolRefData: null });
    }

    async onToolSelected(id, ref) {
        let buttons = this.#componentElement.querySelectorAll(".data-editing-tool-button, .data-drawing-tool-button");
        for (const button of buttons) {
            button.classList.remove("active");
        }
        this.#componentElement.querySelector(`#${id}`).classList.add("active");
        const map = await MapWorkerClient.getMap();
        const tool = map.tools.find(t => EntityReference.areEqual(t.ref, ref));
        if (tool?.toolType == ToolType.EditingTool) {
            await this.onMapItemTemplateReset();
        }
        let cursorSrc = `<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100">${tool.cursorSrc}</svg>`;
        cursorSrc = `data:image/svg+xml;base64,${btoa(cursorSrc)}`;
        this.#toolCursor = `url(${cursorSrc}) ${tool.cursorHotspot.x} ${tool.cursorHotspot.y}, crosshair`;
        this.#setMapCursor();
        const refData = tool?.ref ? tool.ref.getData() : null;
        await MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.SetActiveTool, toolRefData: refData });
    }

    async onMapItemTemplateReset() {
        let buttons = this.#componentElement.querySelectorAll(".data-map-item-template-button");
        for (const button of buttons) {
            button.classList.remove("active");
        }
        await MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.SetActiveMapItemTemplate, mapItemTemplateRefData: null });
    }

    async onMapItemTemplateSelected(id, ref) {
        let buttons = this.#componentElement.querySelectorAll(".data-map-item-template-button");
        for (const button of buttons) {
            button.classList.remove("active");
        }
        this.#componentElement.querySelector(`#${id}`).classList.add("active");
        const map = await MapWorkerClient.getMap();
        const mapItemTemplate = map.mapItemTemplates.find(mit => EntityReference.areEqual(mit.ref, ref));
        const mapItemTemplateRefData = mapItemTemplate?.ref ? mapItemTemplate.ref.getData() : null;
        await MapWorkerClient.postWorkerMessage({ messageType: MapWorkerInputMessageType.SetActiveMapItemTemplate, mapItemTemplateRefData: mapItemTemplateRefData });
    }

    async onNewFileRequested(message) {
        FileManager.fileHandle = null;
        await MapWorkerClient.setMap(null);
        const templateRef = message.templateRef;
        let template = null;
        if (templateRef) {
            if (templateRef.isBuiltIn) {
                template = await BuiltInTemplates.getTemplate(templateRef);
            }
            else {
                // TODO: get template from api
            }
        }
        const mapData = {};
        if (template) {
            mapData.templateRef = template.ref.getData();
            mapData.layers = [];
            for (const layer of template.layers) {
                mapData.layers.push(layer.getData());
            }
            mapData.activeLayer = template.activeLayer;
            mapData.toolPalette = template.toolPalette.getData();
            mapData.overlay = template.overlay.getData();
        }
        await this.#openMap(mapData, template);
    }

    async onOpenFileRequested(message) {
        let json = null;
        if (message.fileHandle) {
            FileManager.fileHandle = message.fileHandle;
            json = await FileManager.openMap(message.fileHandle);
        }
        if (message.fileContents) {
            json = message.fileContents;
        }
        const mapData = JSON.parse(json);
        let template = null;
        if (mapData.templateRef) {
            if (mapData.templateRef.isBuiltIn) {
                template = await BuiltInTemplates.getTemplate(mapData.templateRef);
            }
        }
        await this.#openMap(mapData, template);
    }

    async onSaveFileRequested(message) {
        const appDocument = KitDependencyManager.getDocument();
        const startCursor = appDocument.body.style.cursor;
        try {
            appDocument.body.style.cursor = "wait";
            const map = await MapWorkerClient.getMap();
            const json = EditorModel.#mapToJson(map);
            if (message.fileHandle) {
                FileManager.fileHandle = message.fileHandle;
                await FileManager.saveMap(json);
                this.#showSavedNotification();
                return;
            }
            if (message.fileName) {
                const blob = new Blob([json], { type: "text/plain" });
                const anchor = appDocument.createElement("a");
                await FileManager.download(blob, message.fileName, anchor);
                this.#showSavedNotification()
                return;
            }
        }
        finally {
            appDocument.body.style.cursor = startCursor;
        }
    }

    async onSaveFileAsRequested(message) {
        if (message.fileType == "image") {
            const appDocument = KitDependencyManager.getDocument();
            const startCursor = appDocument.body.style.cursor;
            appDocument.body.style.cursor = "wait";
            try {
                const blob = await MapWorkerClient.getMapAsImage();
                const anchor = appDocument.createElement("a");
                await FileManager.download(blob, message.fileName, anchor);
                this.#showSavedNotification()
            }
            finally {
                appDocument.body.style.cursor = startCursor;
            }
        }
        else {
            await this.onSaveFileRequested(message);
        }
    }

    async onCanvasResizeRequested(message) {
        const currentCanvas = this.#componentElement.querySelector("#map-canvas");
        if (currentCanvas.height != message.height || currentCanvas.width != message.width) {
            const appDocument = KitDependencyManager.getDocument();
            const newCanvas = appDocument.createElement("canvas");
            newCanvas.id = "map-canvas";
            newCanvas.height = message.height;
            newCanvas.width = message.width;
            currentCanvas.parentNode.replaceChild(newCanvas, currentCanvas);
            this.#initializeMapWorker();
        }
    }

    #presentationWindow = null;
    async onPresentationViewerStatusChanged(message) {
        this.#presentationWindow = message.presentationWindow;
        const componentElement = KitRenderer.getComponentElement(this.#componentId);
        const disabled = !this.#presentationWindow;
        componentElement.querySelector("#refresh-presentation-view-menu-button").disabled = disabled;
        componentElement.querySelector("#refresh-presentation-view-toolbar-button").disabled = disabled;
    }

    async getZoom() {      
        const map = await MapWorkerClient.getMap();
        return map ? parseFloat(map.zoom * 100).toFixed(0) + "%" : "";
    }

    async isRefreshPresentationViewerDisabled() {
        return this.#presentationWindow ? "" : "disabled";
    }

    async refreshPresentationViewer() {
        if (this.#presentationWindow) {
            const appWindow = KitDependencyManager.getWindow();
            this.#presentationWindow.postMessage({ messageType: "refresh" }, appWindow.location.origin);
        }
    }

    // helpers
    static #clickHandlerRegistered;
    #initializeMenu() {
        if (!EditorModel.#clickHandlerRegistered) {
            const appDocument = KitDependencyManager.getDocument();
            appDocument.addEventListener("click", (event) => this.#handleClickEvent(event));
            EditorModel.#clickHandlerRegistered = true;
        }
    }

    #handleClickEvent(event) {
        const appDocument = KitDependencyManager.getDocument();
        const dropDownId = event.target.getAttribute("data-dropdown-id");
        const dropdowns = appDocument.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].id != dropDownId) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains("show")) {
                    openDropdown.classList.remove("show");
                }
            }
        }
    }

    #doesCopyPasteHaveData() {
        const appWindow = KitDependencyManager.getWindow();
        let text = appWindow.sessionStorage.getItem("copy-paste-has-data");
        return (text === true.toString());
    }

    #updateMapItemTemplateDataToPaste(map, data) {
        const templatesOut = [];
        for (const mapItemTemplate of data.mapItemTemplates) {
            if (!map.mapItemTemplateRefs.some(ref => EntityReference.areEqual(ref, mapItemTemplate.ref))) {
                const templateOut = mapItemTemplate;
                const notFromTemplateRef = { ...mapItemTemplate.ref };
                notFromTemplateRef.isFromTemplate = false;
                if (map.mapItemTemplateRefs.some(ref => EntityReference.areEqual(ref, notFromTemplateRef))) {
                    for (const mapItemGroup of data.mapItemGroups) {
                        for (const mapItem of mapItemGroup.mapItems) {
                            if (EntityReference.areEqual(mapItemTemplate.ref, mapItem.mapItemTemplateRef)) {
                                mapItem.mapItemTemplateRef.isFromTemplate = false;
                            }
                        }
                    }
                    templateOut.ref.isFromTemplate = false;
                }
                templatesOut.push(templateOut);
            }
        }
        data.mapItemTemplates = templatesOut;
    }

    async #updateMapItemTemplateThumbnails() {
        const palettes = await this.getToolPalettes("MapItemTemplates");
        const palettesLength = palettes.length;
        for (let i = 0; i < palettesLength; i++) {
            const paletteItems = await this.getToolPaletteItems("MapItemTemplates", i);
            for (let j = 0; j < paletteItems.length; j++) {
                const thumbnailSrc = paletteItems[j].data.thumbnailSrc;
                const elementId = `MapItemTemplates-${i}-${j}`;
                const query = `[data-map-item-template-thumbnail="${elementId}"]`;
                const thumbnailElement = this.#componentElement.querySelector(query);
                const style = `background-image: url('${thumbnailSrc}');`;
                thumbnailElement.setAttribute("style", style);
            }
        }
    }

    static #keyDownHandlerRegistered;
    #initializeKeyEvents() {
        if (!EditorModel.#keyDownHandlerRegistered) {
            const appDocument = KitDependencyManager.getDocument();
            appDocument.addEventListener("keydown", async (event) => await this.#handleKeyDownEvent(event));
            EditorModel.#keyDownHandlerRegistered = true;
        }
    }

    async #handleKeyDownEvent(event) {
        if (event.key == "ArrowDown" || event.key == "ArrowUp" || event.key == "ArrowLeft" || event.key == "ArrowRight") {
            event.preventDefault();
        }
        if (event.repeat) {
            return;
        }
        const map = await MapWorkerClient.getMap();
        const mapHasSelections = this.#doesMapHaveSelections(map);
        if (event.key?.toLowerCase() == "a" && event.ctrlKey) {
            if (event.altKey) {
                if (mapHasSelections) {
                    await this.unSelectAll();
                }
            }
            else {
                const canSelectAllInView = (await this.isSelectAllInViewDisabled() == "disabled") ? false : true;
                if (canSelectAllInView) {
                    await this.selectAllInView();
                }
            }
            event.preventDefault();
        }
        if (event.key?.toLowerCase() == "z" && event.ctrlKey && map && map.canUndo()) {
            await this.undo();
        }
        if (event.key?.toLowerCase() == "y" && event.ctrlKey && map && map.canRedo()) {
            await this.redo();
        }
        if (event.key?.toLowerCase() == "x" && event.ctrlKey && mapHasSelections) {
            await this.cut();
        }
        if (event.key?.toLowerCase() == "c" && event.ctrlKey && mapHasSelections) {
            await this.copy();
        }
        if (event.key?.toLowerCase() == "v" && event.ctrlKey && map && this.#doesCopyPasteHaveData()) {
            await this.paste();
        }
        if (event.key == "Delete" && mapHasSelections) {
            await this.delete();
        }
    }

    #subscribeToTopics() {
        KitMessenger.subscribe(EditorModel.NewFileRequestTopic, this.#componentId, this.onNewFileRequested.name);
        KitMessenger.subscribe(EditorModel.SaveFileRequestTopic, this.#componentId, this.onSaveFileRequested.name);
        KitMessenger.subscribe(EditorModel.SaveFileAsRequestTopic, this.#componentId, this.onSaveFileAsRequested.name);
        KitMessenger.subscribe(EditorModel.OpenFileRequestTopic, this.#componentId, this.onOpenFileRequested.name);
        KitMessenger.subscribe(EditorModel.CanvasResizeRequestTopic, this.#componentId, this.onCanvasResizeRequested.name);
        KitMessenger.subscribe(EditorModel.PresentationViewerStatusTopic, this.#componentId, this.onPresentationViewerStatusChanged.name);
    }

    static #mouseLeaveHandlerRegistered;
    static #mouseEnterHandlerRegistered;
    async #initializeToolsAndCanvas() {
        const map = await MapWorkerClient.getMap();
        const toolsElement = this.#componentElement.querySelector("#tools");
        const mapContainerElement = this.#componentElement.querySelector("#map-container");
        if (map) {
            toolsElement.classList.add("has-map");
            mapContainerElement.classList.add("has-map");
        }
        else {
            toolsElement.classList.remove("has-map");
            mapContainerElement.classList.remove("has-map");
        }
        if (!EditorModel.#mouseLeaveHandlerRegistered) {
            toolsElement.addEventListener("mouseleave", (event) => this.#slideTools());
            EditorModel.#mouseLeaveHandlerRegistered = true;
        }
        if (!EditorModel.#mouseEnterHandlerRegistered) {
            toolsElement.addEventListener("mouseenter", (event) => this.#slideTools(true));
            EditorModel.#mouseEnterHandlerRegistered = true;
        }
        if (map) {
            this.#toolsPinned = false;
            await this.toggleToolsPinned();
        }
    }

    #initializeMapWorker() {
        const appDocument = KitDependencyManager.getDocument();
        const canvas = this.#componentElement.querySelector("#map-canvas");
        MapWorkerClient.initializeWorker(appDocument, canvas, this.onMapChanged, EditorModel.#getBaseUrl());
    }

    #slideTools = (slideOpen) => {
        let toolsLeft = "0px";
        if (!this.#toolsPinned && !slideOpen) {
            toolsLeft = "-180px";
        }
        const appDocument = KitDependencyManager.getDocument();
        const documentElement = appDocument.documentElement;
        documentElement.style.setProperty("--editor-tool-left", toolsLeft);
    }

    async #openMap(mapData, template) {

        // ensure one active layer
        if (!mapData.layers) {
            mapData.layers = [];
        }
        if (mapData.layers.length == 0) {
            mapData.layers.push({ name: "Layer 1" });
        }
        if (!mapData.activeLayer) {
            mapData.activeLayer = mapData.layers[0].name;
        }

        // get map item templates
        if (!mapData.mapItemTemplateRefs) {
            mapData.mapItemTemplateRefs = [];
        }
        if (!mapData.mapItemTemplates) {
            mapData.mapItemTemplates = [];
        }
        if (template?.mapItemTemplates) {
            for (const mapItemTemplate of template.mapItemTemplates) {
                const data = mapItemTemplate.getData();
                let toolPaletteItems = [];
                if (mapData.toolPalette?.mapItemTemplatePalettes) {
                    for (const mapItemTemplatePalette of mapData.toolPalette.mapItemTemplatePalettes) {
                        toolPaletteItems = mapItemTemplatePalette.filter(ref => EntityReference.areEqual(ref, data.ref));
                        for (const ref of toolPaletteItems) {
                            ref.isFromTemplate = true;
                        }
                    }  
                }
                data.ref.isFromTemplate = true; 
                mapData.mapItemTemplateRefs.push(data.ref);
                mapData.mapItemTemplates.push(data);
            }
        }

        // get tools
        if (!mapData.toolRefs) {
            mapData.toolRefs = [];
        }
        if (!mapData.tools) {
            mapData.tools = [];
        }
        const builtInTools = await BuiltInTools.getTools(EditorModel.#getBaseUrl());
        for (const builtInTool of builtInTools) {
            const data = builtInTool.getData();
            mapData.toolRefs.push(data.ref);
            mapData.tools.push(data);
        }
        if (template?.tools) {
            const templateTools = template.tools.filter(t => !t.ref.isBuiltIn);
            for (const templateTool of templateTools) {
                const data = templateTool.getData();
                let toolPaletteItems = [];
                if (mapData.toolPalette?.editingToolPalettes) {
                    for (const editingToolPalette of mapData.toolPalette.editingToolPalettes) {
                        toolPaletteItems = editingToolPalette.filter(ref => EntityReference.areEqual(ref, data.ref));
                        for (const ref of toolPaletteItems) {
                            ref.isFromTemplate = true;
                        }
                    }
                }
                if (mapData.toolPalette?.drawingToolPalettes) {
                    for (const drawingToolPalette of mapData.toolPalette.drawingToolPalettes) {
                        toolPaletteItems = drawingToolPalette.filter(ref => EntityReference.areEqual(ref, data.ref));
                        for (const ref of toolPaletteItems) {
                            ref.isFromTemplate = true;
                        }
                    }
                }
                data.ref.isFromTemplate = true;
                mapData.toolRefs.push(data.ref);
                mapData.tools.push(data);
            }
        }
        // TODO: get external tools

        // display
        await MapWorkerClient.setMap(new Map(mapData));
        await KitRenderer.renderComponent(this.#componentId);
    }

    #setMapCursor(cursorName) {
        const canvas = this.#componentElement.querySelector("#map-canvas");
        switch (cursorName) {
            case "Rotate":
                const cursorSrc = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g stroke="black" stroke-width="2" fill="white" stroke-linecap="round"><path d="M 0,0 m 50,90 a 40 40 0 1 1 40 -40 l 10,0 -15,15 -15,-15 10,0 a 30 30 0 1 0 -30 30 z"></path><path d="M 0,0 m 50,45 a 5 5 0 0 0 0 10 a 5 5 0 0 0 0 -10 z"></path></g></svg>')}`;
                const rotateCursor = `url(${cursorSrc}) 15 15, crosshair`;
                canvas.style.cursor = rotateCursor;
                break;
            case "ResizeAll":
                const cursorSrc2 = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 100 100"><g stroke="black" stroke-width="2" fill="white" stroke-linecap="round"><path d="M 5,5 l 0,20 5,-5 30,30 -30,30 -5,-5 0,20 20,0 -5,-5 30,-30 30,30 -5,5 20,0 0,-20 -5,5 -30,-30 30,-30 5,5 0,-20 -20,0 5,5 -30,30 -30,-30 5,-5 z"></path></g></svg>')}`;
                const resizeAllCursor = `url(${cursorSrc2}) 15 15, crosshair`;
                canvas.style.cursor = resizeAllCursor;
                break;
            case "ResizeNW":
                canvas.style.cursor = "nw-resize";
                break;
            case "ResizeN":
                canvas.style.cursor = "n-resize";
                break;
            case "ResizeNE":
                canvas.style.cursor = "ne-resize";
                break;
            case "ResizeE":
                canvas.style.cursor = "e-resize";
                break;
            case "ResizeSE":
                canvas.style.cursor = "se-resize";
                break;
            case "ResizeS":
                canvas.style.cursor = "s-resize";
                break;
            case "ResizeSW":
                canvas.style.cursor = "sw-resize";
                break;
            case "ResizeW":
                canvas.style.cursor = "w-resize";
                break;
            case "Move":
                canvas.style.cursor = "grab";
                break;
            default:
                canvas.style.cursor = this.#toolCursor;
        }
    }

    #hasVisibleToolOption() {
        const toolOptions = MapWorkerClient.getToolOptions();
        return (toolOptions && toolOptions.some(option => option.isVisible));
    }

    static #getBaseUrl() {
        const appWindow = KitDependencyManager.getWindow();
        return `${appWindow.location.protocol}//${appWindow.location.host}`;
    }

    static #mapToJson(map) {
        let json = null;
        if (map) {
            const data = map.getData();
            data.mapItemTemplateRefs = data.mapItemTemplateRefs.filter(ref => !ref.isFromTemplate);
            data.mapItemTemplates = data.mapItemTemplates.filter(mit => !mit.ref.isFromTemplate);
            data.toolRefs = data.toolRefs.filter(ref => !ref.isBuiltIn && !ref.isFromTemplate);
            data.tools = data.tools.filter(t => !t.ref.isBuiltIn && !t.ref.isFromTemplate);
            data.changeLog = null;
            data.undoLog = null;
            json = JSON.stringify(data);
        }
        return json;
    }

    #doesMapHaveSelections(map) {
        if (map) {
            const layer = map.getActiveLayer();
            if (layer && layer.mapItemGroups.some(mig => mig.selectionStatus)) {
                return true;
            }
        }
        return false;
    }

    async #disabledWhenNoMap() {
        const map = await MapWorkerClient.getMap();
        return map ? null : "disabled";
    }

    #showSavedNotification() {
        const element = this.#componentElement.querySelector("#map-saved-notification");
        element.classList.remove("hidden");
        setTimeout(() => {
            element.classList.add("hidden");
        }, 5000);
    }
}
